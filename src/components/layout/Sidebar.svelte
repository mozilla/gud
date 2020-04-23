<script>
import { fade } from 'svelte/transition';
import GUDLogo from '../GUDLogo.svelte';
import isMounted from '../../utils/is-mounted';

const mounted = isMounted();

</script>

<style>

.vertical-orientation {
  display: grid;
  grid-template-rows:
    var(--body-header-height)
    var(--space-8x)
    auto
    max-content;
  align-items: start;
}

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

.sidebar__footer {
  /* align-self: stretch; */
  width: 100%;
  background-color: var(--ux-gray-200);
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  grid-column-gap: var(--space-base);
}

.sidebar__footer__button {
  font-size: var(--text-015);
  background-color: hsl(32, 30%, 30%);
  color: hsla(32, 20%, 95%, 1);
  padding: var(--space-1h);
  padding-left: var(--space-base);
  padding-right: var(--space-base);
  /* border-radius: var(--space-base); */
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
  <div class=sidebar__footer>
    <button class=sidebar__footer__button>Feedback</button>
    <button class=sidebar__footer__button>Documentation</button>
  </div>
</div>
