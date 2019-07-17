<script>
import {onMount} from 'svelte'
import Popper from 'popper.js';
import Help from './Help.svelte'

export let msg;
export let title = undefined;
let parentRef;
let tooltipRef;
let menuPopup;
let isActive = false;

function toggleActive(tf) {
    isActive = tf
}

export let updatePosition = () => { if (menuPopup) menuPopup.scheduleUpdate() }

onMount(() => {
    const container = document.body
    menuPopup = new Popper(parentRef, tooltipRef, {
        placement: 'top',
        modifiers: {
            offset: { 
                    enabled: true,
                    offset: '0,20px'
            },
            preventOverflow: {
                boundariesElement: container,
            },
        }
    });
    updatePosition()
})

</script>

<style>

div.tooltip-trigger {
    width: max-content;
    opacity: .35;
    transition: opacity 200ms;
    display: grid;
    margin: auto;
    align-items: end;
}

div.tooltip-element {
    max-width: 300px;
    padding: var(--modal-tt-pad);
    background-color: var(--modal-fill);
    font-size:13px;
    line-height:1.4;
    /* border: 1px solid lightgray; */
    border-radius: 5px;
    /* box-shadow: 0px 0px 10px rgba(0,0,0,.1); */
    transition: 150ms;
    opacity: 0;
}

.tooltip-element h4 {
    margin:0;
    padding-bottom: 10px;
}

div.tooltip-element.hidden {
    transform: translateY(10px) scale(.8);
    transition: 150ms;
}

div.tooltip-element.active {
    transform: none;
    transition: 150ms;
}

:global(.tooltip-container[x-placement="top"] .tooltip-element:after) {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 0;
	border: 16px solid transparent;
	border-top-color:var(--modal-fill);
	border-bottom: 0;
	margin-left: -16px;
	margin-bottom: -16px;
}

:global(.tooltip-container[x-placement="bottom"] .tooltip-element:after) {
	content: '';
	position: absolute;
	top: 0;
	left: 50%;
	width: 0;
	height: 0;
	border: 16px solid transparent;
	border-bottom-color: var(--modal-fill);
	border-top: 0;
	margin-left: -16px;
	margin-top: -16px;
}

:global(.tooltip-container[x-placement="right"] .tooltip-element:after) {
    content: '';
	position: absolute;
	right: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 16px solid transparent;
	border-left-color: var(--modal-fill);
	border-right: 0;
	margin-top: -16px;
	margin-right: -16px;
}

:global(.tooltip-container[x-placement="left"] .tooltip-element:after) {
    content: '';
	position: absolute;
	right: 0;
	top: 50%;
	width: 0;
	height: 0;
	border: 16px solid transparent;
	border-left-color: var(--modal-fill);
	border-right: 0;
	margin-top: -16px;
	margin-right: -16px;
}

div.active {
    opacity: 1;
    z-index: 1001;
}

div.hidden {
    opacity: 0;
    z-index: -1000;
}

div:hover {
    opacity: 1;
}

</style>

<div class=tooltip-container bind:this={tooltipRef} class:active={isActive} class:hidden={!isActive}>
    <div class=tooltip-element class:active={isActive} class:hidden={!isActive}>
        {#if title}
            <h4>{title}</h4>
        {/if}
        {msg}
    </div>
</div>

<div 
    on:mouseover={() => toggleActive(true)} 
    on:mouseleave={() => toggleActive(false)} 
    class=tooltip-trigger bind:this={parentRef}>
    <Help />
</div>