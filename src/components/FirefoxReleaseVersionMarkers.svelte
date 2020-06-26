<script>
  import { getContext, onDestroy } from 'svelte';
  import { Marker } from '@graph-paper/guides';
  import { store } from '../stores/store';
  import { firefoxVersionMarkers } from './product-versions';

  const xScale = getContext('xScale');
  const top = getContext('topPlot');
  const bottom = getContext('bottomPlot');

  function filterMarkers(release, graphXMin, graphXMax, metric) {
    const size = metric === 'all' ? 'small' : 'large';
    const ONE_YEAR = 1000 * 60 * 60 * 24 * (365 * (size === 'large' ? 2 : 1));
    const onlyEveryFive = graphXMax - graphXMin >= ONE_YEAR ? release.label % 5 === 0 : true;
    return onlyEveryFive &&
      release.date !== undefined &&
      release.date >= graphXMin &&
      release.date <= graphXMax;
  }

</script>

<g class="firefox-release-version-markers">
  {#await firefoxVersionMarkers then markers}
  {#each markers
    .filter(d => filterMarkers(d, ...$xScale.domain(), $store.metric))
  as {label, date}, i (date)}
  <!-- <Marker location="{date}">
    {label}
  </Marker> -->
  <text text-anchor=middle x={$xScale(date)} y={$top - 3} font-size=11 fill=var(--cool-gray-600)>
    {label}
  </text>
  <line
    x1={$xScale(date)} x2={$xScale(date)} y1={$top} y2={$bottom} shape-rendering=crispEdges
      stroke=var(--cool-gray-300) stroke-dashharray=1,2
  />
  {/each}
  {/await}
</g>
