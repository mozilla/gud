import optionSet from './options.json'
import { readable, derived } from 'svelte/store'

const start = optionSet.startOptions.setter;
const end = optionSet.startOptions.setter;

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
    }).map(([_, info]) => {
        info.str = info.date;
        info.date = new Date(info.date);
        let version = parseInt(info.version)
        if (version >= 4) version = ~~version
        version = `${version}`
        info.label = version
        return info
    }).filter(info => {
        return info.str > '2016-06-01'
    })
})

export default productDetails