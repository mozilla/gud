<script context="module">
    let globalX = writable(undefined);
</script>

<script>

import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { fly, fade } from 'svelte/transition';
import { select, mouse } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import {precisionPrefix, formatPrefix, format} from 'd3-format'
import { timeMonth, timeYear } from 'd3-time'
import { timeFormat } from 'd3-time-format'
import { area } from 'd3-shape';

import { majorReleases } from '../stores/productDetails'

// props
export let title;
export let rolloverLabel = 'value';
export let subtitle;
export let yType;
export let size;
export let data;
export let xMin;
export let xMax;

const magnitude = (n) => {
    const order = Math.floor(Math.log(n) / Math.LN10
                       + 0.000000001); // because float math sucks like that
    return Math.pow(10,order);
}

const makeFormatter = (maxValue, fmt) => {
    if (fmt === 'percentage') return format('.2%')
    if (fmt === 'ratio') return format('.2f')
    return (v) => format('~s')(v)
}
// generate this.
// const markers = [
//     {label: '50', date: new Date('2016-11-15')},
//     {label: '55', date: new Date('2017-08-08')},
//     {label: '60', date: new Date('2018-05-09')},
//     {label: '65', date: new Date('2019-01-28')},
// ]

const W = size === 'small' ? 350 : 750;
const H = size==='small' ? W * .6 : W*.5;

