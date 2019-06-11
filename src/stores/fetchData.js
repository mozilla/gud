import optionSet from './options.json'

const getMetricInformation = (m) => {
    return optionSet.metricOptions.values.find(v=> v.key === m);
}

function erfinv(x){
    var z;
    var a  = 0.147;
    var the_sign_of_x;
    if(0==x) {
        the_sign_of_x = 0;
    } else if(x>0){
        the_sign_of_x = 1;
    } else {
        the_sign_of_x = -1;
    }

    if(0 != x) {
        var ln_1minus_x_sqrd = Math.log(1-x*x);
        var ln_1minusxx_by_a = ln_1minus_x_sqrd / a;
        var ln_1minusxx_by_2 = ln_1minus_x_sqrd / 2;
        var ln_etc_by2_plus2 = ln_1minusxx_by_2 + (2/(Math.PI * a));
        var first_sqrt = Math.sqrt((ln_etc_by2_plus2*ln_etc_by2_plus2)-ln_1minusxx_by_a);
        var second_sqrt = Math.sqrt(first_sqrt - ln_etc_by2_plus2);
        z = second_sqrt * the_sign_of_x;
    } else { // x is zero
        z = 0;
    }
    return z;
}

function jackknife_resamples(arr) {
    const output = [];
    for (var i = 0; i < arr.length; i++) {
        var x = arr.slice();
        x.splice(i, 1);
        output.push(x);
    }
    return output;
}

function array_sum(arr) {
    return arr.reduce(function (acc, x) {
        return acc + x;
    }, 0);
}

function array_avg(arr) {
    return array_sum(arr) / arr.length;
}

function sum_buckets_with_ci(counts_per_bucket, agg='sum') {
    //counts_per_bucket = counts_per_bucket.map(x => parseInt(x));
    var n = counts_per_bucket.length;
    var total = array_sum(counts_per_bucket);
    var mean = total / n;
    var resamples = jackknife_resamples(counts_per_bucket);
    var jk_means = resamples.map(x => array_avg(x));
    var mean_errs = jk_means.map(x => Math.pow(x - mean, 2));
    var bucket_std_err = Math.sqrt((n-1) * array_avg(mean_errs));
    var std_err = n * bucket_std_err;
    var z_score = Math.sqrt(2.0) * erfinv(0.90);
    // shouldn't these be mean?
    let value;
    if (agg === 'sum') value = total;
    else if (agg === 'mean') value = mean;
    var high = value + z_score * std_err;
    var low = value - z_score * std_err;
    return {
        value,
        sum: total,
        low: low,
        high: high,
        margin: z_score * std_err,
        "pm": high - total,
        "nbuckets": n,
        mean
    };
}

function convertExploreData(inputs) {
    // group by date string.
    const byDate = inputs.reduce((acc, r) => {
        const d = r.date;
        if (!(d in acc)) acc[d] = []
        acc[d].push(r)
        return acc
    }, {})
    // convert confidence intervals for every non-date, non bucket_id value.
    const metrics = Object.keys(inputs[0]).filter(k=> k!=='date' && k!=='id_bucket')
    const output = Object.entries(byDate).map(([date, points]) => {
        let pt = {date: new Date(date)}
        metrics.forEach(m => {
            const info = getMetricInformation(m)
            const metricPoints =  points.map(p=>p[m])
            const CIs = sum_buckets_with_ci(metricPoints, info.agg);
            pt[m] = CIs.value;//CIs[info.agg==='sum' ? 'total' : 'mean'];
            pt[`${m}_low`] = CIs.low;
            pt[`${m}_high`] = CIs.high;
        })
        return pt
    })
    return output
}

export async function fetchExploreData(params) {
    const dataset = await fetch('/fetch-data', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params)
    })
        .then((r) => r.json())
        .then(json => JSON.parse(json))
        .then(convertExploreData)

    return dataset
}