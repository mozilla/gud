<script>
import { fly } from 'svelte/transition';
import { createRequestCache, storeToQuery } from '../../stores/cache';
import { store, settingChanged, modeIsImplemented } from '../../stores/store';
import GraphicBody from '../../_components/GraphicBody.svelte';
import NoData from '../../_components/NoData.svelte';
import ErrorMessage from '../../_components/ErrorMessage.svelte';

const cache = createRequestCache();
</script>

{#await $cache}
<div in:fly={{ y: 30, duration: 200 }} class="loading-data">
  <div class="loading-message">Loading data ...</div>
  <div class="loading-spinner">
    <svg viewBox="25 25 50 50">
      <circle cx="50" cy="50" r="20" />
    </svg>
  </div>
</div>
{:then value}
{#if value.length}
  <GraphicBody data={value} title={$store.usage} />
{:else}
  <NoData />
{/if}
{:catch error}
<ErrorMessage {error} />
{/await}
