<script>
import { onMount } from 'svelte';
import { fade, fly, blur } from 'svelte/transition';
import { spring } from 'svelte/motion';

export let size = 148;

const s = spring(1, { stiffness: 0.2, damping: 0.2 });
$: s.set(0);

let mounted = false;
onMount(() => {
  mounted = true;
});

const DIST = 5;
</script>

<style>
svg {
  --dark: var(--pantone-red-700);
  --med: var(--pantone-red-500);
  --light: var(--pantone-red-300);
}
</style>

{#if mounted}
<svg width={size} height={size} viewBox="0 0 384 333" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
    <defs>
      <linearGradient id="leftSide" gradientTransform="rotate(90)">
        <stop offset="5%"  stop-color="var(--pantone-red-500)" />
        <stop offset="95%" stop-color="var(--pantone-red-700)" />
      </linearGradient>
      <linearGradient id="rightSide" gradientTransform="rotate(70)">
        <stop offset="5%"  stop-color="var(--pantone-red-600)" />
        <stop offset="95%" stop-color="var(--pantone-red-900)" />
      </linearGradient>
      <linearGradient id="topSide" gradientTransform="rotate(90)">
        <stop offset="5%"  stop-color="var(--pantone-red-200)" />
        <stop offset="95%" stop-color="var(--pantone-red-400)" />
      </linearGradient>
      <linearGradient id="insideLight" gradientTransform="rotate(90)">
        <stop offset="5%"  stop-color="var(--pantone-red-500)" />
        <stop offset="95%" stop-color="var(--pantone-red-600)" />
      </linearGradient>
      <linearGradient id="insideDark" gradientTransform="rotate(90)">
        <stop offset="5%"  stop-color="var(--pantone-red-600)" />
        <stop offset="95%" stop-color="var(--pantone-red-700)" />
      </linearGradient>
    </defs>
    <g style="transform: rotate({$s * 4}deg); transform-origin: center center;">
      <g transform="matrix(1,0,0,1,-1377.18,-880.217)">
        <g transform="matrix(0.866025,0.5,-0.5,0.866025,1249.18,492.238)">
            <g transform="matrix(3,0,0,3,-942.236,-736)">
                <path in:fly={{ duration: 1000, x: DIST, y: 0 }} d="M498.831,416L554.256,384L554.256,320L498.831,352L498.831,416Z" style="fill:url(#rightSide);"/>
                <g transform="matrix(-1,0,0,1,997.661,2.4869e-13)">
                    <path in:fly={{ duration: 1000, x: DIST, y: 0 }}  d="M498.831,416L554.256,384L554.256,320L498.831,352L498.831,416Z" style="fill:url(#leftSide);"/>
                </g>
                <g transform="matrix(-0.5,0.866025,0.866025,0.5,443.405,-320)">
                    <path in:fly={{ duration: 1000, x: -DIST, y: 0 }}  d="M498.831,416L554.256,384L554.256,320L498.831,352L498.831,416Z" style="fill:url(#topSide);"/>
                </g>
            </g>
            <g in:fade={{ duration: 600, delay: 700 }}>
              <path d="M554.256,176L554.256,272L637.395,224L554.256,176Z" style="fill:url(#insideLight);"/>
              <path d="M471.118,224L554.256,176L554.256,272L471.118,224Z" style="fill: url(#insideDark);"/>
            </g>
        </g>
      </g>
    </g>
</svg>
{/if}
