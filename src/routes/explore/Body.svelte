<script context='module'>

  import { createRequestCache } from '../../stores/cache';
  import LoadingSpinner from '../../components/LoadingSpinner.svelte';
  import ErrorMessage from '../../components/ErrorMessage.svelte';
  import Explore from "../../components/Explore.svelte";
  const cache = createRequestCache();

</script>

  {#await $cache}
    <LoadingSpinner />
  {:then value}
    <Explore data={value} />
  {:catch err}
    <ErrorMessage message={err.message} />
  {/await}
