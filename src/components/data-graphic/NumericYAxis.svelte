<script>
import { fly } from 'svelte/transition';
import {precisionPrefix, formatPrefix, format} from 'd3-format'
import { scaleLinear } from 'd3-scale';

export let left;
export let right;
export let top;
export let bottom;
export let tickLength;
export let scale;
export let axisType;
export let side = 'left';

const SETTINGS = {
    'left': {
        main: left,
        dir: -1,
        top,
        bottom,
        anchor: 'end'
    },
    'right': {
        main: right,
        dir: 1,
        top,
        bottom,
        anchor: 'start'
    }
}

const makeFormatter = (maxValue, fmt) => {
    if (fmt === 'percentage') return format('.2%')
    if (fmt === 'ratio') return format('.2f')
    return (v) => format('~s')(v)
}

$: formatter = makeFormatter(scale.domain()[1], axisType);
$: ticks = scale.ticks(5)
$: topTick = ticks[ticks.length-1]
</script>


<g class=y-axis>
    <line 
        x1={SETTINGS[side].main}  
        x2={SETTINGS[side].main}
        y1={scale(topTick)} y2={SETTINGS[side].bottom}
        stroke='gray'
        stroke-width={1}
        ></line>
        {#each ticks as tick,i}
            <line 
                x1={SETTINGS[side].main}
                x2={SETTINGS[side].main + tickLength * SETTINGS[side].dir}
                y1={scale(tick)}
                y2={scale(tick)}
                stroke=gray
            />
            <text
                in:fly={{x:-20, duration:200 + i * 100}}
                y={scale(tick)}
                x={SETTINGS[side].main + tickLength * SETTINGS[side].dir * 1.5}
                dy={'.35em'}
                font-size={10}
                text-anchor={SETTINGS[side].anchor}
            >{formatter(tick)}</text>
            
        {/each}
</g>