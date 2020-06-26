<script>
  import { createEventDispatcher, tick } from "svelte";
  import { Button } from "@graph-paper/button";
  import { onClickOutside } from "@graph-paper/core/utils";
  import {
    CaretDown,
    CheckboxBlank,
    Checkbox,
    Check,
    BarChart
  } from "@graph-paper/icons";
    import { Stack } from "@graph-paper/stack";
  import { Close } from "@graph-paper/icons";
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
    if (toggled) {
      removeListener = onClickOutside(() => {
        toggled = false;
      }, element);
    } else if (removeListener) removeListener();
  }

  function select(value) {
    return () => {
      removeListener();
      toggled = false;
      store.setField('metric', value.key);
    }

  }

  $: metric = CONFIG.metric.values.find(di=> di.key === $store.metric);

</script>


<div class="dimension-button" bind:this={container}>
  <Button compact {toggled} level="medium" on:click={toggle}>
    <div class="dimension-button__content gafc">
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


<FloatingChild width={60} location="bottom" alignment="center" active={toggled} bind:element parent={container}>
  <List>
    <!-- {#if multi}
      <ListItem on:click={clearSelection}>
        <span slot="secondary">
          {#if selections.length}
            clear {selections.length} selection{selections.length === 1 ? '' : 's'}
          {:else}showing all{/if}

        </span>
        <span slot="right">
          {#if selections.length}
            <Close size="1em" color="var(--cool-gray-500)" />
          {/if}
        </span>

      </ListItem>
      <Divider />
    {/if} -->
    {#each CONFIG.metric.values as option}
      {#if option.itemType === 'divider'}
        <Divider />
      {:else if option.itemType === 'section'}
        <ListHeader>{option.label}</ListHeader>
      {:else}
        <ListItem on:click={select(option)}>
          <span slot='left' style="visibility: {option.key === metric.key ? 'visible' : 'hidden'}">
              <Check size=".8em" />
          </span>
          <span slot="primary">{option.label}</span>
          <span slot="secondary">
            {#if option.shortDescription}{option.shortDescription}{/if}
          </span>
          <span
            slot="right"
           >
            <!-- {#if selections.includes(option.key)}
              <Checkbox size="1em" />
            {:else}
              <CheckboxBlank size="1em" />
            {/if} -->
          </span>
        </ListItem>
    {/if}
    {/each}
  </List>
</FloatingChild>
