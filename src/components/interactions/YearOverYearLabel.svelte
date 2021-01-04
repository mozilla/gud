<script>
  import { getContext } from 'svelte';
  import { percentage2d, percentageDifference } from '../../utils/formatters';
  export let data;
  export let focusPoint;
  export let y;

  const top = getContext('topPlot');
  const bottom = getContext('bottomPlot');
  const right = getContext('rightPlot');
  const xScale = getContext('xScale');

  function getYoYComparison(target, candidate) {
    const yearAgo = new Date(target);
    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
    const m = yearAgo.toString();
    return m === candidate.toString();
  }

  $: yoy = data.find(di=> getYoYComparison(focusPoint.date, di.date));
</script>

{#if yoy && yoy[y] !== undefined && focusPoint[y] !== undefined}
  <text
    font-size=12
    x={$right}
    y={12}
    fill={yoy[y] > focusPoint[y] ? 'var(--pantone-red-500)' : 'var(--cool-gray-800)'}
    text-anchor=end>{percentage2d(percentageDifference(yoy[y], focusPoint[y]))} YoY</text>
  <line
    x2={$xScale(yoy.date)} x1={$xScale(yoy.date)} y1={$bottom - 6} y2={$bottom}
    stroke=var(--cool-gray-300)
  />
{/if}
