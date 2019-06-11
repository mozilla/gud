<script>
import {onMount} from 'svelte'
import { timeFormat } from 'd3-time-format'
import { majorReleases } from '../stores/productDetails'
import optionSet from '../stores/options.json'
import {rawStart, rawEnd} from '../stores/stores'

let start = optionSet.startOptions.setter;
let end = optionSet.endOptions.setter;

onMount(() => {
    if ($start !== '') $rawStart = $start;
    if ($end !== '') $rawEnd = $end;
})

let tf = timeFormat('%Y-%m-%d')

let TODAY = tf(new Date());

const dayBefore = (d) => {
    const di = new Date(d);
    return di
}

const dayAfter = (d) => {
    const di = new Date(d);
    di.setDate(di.getDate()+2)
    return di
}

// FIXME: replace this with something a bit more relevant.
let START = '2016-01-01';

// check boundary conditions.
$: if ($rawStart !== '' ) {
    if ($rawStart < START) $start = START
    if ($rawStart > START) $start = $rawStart
    if ($rawEnd !== '' && $rawStart > rawEnd) $start = tf(dayBefore($rawEnd));
    if ($rawStart > TODAY) $start = tf(dayBefore(TODAY))
} else {
    $start = ''
}

$: if ($rawEnd !== '') {
    if ($rawEnd > TODAY) $end = TODAY
    if ($rawEnd < TODAY) $end = $rawEnd
    if ($rawStart !== '' && $rawEnd <= $rawStart) $end = tf(dayAfter($rawStart))
    if ($rawEnd < START) $end = tf(dayAfter(START))
} else {
    $end = ''
}

$: currentStart = new Date($start === '' ? START : $start);
$: currentEnd = new Date($end === '' ? TODAY : $end);

$: if ($start !== '' && $start < START) $start = START;
$: if ($end !== '' && $start !== '' && $start > $end) $start = $end;

const daysBetween = (s,e) => Math.round(Math.abs((e.getTime() - s.getTime())/(24*60*60*1000)));

$: days = daysBetween(currentStart, currentEnd);

// let's limit the total major releaess of FF?

let releaseSet = []
$: releaseSet = $majorReleases === undefined ? [] : $majorReleases.filter(([_name, {date}]) => {
    return ($start !== '' ? date >= $start : true) && ($end !== '' ? date <= $end : true)
})

</script>

<style>

:root {
    --selector-metadata-font-size: 15px;
}

input {
    background-color: transparent;
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 6px;
}

div.days-since {
    margin-top: var(--pad);
    font-size: var(--selector-metadata-font-size)
}

</style>

<div>

<h2>Time Period</h2>

<input type="date" id="start" name="range-start"
       value="2018-07-22"
       min={START} max={$end === '' ? TODAY : $end} bind:value={$rawStart}>

<input type="date" id="end" name="range-end"
       value="2018-07-22"
       min={
           $start === '' ? 
            START :
            ($start)
       } max={TODAY} bind:value={$rawEnd}>

{#if days !== NaN}
    <div class=days-since>
        {#if $start === '' && $end === ''}
            default
        {/if}
        {days} days 
        {#if releaseSet.length > 1}
            ({releaseSet.length} releases)
        {/if}
    </div>
{/if}    

</div>