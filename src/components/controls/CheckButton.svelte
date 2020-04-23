<script>
import { Button } from '@graph-paper/button';
import Checkmark from '../Checkmark.svelte';

export let checked = false;
export let tooltip;
function toggle() { checked = !checked; }
</script>

<Button toggled={checked} {tooltip} compact level="medium" on:click={toggle}>
  <div class="gafc col-gap-1x">
  <div class="gafc" style="opacity: {checked ? 1 : 0}; transition: opacity 100ms;">
        <Checkmark size={12} />
      </div>
    <slot></slot>
  </div>
</Button>
