const { BigQuery } = require("@google-cloud/bigquery");
const allOptions = require("./src/stores/options.json");
const { timeDay } = require("d3-time");
const express = require("express");

const app = express();
const metrics = ["MAU", "DAU", "Retention", "Revenue", "etc."];
const timeRange = timeDay.range(new Date("2018-12-01"), new Date("2019-03-25"));
const path = require("path");

// var sqlite3 = require('sqlite3').verbose();

function getDateString(dt) {
  return dt.toISOString().slice(0, 10);
}

// initialize

function initializeCache() {
  return {};
}

const CACHE = initializeCache();

function checkForCachedVersion(querystring, cache) {
  const TODAY = getDateString(new Date());
  if (querystring in cache && cache[querystring].lastRan === TODAY)
    return cache[querystring];
  return undefined;
}

function cacheResultSet(querystring, cache, data) {
  const lastRan = getDateString(new Date());
  cache[querystring] = { lastRan, data };
}

// FIXME: this is preeeeetty awkward
const getParamInfo = (paramKey) => {
  const k = Object.keys(allOptions).find((thisKey) => {
    return allOptions[thisKey].key === paramKey;
  });
  return allOptions[k];
};

const getDefault = (paramKey) => {
  console.log(paramKey);
  const paramInfo = getParamInfo(paramKey);
  if (paramInfo.type === "multi") return [];
  return paramInfo.values[0];
};

const isDefaultValue = (paramKey, value) => {
  const paramInfo = getParamInfo(paramKey);
  if (paramInfo.type === "multi") return value.length === 0;
  return value.length === paramInfo.values[0];
};

async function query(q) {
  const bigqueryClient = new BigQuery();
  const options = {
    query: q,
    location: "US",
  };
  const [job] = await bigqueryClient.createQueryJob(options);
  console.log(`Job ${job.id} started.`);
  // console.log(q);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();
  return rows;
}

