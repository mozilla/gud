<script>
import { fly } from 'svelte/transition';
import { timeDay, timeWeek, timeMonth, timeYear } from 'd3-time';
import { timeFormat } from 'd3-time-format';

export let left;
export let right;
export let bottom;
export let tickLength;
export let scale;

const xAxisMonth = timeFormat('%b');
const xAxisYear = timeFormat('%Y');
const xAxisWeek = timeFormat('%b %d');
const xAxisDay = timeFormat('%d');

const LINE_1 = bottom + tickLength * 3;
const LINE_2 = bottom + tickLength * 3 + 11;

const daysBetween = (firstDate, secondDate) => {
    const oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}

function getRange(scale) {
    return daysBetween(...scale.domain().map(d => new Date(d)))
}

function getQuarters(scale) {
    const [start, end] = scale.domain().map(d => new Date(d))
    return timeMonth.range(start, end, 3)   
}

let resolution = 'years';

const r = getRange(scale)

let years = timeYear.range(...scale.domain());
let halves = timeMonth.range(...scale.domain(), 6);
let quarters = timeMonth.range(...scale.domain(), 3);
let months = timeMonth.range(...scale.domain());
let weeks = timeWeek.range(...scale.domain(), 2);
let days = timeDay.range(...scale.domain())

if (r >= 365 * 1.5) {
    resolution = 'years';
    // status quo.
    // let's plot quarters + years.
} else if (r <= 365 * 1.5 && r >= 365) {
    resolution = 'shortYear'
} else if ( r <= 365 && r >= 365/4) {
    resolution = 'months'
    // do something here
} else if (r <= 365 / 4 && r > 18) {
    resolution = 'weeks'
    // do one last thiing? I guess.
} else if (r <= 18) {
    resolution = 'days'
}

// take the range, and generate the data accordingly.

</script>

<g class=x-axis>
    <line 
        x1={left}  
        x2={right}
        y1={bottom} y2={bottom}
        stroke='gray'
        stroke-width={1}
        ></line>
        {#if resolution === 'days'}
            {#each days as period, i}
                <line 
                    x1={scale(period)}
                    x2={scale(period)}
                    y1={bottom}
                    y2={bottom + tickLength}
                    stroke='gray'
                />
                <text
                    x={scale(period)}
                    y={LINE_1}
                    dy='.35em'
                    font-size={10}
                    text-anchor=middle

                >{xAxisDay(period)}</text>
            {/each}
            <text
                    x={scale(days[0])}
                    y={LINE_2}
                    dy='.35em'
                    font-size={10}
                    text-anchor=middle

                >{xAxisMonth(days[0])}</text>
        {/if}
        {#if resolution === 'weeks'}
            {#each weeks as period, i}
                <line 
                    x1={scale(period)}
                    x2={scale(period)}
                    y1={bottom}
                    y2={bottom + tickLength}
                    stroke='gray'
                />
                <text
                    x={scale(period)}
                    y={LINE_1}
                    dy='.35em'
                    font-size={10}
                    text-anchor=middle

                >{xAxisWeek(period)}</text>
        
            {/each}
        {/if}
        {#if resolution === 'months'}
            {#each months as month, i}
                <line 
                    x1={scale(month)}
                    x2={scale(month)}
                    y1={bottom}
                    y2={bottom + tickLength}
                    stroke='gray'
                />
                <text
                    x={scale(month)}
                    y={LINE_1}
                    dy='.35em'
                    font-size={10}
                    text-anchor=middle

                >{xAxisMonth(month)}</text>
        
            {/each}
            {#each years as year, i}
                <text
                    x={scale(year)}
                    y={LINE_2}
                    dy='.35em'
                    opacity={.8}
                    font-weight='bold'
                    font-size={10}
                    text-anchor=middle

                >{xAxisYear(year)}</text>
            {/each}
            <!-- add single year at beginning -->
            {#if !years.length}
                <text
                    x={scale(months[0])}
                    y={LINE_2}
                    dy='.35em'
                    font-size={10}
                    text-anchor=middle

                >{xAxisYear(months[0])}</text>
            {/if}

        {/if}
        {#if resolution === 'shortYear'}
            {#each quarters as period, i}
                 <line 
                    x1={scale(period)}
                    x2={scale(period)}
                    y1={bottom}
                    y2={bottom + tickLength}
                    stroke='gray'
                />
                <text
                    x={scale(period)}
                    y={LINE_1}
                    dy='.35em'
                    font-size={10}
                    text-anchor=middle

                >{xAxisMonth(period)}</text>
            {/each}
            {#each years as year, i}
                <text
                    x={scale(year)}
                    y={LINE_2}
                    dy='.35em'
                    font-size={10}
                    text-anchor=middle

                >{xAxisYear(year)}</text>
            {/each}

        {/if}
        {#if resolution === 'years'}
            {#each years as year, i}
                <line 
                    x1={scale(year)}
                    x2={scale(year)}
                    y1={bottom}
                    y2={bottom + tickLength}
                    stroke='gray'
                />
                <text
                    x={scale(year)}
                    y={LINE_1}
                    dy='.35em'
                    font-size={10}
                    text-anchor=middle

                >{xAxisYear(year)}</text>
            {/each}
        {/if}
</g>