import { writable, readable, derived } from 'svelte/store'

let hasLoaded = false

const productDetails = readable(undefined, async(set) => {
    //if (!hasLoaded) {
    const request = await fetch('https://product-details.mozilla.org/1.0/all.json');
    const data = await request.json();
    set(data.releases)        
    return () => undefined
})

export const majorReleases = derived(productDetails, ($pd) => {
    if ($pd === undefined) return undefined
    return Object.entries($pd).filter(([key, {category}]) => {
        return category === 'major' && key.includes('firefox')
    }).sort(([_a, {date: ad}], [_b, {date: bd}]) => {
        if (ad > bd) return 1;
        if (ad < bd) return -1;
        return 0;
    })
})

export default productDetails