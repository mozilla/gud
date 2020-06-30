<script>
import { tooltip as tooltipAction } from '@graph-paper/core/actions/tooltip';
import { CaretDown, Explore, Calendar } from '@graph-paper/icons';
import clickOutside from '../utils/click-outside';
import GUDLogo from './GUDLogo.svelte';
import FloatingChild from './list/FloatingChild.svelte';
import List from './list/List.svelte';
import ListItem from './list/ListItem.svelte';

let toggled = false;
let element;
let container;

let iconSize = 24;

function toggle() {
  toggled = !toggled;
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

h1 button .title-container {
  /* width: 100%; */
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

<h1 bind:this={container}>
  <button on:click={() => { toggled = !toggled; }} use:tooltipAction={{text: !toggled && "Select another view"}}>
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

{#if toggled}
<FloatingChild width={60} bind:element parent={container}>
  <div use:clickOutside={() => {
    if (toggled)  {
      toggled = false;
    }
    }}>
  <List>
    <ListItem key=explore href={'/explore'} on:click={toggle}>
      <div class='large-icon' slot=left>
        <Explore size={iconSize} />
      </div>
      <div slot=primary>Explore</div>
      <div slot=secondary>Slice growth metrics by various dimensions</div>
    </ListItem>
    <ListItem key=ytd href={'/ytd'} on:click={toggle}>
      <div class='large-icon' slot=left>
        <Calendar size={iconSize} />
      </div>
      <div slot=primary>Year-To-Date</div>
      <div slot=secondary>Compare a product usage criterion to previous years</div>
    </ListItem>
  </List>
  </div>
</FloatingChild>
{/if}
