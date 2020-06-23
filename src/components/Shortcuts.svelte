<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Portal } from "@graph-paper/portal"
  import { Calendar, Close } from "@graph-paper/icons";

  const dispatch = createEventDispatcher();

  let isMounted = false;

  onMount(() => {
    isMounted = true;
  });

  function onCancel() {
    dispatch('cancel');
  }

  function listenForEscape(event) {
    if (event.key === 'Escape') onCancel();
  }

</script>

<style>
  .container {
    --width: 600px;
    position: absolute;
    width: var(--width);
    background-color: white;
    left: calc(50% - var(--width) / 2);
    top: 25%;
    bottom: 25%;
    border: 4px solid var(--digital-blue-500);
    border-radius: var(--space-1h);
    min-height: 400px;
    padding: var(--space-4x);
    box-shadow:
            0 2px 1px rgba(0,0,0,0.09),
            0 4px 2px rgba(0,0,0,0.09),
            0 8px 4px rgba(0,0,0,0.09),
            0 16px 8px rgba(0,0,0,0.09),
            0 32px 16px rgba(0,0,0,0.09);
  }

  dl {
    display: grid;
    grid-template-columns: max-content max-content;
    grid-column-gap: var(--space-2x);
    grid-row-gap: var(--space-2x);
    font-size: var(--text-015);
    padding: 0px;
    margin: 0px;
  }

  h4 {
    padding: 0px;
    margin: 0px;
    color: var(--digital-blue-700);
    font-size: var(--text-05);
    text-transform: uppercase;
  }

  span {
    color: var(--cool-gray-700);
    border: 1px solid var(--cool-gray-200);
    padding: var(--space-1h) var(--space-1x);
    border-radius: var(--space-1h);
    display: inline-grid;
    grid-auto-flow: column;
    align-items: center;
    grid-column-gap: var(--space-1h);
  }

  header {
    padding-bottom: var(--space-2x);
    display: grid;
    width: 100%;
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
  }

  button {
    background-color: var(--digital-blue-100);
    padding: 0px;
    margin: 0px;
    border: none;
    display: grid;
    align-items: center;
    justify-items: center;
    border-radius: 50%;
    padding: var(--space-1x);
    transition: background-color 100ms, transform 500ms;
    color: var(--digital-blue-700);
    cursor: pointer;

  }

  button:hover {
    background-color: var(--digital-blue-150);
    transform: rotate(360deg);
  }
</style>

<svelte:window on:keydown={listenForEscape} />

{#if isMounted}
  <Portal>
    <div class=container transition:fly={{duration: 125, y:5}}>
      <header>
        <h4>Shortcuts</h4>
        <button on:click={onCancel}>
          <Close />
        </button>
      </header>
      <dl>
        <dt>click + drag + release</dt>
        <dd>
          set a new
          <span>
            date range
            <Calendar size="1em" />
          </span>
          for all graphs
        </dd>
        <dt>shift + drag</dt>
        <dd>compare whichever point was highlighted on shift to a hover point</dd>
      </dl>
    </div>
  </Portal>
{/if}