const exploreQuery = (params) => {
  // FiXME: validate params HERE!!!! Do NOT DEPLOY UNTIL PARAMS ARE VALIDATED.
  // otherwise we run the risk of something really bad happening.

  // for all params, implement a WHERE ${keyname} IN ${yes-options}
  // check for default param.
  const WHEREClauses = Object.keys(params)
    .filter((k) => {
      if (
        [
          "startDate",
          "endDate",
          "minStartDate",
          "maxEndDate",
          "disabledDimensions",
          "disabledMetrics",
          "activeUsersYMax",
          "brushTransitioning",
        ].includes(k)
      ) {
        return false;
      }
      const defaultValue = getDefault(k).key;
      return (k !== "mode" && !isDefaultValue(k, params[k])) || k === "usage"; // params[k] !== defaultValue
    })
    .map((paramKey) => {
      const opt = getParamInfo(paramKey);

      const values =
        opt.type === "multi" ? params[paramKey] : [params[paramKey]];

      // whereStyle – these are special-case
      if (opt.whereStyle === "like") {
        const key = opt.columnName || paramKey;
        // this should short circuit the whole thing.
        // it must be array already?
        // requires a likeTemplate: `${paramKey} LIKE ''`
        return `REGEXP_CONTAINS(${key}, '^(${values.join("|")})')`;
      }
      if (opt.whereStyle === "boolean") {
        const key = opt.columnName || paramKey;
        return `${key} = ${values[0]}`;
      }

      if (opt.type === "single") return `${paramKey} = '${params[paramKey]}'`;

      return `${paramKey} IN (${values.map((v) => `"${v}"`).join(",")})`;
    });
  WHEREClauses.push(`date >= '2017-06-17'`);
  const WHERE = WHEREClauses.length
    ? `WHERE ${
        WHEREClauses.length > 1 ? WHEREClauses.join(" AND\n") : WHEREClauses
      }`
    : "";

  return query(`
WITH day_0_base AS (
  SELECT
    *
  FROM
    \`moz-fx-data-shared-prod.telemetry_derived.smoot_usage_desktop_compressed_v2\`
  UNION ALL
  SELECT
    *
  FROM
    \`moz-fx-data-shared-prod.telemetry_derived.smoot_usage_nondesktop_compressed_v2\`
  UNION ALL
  SELECT
    *
  FROM
    \`moz-fx-data-shared-prod.telemetry_derived.smoot_usage_fxa_compressed_v2\`
),
--
day_0_all AS (
  SELECT
    submission_date AS \`date\`,
    usage,
    metrics.day_0.*,
    * EXCEPT (submission_date, usage, metrics)
  FROM
    day_0_base
  UNION ALL
  SELECT
    DATE_SUB(submission_date, INTERVAL 6 DAY) AS \`date\`,
    usage,
    new_profiles AS dau,
    NULL AS wau,
    NULL AS mau,
    NULL AS active_days_in_week,
    * EXCEPT (submission_date, usage, new_profiles)
  FROM
    \`moz-fx-data-shared-prod.telemetry_derived.smoot_usage_new_profiles_compressed_v2\`
),
--
day_0 AS (
  SELECT
    date,
    ANY_VALUE(usage) AS usage,
    id_bucket,
    SUM(dau) AS dau,
    SUM(wau) AS wau,
    SUM(mau) AS mau,
    SUM(active_days_in_week) AS active_days_in_week,
    SAFE_DIVIDE(SUM(active_days_in_week), SUM(wau)) AS intensity
  FROM
    day_0_all
  ${WHERE}
  GROUP BY
    date,
    id_bucket
),
--
day_13_base AS (
  SELECT
    *
  FROM
    \`moz-fx-data-shared-prod.telemetry_derived.smoot_usage_desktop_compressed_v2\`
  UNION ALL
  SELECT
    *
  FROM
    \`moz-fx-data-shared-prod.telemetry_derived.smoot_usage_nondesktop_compressed_v2\`
  UNION ALL
  SELECT
    *
  FROM
    \`moz-fx-data-shared-prod.telemetry_derived.smoot_usage_fxa_compressed_v2\`
),
--
day_13_all AS (
  SELECT
    DATE_SUB(submission_date, INTERVAL 13 DAY) AS \`date\`,
    usage,
    metrics.day_13.*,
    * EXCEPT (submission_date, usage, metrics)
  FROM
    day_13_base
),
--
day_13 AS (
  SELECT
    date,
    id_bucket,
    SUM(new_profiles) AS new_profiles,
    SUM(new_profile_active_in_week_1) AS new_profile_active_in_week_1,
    SUM(active_in_weeks_0_and_1) AS active_in_weeks_0_and_1,
    SUM(active_in_week_0) AS active_in_week_0,
    SAFE_DIVIDE(
      SUM(new_profile_active_in_week_1),
      SUM(new_profiles)
    ) AS retention_1_week_new_profile,
    SAFE_DIVIDE(
      SUM(active_in_weeks_0_and_1),
      SUM(active_in_week_0)
    ) AS retention_1_week_active_in_week_0
  FROM
    day_13_all
  ${WHERE}
  GROUP BY
    date,
    id_bucket
),
--
day_0_windowed AS (
SELECT
  *,
  COUNT(*) OVER (PARTITION BY id_bucket ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS c,
  SUM(dau) OVER (PARTITION BY id_bucket ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS dau_sum_7_day,
  SUM(dau) OVER (PARTITION BY id_bucket ORDER BY date ROWS BETWEEN 27 PRECEDING AND CURRENT ROW) AS dau_sum_28_day
FROM
  day_0 ),
--
day_0_replaced AS (
  SELECT
    * EXCEPT (c, dau_sum_7_day, dau_sum_28_day) REPLACE(
      IF(c >= 7 AND usage LIKE 'New %', dau_sum_7_day, wau) AS wau,
      IF(c >= 28 AND usage LIKE 'New %', dau_sum_28_day, mau) AS mau
    )
  FROM
    day_0_windowed
)
--
SELECT
  * EXCEPT (usage) REPLACE(
    -- Desktop data is missing for 2019-05-03 to 2019-05-10 due to the Armag-addon incident,
    -- so we insert nulls for any days that include this range in their windows.
    IF(usage LIKE '%Desktop%' AND date between '2019-05-03' AND '2019-05-10', NULL, dau) AS dau,
    IF(usage LIKE '%Desktop%' AND date between '2019-05-03' AND '2019-05-17', NULL, wau) AS wau,
    IF(usage LIKE '%Desktop%' AND date between '2019-05-03' AND '2019-06-06', NULL, mau) AS mau,
    IF(usage LIKE '%Desktop%' AND date between '2019-05-03' AND '2019-05-17', NULL, intensity) AS intensity,
    IF(usage LIKE '%Desktop%' AND date between '2019-04-13' AND '2019-05-17', NULL, new_profile_active_in_week_1) AS new_profile_active_in_week_1,
    IF(usage LIKE '%Desktop%' AND date between '2019-04-13' AND '2019-05-17', NULL, new_profiles) AS new_profiles,
    IF(usage LIKE '%Desktop%' AND date between '2019-04-13' AND '2019-05-17', NULL, active_in_weeks_0_and_1) AS active_in_weeks_0_and_1,
    IF(usage LIKE '%Desktop%' AND date between '2019-04-13' AND '2019-05-17', NULL, active_in_week_0) AS active_in_week_0,
    IF(usage LIKE '%Desktop%' AND date between '2019-04-13' AND '2019-05-17', NULL, retention_1_week_new_profile) AS retention_1_week_new_profile,
    IF(usage LIKE '%Desktop%' AND date between '2019-04-13' AND '2019-05-17', NULL, retention_1_week_active_in_week_0) AS retention_1_week_active_in_week_0
    )
FROM
  day_0_replaced
FULL JOIN
  day_13
USING
  (date, id_bucket)
ORDER BY
  date
`);
};

// report a server error?

function reportError(res, message) {
  res.status(500).json(JSON.stringify(message));
}

app.use(express.json());
app.use("/", express.static("public"));

app.get("/__heartbeat__", (req, res) => {
  res.send({ status: "ok" });
});

app.get("/__lbheartbeat__", (req, res) => {
  res.sendStatus(200);
});

app.get("/__version__", (req, res) => {
  res.sendFile(path.join(__dirname, "version.json"));
});

app.post("/fetch-data", async (req, res) => {
  const { params, querystring } = req.body;
  let out;
  const cachedVersion = checkForCachedVersion(querystring, CACHE);
  if (!cachedVersion) {
    try {
      out = await exploreQuery(params).then((data) => {
        data.forEach((d) => {
          d.date = d.date.value;
        });
        return data;
      });
    } catch (err) {
      console.log(err);
      return reportError(res, err.message);
    }

    cacheResultSet(querystring, CACHE, out);
  } else {
    out = cachedVersion.data;
  }

  res.json(JSON.stringify(out));
});

app.listen(3000, () => console.log("app listening on port 3000"));
