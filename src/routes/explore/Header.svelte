<script>
import { store } from '../../stores/store';
import optionSet from '../../stores/options.json';

$: currentCriterion = optionSet.usageCriteriaOptions.values.find((d) => d.key === $store.usage);

</script>

<style>
.body-header__description {
  max-width: 936px;
  font-size: var(--text-02);
  padding-top: var(--space-2x);
}
</style>

<div class="body-header">
  <h2>
    <span style="color: var(--ux-gray-400); text-transform: uppercase;">Explore / </span><span>{currentCriterion.label}</span>
  </h2>
  <div class='body-header__description'>
    {currentCriterion.shortDescription}
  </div>
</div>
