<script>
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';
export let options;
export let setter;
export let label;
export let smaller = false;
export let D = 0;

let currentlySelected = $setter ? options.findIndex(o => o.key === $setter) : 0;
$: currentlySelectedText = options[currentlySelected].label;
$: $setter = options[currentlySelected].key;

let visible = false;

onMount(() => {
    visible = true;
})
</script>

<style>
h2.smaller {
    font-size:1rem;
    font-weight: 300;
}

select.smaller {
    font-size: 14px;
    padding: 5px;
}

div.selector {
    display:grid;
    grid-template-columns: [selector] auto [tooltip] 20px;
    align-items: center;
    grid-column-gap: var(--pad);
    margin-bottom: var(--subsection-margin);
}

div.tooltip {
    background-color: black;
    color: white;
    text-align:center;
    border-radius:30px;
    width: var(--tooltip-trigger-width);
    height:var(--tooltip-trigger-width);
    opacity:.5;
    cursor: pointer;
    transition: 200ms;
    font-size:12px;
    display:grid;
    margin:auto;
    align-items: center;
}

select {
    position: absolute;
    width: var(--menu-width);
    display: block;
    border-radius:2px;
    border: transparent;
    height: 20px;
    font-size:16px;
    opacity: .00001;
    z-index:2;
    cursor: pointer;
}

option {
    max-width: 400px;
}

div.selection-menu {
    grid-column: selector;
    width: 100%;
    height: 100%;
}

div.faker {
    position: absolute;
    display: block;
    width: var(--menu-width);
    z-index:1;
    border-bottom: 1px solid tomato;
    padding-bottom:3px;
}

div.faker:after {
    content: "▾";
    position: absolute;
    display: block;
    right:0;
    top:0;
    opacity:.8;
}
</style>

{#if visible}
<h2 in:fly="{{y:10, duration: 300, delay: D}}" class:smaller={smaller} class='menu-label'>{label}</h2>
<div in:fly="{{y:10, duration: 300, delay: 100+D}}" class='selector'>
    <div class='selection-menu'>
    <select class:smaller={smaller} bind:value={currentlySelected}>
        <optgroup label={label}>
            {#each options as option, i}
                <option value={i}>
                        {option.label}
                </option>
            {/each}
        </optgroup>
    </select>
    <div class='faker'>
        {currentlySelectedText}
    </div>
    </div>
    <div in:fly="{{y:10, duration: 300, delay: 150+D}}" class='tooltip'>?</div>
</div>
{/if}