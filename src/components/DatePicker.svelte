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

// FIXME: replace this with something else?
let START = '2017-06-13';

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

// this is where the store gets set, y'all.
$: if ($start !== '' && $start < START) $start = START;
$: if ($end !== '' && $start !== '' && $start > $end) $start = $end;

const daysBetween = (s,e) => Math.round(Math.abs((e.getTime() - s.getTime())/(24*60*60*1000)));

$: days = daysBetween(currentStart, currentEnd);

// let's limit the total major releaess of FF?

let releaseSet = []
$: releaseSet = $majorReleases === undefined ? [] : $majorReleases.filter(({date}) => {
    return ($start !== '' ? date >= $start : true) && ($end !== '' ? date <= $end : true)
})

</script>

<style>

:root {
    --selector-metadata-font-size: 15px;
}


.date-picker {
    margin-top: var(--footer-height);
    text-align: right;
}

.date-picker-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: var(--pad);
    justify-content: end;
}


h2 {
    font-size: 20px;
    font-weight: normal;
}

input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid tomato;
    padding:0;
    padding-top: 6px;
    padding-bottom: 6px;
    color: var(--dp-default-color);
    font-family: var(--default-font-family);
    font-size: var(--default-font-size);
    transition: border-bottom 100ms;
    cursor: pointer;
    width: 100%;
}

input:hover {
    border-bottom: 1px solid black;
}

input:focus {
    color: var(--dp-active-color)
}

.date-picker-input-label {
    font-size:12px;
    text-align:left;
    color: tomato;
}


</style>

<div class=date-picker>

    <h2>Time Period</h2>

    <div class='date-picker-controls'>

    <div>
    <div class='date-picker-input-label'>Start</div>
    <input type="date" id="start" name="range-start"
        value="2018-07-22"
        min={START} max={$end === '' ? TODAY : $end} bind:value={$rawStart} />
    </div>
    <div>
    <div class='date-picker-input-label'>End</div>
    <input type="date" id="end" class=date-end name="range-end"
        value="2018-07-22"
        min={
            $start === '' ? 
                START :
                ($start)
        } max={TODAY} bind:value={$rawEnd} /> 
    </div>
    </div>
</div>