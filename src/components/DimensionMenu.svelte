<script>
  import { createEventDispatcher, tick } from "svelte";
  import { Button } from "@graph-paper/button";
  import clickOutside from "../utils/click-outside";
  import {
    CaretRight,
    CheckboxBlank,
    Checkbox,
    Check
  } from "@graph-paper/icons";
    import { Stack } from "@graph-paper/stack";
  import { Close } from "@graph-paper/icons";
  import FloatingChild from "./list/FloatingChild.svelte";
  import List from "./list/List.svelte";
  import ListItem from "./list/ListItem.svelte";
  import Divider from "./list/Divider.svelte";
  import ListHeader from './list/ListHeader.svelte';

  const dispatch = createEventDispatcher();

  export let toggled = false;
  export let multi = true;
  export let tooltip = undefined;

  export let menuWidth = 40;
  export let options;

  let container;
  let element;
  let removeListener;

  function toggle() {
    toggled = !toggled;
    //if (toggled) toggled = false;
  }

  function handleKeydown({ key }) {
    if (key === "Escape") {
      toggled = false;
    }
  }

  export let selections = multi ? [] : options[0].key;

  function clearSelection() {
    selections = multi ? [] : options[0].key;
    dispatch("selection", selections);
  }

  function toggleListItem(value, isMulti) {
    return () => {
      // closes over value
      if (isMulti) {
        if (selections.includes(value))
          selections = [...selections.filter((s) => s !== value)];
        else selections = [...selections, value];
      } else {
        selections = value;
      }
      dispatch("selection", selections);
      if (!isMulti) {
        toggle();
      }
    };
  }
</script>

<style>
  .gafc {
    display: grid;
    grid-auto-flow: column;
    align-self: stretch;
    height: 100%;
    align-items: center;
    align-content: center;
  }

  .dimension-button {
    width: 100%;
    display: grid;
    padding: 0px;
margin:0px;
  }

  .dimension-button__content {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
    align-content: stretch;
    width: 100%;
    text-align: left;
  }
</style>

<svelte:window on:keydown={handleKeydown} />

<div class="dimension-button" bind:this={container}>
  <Button
    tooltip={!toggled ? tooltip : undefined}
  {toggled} level="low" on:click={toggle}>
    <div class="dimension-button__content">
      <slot />
      <span
        class="gafc"
        style="transition: transform 75ms; transform: rotate({toggled ? -180 : 0}deg);">
        <CaretRight size="1em" />
      </span>
    </div>
  </Button>
</div>

{#if toggled}
<FloatingChild width={menuWidth} active={true} bind:element parent={container}>
  <div use:clickOutside={() => {
    if (toggled)  {
      toggled = false;
    }
    }}>
  <List active={true}>
    {#if multi}
      <ListItem key="clearSelection" on:click={clearSelection}>
        <span slot="secondary">
          {#if selections.length}
            clear {selections.length} selection{selections.length === 1 ? '' : 's'}
          {:else}showing all{/if}

        </span>
        <span slot="left">
            <Close size="1em" color={selections.length ? "var(--cool-gray-500)" : "transparent"} />
        </span>

      </ListItem>
      <Divider />
    {/if}
    {#each options as option}
      {#if option.itemType === 'divider'}
        <Divider />
      {:else if option.itemType === 'section'}
        <ListHeader>{option.label}</ListHeader>
      {:else}
        <ListItem key={option.key} on:click={toggleListItem(option.key, multi)}>
          <span slot="primary">{option.label}</span>
          <span slot="secondary">
            {#if option.shortDescription}{option.shortDescription}{/if}
          </span>
          <span
            slot="left"
            style="align-self: start; display: inline-block; transform: translateY(2px); color: {selections.includes(option.key) ? 'blue' : 'var(--cool-gray-400)'}">
            {#if multi}
              {#if selections.includes(option.key)}
                <Checkbox size="1em" />
              {:else}
                <CheckboxBlank size="1em" />
              {/if}
            {:else}
              <Check size="1em" color={selections === option.key ? 'currentColor' : 'transparent'} />
            {/if}
          </span>
        </ListItem>
    {/if}
    {/each}
  </List>
  </div>
</FloatingChild>
{/if}
