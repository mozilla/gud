<script>
  import { tooltip as tooltipAction } from '@graph-paper/core/actions/tooltip'
  import { Button } from "@graph-paper/button";
  import { Stack } from "@graph-paper/stack";
  import { Box } from "@graph-paper/box";
  import { Documentation, Explore, Calendar, CaretDown } from "@graph-paper/icons";

  import Shortcuts from './Shortcuts.svelte';

  import Slack from './icons/Slack.svelte';
  import Keyboard from './icons/Keyboard.svelte';
  import GithubLogo from './icons/GithubLogo.svelte';

  import TitleMenu from './TitleMenu.svelte';

  let showShortcuts = false;

</script>

<style>
  .pages {
    min-height: var(--space-16x);
  }

  :global(.pages .gp-button) {
    color: var(--pantone-red-500);
  }

  :global(.pages svg) {
    color: var(--pantone-red-700);
  }
</style>

<nav>
    <div style="padding: var(--space-2x) var(--space-1x);">

    <TitleMenu />

    </div>
    <div class='pages'>
      <!-- <Stack>
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
      </Stack> -->
    </div>

    <slot />

    <div class="bottom-element">
      <Box>
        <div style='columns: 2;'>
            <Button compact level=low href="https://mozilla.github.io/gud/">
              <div class=gafc>
                <Documentation color=var(--icon-color) size={14} /> Docs
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
            <Button compact level=low href="https://github.com/mozilla/gud">
              <div class=gafc>
                <GithubLogo color=var(--icon-color) size={14} />
                Code
              </div>
            </Button>
        </div>
      </Box>
    </div>
</nav>

{#if showShortcuts}
  <Shortcuts on:cancel={() => { showShortcuts = false; }} />
{/if}
