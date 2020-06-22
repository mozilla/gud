import optionSet from "./options.json";
import { inArmagaddon } from "../utils/data-quality";
import sumBucketsWithCI from "./CI";
import { toDate } from "../utils/date";

const getMetricInformation = (m) => {
  return optionSet.metric.values.find((v) => v.key === m);
};

export function groupBy(data, key) {
  return data.reduce((acc, r) => {
    const d = r[key];
    if (!(d in acc)) acc[d] = [];
    acc[d].push(r);
    return acc;
  }, {});
}

function weightedMean(points) {
  return (
    points.map((p) => p[0]).reduce((a, b) => a + b, 0) /
    points.map((p) => p[1]).reduce((a, b) => a + b, 0)
  );
}

function fetchMetricPoints(p, numeratorKey, denominatorKey) {
  // return [numerator, denominatorKey]
  return [p[numeratorKey], p[denominatorKey]];
}

function convertExploreData(
  inputs,
  isDesktop = false,
  dateKey = "date",
  bucketKey = "id_bucket"
) {
  const byDate = groupBy(inputs, dateKey);
  // this metrics thing should only be the high-level metrics?
  // why not just use the metrics definition in optionSet? This should include the key
  // value in the dataset that is returned.

  // const metrics = Object.keys(inputs[0]).filter(k=> k !== dateKey && k !== bucketKey)
  const metrics = optionSet.metric.values
    .filter((opt) => opt.key !== undefined && opt.format !== undefined)
    .map((opt) => opt.key);

  const output = Object.entries(byDate).map(([date, points]) => {
    const dt = toDate(date);

    const pt = { date: dt };
    metrics.forEach((m) => {
      const info = getMetricInformation(m);
      let metricPoints = [];
      let CIs;
      let metricValue;
      let CIPoints = [];
      if (info.agg === "sum") {
        metricPoints = points.map((p) => p[m]);
        CIs = sumBucketsWithCI(metricPoints, info.agg);
        metricValue = CIs.value;
      } else if (info.agg === "mean") {
        metricPoints = points.map((p) =>
          fetchMetricPoints(p, info.numeratorKey, info.denominatorKey)
        );
        CIPoints = points.map((p) => p[m]);
        metricValue = weightedMean(metricPoints);
        CIs = sumBucketsWithCI(CIPoints, info.agg);
      }
      const isNull = inArmagaddon(pt.date, m, isDesktop);
      // if (CIPoints.some(d => d === null)) isNull = true;
      // if (metricPoints.some(d => d === null)) isNull = true;

      pt[m] = !isNull ? metricValue : null;
      pt[`${m}_low`] = !isNull ? metricValue - CIs.margin : null;
      pt[`${m}_high`] = !isNull ? metricValue + CIs.margin : null;
      if (Number.isNaN(pt[m])) pt[m] = 0;
      if (Number.isNaN(pt[`${m}_low`])) pt[`${m}_low`] = 0;
      if (Number.isNaN(pt[`${m}_high`])) pt[`${m}_high`] = 0;
    });
    return pt;
  });
  return output;
}

export async function fetchExploreData(params, querystring) {
  let payload;
  const response = await fetch("/fetch-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ params, querystring }),
  });
  if (response.status === 500) {
    const message = await response.json();
    throw new Error(message);
  } else {
    try {
      const { usage } = params;
      const isDesktop =
        optionSet.usage.values.find(
          (v) => v.key === usage && v.markerSet === "firefoxDesktopVersions"
        ) !== undefined;
      payload = await response
        .json()
        .then((json) => JSON.parse(json))
        .then((d) => convertExploreData(d, isDesktop));
    } catch (err) {
      throw new Error("the data appears to be malformed :(");
    }
  }

  return payload;
}

export { sumBucketsWithCI };
