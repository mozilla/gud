<script>
  import { createEventDispatcher, tick } from "svelte";
  import { Button } from "@graph-paper/button";
  import {
    CaretDown,
    CheckboxBlank,
    Checkbox,
    Check,
    BarChart
  } from "@graph-paper/icons";
    import { Stack } from "@graph-paper/stack";
  import { Close } from "@graph-paper/icons";
  import clickOutside from "../../utils/click-outside";
  import FloatingChild from "../list/FloatingChild.svelte";
  import List from "../list/List.svelte";
  import ListItem from "../list/ListItem.svelte";
  import Divider from "../list/Divider.svelte";
  import ListHeader from '../list/ListHeader.svelte';
  import CONFIG from '../../stores/options.json';
  import { store } from '../../stores/store';

  let toggled = false;
  let container;
  let element;
  let removeListener;

  function toggle() {
    toggled = !toggled;
  }

  function handleKeydown({ key }) {
    if (key === "Escape") {
      toggled = false;
    }
  }

  function select(value) {
    return () => {
      toggled = false;
      store.setField('metric', value.key);
    }
  }

  $: metric = CONFIG.metric.values.find(di=> di.key === $store.metric);

</script>

<svelte:window on:keydown={handleKeydown} />

<div class="dimension-button" bind:this={container}>
  <Button
    tooltip={!toggled && "Display all metrics or pick a single metric to display"}
    compact {toggled} level="medium" on:click={toggle}>
    <div class="dimension-button__content gafc" style="--gafc-space: var(--space-1x);">
      <BarChart size={14} />
      {metric.label}
      <span
        class="gafc"
        style="transition: transform 75ms; transform: rotate({toggled ? -180 : 0}deg);">
        <CaretDown size="1em" />
      </span>
    </div>
  </Button>
</div>

{#if toggled}
<FloatingChild width={72} location="bottom" alignment="center" active={true} bind:element parent={container} verticalPad="var(--space-2x)">
  <div use:clickOutside={() => {
    if (toggled) toggled = false;
  }}>
    <List>
      {#each CONFIG.metric.values.filter(m => !$store.disabledMetrics.includes(m.key)) as option}
        {#if option.itemType === 'divider'}
          <Divider />
        {:else if option.itemType === 'section'}
          <ListHeader>{option.label}</ListHeader>
        {:else}
          <ListItem key={option.key} on:click={select(option)}>
            <span slot='left' style="visibility: {option.key === metric.key ? 'visible' : 'hidden'}">
                <Check size=".8em" />
            </span>
            <span slot="primary">{option.label}</span>
            <span slot="secondary">
              {#if option.shortDescription}{option.shortDescription}{/if}
            </span>
          </ListItem>
      {/if}
      {/each}
    </List>
  </div>
</FloatingChild>
{/if}
