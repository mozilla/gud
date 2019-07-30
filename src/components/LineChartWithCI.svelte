<script context="module">
    let ORDER = 0;
    // maintain the globalX value.
    let globalX = writable(undefined);
    // maintain the maximum y-range value for
    // a given grouping, and use  that max y for
    // all the graphs in that grouping (such as dau / wau / mau)
    let yRangeStore = writable({});
</script>

<script>

import { onMount, onDestroy, afterUpdate } from 'svelte';
import { writable } from 'svelte/store';
import { fly, fade, draw } from 'svelte/transition';
import {linear} from 'svelte/easing';
import { select, mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import {precisionPrefix, formatPrefix, format} from 'd3-format'
import { timeMonth, timeYear } from 'd3-time'
import { timeFormat } from 'd3-time-format'
import { area } from 'd3-shape';

import GraphicHeader from './data-graphic/GraphicHeader.svelte'
import NumericYAxis from './data-graphic/NumericYAxis.svelte'
import TimeAxis from './data-graphic/TimeAxis.svelte'
import Tooltip from './Tooltip.svelte'

import splitOn from '../utils/splitOn'

// props
export let title;
export let rolloverLabel = 'value';
export let whatKind;
export let shortDescription;
export let yType;
export let size;
export let data;
export let xMin;
export let xMax;
export let yMin;
export let yMax;
export let markers = [];
export let splitCriterion = undefined;

// markers are thin, vertical lines that
// denote special events & annotations on a graph.
export let filterMarkerCallback = () => true;

export let yRangeGroup;

export let onDragFinish = (startVal, endVal) => {}

function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName);
}

function getGraphWidth(size) {
    const value = getCSSVariable(size === 'small' ? '--small-graph-width' : '--large-graph-width')
    return new Number(value.split('px')[0])
}

// for fade-ins etc.
let order = ORDER;
ORDER += 1;
let orderStagger = 50;

let updateTooltipPosition;

const inBounds = (xmin, xmax) => {
    const xmindate = new Date(xmin)
    const xmaxdate = new Date(xmax)
    return d => { 
        return (xmin !== '' ? d.date >= xmindate : true) && (xmax !== '' ? d.date <= xmaxdate : true)
    }
}

const daysBetween = (firstDate, secondDate) => {
    const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}

const makeFormatter = (maxValue, fmt) => {
    if (fmt === 'percentage') return format('.2%')
    if (fmt === 'ratio') return format('.2f')
    return (v) => format('~s')(v)
}

const W = getGraphWidth(size) //size === 'small' ? 350 : 900;
const H = size==='small' ? W * .625 : W*.5;

const formatKeyString = timeFormat('%Y-%m-%d')
const xRollover = timeFormat('%b %d, %Y')

const M = {
    left:45,
    right:45,
    top:55,
    bottom:40,
    buffer:5
}

const A = {
    left: M.left,
    bottom: H - M.bottom
}

const PL = {
    left: M.left + M.buffer,
    right: W - M.right - M.buffer,
    top: M.top,
    bottom: H - M.bottom - M.buffer
}

let intermediateData = data.filter(inBounds(xMin, xMax));
//$: intermediateData = data.filter(inBounds(xMin, xMax));
const MAX_Y = yMax ? yMax : Math.max(...intermediateData.map(v=>v.upper))
// if this graph has a yRangeGroup key, let's log if it beats the current max Y for the group.
if (yRangeGroup) {
    $yRangeStore[yRangeGroup] = Math.max($yRangeStore[yRangeGroup] || 0, MAX_Y)
}
$: FINAL_MAX_Y = (yRangeGroup ? $yRangeStore[yRangeGroup] : MAX_Y)

$: yFormat = makeFormatter(FINAL_MAX_Y, yType);

let graphXMin;
let graphXMax;
// let dateRangeMode = 'years';

$: graphXMin = xMin !== '' ? new Date(xMin) : new Date(Math.min(...intermediateData.map(v=>v.date)))
$: graphXMax = xMax !== '' ? new Date(xMax) : new Date(Math.max(...intermediateData.map(v=>v.date)))

$: xScale = scaleLinear().domain([
        graphXMin, graphXMax])
    .range([PL.left,PL.right])

// sift throuh releases here.
let filteredMarkers = []
$: filteredMarkers = markers.filter(marker => filterMarkerCallback(marker, graphXMin, graphXMax))

