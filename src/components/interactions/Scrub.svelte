<script>
import { getContext, onMount, onDestroy, createEventDispatcher } from 'svelte';
import { fade } from 'svelte/transition';
const xScale = getContext('xScale');
const top = getContext('topPlot');
const bottom = getContext('bottomPlot');

const dispatch = createEventDispatcher();

export let mousePosition;
export let x = 'x';

let element;
const dateDiff = (a, b) => Math.ceil(Math.abs(a - b) / (1000 * 60 * 60 * 24));

let mouseDownValue = {};
let mouseMoveValue = {};

// $: if (clicked && !activated) {
//   mouseDownValue = mousePosition;
//   activated = true;
// } else if (clicked) {
//   mouseMoveValue = mousePosition;
// } else {
//   mouseDownValue = {};
//   mouseMoveValue = {};
//   activated = false;
// }
let parent;


function onMouseDown() {
  mouseDownValue = mousePosition;
}

function onDrag() {
  if (mouseDownValue[x]) {
    mouseMoveValue = mousePosition;
  }
}

function reset() {
  mouseDownValue = {};
  mouseMoveValue = {};
}

function mouseup() {
  dispatch('scrubend', {start: mouseDownValue, end: mouseMoveValue});
  reset();
}

onMount(() => {
  parent = element.nearestViewportElement;
  parent.addEventListener('mousedown', onMouseDown);
  parent.addEventListener('mousemove', onDrag);
  parent.addEventListener('mouseleave', reset);
  parent.addEventListener('mouseup', mouseup);
})

onDestroy(() => {
  parent.removeEventListener('mousedown', onMouseDown);
  parent.removeEventListener('mousemove', onDrag);
  parent.removeEventListener('mouseleave', reset);
  parent.removeEventListener('mouseup', mouseup);

})

</script>

<g class=gp-scrub bind:this={element}>
{#if mouseDownValue[x] !== undefined && mouseMoveValue[x] !== undefined}
      <text x={10} y={20}>whatsup</text>
      <rect
        transition:fade={{ duration: 75 }}
        x={Math.min($xScale(mouseDownValue[x]), $xScale(mouseMoveValue[x]))}
        y={$top}
        width={Math.abs($xScale(mouseDownValue[x]) - $xScale(mouseMoveValue[x]))}
        height={$bottom - $top}
        fill="var(--pantone-red-100)" />
      <line
        shape-rendering=crispEdges
        x1={$xScale(mouseDownValue[x])}
        x2={$xScale(mouseDownValue[x])}
        y1={$top}
        y2={$bottom}
        stroke="var(--pantone-red-200)"
        stroke-width="1" />
      <line
        shape-rendering=crispEdges
        x1={$xScale(mouseMoveValue[x])}
        x2={$xScale(mouseMoveValue[x])}
        y1={$top}
        y2={$bottom}
        stroke="var(--pantone-red-200)"
        stroke-width="1" />
      <text
        transition:fade={{ duration: 75 }}
        x={Math.min($xScale(mouseDownValue[x]), $xScale(mouseMoveValue[x])) + 5}
        y={$bottom - 5}
        font-size="11"
        style="text-transform: uppercase;"
        fill="var(--cool-gray-500)">
        {dateDiff(mouseDownValue[x], mouseMoveValue[x])} days
      </text>
    {/if}
</g>
