<script>
import { fade } from 'svelte/transition';
import GUDLogo from '../GUDLogo.svelte';
import isMounted from '../../utils/is-mounted';

const mounted = isMounted();

</script>

<style>
h1 {
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  font-size: 36px;
  font-weight: bold;
  color: var(--ux-gray-700);
  margin:0;
  padding: var(--space-2x);
  align-items: center;
  grid-column-gap: var(--space-2x);
  line-height:.79;
  height: var(--space-8x);
}
</style>

<div class="sidebar">

  <h1><GUDLogo size={64} />
    {#if $mounted}
    <span in:fade={{ duration: 1000 }}>
      Growth & Usage
    </span>
    {/if}
  </h1>
  <slot></slot>
</div>