let showReleaseMarkersOnHover = true;
$: showReleaseMarkersOnHover = filteredMarkers.filter(m=> {
    return m.date >= graphXMin && m.date <= graphXMax;
}).length >= 3

let yScale;
$: yScale = scaleLinear().domain([0, yMax ? yMax : (yType === 'percentage' ? 1 : FINAL_MAX_Y)])
    .range([PL.bottom, PL.top]).clamp(yType === 'percentage')

// finalData is the element that gets plotted.
let finalData;

if (!splitCriterion) {
    finalData = [intermediateData]
} else {
    finalData = splitOn(intermediateData, splitCriterion)
}

let areaShape;
$: areaShape = area()
    .x(d=> xScale(d.date))
    .y0(d=> yScale(d.lower))
    .y1(d=> yScale(d.upper))

$: path = finalData.map(segment=>`M${segment.map(p => `${xScale(p.date)},${yScale(p.value)}`).join('L')}`); 
// for whatever reason, ciArea doesn't update gracefully,.
$: ciArea = finalData.map(segment => areaShape(segment.filter(d => d.date <= graphXMax && d.date >= graphXMin)));

// all right. we need PATHS and ciAreas!

$: yTicks = yScale.ticks(5)

let graph;
let available = false;

let last = (arr) => arr[arr.length-1]

let mouseXValue = undefined;
let mouseYValue = undefined;
let mouseYLow = undefined;
let mouseYHigh = undefined;
let mouseVersionValue = undefined;

let localX;
let yPoint;
$: localX = $globalX;

$: yPoint = data[0];

function setPoint(pt) {
    if (pt) $globalX = pt.date
    else $globalX = undefined
}

// this performs the rollover if $globalX has meaningfully changed.
// note: this functionality happens to all graphs because $globalX is
// a store shared in all component namespaces.

function updateRollover(gbx) {
    if (gbx) {
        yPoint = intermediateData.find(d => d.date.getTime() === gbx.getTime())//last(data.filter(d =>  d.date <= $globalX));
        $coords.x = xScale(yPoint.date);
        $coords.y = yScale(yPoint.value);
        mouseXValue = xRollover(yPoint.date);
        mouseYValue = `  ${yPoint.value}`
        mouseYLow = yPoint.lower;
        mouseYHigh = yPoint.upper;
        mouseVersionValue = last(markers.filter(release => {
            return release.date <= yPoint.date;
        }))
        if (mouseVersionValue) {
            mouseVersionValue.end = markers.find(release => {
                return release.date > mouseVersionValue.date;
            })
            if (mouseVersionValue.end) mouseVersionValue.end = mouseVersionValue.end.date
            mouseVersionValue.start = xScale(mouseVersionValue.date)
            mouseVersionValue.end = mouseVersionValue.end ? xScale(mouseVersionValue.end) : PL.right
        }
    } else {
        $coords.x = -150;
        $coords.y = -150;
        mouseXValue = undefined;
        mouseYValue = undefined;
        mouseYLow = undefined;
        mouseYHigh = undefined;
        mouseVersionValue = undefined;
    }
}
$: updateRollover($globalX)
// DELETE WHEN WE VERIFY THIS IS GOOD TO GET RID OF.
// $: if ($globalX) {
//     yPoint = intermediateData.find(d => d.date.getTime() === $globalX.getTime())//last(data.filter(d =>  d.date <= $globalX));
//     $coords.x = xScale(yPoint.date);
//     $coords.y = yScale(yPoint.value);
//     mouseXValue = xRollover(yPoint.date);
//     mouseYValue = `  ${yPoint.value}`
//     mouseYLow = yPoint.lower;
//     mouseYHigh = yPoint.upper;
//     mouseVersionValue = last(markers.filter(release => {
//         return release.date <= yPoint.date;
//     }))
//     if (mouseVersionValue) {
//         mouseVersionValue.end = markers.find(release => {
//             return release.date > mouseVersionValue.date;
//         })
//         if (mouseVersionValue.end) mouseVersionValue.end = mouseVersionValue.end.date
//         mouseVersionValue.start = xScale(mouseVersionValue.date)
//         mouseVersionValue.end = mouseVersionValue.end ? xScale(mouseVersionValue.end) : PL.right
//     }
    
// } else {
//     $coords.x = -150;
//     $coords.y = -150;
//     mouseXValue = undefined;
//     mouseYValue = undefined;
//     mouseYLow = undefined;
//     mouseYHigh = undefined;
//     mouseVersionValue = undefined;
// }

