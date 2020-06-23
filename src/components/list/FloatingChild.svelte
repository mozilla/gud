<script>
  import { setContext } from "svelte";
  import { fly } from "svelte/transition";
  import { placeElement } from "@graph-paper/core/utils/float-placement";

  export let parent;
  export let element;
  export let active = false;
  export let width = 32;
  let leftPlacement = 0;
  let topPlacement = 0;
  export let location = "right";
  export let alignment = "top";
  let scrollY;

  setContext("gp:list:border-radius", "var(--space-1x)");

  let y = 0;
  $: if (element) y = element.getBoundingClientRect().y;

  $: if (element && parent) {
    [leftPlacement, topPlacement] = placeElement({
      location,
      alignment,
      elementPosition: element.getBoundingClientRect(),
      parentPosition: parent.getBoundingClientRect(),
      distance: 10,
      y: scrollY,
    });
  }
</script>

<style>
  div {
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.07),
      0 4px 8px rgba(0, 0, 0, 0.07), 0 8px 16px rgba(0, 0, 0, 0.07),
      0 16px 32px rgba(0, 0, 0, 0.07), 0 32px 64px rgba(0, 0, 0, 0.07);
    border-radius: var(--space-1h);
    transition: opacity 40ms;
    opacity: 1;
    z-index: 1;
    transform: none;
    min-width: var(--width);
  }

  .hidden {
    opacity: 0;
    z-index: -5;
    transform: translateX(-10000px);
  }
</style>

<div
  bind:this={element}
  class:hidden={!active}
  style="
    position: absolute; left: {leftPlacement}px; top: {topPlacement}px;
    max-height: calc(100vh - {y}px - var(--space-16x));
    overflow-y: auto;
    --width: var(--space-{width}x);
  ">
  <slot />
</div>
