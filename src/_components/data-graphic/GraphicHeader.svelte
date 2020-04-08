<script>
  import { afterUpdate, onMount } from "svelte";
  import { fade, fly } from "svelte/transition";

  import Tooltip from "../Tooltip.svelte";

  export let title;
  export let shortDescription;
  export let size = "small";
  export let order = 0;
  export let orderStagger = 0;

  let updateTooltipPosition;

  onMount(() => {
    setTimeout(updateTooltipPosition, 10);
  });

  afterUpdate(() => {
    setTimeout(updateTooltipPosition, 10);
  });
</script>

<style>
  .graphic-container-header {
    padding-left: 50px;
    padding-right: 50px;
    margin: auto;
    display: grid;
    align-items: center;
    grid-template-columns: auto 20px;
    grid-template-rows: auto;
    grid-auto-flow: column;
    grid-template-areas:
      "title    tooltip"
      "subtitle subtitle";
  }

  .graphic-container-header.small-header {
    max-width: 250px;
  }

  .graphic-container-header.large-header {
    max-width: 800px;
  }

  .graphic-container-header h3 {
    grid-area: title;
    margin: 0;
    padding: 0;
    text-align: left;
    font-weight: 300;
    font-size: 16px;
  }

  .graphic-container-header .graph-tooltip {
    grid-area: tooltip;
  }
</style>

<div
  class="graphic-container-header"
  class:large-header={size === 'large'}
  class:small-header={size === 'small'}>
  <h3 in:fly={{ y: 5, duration: 500, delay: order * orderStagger }}>{title}</h3>
  <div
    class="graph-tooltip"
    on:introend={() => {
      if (updateTooltipPosition) updateTooltipPosition();
    }}>
    <Tooltip
      bind:updatePosition={updateTooltipPosition}
      {title}
      msg={shortDescription} />
  </div>
</div>
