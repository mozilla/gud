<script>
	import { onMount } from 'svelte';
	import NavMenu from './components/NavMenu.svelte';
	import ControlModes from './components/ControlModes.svelte';
	import GraphicBody from './components/GraphicBody.svelte';
	import {
		menuOptions, allOptions, mode
	} from './stores/stores'
	import cache, { queryIsCached } from './stores/cache'
	import currentQuery from './stores/query'

	import { fly, fade } from 'svelte/transition';

	export let metrics;
	export let name;

	let visible = false;

	function extractAllParams(str) {
		const params = new URLSearchParams(window.location.search);
		allOptions.forEach((opt) => {
			let $thisOpt = opt.setter;
			$thisOpt = params.get(opt.key);
		})
	}

	onMount(() => {
		visible = true;
		extractAllParams(window.location.search);
	})

	$: if (visible) { 
		updateQueryString($currentQuery);
	}

	function updateQueryString(value) {
		if (history.pushState) {
			const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${$currentQuery}`;
			window.history.pushState({path:newurl},'', newurl);
		}
	}

	let cacheValue;

	$: $cache.then(v => {
		cacheValue = v;
	})


</script>

<main>
	<div class=controls>
		<section class=control-modes>
			<ControlModes />
		</section>
		{#if $mode === 'explore'}
			<section class=control-selectors>
				{#each menuOptions as selector, i}
					<NavMenu smaller D={i * 20} label={selector.label} options={selector.values} setter={selector.setter} />
				{/each}
			</section>
		{/if}
		{#if $mode === 'Compare'}
			<section class=control-selectors>
				<!-- <NavMenu D={0} label='Usage Criterion' options={usageCriteria} /> -->
				<!-- <NavMenu D={150} smaller label='Country' options={metrics} /> -->
			</section>
		{/if}
		<section class=control-foot>
			<div>
				Made by Mozilla Data Engineering + Data Science. 
			</div>	
		</section>
	</div>

{#if visible}
	<div class=content>
		<h1 
			in:fly="{{y:-20, duration: 400, delay: 150}}">
				<img  in:fly="{{y:-10, duration: 600, delay: 200}}" class='ff-logo' alt='Firefox Logo' src='firefox-logo.png' />
				{name} <span>{` / ${$mode}`}</span>
		</h1>
		<!-- content -->
			{#await $cache}
					<div 
						in:fly={{y:30, duration: 200}} 
						class='loading-data'>
						<div class=loading-message>
							Loading data ...
						</div>
						<div class=loading-spinner>
							<svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20"></circle></svg>
						</div>
					</div>
				{:then value}
					<GraphicBody data={value} />
				{:catch error}
					<div>Uh oh!</div>
			{/await}
		<!-- foot -->
		<div class=content-foot>
			Inquiries
				Overall – someone@mozilla.com. 
				Data - someone-else@mozilla.com. 
				Frontend – another-person@mozilla.com
		</div>
	</div>
{/if}
</main>
