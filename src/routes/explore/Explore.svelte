<script>
  import { format } from "d3-format";
  import { timeFormat, timeParse } from "d3-time-format";

  import { fly, fade } from "svelte/transition";
  import { writable } from "svelte/store";

  import { Box } from "@graph-paper/box";

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

  import MetricChart from "../../components/MetricChart.svelte";
  import PageTitle from '../../components/PageTitle.svelte';

  import CONFIG from '../../stores/options.json';
  import { store } from '../../stores/store';
  import { datesAreDefault, storeToQuery } from '../../stores/cache';

  import { dataQualityReason } from '../../utils/data-quality';
  import smooth from '../../utils/smoothing';
  import { exportData } from '../../utils/download-string'
  import { metrics, graphSize } from '../../config';

  import Export from '../../components/Export.svelte';


  import DatePicker from "../../components/controls/DatePicker.svelte";
  import ShowMetrics from '../../components/controls/ShowMetrics.svelte';
  import GraphSizeButtons from '../../components/controls/GraphSizeButtons.svelte';
  import CommonScalesButton from '../../components/controls/CommonScalesButton.svelte';
  import SmoothingButton from '../../components/controls/SmoothingButton.svelte';
  import Key from "../../components/Key.svelte";
  import FirefoxReleaseVersionMarkers from '../../components/FirefoxReleaseVersionMarkers.svelte';

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
      ...data.map((d) => $store.disabledMetrics.includes('dau') ? 0 : (d.dau_high || 0)),
      ...data.map((d) => $store.disabledMetrics.includes('wau') ? 0 : (d.wau_high || 0)),
      ...data.map((d) => $store.disabledMetrics.includes('mau') ? 0 : (d.mau_high || 0))
    ) * 1.1;

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

  $: criterion = CONFIG.usage.values.find(v=> v.key === $store.usage);

  function getMetricMetadata(metric) {
    return CONFIG.metric.values.find(v => v.key === metric);
  }


  // export modal;
  let isExporting = false;

</script>

<style>

  .multiples {
    display: grid;
    grid-column-gap: var(--space-4x);
    grid-row-gap: var(--space-4x);
    justify-content: start;
    justify-items: start;

  }

  .multiples--small {
    grid-template-columns: auto auto auto;
  }

  @media (max-width: 1400px) {
    .multiples--small {
      grid-template-columns: auto auto;
    }
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
    margin-bottom: var(--space-6x);
  }

  .bottom {
    margin: auto;
  }

  :global(.top-right-controls .gp-button) {
    background-color: transparent;
    color: var(--digital-blue-400);
    border-color: var(--digital-blue-300);
    border-width: 2px;
    transition: color 100ms, background-color 100ms, transform 100ms;
  }

  :global(.top-right-controls .gp-button:hover) {
    background-color: var(--digital-blue-100);
    color: var(--digital-blue-500);
    transform: translateY(2px);
  }
</style>

<main>

    <PageTitle>
      <span slot=icon>
        <Explore size={16} />
      </span>
      <span slot=view>Explore</span>
      <span slot=title>{$store.usage}</span>
      <div slot=description>
        {criterion.shortDescription}
      </div>
      <div slot=controls class="top-right-controls">
        <Button
          level=medium on:click={() => { exportData(data, $store); }}
          tooltip="Download the dataset in this view as a CSV file"
        >
          <div class=gafc style="--gafc-space: var(--space-1x);"> <Export size=1em /> Export as CSV</div>
          </Button>
      </div>
    </PageTitle>

    <div class="main-controls">
      <div class="gafc" style="--gafc-space: var(--space-2x);">
        <DatePicker
          startDate={xDomain[0]}
          endDate={xDomain[1]}
          on:applyDates={(evt) => {
            isScrubbing = true;
            let { start, end } = evt.detail;
            endMouseEvent(start, end);
          }}
          on:resetDates={store.resetDateRange} />

        {#if !$datesAreDefault}
          <div in:fly={{ duration: 400, y: -10 }}>
            <Button
              level="medium"
              compact
              on:click={() => {
                isScrubbing = false;
                store.resetDateRange();
              }}>
              clear zoom
              <Close size={16} />
            </Button>
          </div>
        {/if}

        <CommonScalesButton />
        <SmoothingButton />

        <ShowMetrics />
        {#if $store.metric === 'all'}
          <GraphSizeButtons />
        {/if}
      </div>
    </div>

    <div class="multiples multiples--{$store.graphSize}">
      {#each metrics.filter(m => !$store.disabledMetrics.includes(m.key)) as { name, type, key, yMax, metricClass, axisFormat, hoverFormat }, i (name)}
        {#if $store.metric === 'all' || $store.metric === key}
        <div in:fade={{duration: 300 }}>
          <MetricChart
            brushTransitioning={$store.metric !== 'all' ? false : $store.brushTransitioning}
            headerSize={$store.metric !== 'all' ? 'large' : $store.graphSize}
            {width}
            {height}
            {name}
            description={getMetricMetadata(key).shortDescription}
            {data}
            transform={$store.smoothing === true ? smooth : undefined}
            y={key}
            {xDomain}
            yMin={$store.commonScales === true ? 0 : undefined}
            yMax={$store.commonScales === true ? (metricClass === 'actives' && $store.metric === 'all' ? auMax : yMax) : undefined}
            caveat={(datapoint) => datapoint ? dataQualityReason(datapoint.date, key, criterion.product === 'Firefox Desktop') : () => undefined}
            markers={criterion.product === 'Firefox Desktop' ? FirefoxReleaseVersionMarkers : undefined}
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
