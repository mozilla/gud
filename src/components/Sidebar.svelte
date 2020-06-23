<script>
  import { onMount } from 'svelte';
  import { slide, fly } from "svelte/transition";
  import { Button } from "@graph-paper/button";
  import { Stack } from "@graph-paper/stack";
  import { Box } from "@graph-paper/box";
  import { Chip, ChipSet } from "@graph-paper/chip";
  import { Documentation } from "@graph-paper/icons";

  import Shortcuts from './Shortcuts.svelte';

  import Slack from './Slack.svelte';
  import Keyboard from './Keyboard.svelte';
  import GithubLogo from './GithubLogo.svelte';
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

  let showShortcuts = false;

</script>

<style>
  h1 {
    padding: 0px;
    margin: 0px;
    color: var(--cool-gray-700);
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: var(--space-1x);
    justify-content: start;
    align-items: center;
    font-size: var(--text-06);
    line-height: 1;
  }

  h2 {
    font-size: var(--text-03);
    font-weight: normal;
    text-transform: uppercase;
  }
</style>

<nav>
    <Box padding={2}>
      <h1><GUDLogo size={32} /> Growth & Usage</h1>
    </Box>
    {#if mounted}
    <Box pad={2}>
      <div in:fly={{duration: 500, x: -10}}>
        <!-- <h2>Filters</h2> -->
        <Stack>
          {#each Object.values(CONFIG) as dimension, i (dimension.key)}
            {#if !dimension.notInMenu}
            <Stack space={0}>
              <DimensionMenu
                on:selection={handleDimensionSelection(dimension.key)}
                selections={selections[dimension.key]}
                multi={dimension.type === 'multi'}
                menuWidth={dimension.key === 'usage' ? 72 : 32}
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
              {:else if !(dimension.type === 'multi')}
                <div style='text-align: left; padding-right: var(--space-2x); padding-left: var(--space-4x); font-size: var(--text-02);'>
                  {selections[dimension.key]}
                </div>
              {/if}
            </Stack>
            {/if}
          {/each}
        </Stack>
      </div>
    </Box>

    {/if}
    <div class="bottom-element">
      <Box>
        <Stack>
            <Button compact level=low href="https://docs.telemetry.mozilla.org/tools/gud.html">
              <div class=gafc>
                <Documentation color=var(--icon-color) size={14} /> Documentation
              </div>
            </Button>
            <Button toggled={showShortcuts} compact level=low on:click={() => { showShortcuts = !showShortcuts; }}>
              <div class=gafc>
                <Keyboard color=var(--icon-color) size={14} />
                Shortcuts
              </div>
            </Button>
            <Button compact level=low href="https://mozilla.slack.com/archives/CKMUVLPSL">
              <div class=gafc>
                <Slack color=var(--icon-color) size={14} /> Feedback
              </div>
            </Button>
            <Button compact level=low href="https://github.com/mozilla/gud/issues/new/choose">
              <div class=gafc>
                <GithubLogo color=var(--icon-color) size={14} />
                File an Issue
              </div>
            </Button>
        </Stack>
      </Box>
    </div>
</nav>

{#if showShortcuts}
  <Shortcuts on:cancel={() => { showShortcuts = false; }} />
{/if}
