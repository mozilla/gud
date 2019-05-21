<script>
import LineChartWithCI from './LineChartWithCI.svelte'
import { mode } from '../stores/stores'
// should this read the store?

export let data;

// ok, can we separate data into constituents?

const metrics = Object.keys(data[0]).filter(m => {
    return !m.includes('_low') && !m.includes('_high') && !m.includes('date')
})

const outdata = metrics.map(m => {
    return {
        metric: m, 
        data: data.map(d=> {
            const di = {date: d.date}
            di.value = d[m]
            di.lower = d[`${m}_low`]
            di.upper = d[`${m}_high`]
            return di
        })
    }
})

</script>

<style>
.graphics {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
}
</style>


<div class=graphic-body>
    <div class=graphics >
        {#each outdata as dataset, i}
        <LineChartWithCI title={dataset.metric} data={dataset.data} />
        {/each}
    </div>
</div>