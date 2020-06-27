<script>
  import { format } from "d3-format";
  import { timeFormat, timeParse } from "d3-time-format";

  import { fly, fade } from "svelte/transition";
  import { writable } from "svelte/store";

  import { Box } from "@graph-paper/box";

  import MetricChart from "../../components/MetricChart.svelte";
  import PageTitle from '../../components/PageTitle.svelte';

  import CONFIG from '../../stores/options.json';
  import { store } from '../../stores/store';
  import { datesAreDefault } from '../../stores/cache';

  import { dataQualityReason } from '../../utils/data-quality';
  import smooth from '../../utils/smoothing';
  import { metrics, graphSize } from '../../config';


  import {
    Close,
    Stack,
    Tile,
    Checkbox,
    CheckboxBlank,
    Explore
  } from "@graph-paper/icons";


  import { Button, ButtonGroup } from "@graph-paper/button";
  import { window1D } from "@graph-paper/core/utils/window-functions";

  import DatePicker from "../../components/DatePicker.svelte";
  import ShowMetrics from '../../components/controls/ShowMetrics.svelte';
  import GraphSizeButtons from '../../components/controls/GraphSizeButtons.svelte'
  import Key from "../../components/Key.svelte";


  export let data;

  let dtfmt = timeFormat("%b %d, %Y");
  let dateStringFormat = timeFormat('%Y-%m-%d');
  let parseDateString = timeParse('%Y-%m-%d');

  const generateDomain = (d) => [
    new Date(Math.min(...d.map((di) => di.date))),
    new Date(Math.max(...d.map((di) => di.date))),
  ];


  $: xDomain = [parseDateString($store.startDate), parseDateString($store.endDate)];

  let auMax =
    Math.max(
      ...data.map((d) => d.dau_high || 0),
      ...data.map((d) => d.wau_high || 0),
      ...data.map((d) => d.mau_high || 0)
    ) * 1.1;

  const resetDomain = () => {
    store.resetDateRange();
  };

  const get = (d, value, dom) => {
    const w = window1D({
      value,
      data: d,
      key: "date",
      lowestValue: dom[0],
      highestValue: dom[1],
    });
    if (w.current) return w.current;
    return 0;
  };

  let mousePosition = {};
  let mouseDownValue = {};
  let mouseMoveValue = {};
  let startValue;
  let endValue;

  const resetMouseClicks = () => {
    mouseDownValue = {};
    mouseMoveValue = {};
  };
  let isScrubbing = false;

  const endMouseEvent = (a, b) => {
    startValue = new Date(Math.min(a, b));
    endValue = new Date(Math.max(a, b));
    store.setDateRange(dateStringFormat(startValue), dateStringFormat(endValue));
    isScrubbing = true;
    resetMouseClicks();
  };

  let isComparing = false;

  let width = 375;
  let height = 250;

  $: [width, height] = graphSize($store.metric !== 'all' ? 'large' : $store.graphSize);

  $: description = CONFIG.usage.values.find(v=> v.key === $store.usage).shortDescription;

</script>

<style>

  .gafc {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-column-gap: var(--space-2x);
  }

  .multiples {
    display: grid;
    grid-column-gap: var(--space-4x);
    grid-row-gap: var(--space-6x);
    justify-content: start;
    justify-items: start;

  }

  .multiples--small {
    grid-template-columns: auto auto auto;
  }

  .multiples--medium {
    grid-template-columns: auto auto;
  }

  .multiples--large {
    grid-template-columns: auto;
  }

  .main-controls {
    padding-left: var(--space-2x);
    padding-right: var(--space-2x);
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    justify-items: start;
    align-items: center;
    margin-bottom: var(--space-4x);
  }

  .bottom {
    margin: auto;
  }
</style>

<main>

    <PageTitle>
      <span slot=icon>
        <Explore size={16} />
      </span>
      <span slot=view>explore</span>
      <span slot=title>{$store.usage}</span>
      <div slot=description>
        {description}
      </div>
      <div slot=controls>
        <Button level=medium>Export ...</Button>
      </div>
    </PageTitle>

    <div class="main-controls">
      <div class="gafc">
        <DatePicker
          startDate={xDomain[0]}
          endDate={xDomain[1]}
          on:applyDates={(evt) => {
            isScrubbing = true;
            let { start, end } = evt.detail;
            xDomain = [start, end];
          }}
          on:resetDates={resetDomain} />

        {#if !$datesAreDefault}
          <div in:fly={{ duration: 400, y: -10 }}>
            <Button
              level="medium"
              compact
              on:click={() => {
                isScrubbing = false;
                resetDomain();
              }}>
              clear zoom
              <Close size={16} />
            </Button>
          </div>
        {/if}

        <Button
          compact
          level="medium"
          on:click={() => {
            store.setField('commonScales', !$store.commonScales)
          }}>
          <div class="gafc" style="grid-column-gap: var(--space-base);">
            common scales
            {#if $store.commonScales}
              <Checkbox size="1em" />
            {:else}
              <CheckboxBlank size="1em" />
            {/if}
          </div>
        </Button>
        <Button
          compact
          level="medium"
          on:click={() => {
            store.setField('smoothing', !$store.smoothing)
          }}>
          <div class="gafc" style="grid-column-gap: var(--space-base);">
            7-day smoothing
            {#if $store.smoothing === true}
              <Checkbox size="1em" />
            {:else}
              <CheckboxBlank size="1em" />
            {/if}
          </div>
        </Button>

        <ShowMetrics />
        <GraphSizeButtons />
      </div>
    </div>

    <div class="multiples multiples--{$store.graphSize}">
      {#each metrics as { name, type, key, yMax, metricClass, axisFormat, hoverFormat }, i (name)}
        {#if $store.metric === 'all' || $store.metric === key}
        <div in:fade={{duration: 300 }}>
          <MetricChart
            headerSize={$store.metric !== 'all' ? 'large' : $store.graphSize}
            {width}
            {height}
            {name}
            {data}
            transform={$store.smoothing === true ? smooth : undefined}
            y={key}
            {xDomain}
            yMin={$store.commonScales === true ? 0 : undefined}
            yMax={$store.commonScales === true ? (metricClass === 'actives' ? auMax : yMax) : undefined}
            caveat={(datapoint) => dataQualityReason(datapoint.date, key, true)}
            {axisFormat}
            {hoverFormat}
            {endMouseEvent}
            {resetMouseClicks}
            bind:mousePosition
            bind:mouseDownValue
            bind:mouseMoveValue
            bind:isComparing />
        </div>
        {/if}
      {/each}
    </div>

      <Key />
</main>
