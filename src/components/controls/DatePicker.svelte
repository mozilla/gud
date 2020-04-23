<script>
import { createEventDispatcher } from 'svelte';
import { timeFormat, timeParse } from 'd3-time-format';
import { timeDay } from 'd3-time';
import { Button } from '@graph-paper/button';
import Calendar from '../Calendar.svelte';

const dispatch = createEventDispatcher();

export let active = false;

let whichOption = 'BETWEEN';

function setActive() {
  active = !active;
}

function changeOption(which) {
  return () => { whichOption = which; };
}

const FORMAT = '%Y-%m-%d';
const LABEL_FORMAT = '%b %d, %Y';
const formatLabel = timeFormat(LABEL_FORMAT);

function toDate(str) {
  const fmt = timeParse(FORMAT);
  return fmt(str);
}

// function fromDate(dt) {
//   const fmt = timeFormat(FORMAT);
//   return fmt(dt);
// }

function validateDate(str) {
  if (!str) return false;
  let [y, m, d] = str.split('-');
  d = +d;
  m = +m;
  y = +y;
  const dt = new Date(y, m - 1, d);
  return (Boolean(+dt) && dt.getDate() === d && y > 2010);
}

let lastValue = 90;

export let startDate;
export let endDate;

let formattedStartDate = startDate;
let formattedEndDate = endDate;

function applyDates() {
  dispatch('applyDates', {
    start: formattedStartDate,
    end: formattedEndDate,
  });
}

function withKey(keybinding, callback) {
  return (evt) => {
    if (evt.key === keybinding) callback();
  };
}

$: startIsValid = validateDate(formattedStartDate);
$: endIsValid = validateDate(formattedEndDate);

</script>

<style>

.date-picker {
  width: var(--space-40x);
  border: 1px solid var(--ux-gray-300);
  box-shadow: 0px 4px 6px rgba(0,0,0,.1);
  border-radius: var(--space-base);
}

.date-picker__optionset {
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: var(--space-base);
  background-color: var(--ux-gray-100);
  padding-top: var(--space-base);
  padding-left: var(--space-2x);
  padding-right: var(--space-2x);
}

.date-picker__option {
  justify-self: start;
  padding: var(--space-base);
  padding-left: var(--space-2x);
  padding-right: var(--space-2x);
  font-size: var(--text-02);
  text-align: center;
  color: var(--ux-gray-550);
  cursor: pointer;
}

.date-picker__option--active {
  background-color: white;
  color: var(--digital-blue-500);
}

.date-picker--last {
  padding: var(--space-base);
}

.date-picker--between {
  padding: var(--space-base);
  padding-left: var(--space-2x);
  padding-right: var(--space-2x);
}

.date-picker__input {
  display: inline;
  font-size: var(--text-02);
  border-radius: var(--space-1h);
}

.date-picker__input--last {
  width: 72px;
}

.date-picker__input--between {
width: 102px;
}

.date-picker__apply {
  padding: var(--space-base);
  padding-left: var(--space-2x);
  padding-right: var(--space-2x);
  padding-bottom: var(--space-2x);
  display: grid;
  grid-auto-flow: column;
  justify-content: end;
  grid-column-gap: var(--space-base);
}

.date-picker__input--invalid {
  outline: 2px solid var(--pantone-red-500);
}

.date-picker__reset {
  justify-self: end;
}

.date-picker__range {
  padding-left: var(--space-2x);
  padding-right: var(--space-2x);
  color: var(--ux-gray-500);
  font-size: var(--text-02);
}

</style>

<svelte:window on:keydown={withKey('Escape', () => { if (active) active = false; })} />

<Button compact level="medium" on:click={setActive}>
  <div class='gafc col-gap-1x'>
    <Calendar size={12} /> {formatLabel(toDate(startDate))} - {formatLabel(toDate(endDate))}
  </div>
</Button>

{#if active}
  <div class="date-picker">
    <div class="date-picker__optionset">
      <div class="date-picker__option" class:date-picker__option--active={whichOption === 'BETWEEN'} on:click={changeOption('BETWEEN')}>Between</div>
      <div class="date-picker__reset">
        <Button level="low" compact> Reset </Button>
      </div>
    </div>
    {#if whichOption === 'LAST'}
      <div class='date-picker--last'>
        <div>
          last <input type="number" class="date-picker__input date-picker__input--last" bind:value={lastValue} /> days
        </div>
      </div>
    {/if}
    {#if whichOption === 'BETWEEN'}
      <div class="date-picker--between">
        <input
          class="date-picker__input date-picker__input--between"
          class:date-picker__input--invalid={!startIsValid}
          bind:value={formattedStartDate} />
        to
        <input
          class="date-picker__input date-picker__input--between"
          class:date-picker__input--invalid={!endIsValid}
          bind:value={formattedEndDate}  />
      </div>
      <div class="date-picker__range">
        {#if startIsValid && endIsValid}
          {timeDay.count(toDate(formattedStartDate), toDate(formattedEndDate))} days
        {:else}
          Invalid dates.
        {/if}
      </div>
    {/if}
    <div class="date-picker__apply">
      <Button compact level="low" on:click={() => { active = false; }}>Cancel</Button>
      <Button compact level="high" on:click={applyDates}>Apply</Button>
    </div>
  </div>
{/if}
