<script>
import LineChartWithCI from './LineChartWithCI.svelte'
import { mode } from '../stores/stores'
import { modeIsImplemented } from '../stores/stores'
import {fly} from 'svelte/transition'
import optionSet from '../stores/options.json'
// should this read the store?

export let data;

let metrics;
let outdata;

const start = optionSet.startOptions.setter;
const end = optionSet.endOptions.setter;

if ($mode === 'explore') {
    metrics = Object.keys(data[0]).filter(m => {
        return !m.includes('_low') && !m.includes('_high') && !m.includes('date')
    })
    outdata = metrics.map(m => {
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
}

</script>

<style>
.graphics {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
}

.coming-soon {
    display: grid;
    margin: auto;
    height: 100%;
    text-align: center;
    font-size:25px;
    font-weight: 900;
    color: var(--faint-text);
}

</style>



<div class=graphic-body>
    {#if $modeIsImplemented}
        <div class=graphics >
            {#each outdata as dataset, i}
            <LineChartWithCI title={dataset.metric} data={dataset.data} xMin={$start} xMax={$end} />
            {/each}
        </div>
    {:else}
        <div in:fly={{y:-30, duration: 300, delay: 250}} class=coming-soon>
            <div>coming soon</div>
        </div>
    {/if}
</div>