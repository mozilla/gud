export default async function fetchData(params) {
    const datasets = await fetch('/fetch-data', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params)
    })
        .then((r) => r.json())
        .then(json => JSON.parse(json))
    datasets.forEach(dataset => {
        dataset.data.forEach(d => {
            d.date = new Date(d.date)
        })
    })
    return datasets
}