<script>
  import { onMount } from 'svelte';
  import { slide, fly } from "svelte/transition";
  import { Button } from "@graph-paper/button";
  import { Stack } from "@graph-paper/stack";
  import { Box } from "@graph-paper/box";
  import { Chip, ChipSet } from "@graph-paper/chip";
  import { Documentation, Explore, Calendar } from "@graph-paper/icons";

  import Shortcuts from './Shortcuts.svelte';

  import Slack from './Slack.svelte';
  import Keyboard from './Keyboard.svelte';
  import GithubLogo from './GithubLogo.svelte';
  import DimensionMenu from "./DimensionMenu.svelte";
  import GUDLogo from './GUDLogo.svelte';
  import CONFIG from '../stores/options.json';
  import { store } from '../stores/store';

  let selections = Object.values(CONFIG).reduce((acc, v) => {
    if (!v.inMenu) return acc;
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

  function setMenuWidth(key) {
    if (key === 'usage') return 72;
    if (key === 'metric') return 72;
    return 32;
  }

  function setButtonVariant(key) {
    if (key === 'usage') return 'big';
    return undefined;
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
    font-size: var(--text-02);
    font-weight: normal;
    /* text-transform: uppercase; */
    padding-left: var(--space-2x);
    padding-right: var(--space-2x);
  }
</style>

<nav>
    <Box padding={2}>
      <h1><GUDLogo size={32} /> Growth & Usage</h1>
    </Box>
    <Box>
      <Stack>
        <Button level=low>
        <div class=gafc>
          <Explore size=1em /> Explore
        </div>
        </Button>
        <Button level=low>
          <div class=gafc>
            <Calendar size=1em />
            2020
          </div>
        </Button>
      </Stack>
    </Box>
    {#if mounted}
    <Box padding={0}>
      <div in:fly={{duration: 500, x: -10}}>
        <Stack space={0}>
          <!-- <DimensionMenu
                on:selection={handleDimensionSelection(CONFIG.usage.key)}
                selections={selections[CONFIG.usage.key]}
                multi={false}
                menuWidth={setMenuWidth(CONFIG.usage.key)}
                variant={setButtonVariant(CONFIG.usage.key)}
                options={CONFIG.usage.values}>
                {CONFIG.usage.label}
                <span slot=option>{$store[CONFIG.usage.key]}</span>
          </DimensionMenu> -->
          <h2>Aggregation Filters</h2>
          {#each Object.values(CONFIG) as dimension, i (dimension.key)}
            {#if dimension.inMenu}
            <Stack space={0}>
              <DimensionMenu
                on:selection={handleDimensionSelection(dimension.key)}
                selections={selections[dimension.key]}
                multi={dimension.type === 'multi'}
                menuWidth={setMenuWidth(dimension.key)}
                variant={setButtonVariant(dimension.key)}
                options={dimension.values}>
                {dimension.label}
              </DimensionMenu>
              {#if selections[dimension.key].length && dimension.type === 'multi'}
                <div transition:slide style='padding-left: var(--space-2x); padding-right: var(--space-2x); padding-top: var(--space-1x);'>
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
              {/if}
              <hr style="width:100%; border: none; border-bottom: 1px solid var(--cool-gray-150); padding:0px; margin:0px;" />
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
            <Button compact level=low href="https://mozilla.github.io/gud/">
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
