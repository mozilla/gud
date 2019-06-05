<script>
import { fly } from 'svelte/transition'
export let error;
</script>

<style>
section {
    text-align: center;
    font-size:22px;
    color: var(--faint-text);
    font-weight: 900;
    opacity: .8;
}

div {
    font-size:18px;
    font-weight: normal;
}
</style>

<section in:fly={{y:20, duration: 1000}}>
    No data with the specified parameters.
    <div>
        Try selecting a different date range or set of parameters.
    </div>
</section>