<script>
  import { getContext } from "svelte";

  let borderRadius = getContext("gp:list:border-radius");
  $: style = `${borderRadius ? `--border-radius: ${borderRadius};` : ""}`;
  $: console.log(style)
</script>

<style>
  ul {
    --border-radius: 0px;
    padding: 0px;
    margin: 0px;
    background-color: white;
    list-style-type: none;
    min-width: var(--spac-32x);
    border-radius: var(--border-radius);
  }
</style>

<ul {style}>
  <slot />
</ul>
