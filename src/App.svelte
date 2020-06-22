<script>
  import Sidebar from "./components/Sidebar.svelte";
  import Explore from "./components/Explore.svelte";
  import LoadingSpinner from './components/LoadingSpinner.svelte'
  import { createRequestCache } from './stores/cache';
  import { store } from './stores/store';

  $: console.log($store);

  const cache = createRequestCache();

</script>

<style>
  div {
    display: grid;
    grid-template-columns: var(--space-32x) auto;
    /* FIXME: remove need for this workaround from story */
    min-width: calc(100vw - var(--space-4x)) !important;
  }
</style>

<div>
  <Sidebar />
  {#await $cache}
    <LoadingSpinner />
  {:then value}
    <Explore data={value} />
  {/await}
</div>
