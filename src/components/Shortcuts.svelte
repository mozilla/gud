<script>
import { Calendar } from "@graph-paper/icons";

import Modal from './Modal.svelte';

</script>

<style>
 dl {
    position: relative;
    display: grid;
    grid-template-columns: max-content auto;
    align-items: baseline;
    justify-items: stretch;
    grid-column-gap: var(--space-4x);
    grid-row-gap: var(--space-4x);
    font-size: var(--text-03);
    padding: 0px;
    margin: 0px;
    padding: 0px var(--space-4x);
    line-height: 1.5;
  }

  dt {
    font-weight: bold;
    color: var(--cool-gray-700);
  }

  dl span {
    color: var(--cool-gray-700);
    border: 1px solid var(--cool-gray-200);
    padding: var(--space-1h) var(--space-1x);
    border-radius: var(--space-1h);
    display: inline-grid;
    grid-auto-flow: column;
    align-items: center;
    grid-column-gap: var(--space-1h);
  }
</style>

<Modal on:cancel>
  <span slot=title>Shortcuts</span>
  <dl>
    <!-- <dt>click + drag + release</dt>
    <dd>
      set a new
      <span>
        date range
        <Calendar size="1em" />
      </span>
      for all graphs
    </dd> -->
    <dt>shift + drag</dt>
    <dd>compare whichever point was highlighted on shift to a hover point on and on and on and on</dd>
  </dl>
</Modal>
