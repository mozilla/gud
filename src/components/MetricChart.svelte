<script>
  import { fade, fly } from "svelte/transition";
  import { timeFormat } from "d3-time-format";
  import { format } from "d3-format";
  import { cubicInOut as easing } from "svelte/easing";

  import { outline } from "./outline";
  import { DataGraphic } from "@graph-paper/datagraphic";
  import { Line, Band } from "@graph-paper/elements";
  import LeftAxis from "@graph-paper/guides/LeftAxis.svelte";
  import BottomAxis from "@graph-paper/guides/BottomAxis.svelte";
  import TimeAxis from './TimeAxis.svelte';
  import { window1D } from "@graph-paper/core/utils/window-functions";

  import Scrub from './Scrub.svelte';
  import CompareDates from './CompareDates.svelte';
  import FirefoxReleaseVersionMarkers from './FirefoxReleaseVersionMarkers.svelte';
  import YearOverYearLabel from './YearOverYearLabel.svelte';

  export let name;

  export let brushTransitioning = false;
  export let data;
  export let width = 350;
  export let height = 200;
  export let headerSize = 'small';
  export let y;
  export let mousePosition = {};
  export let xDomain;
  export let yMin;
  export let yMax;
  export let caveat = () => undefined;
  export let transform = undefined;

  export let axisFormat = (v) => v;
  export let hoverFormat = (v) => v;

  // these functions should fire off as events.
  export let endMouseEvent;
  export let resetMouseClicks;

  let isComparing = false;
  let compareStart = {};
  let compareEnd = {};

  let xScale;
  let yScale;

  // formatters
  let dtfmt = timeFormat("%b %d, %Y");
  let percentage = format("+.2%");
  const dateDiff = (a, b) => Math.ceil(Math.abs(a - b) / (1000 * 60 * 60 * 24));

  function keyDown(evt) {
    if (evt.shiftKey) isComparing = true;
  }

  function keyUp() {
    if (isComparing) isComparing = false;
  }

  const get = (d, v, k, dom) => {
    const w = window1D({
      value: v,
      data: d,
      key: k,
      lowestValue: dom[0],
      highestValue: dom[1],
    });
    if (w.current) return w.current;
    return 0;
  };

  function percentageDifference(start, end) {
    return (end - start) / start;
  }

  function mouseleave(event) {
    resetMouseClicks(event);
  }
  // update the xMouse shared value.
  $: transformedData = transform ? transform(data, y) : data;
  $: output = (xScale && transformedData) ? get(transformedData, mousePosition.x || transformedData[transformedData.length-1].date, "date", xScale.domain()) : transformedData[transformedData.length -1];

  $: if (isComparing) {
    compareEnd = output;
  } else {
    compareStart = output;
  }

  $: caveatReason = caveat(output);

</script>


<style>
  header {
    display: grid;
    grid-template-columns: auto auto;
    margin: 0;
    padding: 0;
    padding-left: 40px;
    padding-right: 24px;
    color: var(--cool-gray-750);
    align-items: baseline;
  }

  h2 {
    margin: 0;
    font-size: 16px;
  }

  header div {
    justify-self: end;
  }

  .big {
    font-size: var(--text-04);
  }

  .big h2 {
    font-size: var(--text-06);
  }

  .caveat {
    font-size:.8em;
    color: var(--cool-gray-500);
  }
</style>

<svelte:window on:keydown={keyDown} on:keyup={keyUp} />

<header class:big={headerSize === 'large'}>
  <h2>{name}</h2>
  <div class:caveat={!!caveatReason}>
    {#if caveatReason}
      no data
    {:else if output[y] !== undefined}
      {hoverFormat(output[y])}
    {/if}
    </div>
</header>

<DataGraphic
  {width}
  {height}
  top={36}
  bottom={32}
  left={40}
  right={24}
  {xDomain}
  xDomainTween={{ duration: 250, easing }}
  yDomain={[yMin, yMax]}
  xType="time"
  yType="linear"
  bind:xScale
  bind:yScale
  let:left
  let:right
  bind:mousePosition
  on:mouseleave={mouseleave}>

  <g slot="body-background">
    {#if !brushTransitioning}
    <Band
      data={transformedData}
      curve=curveLinear
      x="date"
      yMin={`${y}_low`}
      yMax={`${y}_high`}
      color="var(--cool-gray-300)"
      alpha={0.4} />
    {/if}
  </g>
  <g slot="background" let:xScale let:yScale let:top let:bottom>
    <LeftAxis tickColor="var(--cool-gray-150)" tickFormatter={axisFormat} />

    {#if !brushTransitioning}
      <TimeAxis />
    {/if}
  </g>
  <g slot="body-background" let:xScale let:yScale let:top let:bottom>
    <Scrub x='x' on:scrubend={(event) => {
      const { start, end } = event.detail;
      endMouseEvent(start.x, end.x);
    }} {mousePosition} />
  </g>

  <g slot="body">
    <Line data={transformedData} x="date" {y} curve=curveLinear />
  </g>

  {#if !brushTransitioning}
    <g style="opacity:.6" in:fade={{duration: 260}}>
      <FirefoxReleaseVersionMarkers />
    </g>
  {/if}

  <g
    slot="interaction"
    let:left
    let:right
    let:top
    let:bottom
    let:xScale
    let:yScale>
    {#if output}
        {#if output.date}
          <text fill=var(--cool-gray-550) x={left} y={12} font-size={12}>
            {dtfmt(output.date)}
          </text>
        {/if}
        {#if caveatReason}
          <text in:fade={{duration:200}} x={right} y={12} text-anchor=end font-size={12} fill=var(--cool-gray-500)>{caveatReason}</text>
        {/if}

      {#if !caveatReason}
        <YearOverYearLabel data={transformedData} focusPoint={output} {y} />
      {/if}

      <CompareDates
        point={output} {y} x=date {hoverFormat}
      />

      <g transform="translate({xScale(output.date)} 0)">
        {#if !caveatReason && output[y] !== undefined}
          <circle cy={yScale(output[y])} r="3" fill="var(--digital-blue-500)" />
        {/if}
      </g>
    {/if}

  </g>
</DataGraphic>
