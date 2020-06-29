<script>
  import { createEventDispatcher, tick } from "svelte";
  import { Button } from "@graph-paper/button";
  import { onClickOutside } from "@graph-paper/core/utils";
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

  export let variant = 'regular';
  export let toggled = false;
  export let multi = true;
  export let tooltip = undefined;

  export let menuWidth = 32;
  export let options;

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

  function handleKeydown({ key }) {
    if (key === "Escape") {
      toggled = false;
      if (removeListener) removeListener();
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

  .dimension-button--big {
    padding: 0px;
    margin: 0px;
    padding: var(--space-2x) var(--space-2x);
    background-color: white;
    display: grid;
    grid-template-columns: auto max-content;
    grid-template-rows: max-content auto;
    grid-template-areas: 'title caret'
                         'option caret';
    grid-column-gap: var(--space-2x);
    text-align: left;
    cursor: pointer;
    border-radius: var(--space-1h);
    border: 1px solid var(--cool-gray-200);
    margin-bottom: var(--space-2x);
    margin-top: var(--space-2x);
    transition: background-color 200ms, box-shadow 200ms;
    box-shadow: 0px 0px 0px transparent;
  }

  .dimension-button--big:active, .dimension-button--big.toggled, .dimension-button--big:hover {
    box-shadow: 3px 3px 0px var(--blue-slate-150);
  }

  .dimension-button--big:active, .dimension-button--big.toggled {
    /* background-color: var(--cool-gray-subtle); */
    box-shadow: 3px 3px 0px var(--blue-slate-300);
  }

  .dimension-button--big:active div:first-child, .dimension-button--big.toggled div:first-child {
    color: var(--cool-gray-700);
  }

  .dimension-button--big div:first-child {
    grid-area: title;
    font-size: var(--text-02);
    text-transform: uppercase;
    color: var(--cool-gray-500);
    transition: color 200ms;

  }

  .dimension-button--big div:nth-child(2) {
    grid-area: option;
  }
  .dimension-button--big div:nth-child(3) {
    grid-area: caret;
    align-self: center;
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

<FloatingChild width={menuWidth} active={toggled} bind:element parent={container}>
  <List>
    {#if multi}
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
    {/if}
    {#each options as option}
      {#if option.itemType === 'divider'}
        <Divider />
      {:else if option.itemType === 'section'}
        <ListHeader>{option.label}</ListHeader>
      {:else}
        <ListItem on:click={toggleListItem(option.key, multi)}>
          <span slot="primary">{option.label}</span>
          <span slot="secondary">
            {#if option.shortDescription}{option.shortDescription}{/if}
          </span>
          <span
            slot="right"
            style="color: {selections.includes(option.key) ? 'blue' : 'var(--cool-gray-400)'}">
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
</FloatingChild>
