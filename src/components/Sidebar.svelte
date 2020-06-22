<script>
  import { onMount } from 'svelte';
  import { slide, fly } from "svelte/transition";
  import { Button } from "@graph-paper/button";
  import { Stack } from "@graph-paper/stack";
  import { Box } from "@graph-paper/box";
  import { Chip, ChipSet } from "@graph-paper/chip";
  import DimensionMenu from "./DimensionMenu.svelte";
  import GUDLogo from './GUDLogo.svelte';
  import CONFIG from '../stores/options.json';
  import { store } from '../stores/store';

  let selections = Object.values(CONFIG).reduce((acc, v) => {
    if (v.notInMenu) return acc;
    if (v.type === 'multi') acc[v.key] = [];
    else acc[v.key] = [v.values[0].key];
    return acc;
  }, {});

  function removeSelection(key, value) {
    return () => {
      selections[key] = [...selections[key].filter((s) => s !== value)];
      store.setField(key, selections[key]);
    };
  }

  function handleDimensionSelection(key) {
    return (event) => {
      const value = event.detail;
      selections[key] = value;
      store.setField(key, selections[key]);
    };
  }

  let mounted = false;
  onMount(() => { mounted = true });
</script>

<style>
  h1 {
    padding: 0px;
    margin: 0px;
    font-weight: 900;
    color: var(--cool-gray-700);
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: var(--space-2x);
    justify-content: start;
    align-items: center;
    font-size: var(--text-07);
  }

  h2 {
    font-size: var(--text-03);
    font-weight: normal;
    text-transform: uppercase;
  }
</style>

<nav>
  <div>
    <Box padding={2}>
      <h1><GUDLogo size={40} /> GUD</h1>
    </Box>
    {#if mounted}
    <Box pad={2}>
      <div in:fly={{duration: 500, x: -10}}>
        <h2>Filters</h2>
        <Stack>
          {#each Object.values(CONFIG) as dimension, i (dimension.key)}
            {#if !dimension.notInMenu}
            <Stack space={0}>
              <DimensionMenu
                on:selection={handleDimensionSelection(dimension.key)}
                selections={selections[dimension.key]}
                multi={dimension.type === 'multi'}
                options={dimension.values}>
                {dimension.label}
              </DimensionMenu>
              {#if selections[dimension.key].length && dimension.type === 'multi'}
                <div transition:slide>
                  <ChipSet>
                    {#each selections[dimension.key] as value, i (value)}
                      <Chip
                        cancelable
                        on:cancel={removeSelection(dimension.key, value)}>
                        {value}
                      </Chip>
                    {/each}
                  </ChipSet>
                </div>
              {:else if !(dimension.type === 'multi')}{selections[dimension.key]}{/if}
            </Stack>
            {/if}
          {/each}
        </Stack>
      </div>
    </Box>

    {/if}
    <!-- footer -->
    <!-- {#if site.feedback}
      <Box padding={3}>
        <div
          style="padding-top: var(--space-4x); font-size: var(--text-02); color:
          var(--cool-gray-7500);">
          <div
            style="font-size: var(--text-015); text-transform: uppercase;color:
            var(--cool-gray-550); font-weight: bold;">
            feedback
          </div>
          {site.feedback}
        </div>
      </Box>
    {/if} -->

  </div>
</nav>
