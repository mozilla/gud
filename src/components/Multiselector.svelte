<script>
import { onMount } from 'svelte'
import { writable } from 'svelte/store';
import { slide } from 'svelte/transition';
import SelectedCheckbox from './SelectedCheckbox.svelte';
import BlankCheckbox from './BlankCheckbox.svelte';
import Popper from 'popper.js'

export let title;
export let options;
export let setter;
export let selectType = 'single';

let parentRef;
let menuRef;
let isActive = false;

let key;
let keyCode;

let menuPopup;
onMount(() => {
    const container = document.body
    menuPopup = new Popper(parentRef, menuRef, {
            placement: 'right-start',
            modifiers: {
                offset: { 
                        enabled: true,
                        offset: '0,10px'
                },
            preventOverflow: {
                boundariesElement: container,
            },
            }
    });
})

// set singleOptionLabel 
let singleOptionLabel = options[0].label;
$: if (selectType === 'single') {
    singleOptionLabel = options.find(opt => opt.key === $setter).label;
}

function toggleActive() {
    isActive = !isActive
    if (isActive) hideOnClickOutside(menuRef)
}

function removeSelection(key) {
    $setter = $setter.filter(k=>k!==key)
}

function handleSelection(key) {
    if (selectType === 'multi') {
            if (!$setter.includes(key)) {
            $setter = [...$setter, key];
        }
        else $setter = $setter.filter(k=>k!==key)
    } else {
        $setter = key
    }
    
}

function clearAllSelections() {
    $setter = selectType === 'multi' ? [] : options[0].key
}

function handleKeydown(event) {
    if (isActive && event.key === 'Escape') {
        isActive = false;
    }
}

function addAllSelections() {
    $setter = options.map(opt => opt.key)
}

function hideOnClickOutside(element) {
    const outsideClickListener = event => {
        if (!element.contains(event.target) && !parentRef.contains(event.target) && isActive) { // or use: event.target.closest(selector) === null
            toggleActive();
            removeClickListener()
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener)
    }

    document.addEventListener('click', outsideClickListener)
}

</script>

<style>

:root {
    --list-item-pad: 10px;
    --list-item-status-size: 25px;
}

.selector {
    margin-bottom: var(--pad);
}

button.dropdown {
    border: none;
    border-bottom: 1px solid tomato;
    background-color: transparent;
    width: 100%;
    text-align: left;
    padding:0;
    padding-bottom: 5px;
    font-size: 16px;
    cursor: pointer;
    display: grid;
    grid-template-columns: auto 10px;
}

button.dropdown .dropdown-button-icon {
    transform-origin: center;
    text-align:center;
    opacity: .8;
}

button.dropdown div.active-icon {
    transform: rotate(-90deg);
}

.dropdown-title {
    opacity: .7;
}

.menu-popup {
    transition: 100ms;
}

div {
    transition: 100ms;
}

div.active {
    opacity: 1;
    z-index: 1001;
}

div.hidden {
    opacity: 0;
    z-index: -1;
}

ul.menu-content {
    transition: 100ms;
    margin:0;
    border: 1px solid lightgray;
    padding:0;
    padding-top:5px;
    padding-bottom:5px;
    border-radius: 5px;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0,0,0,.1);
    max-width: 425px;
    min-width: 200px;

}

ul.hidden {
    transform: translateX(-10px);
}

ul.active {
    transform: none;
}

.menu-content li {
    list-style-type: none;
    margin:0;
    padding-left: var(--list-item-pad);
    padding-right: var(--list-item-pad);
    padding-top: calc(var(--list-item-pad) );
    padding-bottom: calc(var(--list-item-pad) w);
    cursor: pointer;
    display: grid;
    grid-template-columns: [status] var(--list-item-status-size) [content] auto [right] var(--list-item-status-size);
    min-height: var(--list-item-status-size);
    grid-gap: calc(var(--list-item-pad));
    transition: 50ms;
    align-items: start;
    -webkit-user-select: none;  /* Chrome all / Safari all */
    -moz-user-select: none;     /* Firefox all */
    -ms-user-select: none;      /* IE 10+ */
    user-select: none;
}

.menu-content li:hover {
    background-color: gainsboro;
}