// these values are used for dragging.
let isDragging = false;
let mouseDownStartValue;
let mouseDownEndValue;

onMount(() => {
    available = true;
    const svg = select(graph)
    svg.on('mousedown', (e) => {
        isDragging = true;
        const [x, y] = mouse(svg.node())
        mouseDownStartValue = last(intermediateData.filter(d => d.date <= xScale.invert(x)))
        if (mouseDownStartValue) mouseDownStartValue = mouseDownStartValue.date
    })
    svg.on('mouseup', (e) => {
        if (isDragging) {
            const [x, y] = mouse(svg.node())
            if (mouseDownStartValue && mouseDownEndValue) {
                onDragFinish(mouseDownStartValue, mouseDownEndValue)
                $globalX = undefined;
            }
            isDragging=false;
            mouseDownStartValue = undefined;
            mouseDownEndValue = undefined;
        }
        
    })
    svg.on('mousemove', (e) => {
        // move the circle.
        const [x, y] = mouse(svg.node())
        if (x >= PL.left && x <= PL.right) {
            const invertedX = xScale.invert(x)
            //const invertedX = formatKeyString(xScale.invert(x)
            const currentPoint = last(intermediateData.filter(d => d.date <= invertedX))
            //const currentPoint = last(data.filter(d => d.key === invertedX))
            setPoint(currentPoint)
            if (isDragging) {
                mouseDownEndValue = currentPoint.date
            }
            // 
        } else {
            $coords.x = -150;
            $coords.y = -150;
            mouseXValue = undefined
            mouseYValue = undefined
            setPoint(undefined)
        }
    })
    svg.on('mouseleave', () => {
        isDragging = false;
        $coords.x = -150;
        $coords.y = -150;
        mouseXValue = undefined
        mouseYValue = undefined
        mouseYLow = undefined;
        mouseYHigh = undefined;
        // clear the drag.
        isDragging = false;
        mouseDownStartValue = undefined;
        mouseDownEndValue = undefined;
        setPoint(undefined)
    })
})

onDestroy(() => {
    ORDER -= 1;
})

afterUpdate(() => {
    if (updateTooltipPosition) updateTooltipPosition();
})

let coords = writable({ x: -150, y: -150 });

// handle scale size.

</script>

<style>

.graphic-container {
    display: block;
    margin: auto;
}

svg {
    display: block;
    margin: auto;
}

svg.small-graph {
        width: var(--small-graph-width);
}
svg.large-graph {
        width: var(--large-graph-width);
}

.path-line {
    fill: none;
    stroke: rgba(138, 43, 226, .8);
    stroke-width: 1px;
}

