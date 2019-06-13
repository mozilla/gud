<script>
import {onMount} from 'svelte'
import Popper from 'popper.js';
import Help from './Help.svelte'

export let msg;
export let title;
let parentRef;
let tooltipRef;
let arrowRef;
let menuPopup;
let isActive = false;

function toggleActive(tf) {
    isActive = tf
}

onMount(() => {
    const container = document.body
    menuPopup = new Popper(parentRef, tooltipRef, {
        placement: 'top',
        modifiers: {
            arrow: {
                enabled: true,
                element: arrowRef
            },
            offset: { 
                    enabled: true,
                    offset: '0,20px'
            },
            preventOverflow: {
                boundariesElement: container,
            },
        }
    });
    menuPopup.scheduleUpdate();
})

</script>

<style>

:root {
    --fill: #f8ece5;
    --tt-pad: 15px;
}

div.tooltip-trigger {
    width: max-content;
    opacity: .35;
    transition: opacity 200ms;
    display: grid;
    margin: auto;
}

div.tooltip-element {
    max-width: 300px;
    padding: var(--tt-pad);
    background-color: var(--fill);
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
}

div.tooltip-element.active {
    transform: none;
}

:global(.tooltip-container[x-placement="top"] .tooltip-element:after) {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 0;
	border: 16px solid transparent;
	border-top-color:var(--fill);
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
	border-bottom-color: var(--fill);
	border-top: 0;
	margin-left: -16px;
	margin-top: -16px;
}

div.active {
    opacity: 1;
    z-index: 1001;
}

div.hidden {
    opacity: 0;
    z-index: -1;
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
    class=tooltip-trigger bind:this={parentRef}><Help /></div>