<script>
  import { onMount } from "svelte/transition";
  import { fade } from "svelte/transition";
  import {
    activateAnnotationModal,
    deactivateAnnotationModal,
    addAnnotation
  } from "../stores/annotations";

  export let maxChars = 100;
  export let active = true;
  export let currentDate = "2019-01-01";

  let annotation = "";
  let errorMessage;

  let howManyCharacters = maxChars;
  let isUnderCharacterLimit = true;
  $: isUnderCharacterLimit = annotation.length <= maxChars;
  $: howManyCharacters = isUnderCharacterLimit
    ? `${maxChars - annotation.length} characters left`
    : `${Math.abs(maxChars - annotation.length)} characters over`;

  function handleKeydown(event) {
    if (active && event.key === "Escape") {
      deactivateAnnotationModal();
    }
  }
</script>

<style>
  div.modal-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.1);
    display: grid;
    z-index: 100000;
  }

  div.modal {
    max-width: 500px;
    max-height: 500px;
    margin: auto;
    background-color: white;
    padding: var(--pad);
    border-radius: var(--modal-border-radius);
    box-shadow: var(--modal-box-shadow);
  }

  div.modal h2 {
    margin: 0;
    padding: 0;
    color: #999;
    text-transform: uppercase;
    font-size: 20px;
    padding-bottom: calc(var(--pad) / 2);
  }

  .modal-body {
    font-size: var(--modal-body-font-size);
    margin: 0;
    padding-bottom: var(--pad);
  }

  .modal-buttons {
    text-align: right;
    margin-top: var(--pad);
  }

  textarea {
    --valid-entry-color: rgb(144, 144, 216);
    --current-status-color: var(--valid-entry-color);
    --valid-entry-border: 1px solid var(--current-status-color);
    --valid-entry-focus-box-shadow: 0px 0px 2px 0px var(--current-status-color);
    display: block;
    margin: 0;
    padding: 0;
    margin-left: auto;
    margin-right: auto;
    width: calc(100% - var(--pad) * 2);
    border: 1px solid #999;
    border-radius: var(--modal-border-radius);
    resize: none;
    font-family: var(--default-font-family);
    padding: calc(var(--pad) / 2);
    transition: 200ms border, 300ms box-shadow, 200ms color;
  }

  textarea:focus {
    border: var(--valid-entry-border);
    box-shadow: var(--valid-entry-focus-box-shadow);
  }

  .annotation-status {
    display: grid;
    grid-template-columns: 50% 50%;
    padding-left: calc(var(--pad) / 2);
    padding-right: calc(var(--pad) / 2);
    font-size: 12px;
    padding-top: calc(var(--pad) / 4);
    padding-bottom: calc(var(--pad) / 4);
  }

  .annotation-status :nth-child(2) {
    justify-self: end;
  }

  .annotation-length {
    width: max-content;
  }

  .over-limit {
    color: tomato;
    --current-status-color: tomato;
  }

  .annotation-error-message {
    color: tomato;
  }
</style>

<svelte:window on:keydown={handleKeydown} />

{#if active}
  <div class="modal-container" transition:fade={{ duration: 100 }}>
    <div class="modal annotation-modal">
      <h2>add an annotation</h2>

      <p class="modal-body">
        These annotations get saved in the URL querystring above. If you copy
        and paste it and send it to someone, they will see your annotations. But
        if they do not get your exact URL above, they won't see anything.
      </p>
      <textarea
        class:over-limit={!isUnderCharacterLimit}
        bind:value={annotation} />

      <div class="annotation-status">
        <div
          class:over-limit={!isUnderCharacterLimit}
          class="annotation-length">
          {howManyCharacters}
        </div>
        <div>
          {#if errorMessage}
            <div
              class="annotation-error-message"
              transition:fade={{ y: 20, duration: 200 }}>
              {errorMessage}
            </div>
          {/if}
        </div>
      </div>

      <div class="modal-buttons">
        <button class="bt bt-text" on:click={deactivateAnnotationModal}>
          cancel
        </button>
        <button
          class="bt"
          on:click={() => {
            if (annotation.length && annotation.length <= maxChars) {
              addAnnotation({ text: annotation, date: currentDate });
              deactivateAnnotationModal();
              annotation = '';
              return;
            } else if (!annotation.length) {
              errorMessage = 'no text entered';
            } else {
              errorMessage = 'over the char limit :(';
            }
            setTimeout(() => {
              errorMessage = undefined;
            }, 1000);
          }}>
          + add annotation
        </button>
      </div>
    </div>
  </div>
{/if}
