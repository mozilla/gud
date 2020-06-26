<script>
  import { getContext } from 'svelte'
  import { fly } from "svelte/transition";
  import { timeDay, timeWeek, timeMonth, timeYear } from "d3-time";
  import { timeFormat } from "d3-time-format";
  import {AxisContainer, AxisLabel, AxisTick } from '@graph-paper/guides';

  export let scale = getContext('xScale');
  export let secondaryOffset = '.7em';
  export let majorLines = false;

  const xAxisMonth = timeFormat("%b");
  const xAxisYear = timeFormat("%Y");
  const xAxisWeek = timeFormat("%b %d");
  const xAxisDay = timeFormat("%d");

  const daysBetween = (firstDate, secondDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(
      Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay)
    );
  };

  function getRange(scale) {
    return daysBetween(...scale.domain().map(d => new Date(d)));
  }

  function getQuarters(scale) {
    const [start, end] = scale.domain().map(d => new Date(d));
    return timeMonth.range(start, end, 3);
  }

  let resolution = "years";
  let r = getRange($scale);
  $: r = getRange($scale);

  $: years = timeYear.range(...$scale.domain());
  $: halves = timeMonth.range(...$scale.domain(), 6);
  $: quarters = timeMonth.range(...$scale.domain(), 3);
  $: months = timeMonth.range(...$scale.domain());
  $: weeks = timeWeek.range(...$scale.domain(), 2);
  $: days = timeDay.range(...$scale.domain());

  let p;
  $: if (r >= 365 * 1.5) {
    resolution = "years";
    p = years;
  } else if (r <= 365 * 1.5 && r >= 365) {
    resolution = "shortYear";
    p = quarters;
  } else if (r <= 365 && r >= 365 / 4) {
    resolution = "months";
    p = months;
  } else if (r <= 365 / 4 && r > 18) {
    resolution = "weeks";
    p = weeks;
  } else if (r <= 18) {
    resolution = "days";
    p = days;
  }

</script>

<AxisContainer side="bottom">
  <g slot='ticks' let:closestMargin let:farthestMargin>
  {#if majorLines}
    {#each p as pi, i}
                <AxisTick
      placement={pi}
      color="var(--cool-gray-150)"
      tickDirection={-1}
      length={closestMargin - farthestMargin} />
    {/each}
    {/if}
  </g>
  <g slot='labels'>
    {#if resolution === 'days'}
    {#each days as period, i}
    <AxisTick placement={period} />
      <AxisLabel
        placement={period}
      >
        {xAxisDay(period)}
      </AxisLabel>
    {/each}
    <AxisLabel
      dy={secondaryOffset}
      placement={days[0]}
    >
      {xAxisMonth(days[0])}
    </AxisLabel>

  {/if}
  {#if resolution === 'weeks'}
    {#each weeks as period, i}
      <AxisTick placement={period} />
      <AxisLabel placement={period}>
        {xAxisWeek(period)}
      </AxisLabel>
    {/each}
  {/if}
  {#if resolution === 'months'}
    {#each months as month, i}
      <AxisTick placement={month} />
      <AxisLabel
        placement={month}>
        {xAxisMonth(month)}
      </AxisLabel>
    {/each}
    {#each years as year, i}
      <AxisLabel dy={secondaryOffset} placement={year}>
        {xAxisYear(year)}
      </AxisLabel>
    {/each}
    {#if !years.length}
      <AxisLabel dy={secondaryOffset} placement={months[0]}>
        {xAxisYear(months[0])}
      </AxisLabel>
    {/if}
    {/if}
    {#if resolution === 'shortYear'}
      {#each quarters as period, i}
        <AxisTick placement={period} />
        <AxisLabel placement={period}>
          {xAxisMonth(period)}
        </AxisLabel>
      {/each}
      {#each years as year, i}
        <AxisLabel
          dy={secondaryOffset}
          placement={year}>
          {xAxisYear(year)}
        </AxisLabel>
      {/each}
    {/if}
    {#if resolution === 'years'}
      {#each years as year, i}
        <AxisTick placement={year} />
        <AxisLabel placement={year}>
          {xAxisYear(year)}
        </AxisLabel>
      {/each}
    {/if}
  </g>
</AxisContainer>
