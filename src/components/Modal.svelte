<script>
  import clickOutside from '../utils/click-outside'
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { fly, scale } from 'svelte/transition';
  import { Portal } from "@graph-paper/portal"
  import { Calendar, Close } from "@graph-paper/icons";


  const dispatch = createEventDispatcher();
  export let sink = true;
  let isMounted = false;

  let sunken = false;
  onMount(() => {
    isMounted = true;
    if (sink) {
      sunken = true;
      const b = document.querySelector('#gud');
      b.classList.add('sunken');
    }

  });

  onDestroy(() => {
    if (sunken) {
      const b = document.querySelector('#gud');
      b.classList.remove('sunken');
    }
  })

  function onCancel() {
    if (sunken) {
      const b = document.querySelector('#gud');
      b.classList.remove('sunken');
      sunken = false;
    }

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
    /* bottom: 25%; */
    height: max-content;
    border-radius: var(--space-1h);
    /* min-height: 400px; */
    overflow-y: auto;
    box-shadow:
            0 2px 1px rgba(0,0,0,0.09),
            0 4px 2px rgba(0,0,0,0.09),
            0 8px 4px rgba(0,0,0,0.09),
            0 16px 8px rgba(0,0,0,0.09),
            0 32px 16px rgba(0,0,0,0.09);
  }

  header {
    top: 0;
    z-index: 100;
    position: sticky;
    padding: var(--space-2x);
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to left, var(--digital-blue-700), var(--digital-blue-800) 36%, var(--digital-blue-900));
    color: var(--digital-blue-100);
    border-top-left-radius: var(--space-1h);
    border-top-right-radius: var(--space-1h);
  }

  header h4 {
    padding: 0px;
    margin: 0px;
    font-size: var(--text-05);
    text-transform: uppercase;
  }

  button {
    background-color: var(--digital-blue-200);
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
    background-color: var(--digital-blue-250);
    transform: rotate(360deg);
  }

  .modal-content {
    padding-top: var(--space-6x);
    padding-bottom: var(--space-6x);
  }
</style>

<svelte:window on:keydown={listenForEscape} />

{#if isMounted}
  <Portal>
    <div class=container transition:fly={{duration: 125, y:5}} use:clickOutside={onCancel}>
      <header>
        <h4>
          <slot name='title'>Modal</slot>
        </h4>
        <button on:click={onCancel}>
          <Close size={16} />
        </button>
      </header>
      <div class=modal-content>
        <slot />
      </div>
    </div>
  </Portal>
{/if}
