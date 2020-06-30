<script>
  import { getContext, setContext } from "svelte";
  import { writable } from 'svelte/store';

  const focus = writable(undefined);
  const keys = writable([]);
  setContext("gp:list:focus", focus);
  setContext("gp:list:keys", keys);

  let borderRadius = getContext("gp:list:border-radius");
  let verticalPad = getContext("gp:list:vertical-pad");
  $: style = `${borderRadius ? `--border-radius: ${borderRadius};` : ""}${verticalPad ? `--vertical-pad: ${verticalPad}` : ""}`;

  function previous() {
    let index = $keys.findIndex(key => key === $focus);
    if (index === undefined) {
      focus.set(0);
    } else if (index > 0) {
      focus.set($keys[index - 1]);
    }
  }

  function next() {
    let index = $keys.findIndex(key => key === $focus);
    if (index === undefined) {
      focus.set(0);
    } else if (index < $keys.length - 1) {
      focus.set($keys[index + 1]);
    }
  }

  const handleKeypress = (event) => {
    const { key } = event;
    if (key !== "Tab") {
      event.preventDefault();
    }
    if (key === "ArrowUp") previous();
    if (key === "ArrowDown") next();
  };

</script>

<style>
  ul {
    --border-radius: 0px;
    padding: var(--vertical-pad) 0px;
    margin: 0px;
    background-color: white;
    list-style-type: none;
    min-width: var(--space-32x);
    border-radius: var(--border-radius);
  }
</style>

<svelte:window on:keydown={handleKeypress} />

<ul {style}>
  <slot />
</ul>
