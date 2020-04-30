<script>
import { tweened } from 'svelte/motion';
import { createEventDispatcher } from 'svelte';
import { ArrowheadRight as CaretRight } from '@graph-paper/icons';
import { FloatingMenu, MenuList, MenuListItem } from '@graph-paper/menu';
import { quickTransition } from '../../config/ux';

const dispatch = createEventDispatcher();

let bt;

export let options = [];
export let toggled = false;
export let selected;
export let multi = false;
export let active = true;

function unique(arr) {
  return Array.from(new Set(arr));
}

function selectValue(value) {
  if (multi) {
    if (selected.includes(value)) selected = selected.filter((s) => s !== value);
    else selected = [...selected, value];
  } else if (selected === value) selected = undefined;
  else selected = value;
  dispatch('select', selected);
  if (!multi) toggled = false;
}

const r = tweened(0, quickTransition);
$: r.set(toggled ? 1 : 0);

</script>

<style>
.gud-dimension-selector {
  margin:0;
  padding:0;
  background-color: transparent;
  text-align: right;
  padding: var(--space-base);
  width: 100%;
  padding-left: var(--space-2x);
  padding-right: var(--space-2x);
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  font-size: var(--text-02);
  font-weight: 500;
  color: var(--digital-blue-500);
  align-content: end;
  align-items: end;
  justify-content: end;
}

.gud-dimension-selector:hover {
  background-color: var(--ux-gray-200);
}
</style>

<button bind:this={bt} class="gud-dimension-selector gafc" on:click={() => { toggled = !toggled; }}>
<slot></slot> <div class="gafc" style="transform: rotate({$r * 180}deg);"><CaretRight size={14} /></div>
</button>

{#if toggled}
    <FloatingMenu location=right alignment=top parent={bt}>
      <MenuList>
        {#each options as item, i}
          <MenuListItem on:select={() => selectValue(item.key)}>{item.label}</MenuListItem>
        {/each}
      </MenuList>
    </FloatingMenu>
  </div>
{/if}
