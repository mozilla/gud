<script>
import { getContext } from 'svelte';
import { format } from "d3-format";
import { outline } from "./outline";

const xScale = getContext('xScale');
const yScale = getContext('yScale');
const top = getContext('topPlot');
const bottom = getContext('bottomPlot');
export let point;
export let y;
export let x = 'date';
export let hoverFormat = (v) => v;
let percentage = format("+.2%");

let compareStart = {};
let compareEnd = {};
let isComparing = false;

function keyDown(evt) {
  if (evt.shiftKey) isComparing = true;
}

function keyUp() {
  if (isComparing) isComparing = false;
}

  function percentageDifference(start, end) {
    return (end - start) / start;
  }

$: if (isComparing) {
  compareEnd = point;
} else {
  compareStart = point;
}

</script>

<style>
  .comparison__line {
    shape-rendering: crispEdges;
    stroke: var(--digital-blue-200);
  }

  .comparison__text {
    font-size: 12px;
  }
</style>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} />

{#if isComparing}
<rect
  x={Math.min($xScale(compareStart.date), $xScale(compareEnd.date))}
  y={$top}
  width={Math.abs($xScale(compareStart.date) - $xScale(compareEnd.date))}
  height={$bottom - $top}
  fill="var(--digital-blue-100)"
  opacity=".35" />
<line
  shape-rendering="crispEdges"
  x1={$xScale(compareStart[x])}
  x2={$xScale(compareEnd[x])}
  y1={$yScale(compareStart[y])}
  y2={$yScale(compareStart[y])}
  stroke="var(--cool-gray-700)"
  stroke-dasharray="1,1" />
<line
  class="comparison__line"
  x1={$xScale(compareStart[x])}
  x2={$xScale(compareStart[x])}
  y1={$top}
  y2={$bottom} />
<g transform="translate({$xScale(point.date)} 0)">
        <line class="comparison__line" y1={$top} y2={$bottom} />
        <line
          y1={$yScale(compareStart[y])}
          y2={$yScale(compareEnd[y])}
          stroke-width=3
          stroke={compareStart[x] < compareEnd[x] ? 'var(--cool-gray-700)' : 'var(--pantone-red-500'}
        />
        <g>
          <text
            use:outline
            class="comparison__text"
            text-anchor={compareStart[x] > compareEnd[x] ? 'end' : 'start' }
            dx={compareStart[x] > compareEnd[x] ? '-1em' : '1em'}
            y={$yScale(point[y])}>
            {hoverFormat(compareEnd[y])}
          </text>
          <text
            use:outline
            class="comparison__text"
            dx={compareStart[x] > compareEnd[x] ? '-1em' : '1em'}
            dy="1em"
            text-anchor={compareStart[x] > compareEnd[x] ? 'end' : 'start' }
            y={$yScale(point[y])}
            fill={compareStart[y] < compareEnd[y] ? 'var(--cool-gray-900)' : 'var(--pantone-red-500)'}>
            {percentage(percentageDifference(compareStart[y], compareEnd[y]))}
          </text>
        </g>
    </g>
    <text
      use:outline
      class="comparison__text"
      y={$yScale(compareStart[y])}
      x={$xScale(compareStart[x])}
      text-anchor={compareStart[x] < compareEnd[x] ? 'end' : 'start'}
      dx={compareStart[x] < compareEnd[x] ? '-1em' : '1em'}>
      {hoverFormat(compareStart[y])}
    </text>
  {/if}
