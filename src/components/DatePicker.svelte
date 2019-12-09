<script>
  import { onMount } from "svelte";
  import { timeFormat } from "d3-time-format";

  import optionSet from "../stores/options.json";
  import { majorReleases } from "../stores/productDetails";
  import { store } from "../stores/store";

  const timeFormatter = timeFormat("%Y-%m-%d");

  const dayBefore = d => {
    const di = new Date(d);
    return timeFormatter(di);
  };

  const dayAfter = d => {
    const di = new Date(d);
    di.setDate(di.getDate() + 2);
    return timeFormatter(di);
  };

  $: startMin = $store.minStartDate;
  $: startMax = dayBefore($store.endDate);
  $: endMin = dayAfter($store.startDate);
  const endMax = $store.maxEndDate;

  $: currentStart = $store.startDate;
  $: currentEnd = $store.endDate;
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
    padding: 0;
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
    color: var(--dp-active-color);
  }

  .date-picker-input-label {
    font-size: 12px;
    text-align: left;
    color: tomato;
  }

  @media (max-width: 1301px) {
    .date-picker-controls {
      display: block;
      padding-bottom: var(--pad);
    }
  }
</style>

<div class="date-picker">

  <h2>Time Period</h2>

  <div class="date-picker-controls">
    <div>
      <div class="date-picker-input-label">Start</div>
      <input
        type="date"
        id="startDate"
        name="range-start"
        bind:value={currentStart}
        min={startMin}
        max={startMax}
        on:change={evt => {
          let date = evt.target.value;
          if (date === '' || date < startMin) {
            date = startMin;
          } else if (date > startMax) {
            date = startMax;
          }
          store.setField('startDate', date);
        }} />
    </div>
    <div>
      <div class="date-picker-input-label">End</div>
      <input
        type="date"
        id="endDate"
        name="range-end"
        bind:value={currentEnd}
        min={endMin}
        max={endMax}
        on:change={evt => {
          let date = evt.target.value;
          if (date === '' || date > endMax) {
            date = endMax;
          } else if (date < endMin) {
            date = endMin;
          }
          store.setField('endDate', date);
        }} />
    </div>
  </div>
</div>
