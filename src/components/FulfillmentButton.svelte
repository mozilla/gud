<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  function fireClickMessage() {
    console.log("yeah!");
    dispatch("click");
  }

  let visible = false;
  onMount(() => {
    visible = true;
  });
</script>

<div class="app-button" in:fly={{ x: 20, duration: 400, delay: 100 }}>
  <button on:click={fireClickMessage}>Export Dataset as CSV</button>
</div>
