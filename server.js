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
    return paramInfo.values[0]
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

    const { channel } = params
    // for all params, implement a WHERE ${keyname} IN ${yes-options}
    // check for default param.
    const WHEREClauses = Object.keys(params)
        .filter(k=> {
            const defaultValue = getDefault(k).key
            return k !== 'mode' && params[k] !== defaultValue
        })
        .map(paramKey => {
            // get default param
            const values = [params[paramKey]]
            // console.log(getParamInfo(paramKey))
            return `WHERE ${paramKey} IN (${values.map(v=>`"${v}"`).join(',')})`
        })
    const WHERE = WHEREClauses.length > 1 ? WHEREClauses.join(' AND\n') : WHEREClauses;
    return query(`
SELECT
    submission_date AS date,
    id_bucket,
    SUM(mau) AS mau,
    SUM(wau) AS wau,
    SUM(dau) AS dau
FROM
    \`moz-fx-data-derived-datasets.telemetry.firefox_desktop_exact_mau28_by_dimensions_v1\`
${WHERE}
GROUP BY
    submission_date,
    id_bucket
ORDER BY
    submission_date,
    id_bucket;
    `)

    //return []
    
    // return query(`
    // SELECT
    //   submission_date AS date,
    //   id_bucket,
    //   SUM(mau) AS mau,
    //   SUM(wau) AS wau,
    //   SUM(dau) AS dau
    // FROM
    //   \`moz-fx-data-derived-datasets.telemetry.firefox_desktop_exact_mau28_by_dimensions_v1\`
    // -- WHERE country = 'US'
    // ${channel === 'all' ? '--' : ''} WHERE channel = '${channel}'
    // GROUP BY
    //   submission_date,
    //   id_bucket
    // ORDER BY
    //   submission_date,
    //   id_bucket;
    // `)
}

// query(`
// SELECT
//   submission_date,
//   id_bucket,
//   SUM(mau) AS mau,
//   SUM(wau) AS wau,
//   SUM(dau) AS dau
// FROM
//   \`moz-fx-data-derived-datasets.telemetry.firefox_desktop_exact_mau28_by_dimensions_v1\`
// -- WHERE country = 'US'
// GROUP BY
//   submission_date,
//   id_bucket
// ORDER BY
//   submission_date,
//   id_bucket;
// `)

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
    // simulate the delay.
    //await new Promise(r=>setTimeout(r, 1000));
    const params = req.body
    // for now, let's just look at channel!
    const datasets = metrics.map( m => {
        return {
            metric: m,
            data: fakeData()
        }
    })
    const out = await exploreQuery(params).then(data => {
        data.forEach(d => {
            d.date = d.date.value
        })
        return data;
    })
    console.log(out.slice(0,2))
    // let's make one data set?
    res.json(JSON.stringify(out))
    //res.json(JSON.stringify(datasets))
})

app.listen(3000, () => console.log('app listening on port 3000'));