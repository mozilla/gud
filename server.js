const { BigQuery } = require('@google-cloud/bigquery');
const allOptions = require('./src/stores/options.json')
const timeDay = require('d3-time').timeDay
const express = require('express');
const app = express();
const metrics = ['MAU', 'DAU', 'Retention', 'Revenue', 'etc.']
const timeRange = timeDay.range(new Date('2018-12-01'), new Date('2019-03-25'))

// FIXME: this is preeeeetty awkward
const getParamInfo = (paramKey) => {
    const k = Object.keys(allOptions).find(thisKey => {
        return allOptions[thisKey].key === paramKey
    })
    return allOptions[k]
}

const getDefault = (paramKey) => {
    const paramInfo = getParamInfo(paramKey)
    if (paramInfo.type === 'multi') return []
    else return paramInfo.values[0]
}

const isDefaultValue = (paramKey, value) => {
    const paramInfo = getParamInfo(paramKey)
    if (paramInfo.type === 'multi') return value.length === 0
    else return value.length = paramInfo.values[0]
}

async function query(q) {
    const bigqueryClient = new BigQuery();
    const options = {
        query: q,
        location: 'US',
    };
    const [job] = await bigqueryClient.createQueryJob(options);
    console.log(`Job ${job.id} started.`);
    console.log(q)
    // Wait for the query to finish
    const [rows] = await job.getQueryResults();
    //console.log('Rows:');
    //rows.forEach(row => console.log(row));
    return rows;
}

const exploreQuery =(params) => {
    // FiXME: validate params HERE!!!! Do NOT DEPLOY UNTIL PARAMS ARE VALIDATED.
    // otherwise we run the risk of something really bad happening.

    // for all params, implement a WHERE ${keyname} IN ${yes-options}
    // check for default param.
    const WHEREClauses = Object.keys(params)
        .filter(k=> {
            if (k === 'start' || k === 'end') return false
            const defaultValue = getDefault(k).key
            return (k !== 'mode' && !isDefaultValue(k, params[k])) || k === 'usage'//params[k] !== defaultValue
        })
        .map(paramKey => {
            // get default param
            const opt = getParamInfo(paramKey)
            const values = opt.type === 'multi' ? params[paramKey] : [params[paramKey]]
            if (opt.key === 'usage') return `${paramKey} = '${params[paramKey]}'`
            return `${paramKey} IN (${values.map(v=>`"${v}"`).join(',')})`
        })
    WHEREClauses.push(`date >= '2017-06-17'`)
    const WHERE = WHEREClauses.length ? `WHERE ${WHEREClauses.length > 1 ? WHEREClauses.join(' AND\n') : WHEREClauses}` : '';
//     return query(`
// SELECT
//     submission_date AS date,
//     id_bucket,
//     SUM(mau) AS mau,
//     SUM(wau) AS wau,
//     SUM(dau) AS dau
// FROM
//     \`moz-fx-data-derived-datasets.telemetry.firefox_desktop_exact_mau28_by_dimensions_v1\`
// ${WHERE}
// GROUP BY
//     submission_date,
//     id_bucket
// ORDER BY
//     submission_date,
//     id_bucket;
//     `)
// }
     
    return query(`
SELECT
date,
id_bucket,
SUM(dau) AS dau,
SUM(wau) AS wau,
SUM(mau) AS mau,
SAFE_DIVIDE(SUM(active_days_in_week),
  SUM(wau)) AS intensity,
SAFE_DIVIDE(SUM(active_in_week_1),
  SUM(new_profiles)) AS retention_1_week_new_profile,
SAFE_DIVIDE(SUM(active_in_weeks_0_and_1),
  SUM(active_in_week_0)) AS retention_1_week_active_in_week_0
FROM
telemetry.smoot_usage_all_mtr_v1
${WHERE}
GROUP BY
date, id_bucket
ORDER BY
date;
`)
    }

const fakeData = () => {
    let value = 100;
    let bandSize = 10;
    return timeRange.map((date,i) => {
        value = Math.max(value + (Math.random() -.5) * 10, 0)
        bandSize += (Math.random() - .5)
        return {
            value,
            upper: value + bandSize,
            lower: Math.max(0, value - bandSize),
            date
        }
    })
}

app.use(express.json())
app.use('/', express.static('public'));

app.post('/fetch-data', async (req, res) => {
    const params = req.body
    const out = await exploreQuery(params).then(data => {
        data.forEach(d => {
            d.date = d.date.value
        })
        return data;
    })
    res.json(JSON.stringify(out))
})

app.listen(3000, () => console.log('app listening on port 3000'));