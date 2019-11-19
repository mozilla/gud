<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";

  import { mode, modeOptions } from "../stores/stores";

  let visible = false;

  onMount(() => {
    visible = true;
  });

  let currentOption = $mode;
</script>

<style>
  .mode-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    height: var(--title-height);
    align-content: stretch;
  }

  .mode-selector {
    width: 100%;
    margin: auto;
    text-align: center;
  }

  input[type="radio"] {
    /* secret sauce to styling radio buttons */
    appearance: none;
    -webkit-appearance: none;
    -mozilla-appearance: none;
    /* Aligning your label text and your radio */
    display: none;
  }

  input[type="radio"] + label {
    border: 2px solid transparent;
    padding: 0.1em;
    transition: 200ms;
    cursor: pointer;
    border-radius: 20px;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
  }

  input[type="radio"].coming-soon + label {
    font-style: italic;
  }

  input[type="radio"]:hover + label {
    background-color: rgba(255, 99, 71, 0.3);
    padding: 0.3em;
    border-radius: 10px;
  }

  input[type="radio"].coming-soon + label:after {
    content: "coming soon!";
    position: absolute;
    text-align: center;
    display: block;
    opacity: 0;
    font-size: 12px;
    transition: 200ms;
    transform: translateX(20px);
  }

  input[type="radio"].coming-soon:hover + label:after {
    content: "coming soon!";
    position: absolute;
    display: block;
    opacity: 0.6;
    margin: auto;
    transform: translateX(20px) translateY(5px);
  }

  input[type="radio"]:checked {
    background-color: gray;
  }

  input[type="radio"]:checked + label {
    border: 2px solid tomato;
    background-color: tomato;
    color: white;
    padding: 0.5em;
    border-radius: 3px;
  }
</style>

{#if visible}
  <div in:fly={{ y: -10, duration: 300, delay: 100 }} class="mode-container">
    {#each modeOptions.values as option, i}
      <div
        in:fly={{ y: -10, duration: 250, delay: 200 + i * 50 }}
        class="mode-selector">
        <input
          type="radio"
          id={option.key}
          name="mode"
          value={option.key}
          on:select={opt => mode.store.set(opt.key)}
          class:coming-soon={option.key !== 'explore'}
          disabled={option.key !== 'explore'}
          bind:group={$mode} />
        <label for={option.key}>{option.label}</label>
      </div>
    {/each}
  </div>
{/if}
