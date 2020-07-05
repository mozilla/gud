<script>
import { store } from '../stores/store'
import { tooltip as tooltipAction } from '@graph-paper/core/actions/tooltip';
import { CaretDown, Explore, Calendar } from '@graph-paper/icons';
import clickOutside from '../utils/click-outside';
import GUDLogo from './GUDLogo.svelte';
import FloatingChild from './list/FloatingChild.svelte';
import List from './list/List.svelte';
import ListItem from './list/ListItem.svelte';

import routes from "../routes/routes";

let toggled = false;
let element;
let container;

let iconSize = 24;

function toggle() {
  toggled = !toggled;
}

function handleKeydown({ key }) {
  if (key === "Escape") {
    toggled = false;
  }
}

</script>

<style>


h1 {
  /* border-radius: var(--space-1x); */
  /* background-color: var(--blue-slate-600); */
  padding: 0px;
  margin: 0px;
  /* color: var(--pantone-red-450); */
  color: var(--cool-gray-600);
  /* color: white; */
  /* font-weight: 900; */
  line-height: 1;

  /* padding: var(--space-1x) var(--space-1x); */
}

h1 button {
  display: grid;
  grid-template-columns: max-content auto;
  grid-column-gap: var(--space-1x);
  justify-content: start;
  align-items: center;
  width: 100%;
  background-color: transparent;
  border: none;
  padding: 0px;
  margin: 0px;
  border: 1px solid transparent;
  padding: var(--space-1x) var(--space-1x);
  border-radius: var(--space-1h);
}

h1 button:hover {
  border: 1px solid var(--cool-gray-200);
}

h1 button .title {
  text-align: left;
  font-size: var(--text-04);
  /* padding-bottom: var(--space-1q); */
}

h1 button .view {
  font-size: var(--text-02);
  font-weight: normal;
}

.large-icon {
  color: var(--cool-gray-400);
  align-self: start;
}
</style>

<svelte:window on:keydown={handleKeydown} />

<h1 bind:this={container}>
  <button on:click={() => { toggled = !toggled; }} use:tooltipAction={{text: !toggled && "Select another view"}}>
    <GUDLogo size={40} />
      <div class=title-container>
        <div class="title gafc" style="--gafc-space: var(--space-1h);">Growth & Usage <CaretDown size=.9em /></div>
        <div class="view gafc justify-content-start" style="
          color: var(--cool-gray-600);
          --gafc-space: var(--space-1h);
        ">
          {#if routes[$store.mode].icon}
            <svelte:component this={routes[$store.mode].icon} size=.9em />
          {/if}
          {routes[$store.mode].label}
        </div>
    </div>
  </button>
</h1>

{#if toggled}
<FloatingChild width={60} bind:element parent={container}>
  <div use:clickOutside={() => {
    if (toggled)  {
      toggled = false;
    }
    }}>
  <List>
    {#each Object.values(routes) as route, i}
      <ListItem disabled={route.disabled} key={route.path} href={`/${route.path}`} on:click={toggle}>
        <div class='large-icon' slot=left>
          <svelte:component this={route.icon} size={iconSize} />
        </div>
        <div slot=primary>{route.label}</div>
        <div slot=secondary>{#if route.description}{route.description}{/if}</div>
      </ListItem>
    {/each}
  </List>
  </div>
</FloatingChild>
{/if}
