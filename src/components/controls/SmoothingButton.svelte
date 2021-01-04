<script>
import { Button } from '@graph-paper/button';
import { Checkbox, CheckboxBlank } from '@graph-paper/icons';
import { store } from '../../stores/store'
</script>
<Button
  tooltip={'Apply a 7-day smoothing window to the line charts'}
  compact
  level="medium"
  on:click={() => {
    store.setField('smoothing', !$store.smoothing)
  }}>
  <div class="gafc" style="grid-column-gap: var(--space-base);">
    7-day smoothing
    {#if $store.smoothing === true}
      <Checkbox size="1em" />
    {:else}
      <CheckboxBlank size="1em" />
    {/if}
  </div>
</Button>
