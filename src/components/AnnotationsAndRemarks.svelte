<script>
import { fly, slide } from 'svelte/transition';
import { flip } from 'svelte/animate';
import annotations, {activateAnnotationModal, removeAnnotation} from '../stores/annotations';
</script>

<div class=annotations-and-remarks>
    <button class='bt bt-outline' on:click={activateAnnotationModal}>+ add annotation</button>
    {#if $annotations.length}
        <h2 transition:fly={{x:-20, duration: 100}}>annotations & remarks</h2>
        <ol transition:fly={{x:-20, duration: 100}}>
        {#each $annotations as annotation (annotation.id)}
            <li 
                animate:flip={{duration:150}} 
                in:fly={{x:-20, duration:150}}
                out:slide={{duration:150}}
            >
                {annotation.text} <button class='bt bt-text' on:click={() => removeAnnotation(annotation.id)}>╳</button>
            </li>
        {/each}
        </ol>
    {/if}
</div>