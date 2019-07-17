<script>
import {fly} from 'svelte/transition'
import {timeFormat} from 'd3-time-format'
import LineChartWithCI from './LineChartWithCI.svelte'
import { mode } from '../stores/stores'
import { modeIsImplemented } from '../stores/stores'
import optionSet from '../stores/options.json'
import queryString, { setDateRange } from '../stores/query'
import { majorReleases } from '../stores/productDetails';

import AnnotationsAndRemarks from './AnnotationsAndRemarks.svelte'

// these are the markers.

export let data;
export let title;

let outdata;

const formatKeyString = timeFormat('%Y-%m-%d')

let metricSet = optionSet.metricOptions.setter;

// filter majorReleases according to start and end.
const start = optionSet.startOptions.setter;
const end = optionSet.endOptions.setter;

console.log('start/end', $start, $end)

const getMetricInformation = (m) => {
    return optionSet.metricOptions.values.find(v=> v.key === m);
}

function fetchData(rawData, visibleMetrics) {
    let metrics = Object.keys(rawData[0]).filter(m => {
        return !m.includes('_low') && !m.includes('_high') && !m.includes('date')
    }).filter(m => {
        // take out everything not in the $metricsSet, or default to all if $metricSet === 'all'
        if (visibleMetrics === 'all') return true
        return visibleMetrics === m
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
            data: rawData.map(d=> {
                const di = {date: d.date}
                di.value = d[m]
                di.lower = Math.max(d[`${m}_low`], 0)
                di.upper = d[`${m}_high`]
                di.key = formatKeyString(di.date)
                return di
            })
        }
    })
    return outdata
}

$: outdata = fetchData(data, $metricSet)
$: console.log('$metricSet', $metricSet)

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
        <!-- <h2 class=graphic-body-header>
            {title}
        </h2> -->
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
                markers={$majorReleases}
                filterMarkerCallback={ // filters by range.
                    (release, graphXMin, graphXMax) => {
                        const size = $metricSet === 'all' ? 'small' : 'large';
                        const ONE_YEAR = 1000 * 60 * 60 * 24 * (365  * (size === 'large' ? 2 : 1))
                        const onlyEveryFive = graphXMax - graphXMin >= ONE_YEAR ? parseInt(release.version) % 5 === 0 : true
                        return onlyEveryFive 
                            && (release.date >= graphXMin && release.date <= graphXMax)
                    }
                }
                xMin={$start} 
                xMax={$end}
                yMin={dataset.yMin}
                yMax={dataset.yMax}
                yRangeGroup={$metricSet === 'all' ? dataset.yRangeGroup : undefined}
                onDragFinish={(mouseDownStartValue, mouseDownEndValue) => {
                    const firstVal = mouseDownStartValue > mouseDownEndValue ? mouseDownEndValue : mouseDownStartValue;
                    const secondVal = mouseDownStartValue > mouseDownEndValue ? mouseDownStartValue : mouseDownEndValue;
                    setDateRange(formatKeyString(firstVal), formatKeyString(secondVal))
                }}
                 />
            {/each}
        </div>
    <!-- <AnnotationsAndRemarks /> -->
    {:else}
        <div in:fly={{y:-30, duration: 300, delay: 250}} class=coming-soon>
            <div>coming soon</div>
        </div>
    {/if}
</div>