<script>
  import { format } from "d3-format";
  import { timeFormat } from "d3-time-format";

  import { fly } from "svelte/transition";
  import { writable } from "svelte/store";

  import { Box } from "@graph-paper/box";
  import CONFIG from '../stores/options.json';
  import { store } from '../stores/store'
  import MetricChart from "./MetricChart.svelte";

  import {
    Close,
    Stack,
    Tile,
    Checkbox,
    CheckboxBlank,
  } from "@graph-paper/icons";

  import ThreeByThree from './ThreeByThree.svelte'

  import { Button, ButtonGroup } from "@graph-paper/button";
  import { window1D } from "@graph-paper/core/utils/window-functions";

  import DatePicker from "./DatePicker.svelte";

  import Key from "./Key.svelte";
  import Shortcuts from "./Shortcuts.svelte";

  const graphSize = writable({
    graphSize: "small", // medium, large.
  });

  export let data;

  function changeSize(size) {
    return () => {
      graphSize.update((state) => {
        const newState = { ...state };
        newState.graphSize = size;
        return newState;
      });
    };
  }

  let dtfmt = timeFormat("%b %d, %Y");

  const generateDomain = (d) => [
    new Date(Math.min(...d.map((di) => di.date))),
    new Date(Math.max(...d.map((di) => di.date))),
  ];

  let xDomain = generateDomain(data);

  let auMax =
    Math.max(
      ...data.map((d) => d.dau_high),
      ...data.map((d) => d.wau_high || 0),
      ...data.map((d) => d.mau_high)
    ) * 1.1;

  const resetDomain = () => {
    xDomain = generateDomain(data);
  };

  let withCommas = format(",");
  let count = (v) => (v !== undefined ? withCommas(Math.round(v)) : "missing");

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

  const graphs = [
    {
      name: "DAU",
      key: "dau",
      type: "count",
      yMax: auMax,
      axisFormat: format("~s"),
      hoverFormat: count,
    },
    {
      name: "WAU",
      key: "wau",
      type: "count",
      yMax: auMax,
      axisFormat: format("~s"),
      hoverFormat: count,
    },
    {
      name: "MAU",
      key: "mau",
      type: "count",
      yMax: auMax,
      axisFormat: format("~s"),
      hoverFormat: count,
    },
    {
      name: "Intensity",
      key: "intensity",
      type: "rate",
      yMax: 7,
      axisFormat: format(".1f"),
      hoverFormat: format(".2f"),
    },
    {
      name: "Retention ",
      key: "retention_1_week_active_in_week_0",
      type: "percentage",
      yMax: 1,
      axisFormat: format(".0%"),
      hoverFormat: format(".2%"),
    },
    {
      name: "Retention (1 wk. new)",
      key: "retention_1_week_new_profile",
      type: "percentage",
      yMax: 1,
      axisFormat: format(".0%"),
      hoverFormat: format(".2%"),
    },
  ];

  let mousePosition = {};
  let mouseDownValue = {};
  let mouseMoveValue = {};
  let startValue;
  let endValue;

  let xMouse;

  const resetMouseClicks = () => {
    mouseDownValue = {};
    mouseMoveValue = {};
  };
  let isScrubbing = false;

  const endMouseEvent = () => {
    startValue = new Date(Math.min(mouseDownValue.x, mouseMoveValue.x));
    endValue = new Date(Math.max(mouseDownValue.x, mouseMoveValue.x));
    xDomain = [startValue, endValue];
    isScrubbing = true;
    resetMouseClicks();
  };

  let isComparing = false;
  let commonScales = true;

  let width = 375;
  let height = 250;

  $: if ($graphSize.graphSize === "small") {
    width = 375;
    height = 250;
  } else if ($graphSize.graphSize === "medium") {
    width = 550;
    height = 325;
  } else if ($graphSize.graphSize === "large") {
    width = 1200;
    height = 400;
  }

  $: description = CONFIG.usage.values.find(v=> v.key === $store.usage).shortDescription;

</script>

<style>

  header {
    padding-left: var(--space-2x);
    color: var(--cool-gray-700);
    padding-bottom: var(--space-6x);
  }

  h1 {
    margin: 0px;
    padding: 0px;
  }

  header div {
    font-size: var(--text-03);
    max-width: calc(var(--space-1x) * 120);
  }

  .gafc {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-column-gap: var(--space-2x);
  }

  main {
    min-width: 1200px;
  }

  .multiples {
    display: grid;
    grid-column-gap: var(--space-4x);
    grid-row-gap: var(--space-8x);
    justify-content: center;
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
    justify-content: stretch;
    justify-items: start;
    align-items: center;
    margin-bottom: var(--space-4x);
  }

  .bottom {
    margin: auto;
  }
</style>

<main>
  <Box padding={2}>
    <header>
      <h1>{$store.usage}</h1>
      <div>{description}</div>
    </header>

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

        {#if isScrubbing}
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
      </div>
      <div class="gafc" style="justify-self: end">
        <Button
          compact
          level="medium"
          on:click={() => {
            commonScales = !commonScales;
          }}>
          <div class="gafc" style="grid-column-gap: var(--space-base);">
            common scales
            {#if commonScales}
              <Checkbox size="1em" />
            {:else}
              <CheckboxBlank size="1em" />
            {/if}
          </div>
        </Button>
        <ButtonGroup level="medium" compact>
          <Button on:click={changeSize('small')}>
            <ThreeByThree size={16} />
          </Button>
          <Button on:click={changeSize('medium')}>
            <Tile size={16} />
          </Button>
          <Button on:click={changeSize('large')}>
            <Stack size={16} />
          </Button>
        </ButtonGroup>
      </div>
    </div>

    <div class="multiples multiples--{$graphSize.graphSize}">
      {#each graphs as { name, type, key, yMax, axisFormat, hoverFormat }, i (name)}
        <div>
          <MetricChart
            {width}
            {height}
            {name}
            data={data}
            y={key}
            {xDomain}
            yMin={commonScales ? 0 : undefined}
            yMax={commonScales ? yMax : undefined}
            {axisFormat}
            {hoverFormat}
            {endMouseEvent}
            {resetMouseClicks}
            bind:xMouse
            bind:mouseDownValue
            bind:mouseMoveValue
            bind:isComparing />
        </div>
      {/each}
    </div>

    <div
      class="bottom"
      in:fly={{ duration: 500, delay: 1000, y: -10 }}
      style=" width: 970px; display: grid; grid-template-columns: auto auto;
      align-items: start; justify-content: space-between; ">
      <Key />
    </div>
  </Box>
</main>
