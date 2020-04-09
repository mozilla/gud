<script>
import { fly } from 'svelte/transition';
import { createRequestCache, storeToQuery } from '../../stores/cache';
import { store, settingChanged, modeIsImplemented } from '../../stores/store';
import GraphicBody from '../../_components/GraphicBody.svelte';
import NoData from '../../_components/NoData.svelte';
import ErrorMessage from '../../_components/ErrorMessage.svelte';
import Header from './Header.svelte';
import Controls from './Controls.svelte';

const cache = createRequestCache();
</script>

<style>

.loading-data {
  position: grid;
  justify-items:stretch;
  outline: 1px solid black;
  grid-auto-flow: row;
  align-content: center;
	text-align:center;
  font-weight: bold;
	/* background-color: #eee; */
	border-radius: 5px;
	position: absolute;
}

.loading-message {
	opacity:.8;
	margin-bottom:var(--pad);
}

.loading-data svg {
  width: 3.75em;
  transform-origin: center;
  animation: rotate-loader 2s linear infinite;
}

.loading-data circle {
  fill: none;
  stroke: #fc2f70;
  stroke-width: 2;
  stroke-dasharray: 1, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash-loader 1.5s ease-in-out infinite;
}
</style>

<div class=body-container>

<Header />
<Controls />

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

</div>
