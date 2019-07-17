<script context=module>
let IND = 0;
</script>

<script>
import { onMount } from 'svelte'
import { writable } from 'svelte/store';
import { fade, fly, slide } from 'svelte/transition';
import { flip } from 'svelte/animate';

import Popper from 'popper.js'

import SelectedCheckbox from './SelectedCheckbox.svelte';
import BlankCheckbox from './BlankCheckbox.svelte';
import Tooltip from './Tooltip.svelte';

export let title;
export let description=title;
export let showDescriptionOnSelect = false;
export let options;
export let setter;
export let selectType = 'single';
export let onSelection;
export let enabled;

let parentRef;
let menuRef;
let isActive = false;

let key;
let keyCode;

let ind = IND;
IND += 1;

let menuPopup;
let visible = false;

export let updatePopup = () => { if (menuPopup) menuPopup.scheduleUpdate() }

onMount(() => {
    visible = true;
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
    updatePopup();
})

// set singleOptionLabel
let singleOptionLabel = options[0].label;
let singleOptionDescription = options[0].shortDescription;
$: if (selectType === 'single') {
    const opt = options.find(opt => opt.key === $setter)
    singleOptionLabel = opt.label;
    if (showDescriptionOnSelect) singleOptionDescription = opt.shortDescription;
}

function toggleActive() {
    isActive = !isActive
    if (isActive) hideOnClickOutside(menuRef)
}

function removeSelection(key) { 
    $setter = $setter.filter(k=>k!==key)
}

function handleSelection(key) {
    console.log('-----------------------------Multiselector: ', title, key)
    const thisOption = options.find(k=>k.key===key);
    if (selectType === 'multi') {
            if (!$setter.includes(key)) {
            $setter = [...$setter, key];
        }
        else {
            $setter = $setter.filter(k=>k!==key);
        }
    } else {
        $setter = key;
        // if single, collapse.
        isActive = false;
    }
    if (onSelection) {
        onSelection(thisOption)
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

.selector {
    margin-bottom: var(--pad);
}

.disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.45;
}

.disabled-text {
    font-weight: 300;
}

button.dropdown {
    border: none;
    /* border-bottom: 1px solid tomato; */
    background-color: var(--multiselector-bg);
    border: 1px solid var(--multiselector-border-color);
    padding: calc(var(--multiselector-list-item-pad) / 2);
    padding-left: var(--multiselector-horiz-pad);
    padding-right: var(--multiselector-horiz-pad);
    border-radius: calc(var(--multiselector-list-item-pad) / 4);
    color: var(--multiselector-button-text-color);
    text-align: left;
    text-transform: uppercase;
    /* padding-bottom: 5px; */
    font-size: 14px;
    cursor: pointer;
    display: grid;
    margin-right:0;
    margin-left: auto;
    grid-template-columns:  [title] max-content [carat] max-content;
    grid-column-gap: 5px;
    transition: background-color 200ms, box-shadow 200ms;
}

button.dropdown:hover {
    box-shadow: 2px 2px 0px #0250bb;
}

button.dropdown.isActive {
    background-color: var(--multiselector-selected-bg);
}

button.dropdown .dropdown-button-icon {
    transform-origin: center;
    text-align:center;
    opacity: .8;
    grid-column: carat;
}

button.dropdown div.active-icon {
    transform: rotate(-1080deg);
}

.dropdown-title {
    opacity: .7;
    width: 100%;
    grid-column: title;
}

.dropdown-tooltip {
    grid-column: tooltip;
    margin-left:0;
    transition: 200ms;
    display:grid;
    align-items:end;
    /* opacity:.5; */
}

:global(.dropdown-tooltip div.tooltip-trigger) {
    margin:0;
}

.menu-popup {
    transition: 100ms;
    /* max-height: 95vh;
    overflow: auto; */
    box-shadow: 0px 0px 20px rgba(0,0,0,.1);
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
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0,0,0,.1);
    padding:0;
    padding-top:5px;
    padding-bottom:5px;
    background-color: white;
    max-width: 425px;
    min-width: 200px;
    overflow: auto;
    max-height: 95vh;

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
    padding-left: var(--multiselector-list-item-pad);
    padding-right: var(--multiselector-list-item-pad);
    padding-top: calc(var(--multiselector-list-item-pad) );
    padding-bottom: calc(var(--multiselector-list-item-pad));
    cursor: pointer;
    display: grid;
    grid-template-columns: [status] var(--multiselector-list-item-size) [content] auto [right] var(--multiselector-list-item-size);
    min-height: var(--multiselector-list-item-size);
    grid-gap: calc(var(--multiselector-list-item-pad));
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
    /* margin-left: calc(16px + var(--pad) / 2); */
    margin-top: var(--multiselector-list-item-pad);
    flex-wrap: wrap;
    font-size: 14px;
    font-weight: bold;
    justify-content: flex-end;
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
    margin-bottom: calc(var(--multiselector-list-item-pad) / 2);
    margin-top: calc(var(--multiselector-list-item-pad) / 2);
}

.menu-section {
    text-transform: uppercase;
    font-size:12px;
    font-weight:900;
    color: darkgray;
    padding-top: calc(var(--multiselector-list-item-pad) / 2);
    padding-bottom: calc(var(--multiselector-list-item-pad) / 2);
    padding-left: calc(var(--multiselector-list-item-size) + var(--multiselector-list-item-pad) * 1.5);
}

.single-option-description {
    font-weight: normal;
    font-size:13px;
    opacity: .8;
    margin-top: calc(var(--pad) / 2);
    font-style: italic;
    text-align:right;
}

</style>

<svelte:window on:keydown={handleKeydown} />

<!-- <div class=dropdown-tooltip>
    <Tooltip msg={description} />
</div> -->

<div
    transition:fly={{x:-10, duration: 200}}
    on:introend={() =>{
        updatePopup()
    }}
    class=selector
    class:disabled={!enabled}
>

<div class=input-set>
    <button bind:this={parentRef} class=dropdown class:isActive on:click={toggleActive}>
        <div class=dropdown-title>{title}</div>
        <div class=dropdown-button-icon class:active-icon={isActive}>▾</div>
    </button>
</div>
{#if selectType === 'multi'}
<ul class=selected-items>
    {#if $setter.length === 0}
        <div transition:fade={{duration:150}} class=default-selected-item-message>
            All
        </div>
    {/if}
    {#each $setter as key (key)}
        <li transition:fade={{duration:150}} animate:flip={{duration:150}}>
            <span class=remove-item on:click={() => removeSelection(key)}>╳</span>
            {options.find(opt => opt.key === key).label}
        </li>
    {/each}
</ul>
{:else}
<div class='selected-items'>
    {singleOptionLabel}
    {#if showDescriptionOnSelect && singleOptionDescription && singleOptionLabel !== 'All'}
        <div class=single-option-description>
            {singleOptionDescription}
        </div>
    {/if}
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