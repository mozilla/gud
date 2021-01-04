<script>
import { Button } from '@graph-paper/button';
import { Checkbox, CheckboxBlank } from '@graph-paper/icons';
import { store } from '../../stores/store'
</script>

<Button
  tooltip="Use default scaling for each graph"
  compact
  level="medium"
  on:click={() => {
    store.setField('commonScales', !$store.commonScales)
  }}>
  <div class="gafc" style="grid-column-gap: var(--space-base);">
    common scales
    {#if $store.commonScales}
      <Checkbox size="1em" />
    {:else}
      <CheckboxBlank size="1em" />
    {/if}
  </div>
</Button>
