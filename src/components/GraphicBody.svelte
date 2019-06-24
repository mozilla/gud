<script>
import {fly} from 'svelte/transition'
import {timeFormat} from 'd3-time-format'

import LineChartWithCI from './LineChartWithCI.svelte'
import { mode } from '../stores/stores'
import { modeIsImplemented } from '../stores/stores'
import optionSet from '../stores/options.json'
import queryString, { setDateRange } from '../stores/query'
//import { rawStart, rawEnd } from '../stores/stores'

export let data;
console.log(data)
let metrics;
let outdata;

const formatKeyString = timeFormat('%Y-%m-%d')

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
    // get start an end date of data, and filter accordingly?
    // FIXME: add filter when we are not on metric=all
    // const intermediateData = data.filter(d => { 
    //     return ($start !== '' ? d.date >= new Date($start): true) && ($end !== '' ? d.date <= new Date($end) : true)
    // }).map(d => {
    //     return Object.assign({}, d)
    // })
    
    outdata = metrics.map(m => {
        const metricInfo = getMetricInformation(m)
        return {
            metric: m,
            title: metricInfo.label,
            rolloverLabel: metricInfo.short,
            shortDescription: metricInfo.shortDescription,
            whatKind: metricInfo.needsExplanation ? metricInfo.shortsub : undefined,
            format: metricInfo.format,
            yMax: metricInfo.yMax,
            yMin: metricInfo.yMin,
            yRangeGroup: `${$queryString}-${metricInfo.yRangeGroup}`,
            data: data.map(d=> {
                const di = {date: d.date}
                di.value = d[m]
                di.lower = Math.max(d[`${m}_low`], 0)
                di.upper = d[`${m}_high`]
                di.key = formatKeyString(di.date)
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
    grid-row-gap: var(--subsection-margin);
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
            {#each outdata as dataset, i (dataset.title)}
            <LineChartWithCI 
                size={$metricSet === 'all' ? 'small' : 'large'} 
                title={dataset.title} 
                whatKind={dataset.whatKind}
                shortDescription={dataset.shortDescription}
                rolloverLabel={dataset.rolloverLabel}
                yType={dataset.format}
                data={dataset.data} 
                xMin={$start} 
                xMax={$end}
                yMin={dataset.yMin}
                yMax={dataset.yMax}
                yRangeGroup={$metricSet === 'all' ? dataset.yRangeGroup : undefined}
                onDragFinish={(mouseDownStartValue, mouseDownEndValue) => {
                    const firstVal = mouseDownStartValue > mouseDownEndValue ? mouseDownEndValue : mouseDownStartValue;
                    const secondVal = mouseDownStartValue > mouseDownEndValue ? mouseDownStartValue : mouseDownEndValue;
                    // FIXME: this doesn't work as intended.
                    //setDateRange(formatKeyString(firstVal), formatKeyString(secondVal))
                }}
                 />
            {/each}
        </div>
    {:else}
        <div in:fly={{y:-30, duration: 300, delay: 250}} class=coming-soon>
            <div>coming soon</div>
        </div>
    {/if}
</div>