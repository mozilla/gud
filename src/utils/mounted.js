import { writable } from "svelte/store";
import { onMount } from "svelte";

export default function isMounted() {
  const { subscribe, set } = writable(false);
  onMount(() => {
    set(true);
  });
  return {
    subscribe,
  };
}
