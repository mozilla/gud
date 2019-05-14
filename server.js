const timeDay = require('d3-time').timeDay
const express = require('express');
const app = express();
const metrics = ['MAU', 'DAU', 'Retention', 'Revenue', 'etc.']
const timeRange = timeDay.range(new Date('2018-12-01'), new Date('2019-03-25'))

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
    await new Promise(r=>setTimeout(r, 1000));
    const datasets = metrics.map( m => {
        return {
            metric: m,
            data: fakeData()
        }
    })
    res.json(JSON.stringify(datasets))
})

app.listen(3000, () => console.log('app listening on port 3000'));