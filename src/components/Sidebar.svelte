<script>
  import { tooltip as tooltipAction } from '@graph-paper/core/actions/tooltip'
  import { Button } from "@graph-paper/button";
  import { Stack } from "@graph-paper/stack";
  import { Box } from "@graph-paper/box";
  import { Documentation, Explore, Calendar, CaretDown } from "@graph-paper/icons";

  import Shortcuts from './Shortcuts.svelte';

  import Slack from './Slack.svelte';
  import Keyboard from './Keyboard.svelte';
  import GithubLogo from './GithubLogo.svelte';
  import GUDLogo from './GUDLogo.svelte';

  let showShortcuts = false;
  let showView = false;

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
      <h1>
        <button use:tooltipAction={{text: !showView && "Select another view"}}>
          <GUDLogo size={40} />
                    <div class=title-container>
            <div class="title gafc" style="--gafc-space: var(--space-1h);">Growth & Usage <CaretDown size=.9em /></div>
            <div class="view gafc justify-content-start" style="
              color: var(--cool-gray-600);
              --gafc-space: var(--space-1h);
            "><Explore size=.9em /> explore</div>
          </div>
        </button>
        </h1>

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
            <Button compact level=low href="https://github.com/mozilla/gud/issues/new/choose">
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
