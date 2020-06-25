<script>
  import { Button } from "@graph-paper/button";
  import { Stack } from "@graph-paper/stack";
  import { Box } from "@graph-paper/box";
  import { Documentation, Explore, Calendar } from "@graph-paper/icons";

  import Shortcuts from './Shortcuts.svelte';

  import Slack from './Slack.svelte';
  import Keyboard from './Keyboard.svelte';
  import GithubLogo from './GithubLogo.svelte';
  import GUDLogo from './GUDLogo.svelte';

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

  .pages {
    padding: var(--space-2x) var(--space-1x);
    min-height: var(--space-16x);
  }
</style>

<nav>
    <Box padding={2}>
      <h1><GUDLogo size={32} /> Growth & Usage</h1>
    </Box>
    <div class='pages'>
      <Stack>
        <Button level=low href={'/explore'}>
          <div class=gafc>
            <Explore size=1em />
            Explore
          </div>
        </Button>
        <Button level=low href={'/ytd'} disabled>
          <div class=gafc>
            <Calendar size=1em />
            Year to date
          </div>
        </Button>
      </Stack>
    </div>

    <slot />

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