</style>
{#if intermediateData.length}
<div
    class=graphic-container
>
    <GraphicHeader
        title={title}
        shortDescription={shortDescription}
        size={size}
        order={order}
        orderStagger={orderStagger}
    />
    <svg
        bind:this={graph}
        on:mousemove="{e => coords.set({ x: e.clientX, y: e.offsetY })}"
        in:fly="{{y:4 * Math.sign(Math.random()-.5), duration: 100, delay: 150}}" 
        width="100%" 
        viewbox='0 0 {W} {H}'
        class:small-graph={size==='small'}
        class:large-graph={size==='large'}
    >
        <defs>
            <clipPath id='clip-path'>
                <rect
                    x={PL.left}
                    y={PL.top}
                    width={PL.right - PL.left}
                    height={PL.bottom - PL.top}
                />
            </clipPath>
        </defs>
        <TimeAxis
            left={PL.left}
            right={PL.right}
            bottom={A.bottom}
            scale={xScale}
            tickLength={M.buffer}
        />
        <NumericYAxis
            left={PL.left}
            right={PL.right}
            top={PL.top}
            bottom={PL.bottom}
            tickLength={M.buffer}
            scale={yScale}
            axisType={yType}
        />
        <g class=plot-background>
            {#if mouseVersionValue && mouseVersionValue.end && mouseVersionValue && showReleaseMarkersOnHover}
                <!-- marker hoverover -->
                <rect
                    style="clip-path: url(#clip-path);" 
                    in:fade={{duration:100}}
                    x={Math.max(mouseVersionValue.start, PL.left)}
                    y={PL.top}
                    width={mouseVersionValue.end - Math.max(mouseVersionValue.start, PL.left)}
                    height={A.bottom - PL.top}
                    fill='rgba(0,0,100,.05)'
                />
                <text
                    in:fade={{duration:100}}
                    x={
                        size === 'large' ? mouseVersionValue.start + (mouseVersionValue.end - mouseVersionValue.start) / 2 :
                        Math.max(mouseVersionValue.start - M.buffer, PL.left + M.buffer)
                    }
                    y={PL.bottom}
                    font-size=10
                    opacity='.5'
                    text-anchor={
                        size === 'large' ? 'middle' : 
                        ((mouseVersionValue.start - M.buffer < PL.left + M.buffer) ? 'start' : 'end')
                    }
                >{parseInt(mouseVersionValue.version)}</text>
            {/if}
            {#if isDragging}
                <!-- this is the brushing element -->
                <rect
                    class=dg-horizontal-brush
                    x={Math.min(xScale(mouseDownStartValue), xScale(mouseDownEndValue))}
                    y={PL.top}
                    width={Math.abs(xScale(mouseDownStartValue) - xScale(mouseDownEndValue))}
                    height={A.bottom - PL.top}
                    opacity={.2}
                    fill='tomato'
                />
            {/if}
        </g>
        <g in:fade={{duration:300}} class=plot-area>
            {#each path as p, i}
                <path style="clip-path: url(#clip-path);" in:draw={{duration: 500}} class:loaded={available} class=path-line d={p} />
            {/each}
            {#each ciArea as ci, i}
                <path  style="clip-path: url(#clip-path);" in:fade={{duration:1000}} d={ci}  fill='rgba(0,0,0,.1)' />
            {/each}
            
            
        </g>
        <g class=markers>
            {#each filteredMarkers as marker, i}
                <line 
                    x1={xScale(marker.date)}
                    x2={xScale(marker.date)}
                    y1={PL.top}
                    y2={A.bottom}
                    stroke=gray
                    stroke-dasharray="1,1"
                ></line>
                <text 
                    x={xScale(marker.date)} 
                    y={PL.top - M.buffer}
                    fill=gray
                    font-size=11
                    text-anchor=middle
                >
                    {marker.label}
                    </text>
            {/each}
        </g>
        <g class=body-rollover>
            <line x1={$coords.x} x2={$coords.x} y1={yScale(yPoint.lower)} y2={yScale(yPoint.upper)} stroke='black' />
            <line x1={$coords.x - 3} x2={$coords.x + 3} y1={yScale(yPoint.upper)} y2={yScale(yPoint.upper)} stroke=black />
            <line x1={$coords.x - 3} x2={$coords.x + 3} y1={yScale(yPoint.lower)} y2={yScale(yPoint.lower)} stroke=black />
            <circle cx={$coords.x} cy={$coords.y} r={2.5} fill='blue'  />
        </g>
        
        <text opacity=".8" font-size='12' text-anchor='start' x={PL.left} y={12}>
            {#if mouseYValue !== undefined}
                <tspan in:fade={{duration:100}} font-weight="bold" fill='blue'> – </tspan><tspan>{`   ${yFormat(mouseYValue)}   `}    </tspan>
            {/if}
        </text>
        <text opacity=".6" font-size='10' text-anchor='start' x={PL.left} y={26}>
            {#if mouseYLow !== undefined}
                <tspan font-weight="bold" fill='black'> L </tspan><tspan fill='rgb(0,0,0,.7)'>{`   ${yFormat(mouseYLow)}   `}    </tspan>
            {/if}
            {#if mouseYHigh !== undefined}
                <tspan font-weight="bold" > H </tspan><tspan fill='rgb(0,0,0,.9)'>{`   ${yFormat(mouseYHigh)}   `}    </tspan>
            {/if}
        </text>
        <text opacity=".8" font-size='12' text-anchor='end' x={PL.right} y={12}>
            {#if mouseXValue !== undefined}
                <tspan>{`    ${mouseXValue}   `} </tspan>
            {/if}
        </text>
        <text font-weight=bold opacity=".4" font-size='10' text-anchor='end' x={PL.right} y={26}>
            {#if mouseVersionValue !== undefined && yPoint !== undefined}
                <tspan>{`    ${parseInt(mouseVersionValue.version)} – day ${daysBetween(yPoint.date, mouseVersionValue.date)}   `} </tspan>
            {/if}
        </text>
    </svg>
</div>
{:else}
    Yes, there's no data with this range specified
{/if}