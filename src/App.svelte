<script>
  import { onMount } from 'svelte';
  import Sidebar from "./components/Sidebar.svelte";
  import Explore from "./components/Explore.svelte";
  import LoadingSpinner from './components/LoadingSpinner.svelte';
  import ErrorMessage from './components/ErrorMessage.svelte';
  import { createRequestCache, storeToQuery } from './stores/cache';
  import { store } from './stores/store';

  const cache = createRequestCache();

  function updateQueryString(value) {
    if (history.pushState) {
      const newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        `?${value}`;
      window.history.pushState({ path: newurl }, "", newurl);
    }
  }

  let mounted = false;
  onMount(() => { mounted = true });

  $: if (mounted) {
    updateQueryString(storeToQuery($store));
  }

</script>

<style>
  div {
    display: grid;
    grid-template-columns: var(--space-40x) auto;
    min-width: calc(100vw - var(--space-4x)) !important;
  }
</style>

<div>
  <Sidebar />
  {#await $cache}
    <LoadingSpinner />
  {:then value}
    <Explore data={value} />
  {:catch err}
    <ErrorMessage message={err.message} />
  {/await}
</div>