.dropdown-status {
    text-align: center;
    font-size: 14px;
    opacity: .75;
}

.dropdown-content {
    font-size: 14px;
}

.clear-all {
    border-bottom: 1px solid gainsboro;
    min-height: 0px;
    font-size: 10px;
    font-weight: bold;
    color: darkgray;
    text-transform: uppercase;
}

.clear-all .dropdown-status {
    font-size: 10px;
}

.clear-all.nothing-selected:hover {
    background-color: transparent;
}

.selected-items {
    display: flex;
    padding:0;
    margin:0;
    margin-top: var(--list-item-pad);
    flex-wrap: wrap;
    font-size: 14px;
    font-weight: bold;
}

.selected-items li {
    font-weight: normal;
    list-style-type: none;
    font-size: 12px;
    margin-right:5px;
    margin-bottom:5px;
}

.remove-item {
    border-radius:18px;
    min-width: 18px;
    display: inline-block;
    text-align:center;
    cursor: pointer;
    transition: 150ms;
}

.remove-item:hover {
    background-color: darkgray;
    color: white;
}

.dropdown-item-description {
    font-size:13px;
    opacity:.6;
}

.divider {
    border-bottom: 1px solid gainsboro;
    margin-bottom: calc(var(--list-item-pad) / 2);
    margin-top: calc(var(--list-item-pad) / 2);
}

.menu-section {
    text-transform: uppercase;
    font-size:12px;
    font-weight:900;
    color: darkgray;
    padding-top: calc(var(--list-item-pad) / 2);
    padding-bottom: calc(var(--list-item-pad) / 2);
    padding-left: calc(var(--list-item-status-size) + var(--list-item-pad) * 1.5);
}

</style>

<svelte:window on:keydown={handleKeydown} />

<div class=selector>

<button bind:this={parentRef} class=dropdown on:click={toggleActive}>
    <div class=dropdown-title>{title}</div>
    <div class=dropdown-button-icon class:active-icon={isActive}>▾</div>
</button>


{#if selectType === 'multi'}
<ul class=selected-items>
    {#if $setter.length === 0}
        <div class=default-selected-item-message>
            All
        </div>
    {/if}
    {#each $setter as key (key)}
        <li>
            <span class=remove-item on:click={() => removeSelection(key)}>╳</span>
            {options.find(opt => opt.key === key).label}
        </li>
    {/each}
</ul>
{:else}
<div class='selected-items'>
    {singleOptionLabel}
</div>
{/if}

<div bind:this={menuRef} class=menu-popup class:active={isActive} class:hidden={!isActive}>
    <ul class=menu-content class:active={isActive} class:hidden={!isActive}>
        {#if selectType === 'multi'}
        <li class=clear-all class:nothing-selected={!$setter.length} on:click={clearAllSelections}>
            <div class=dropdown-status>
                {#if $setter.length}
                    ╳ 
                {/if}
            </div>
            <div class=clear-all-label>
                {#if $setter.length}
                    clear {$setter.length} item{$setter.length > 1 ? 's' : ''}
                {:else}
                    default: showing all
                {/if}
            </div>
        </li>
        {/if}
        {#each options as {label, key, shortDescription, itemType}}
            {#if itemType === 'divider'}
                <div class=divider></div>
            {:else if itemType === 'section'}
                <div class=menu-section>{label}</div>
            {:else}
                <li on:click={() => handleSelection(key)} class:selected={$setter.includes(key)}>
                    <!-- <div class=dropdown-status>{$setter.includes(key) ? '✓' : ' '}</div> -->
                    <div class=dropdown-status>
                        {#if selectType === 'multi'}
                            <div 
                                class=dropdown-status
                            >
                            <svelte:component this={$setter.includes(key) ? SelectedCheckbox : BlankCheckbox} />
                        </div>
                        {:else}
                            <div 
                                class=dropdown-status

                            >{$setter.includes(key) ? '✓' : ' '}</div>
                        {/if}
                    </div>
                    <div class=dropdown-content>
                        {label}
                        {#if shortDescription}
                            <div class=dropdown-item-description>{shortDescription}</div>
                        {/if}
                    </div>
                </li>
            {/if}
        {/each}
    </ul>
</div>

</div>