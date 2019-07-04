<script>
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	// 3rd parties

	import { csvFormat } from 'd3-dsv';

	// components
	import NavMenu from './components/NavMenu.svelte';
	import ControlModes from './components/ControlModes.svelte';
	import GraphicBody from './components/GraphicBody.svelte';
	import Multiselector from './components/Multiselector.svelte';
	// import RadioGroup from './components/RadioGroup.svelte';
	import DatePicker from './components/DatePicker.svelte';
	import ErrorMessage from './components/ErrorMessage.svelte';
	import NoData from './components/NoData.svelte'
	// import AnnotationModal from './components/AnnotationModal.svelte';
	
	import FulfillmentButton from './components/FulfillmentButton.svelte'

	// experiments
	// import MouseMove from './Components/MouseMove.svelte';
	// import AdjustableDate from './components/AdjustableDate.svelte';

	// stores
	import {
		menuOptions, allOptions, mode, modeIsImplemented, disabledDimensions
	} from './stores/stores'
	import cache, { queryIsCached } from './stores/cache'
	import currentQuery, { isNotDefaultQueryset, resetQuery } from './stores/query'
	import optionSet from './stores/options.json'

	// annotations
	import { annotationModalIsActive } from './stores/annotations'

	// get usage name.
	const usageCriterion = optionSet.usageCriteriaOptions.setter;

	export let name;

	let visible = false;

	// FIXME: this and all the buttons around exporting should be
	// in some other file!!!
	function downloadString(text, fileType = 'text', fileName) {
		const blob = new Blob([text], { type: fileType });
		const a = document.createElement('a');
		a.download = fileName;
		a.href = URL.createObjectURL(blob);
		a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
	}


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
<!-- PLUGINS ETC. GO RIGHT HERE -->
<!-- <AnnotationModal active={$annotationModalIsActive} /> -->

<!-- MAIN BODY -->
<main>
	<div class=controls>
		<section class=control-modes>
			<ControlModes />
		</section>
		{#if $isNotDefaultQueryset && $modeIsImplemented}
			<section class=app-button transition:fly={{x: -30, duration: 300}}>
				<button on:click={() => {
					resetQuery()
				}}>reset selections <span>✖</span></button>
			</section>
		{/if}
		{#if $mode === 'explore' && visible}
			<section class=control-selectors>
				{#each menuOptions as selector, i (selector.key)}
				{#if !$disabledDimensions.includes(selector.key)}
					<!-- {#if selector.variant === 'radio-group'}
						<RadioGroup 
							title={selector.label}
							options={selector.values} 
							setter={selector.setter}
							onSelection={(option) =>{
								// aside from assigning the selection value to (or pushing to)
								// $setter, any additional callbacks should go here.
								if (option.disabledDimensions) {
									$disabledDimensions = [...option.disabledDimensions];
								} else {
									$disabledDimensions = []
								}
							}}
						/> -->
						{#if selector.type !== 'date'}
						<Multiselector 
							title={selector.label} 
							description={selector.description || selector.label}
							showDescriptionOnSelect={selector.showDescriptionOnSelect}
							selectType={selector.type || 'single'} 
							options={selector.values} 
							setter={selector.setter}
							onSelection={(option) =>{
								// aside from assigning the selection value to (or pushing to)
								// $setter, any additional callbacks should go here.
								if (option.disabledDimensions) {
									$disabledDimensions = [...option.disabledDimensions];
								} else {
									$disabledDimensions = []
								}
							}}
							 />
					{/if}
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
		<div class=header>
			<h1 
				in:fly="{{y:-20, duration: 400, delay: 150}}">
					<img  in:fly="{{y:-10, duration: 600, delay: 200}}" class='ff-logo' alt='Firefox Logo' src='firefox-logo.png' />
					{name} <span>{` / ${$mode}`}</span>
			</h1>
			{#await $cache then data}
			<div class=fulfillment-buttons in:fly={{x:20, duration:400, delay: 100}}>
				<FulfillmentButton on:click={() => downloadString(csvFormat(data), 'text', 'GUD–BigQuery-dataset.csv')} />
			</div>
			{/await}
		</div>
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
				<GraphicBody data={value} title={$usageCriterion} />
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
