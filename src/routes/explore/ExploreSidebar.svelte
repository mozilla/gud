<script>
import { fly } from 'svelte/transition';
import Multiselector from '../../_components/Multiselector.svelte';

import { store, settingChanged, modeIsImplemented } from '../../stores/store';
import optionSet from '../../stores/options.json';

function filterMetricsOnUsageCriterion(values) {
  const { disabledMetrics } = optionSet.usageCriteriaOptions.values.find(
    (v) => v.key === $store.usage,
  );
  if (disabledMetrics !== undefined) {
    return values.filter((v) => !disabledMetrics.includes(v.key));
  }
  return values;
}
const menuOptions = Object.values(optionSet).filter((v) => v.inMenu);

</script>

<style>
.control-selectors {
  padding: var(--space-2x);
}
</style>

<div class='body-header'>
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
</div>

{#if $store.mode === 'explore'}
<section class="control-selectors">
  {#each menuOptions as selector, i (selector.key)}
    {#if selector.type !== 'date'}
      <Multiselector
        enabled={!$store.disabledDimensions.includes(selector.key)}
        title={selector.label}
        description={selector.description || selector.label}
        showDescriptionOnSelect={selector.showDescriptionOnSelect}
        selectType={selector.type || 'single'}
        options={(() => {
          if ($store.usage && selector.key === 'metric') {
            return filterMetricsOnUsageCriterion(selector.values);
          } if ($store.usage && selector.key === 'channel') {
            const overriddenChannels = optionSet.usageCriteriaOptions.values.find((v) => v.key === $store.usage).channels;
            if (overriddenChannels) {
              return overriddenChannels;
            }
              return selector.values;
          }
            return selector.values;
        })()}
        storeKey={selector.key}
        onSelection={(option) => {
          if (selector.key === 'usage') {
            if (option.disabledMetrics && option.disabledMetrics.includes($store.metric)) {
              store.setField('metric', 'all');
            }
            if (option.disabledDimensions) {
              store.setField('disabledDimensions', [
                ...option.disabledDimensions,
              ]);
              Object.keys(optionSet)
                .filter((k) => $store.disabledDimensions.includes(optionSet[k].key))
                .forEach((k) => {
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
</section>
{/if}
