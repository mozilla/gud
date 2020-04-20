<script>
import { fade } from 'svelte/transition';
import GUDLogo from '../GUDLogo.svelte';
import isMounted from '../../utils/is-mounted';

const mounted = isMounted();

</script>

<style>

/* div * {
  outline: 1px solid black;
} */
h1 {
  display: grid;
  grid-auto-flow: column;
  justify-content: start;
  font-size: 24px;
  font-weight: bold;
  color: var(--ux-gray-700);
  margin:0;
  padding: var(--space-2x);
  align-items: center;
  grid-column-gap: var(--space-base);
  line-height:.79;
  /* height: var(--space-8x); */
}
</style>

<div class="sidebar vertical-orientation">

  <h1>
    <GUDLogo size={40} />
    {#if $mounted}
    <span in:fade={{ duration: 1000 }}>
      Growth & Usage
    </span>
    {/if}
  </h1>
  <div></div>
  <div>
    <slot></slot>
  </div>
</div>
