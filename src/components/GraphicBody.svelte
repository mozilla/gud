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

let metricSet = optionSet.metricOptions.setter;

const start = optionSet.startOptions.setter;
const end = optionSet.endOptions.setter;

const getMetricInformation = (m) => {
    return optionSet.metricOptions.values.find(v=> v.key === m);
}

if ($mode === 'explore') {
    // this is where we filter?
    metrics = Object.keys(data[0]).filter(m => {
        return !m.includes('_low') && !m.includes('_high') && !m.includes('date')
    }).filter(m => {
        // take out everything not in the $metricsSet, or default to all if $metricSet === 'all'
        if ($metricSet === 'all') return true
        return $metricSet === m
    })
    // FIXME: add filter when we are not on metric=all
    outdata = metrics.map(m => {
        const metricInfo = getMetricInformation(m)
        return {
            metric: m,
            title: metricInfo.label,
            rolloverLabel: metricInfo.short,
            subtitle: metricInfo.subtitle,
            format: metricInfo.format,
            data: data.map(d=> {
                const di = {date: d.date}
                di.value = d[m]
                di.lower = Math.max(d[`${m}_low`], 0)
                di.upper = d[`${m}_high`]
                return di
            })
        }
    })
}

</script>

<style>

.all-graphics {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
}

.one-graphic {
    display: block;
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
        <div 
            class:all-graphics={$metricSet === 'all'}
            class:one-graphic={$metricSet !== 'all'}
        >
            {#each outdata as dataset, i}
            <LineChartWithCI 
                size={$metricSet === 'all' ? 'small' : 'large'} 
                title={dataset.title} 
                subtitle={dataset.subtitle}
                rolloverLabel={dataset.rolloverLabel}
                yType={dataset.format}
                data={dataset.data} 
                xMin={$start} 
                xMax={$end} />
            {/each}
        </div>
    {:else}
        <div in:fly={{y:-30, duration: 300, delay: 250}} class=coming-soon>
            <div>coming soon</div>
        </div>
    {/if}
</div>