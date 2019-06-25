<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    function fireClickMessage() {
        console.log('yeah!');
		dispatch('click');
	}
</script>

<div class=app-button>
    <button on:click={fireClickMessage}>
        Export Dataset as CSV
    </button>
</div>