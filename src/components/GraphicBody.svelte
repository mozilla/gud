<script>
import LineChartWithCI from './LineChartWithCI.svelte'
import { mode } from '../stores/stores'
// should this read the store?

export let data;
</script>

<style>
.graphics {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;
}
</style>


<div class=graphic-body>
    <div class=graphics >
        {#each data as dataset, i}
        <LineChartWithCI title={dataset.metric} data={dataset.data} />
        {/each}
    </div>
</div>