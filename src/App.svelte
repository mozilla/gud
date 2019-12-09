<script>
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { flip } from "svelte/animate";

  // 3rd parties

  import { csvFormat } from "d3-dsv";

  // components
  import NavMenu from "./components/NavMenu.svelte";
  import ControlModes from "./components/ControlModes.svelte";
  import GraphicBody from "./components/GraphicBody.svelte";
  import Multiselector from "./components/Multiselector.svelte";
  // import RadioGroup from './components/RadioGroup.svelte';
  import DatePicker from "./components/DatePicker.svelte";
  import ErrorMessage from "./components/ErrorMessage.svelte";
  import NoData from "./components/NoData.svelte";
  // import AnnotationModal from './components/AnnotationModal.svelte';

  import FulfillmentButton from "./components/FulfillmentButton.svelte";
  import GoToDocsButton from "./components/GoToDocsButton.svelte";
  import ArrowForward from "./components/icons/ArrowForward.svelte";
  // experiments
  // import MouseMove from './Components/MouseMove.svelte';
  // import AdjustableDate from './components/AdjustableDate.svelte';

  import optionSet from "./stores/options.json";
  import { createRequestCache, storeToQuery } from "./stores/cache";
  import { store, settingChanged, modeIsImplemented } from "./stores/store";

  // annotations
  import { annotationModalIsActive } from "./stores/annotations";

  function filterMetricsOnUsageCriterion(values) {
    const disabledMetrics = optionSet.usageCriteriaOptions.values.find(
      v => v.key === $store.usage
    ).disabledMetrics;
    if (disabledMetrics !== undefined) {
      return values.filter(v => !disabledMetrics.includes(v.key));
    }
    return values;
  }

  export let name;

  const menuOptions = Object.values(optionSet).filter(v => v.inMenu);
  const cache = createRequestCache();
  let visible = false;

  // FIXME: this and all the buttons around exporting should be
  // in some other file!!!
  function downloadString(text, fileType = "text", fileName) {
    const blob = new Blob([text], { type: fileType });
    const a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() {
      URL.revokeObjectURL(a.href);
    }, 1500);
  }

  onMount(() => {
    visible = true;
  });

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

  $: if (visible) {
    updateQueryString(storeToQuery($store));
  }
</script>

<!-- PLUGINS ETC. GO RIGHT HERE -->
<!-- <AnnotationModal active={$annotationModalIsActive} /> -->

<!-- MAIN BODY -->
<main>
  <div class="controls">
    <section class="control-modes">
      <ControlModes />
    </section>
    {#if $settingChanged && $modeIsImplemented}
      <section class="app-button" transition:fly={{ x: -30, duration: 300 }}>
        <button
          on:click={() => {
            store.resetQuery();
          }}>
          reset selections
          <span>✖</span>
        </button>
      </section>
    {/if}
    {#if $store.mode === 'explore' && visible}
      <section class="control-selectors">
        {#each menuOptions as selector, i (selector.key)}
          {#if selector.type !== 'date'}
            <Multiselector
              enabled={!$store.disabledDimensions.includes(selector.key)}
              title={selector.label}
              description={selector.description || selector.label}
              showDescriptionOnSelect={selector.showDescriptionOnSelect}
              selectType={selector.type || 'single'}
              options={$store.usage && selector.key === 'metric' ? filterMetricsOnUsageCriterion(selector.values) : selector.values}
              storeKey={selector.key}
              onSelection={option => {
                if (selector.key === 'usage') {
                  if (option.disabledMetrics !== undefined) {
                    $store.metric.set(optionSet.find(o => o.key === 'metric').values[0].key);
                  }
                  if (option.disabledDimensions) {
                    store.setField('disabledDimensions', [
                      ...option.disabledDimensions
                    ]);
                    Object.keys(optionSet)
                      .filter(k =>
                        $store.disabledDimensions.includes(optionSet[k].key)
                      )
                      .forEach(k => {
                        if (optionSet[k].type === 'multi') store.setField(optionSet[k].key, []);
                        else if (optionSet[k].type === 'single') store.setField(optionSet[k].key, optionSet[k].values[0]);
                      });
                  } else {
                    store.setField('disabledDimensions', []);
                  }
                }
              }} />
          {/if}
        {/each}
        <DatePicker />
      </section>
    {/if}
    {#if $store.mode === 'Compare'}
      <section class="control-selectors" />
    {/if}
    <footer class="control-foot">
      {#if visible}
        <div>Made by Mozilla Data Engineering + Data Science.</div>
      {/if}
    </footer>
  </div>

  {#if visible}
    <div class="content">
      <div class="header">
        <h1 in:fly={{ y: -20, duration: 400, delay: 150 }}>
          <img
            in:fly={{ y: -10, duration: 600, delay: 200 }}
            class="ff-logo"
            alt="Firefox Logo"
            src="firefox-logo.png" />
          {name}
          <span>{` / ${$store.mode}`}</span>
        </h1>
        <div
          class="fulfillment-buttons"
          in:fly={{ x: 20, duration: 400, delay: 100 }}>
          {#await $cache then response}
            <FulfillmentButton
              on:click={() => downloadString(csvFormat(response), 'text', 'GUD–BigQuery-dataset.csv')} />
          {/await}
          <GoToDocsButton />
        </div>
      </div>
      <!-- content -->
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
      <!-- foot -->
      <footer class="body-foot">
        <h3>Inquiries</h3>
        <ul>
          <li>overall / jmccrosky@mozilla.com</li>
          <li>data / jklukas@mozilla.com</li>
          <li>frontend / hulmer@mozilla.com</li>
        </ul>
        <div style="width:100%">
          <a
            class="bt bt-text bt-text-with-icon"
            target="_blank"
            href="https://docs.google.com/document/d/1sIHCCaJhtfxj-dnbInfuIjlMRhCFbEhFiBESaezIRwM/edit?usp=sharing">
            Documentation
            <ArrowForward />
          </a>
        </div>
      </footer>
    </div>
  {/if}
</main>