const xAxisDate = timeFormat('%d');
const xAxisMonth = timeFormat('%b');
const xAxisYear = timeFormat('%Y')
const xRollover = timeFormat('%b %d, %Y')
const M = {
    left:45,
    right:45,
    top:40,
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

const MAX_Y =  Math.max(...data.map(v=>v.upper))

const yFormat = makeFormatter(MAX_Y, yType);

let graphXMin;
let graphXMax;

$: graphXMin = xMin !== '' ? new Date(xMin) : Math.min(...data.map(v=>v.date))
$: graphXMax = xMax !== '' ? new Date(xMax) : Math.max(...data.map(v=>v.date))
$: xScale = scaleLinear().domain([
        graphXMin, graphXMax])
    .range([PL.left,PL.right])


// sift throuh releases here.
const ONE_YEAR = 1000 * 60 * 60 * 24 * (365  * (size === 'large' ? 2 : 1))
let markers = []
$: markers = $majorReleases.filter(release => {
    const onlyEveryFive = graphXMax - graphXMin >= ONE_YEAR ? parseInt(release.version) % 5 === 0 : true
    return onlyEveryFive 
        && (release.date >= graphXMin && release.date <= graphXMax)
})

$: yScale = scaleLinear().domain([0, yType === 'percentage' ? 1 : MAX_Y])
    .range([PL.bottom, PL.top])

$: path = `M${data.map(p => `${xScale(p.date)},${yScale(p.value)}`).join('L')}`;
$: xTicks = xScale.ticks()
$: yTicks = yScale.ticks(5)

let areaShape = area()
    .x(d=> xScale(d.date))
    .y0(d=> yScale(d.lower))
    .y1(d=> yScale(d.upper))

let graph;
let available = false;

let last = (arr) => arr[arr.length-1]

let mouseXValue = undefined;
let mouseYValue = undefined;

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
$: if ($globalX) {
    yPoint = data.find(d => d.date.getTime() === $globalX.getTime())//last(data.filter(d =>  d.date <= $globalX));
    $coords.x = xScale(yPoint.date);
    $coords.y = yScale(yPoint.value);
    mouseXValue = xRollover(yPoint.date);
    mouseYValue = `  ${yPoint.value}`
} else {
    $coords.x = -150;
    $coords.y = -150;
    mouseXValue = undefined
    mouseYValue = undefined
}

onMount(() => {
    available = true;
    const svg = select(graph)
    svg.on('mousemove', (e) => {
        // move the circle.
        const [x, y] = mouse(svg.node())
        if (x >= PL.left && x <= PL.right) {
            setPoint(last(data.filter(d => d.date <= xScale.invert(x))))
        } else {
            $coords.x = -150;
            $coords.y = -150;
            mouseXValue = undefined
            mouseYValue = undefined
            setPoint(undefined)
        }
    })
    svg.on('mouseleave', () => {
        $coords.x = -150;
        $coords.y = -150;
        mouseXValue = undefined
        mouseYValue = undefined
        setPoint(undefined)
    })
})

let coords = writable({ x: -150, y: -150 });

$: xTicks = timeMonth.range(...xScale.domain(), 3)

$: years = timeYear.range(...xScale.domain())

</script>

<style>
h3 {
    margin: 0;
}
label {
    margin-top: -4px;
    font-size: 12px;
    display: block;
    text-align: center;
    font-weight: 300;
    opacity: .8;
    text-transform: uppercase;
}

.graphic-container {
    display: block;
}

.graphic-container h3 {
    margin:0;
    padding:0;
    text-align:center;
    font-weight: 300;
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

.path-line.loaded {
    /* stroke-dasharray: 2000; */
    /* stroke-dashoffset: 2000; */
    /* animation: dash 1s ease-in forwards; */
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

</style>

{#if data.length}
<div
    class=graphic-container
>
    <h3>{title}</h3>
    <label>{subtitle || ""}</label>
    <svg
        bind:this={graph}
        on:mousemove="{e => coords.set({ x: e.clientX, y: e.offsetY })}"
        in:fly="{{y:4 * Math.sign(Math.random()-.5), duration: 100, delay: 150}}" 
        width="100%" 
        viewbox='0 0 {W} {H}'
        class:small-graph={size==='small'}
        class:large-graph={size==='large'}
    >
        
        <g class=x-axis>
            <line 
                x1={PL.left}  
                x2={PL.right}
                y1={A.bottom} y2={A.bottom}
                stroke='gray'
                stroke-width={1}
                ></line>
                <!-- {#each xTicks as xTick, i}
                    <line 
                        x1={xScale(xTick)}
                        x2={xScale(xTick)}
                        y1={A.bottom}
                        y2={A.bottom + M.buffer}
                        stroke='gray'
                    />
                    <text
                        x={xScale(xTick)}
                        y={A.bottom + M.buffer * 3}
                        dy={'.35em'}
                        font-size={10}
                        font-weight={xAxisMonth(xTick) === 'Jan' ? 'normal' : '100'} 
                        text-anchor="middle"
                    >{xAxisMonth(xTick)}</text>
                {/each} -->
                {#each years as year, i}
                    <line 
                        x1={xScale(year)}
                        x2={xScale(year)}
                        y1={A.bottom}
                        y2={A.bottom + M.buffer}
                        stroke='gray'
                    />
                    <text
                        x={xScale(year)}
                        y={A.bottom +M.buffer*3}
                        dy='.35em'
                        font-size={10}
                        text-anchor=middle

                    >{xAxisYear(year)}</text>
                {/each}
        </g>
        <g class=y-axis>
            <line 
                x1={PL.left}  
                x2={PL.left}
                y1={M.top} y2={A.bottom}
                stroke='gray'
                stroke-width={1}
                ></line>
                {#each yTicks as yTick,i}
                    <line 
                        x1={PL.left}
                        x2={PL.left - M.buffer}
                        y1={yScale(yTick)}
                        y2={yScale(yTick)}
                        stroke=gray
                    />
                    <text
                        y={yScale(yTick)}
                        x={A.left - M.buffer}
                        dy={'.35em'}
                        font-size={10}
                        text-anchor="end"
                    >{yFormat(yTick)}</text>
                    
                {/each}
        </g>
        <g class=plot-area>
            <path in:fade={{delay: 400}} d={areaShape(data)}  fill='rgba(0,0,0,.1)' />
            <path class:loaded={available} class=path-line d={path} />
        </g>
        <g class=markers>
            {#each markers as marker, i}
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
                <tspan font-weight="bold" fill='blue'> – </tspan> <tspan> {rolloverLabel} </tspan><tspan>{`   ${yFormat(mouseYValue)}   `}    </tspan>
            {/if}
        </text>
        <text opacity=".8" font-size='12' text-anchor='end' x={PL.right} y={12}>
            {#if mouseXValue !== undefined}
                <tspan>{`    ${mouseXValue}   `} </tspan>
            {/if}
        </text>
    </svg>
</div>
{:else}
    Yes, there's no data with this range specified
{/if}