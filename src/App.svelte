<script>
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	// components
	import NavMenu from './components/NavMenu.svelte';
	import ControlModes from './components/ControlModes.svelte';
	import GraphicBody from './components/GraphicBody.svelte';
	import Multiselector from './components/Multiselector.svelte';
	import DatePicker from './components/DatePicker.svelte';
	import ErrorMessage from './components/ErrorMessage.svelte';
	import NoData from './components/NoData.svelte'

	// stores
	import {
		menuOptions, allOptions, mode, modeIsImplemented
	} from './stores/stores'
	import cache, { queryIsCached } from './stores/cache'
	import currentQuery, { isNotDefaultQueryset, resetQuery } from './stores/query'
	import optionSet from './stores/options.json'

	// props
	export let name;

	let visible = false;

	onMount(() => {
		visible = true;
	})

	function updateQueryString(value) {
		if (history.pushState) {
			const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${$currentQuery}`;
			window.history.pushState({path:newurl},'', newurl);
		}
	}

	$: if (visible) {
		updateQueryString($currentQuery);
	}
	
</script>

<main>
	<div class=controls>
		<section class=control-modes>
			<ControlModes />
		</section>
		{#if $isNotDefaultQueryset && $modeIsImplemented}
			<section class=control-reset transition:fly={{x: -30, duration: 300}}>
				<button on:click={() => {
					resetQuery()
				}}>reset selections <span>✖</span></button>
			</section>
		{/if}
		{#if $mode === 'explore'}
			<section class=control-selectors>
				{#each menuOptions as selector, i}
					{#if selector.type !== 'date'}
						<Multiselector 
							title={selector.label} 
							description={selector.description || selector.label}
							showDescriptionOnSelect={selector.showDescriptionOnSelect}
							selectType={selector.type || 'single'} 
							options={selector.values} 
							setter={selector.setter} />
					{/if}
				{/each}
			<DatePicker />
			</section>
		{/if}
		{#if $mode === 'Compare'}
			<section class=control-selectors></section>
		{/if}
		<footer class=control-foot>
			{#if visible}
				<div>Made by Mozilla Data Engineering + Data Science.</div>	
			{/if}
		</footer>
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
					{#if value.length}
						<GraphicBody data={value} />
					{:else}
						<NoData />
					{/if}
				{:catch error}
					<ErrorMessage error={error} />
			{/await}
		<!-- foot -->
		<footer>
			<h3>Inquiries</h3>
			<ul>
				<li><strong>OVERALL</strong> –  jmccrosky@mozilla.com</li>
				<li><strong>DATA</strong> – jklukas@mozilla.com</li>
				<li><strong>FRONTEND</strong> – hulmer@mozilla.com</li>
			</ul>
		</footer>
	</div>
{/if}
</main>
