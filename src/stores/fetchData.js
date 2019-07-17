import optionSet from './options.json'
import sumBucketsWithCI from './CI'

const getMetricInformation = (m) => {
    return optionSet.metricOptions.values.find(v=> v.key === m);
}

export function groupBy(data, key) {
    return data.reduce((acc, r) => {
        const d = r[key];
        if (!(d in acc)) acc[d] = []
        acc[d].push(r)
        return acc
    }, {})
}

function convertExploreData(inputs, dateKey='date', bucketKey='id_bucket') {
    // group by date string.
    const byDate = groupBy(inputs, dateKey)
    // const byDate = inputs.reduce((acc, r) => {
    //     const d = r[dateKey];
    //     if (!(d in acc)) acc[d] = []
    //     acc[d].push(r)
    //     return acc
    // }, {})
    // convert confidence intervals for every non-date, non bucket_id value.
    const metrics = Object.keys(inputs[0]).filter(k=> k !== dateKey && k !== bucketKey)
    const output = Object.entries(byDate).map(([date, points]) => {
        let pt = {date: new Date(date)}
        metrics.forEach(m => {
            const info = getMetricInformation(m)
            const metricPoints =  points.map(p=>p[m])
            const CIs = sumBucketsWithCI(metricPoints, info.agg);
            pt[m] = CIs.value;//CIs[info.agg==='sum' ? 'total' : 'mean'];
            pt[`${m}_low`] = CIs.low;
            pt[`${m}_high`] = CIs.high;
            if (Number.isNaN(pt[m])) pt[m] = 0;
            if (Number.isNaN(pt[`${m}_low`])) pt[`${m}_low`] = 0;
            if (Number.isNaN(pt[`${m}_high`])) pt[`${m}_high`] = 0;
        })
        return pt
    })
    return output
}

export async function fetchExploreData(params, querystring) {
    let payload;
    const response = await fetch('/fetch-data', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({params, querystring})
    })
    if (response.status === 500) {
        const message = await response.json()
        throw new Error(message)
    } else {
        try {
            payload = await response.json()
                .then(json => JSON.parse(json))
                .then(convertExploreData)
        } catch(err) {
            throw new Error('the data appears to be malformed :(')
        }
    }

    return payload
}

export { sumBucketsWithCI }