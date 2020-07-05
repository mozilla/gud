<script>
import { getContext, onMount, onDestroy, createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

export let key;
export let href = undefined;
export let disabled = false;

const focus = getContext('gp:list:focus');
const keys = getContext('gp:list:keys');

let bt;
let itemNumber;

function claimFocus() {
  if (!disabled) {
    bt.focus();
    focus.set(key);
  }
};

onMount(() => {
  keys.update(current => {
    return [...current.map(k=> ({ ...k })), { key, disabled }]
  });
  itemNumber = $keys.length - 1;
})

function select() {
  dispatch('click');
}

const handleKeypress = (event) => {
  if (event.key === "Enter" && key === $focus) select();
};

</script>

<style>

  li {
    cursor: pointer;
    --primary-text-color: var(--cool-gray-750);
    --primary-text-size: var(--text-03);
    --secondary-text-color: var(--cool-gray-550);
    --secondary-text-size: var(--text-02);
  }

  li.disabled {
    --primary-text-color: var(--cool-gray-550);
    --secondary-text-color: var(--cool-gray-550);
  }

  a {
    text-decoration: none;
  }

  button {
    margin: 0px;
    background-color: transparent;
    border: none;
    width: 100%;
    text-align: left;
    padding: var(--space-2x) var(--space-2x);
    display: grid;
    grid-template-columns: max-content auto max-content;
  }

  button:focus,
  button:hover,
  button.focus {
    background-color: var(--cool-gray-100);
  }

  .disabled button:focus,
  .disabled button:hover,
  .disabled button.focus {
    background-color: transparent;
  }

  .list-item__body {
    padding-left: var(--space-2x);
    padding-right: var(--space-2x);
  }

  :global(.list-item__left > *) {
    padding-left: var(--space-2x);
    padding-right: var(--space-2x);
  }

  :global(.list-item__right > *) {
    padding-left: var(--space-2x);
    padding-right: var(--space-2x);
  }

  .list-item--centered {
    display: grid;
    align-items: center;
    grid-auto-flow: column;
  }

  :global(.list-item__left > *, list-item__right > *) {
    display: grid;
    align-items: baseline;
    grid-auto-flow: column;
  }

  .list-item__body__primary-text {
    font-size: var(--primary-text-size);
    color: var(--primary-text-color);
  }

  .list-item__body__secondary-text {
    font-size: var(--secondary-text-size);
    color: var(--secondary-text-color);
  }

  .list-item__right {
    min-width: var(--space-2x);
  }

  :global(.gp-list-item .list-item__right > *) {
    display: grid;
    align-items: center;
    grid-auto-flow: column;
  }
</style>

<svelte:window on:keydown={handleKeypress} />

<li class="gp-list-item" class:disabled role="menuitem" on:mouseover={claimFocus}>
<a href={disabled ? '#' : href}>
    <button disabled={disabled} bind:this={bt} class:focus={key === $focus} on:click on:focus={claimFocus}>
      <div class="list-item__left list-item--centered">
        <slot name="left" />
      </div>
      <div class="list-item__body list-item--centered">
        <div>
          <div class="list-item__body__primary-text">
            <slot name="primary" />
            <slot />
          </div>
          <div class="list-item__body__secondary-text">
            <slot name="secondary" />
          </div>
        </div>
      </div>
      <div class="list-item__right list-item--centered">
        <slot name="right" />
      </div>
    </button>
  </a>
</li>
