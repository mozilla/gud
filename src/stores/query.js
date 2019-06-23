import { derived } from 'svelte/store'
import { allOptions, allStores, rawStart, rawEnd } from './stores'

export const queryParameters = derived(allStores, (stores) => {
    const outs = {}
    stores.forEach(($store,i) => {
        outs[allOptions[i].key] = $store;
    })
    return outs
})

const filterDates = ($store, i) => {
    const opt = allOptions[i]
    return !opt.onlyLocal
}

const toQueryStringParts = ($store,i) => {
    const opt = allOptions[i]
    if (opt.type === 'multi') {
        return `${opt.key}=${encodeURIComponent(JSON.stringify($store.sort()))}`
    }
    else  return `${opt.key}=${encodeURIComponent($store)}`
}

const queryString = derived(
        allStores, 
        (stores) => {
    const outs = stores.map(toQueryStringParts)
    const currentQuery = outs.join('&')
    return currentQuery
})

// this store specifically filters out all the options that have
// onlyLocal = true. These are not meaningful for the cached data, which is
// where this store is primarily used.
export const queryStringWithoutLocalOpts = derived(allStores, (stores) => {
    const outs = stores.map(toQueryStringParts).filter(filterDates)
    return outs.join('&')
})

export const isNotDefaultQueryset = derived(allStores, stores => {
    return !stores.every(($store, i) => {
        const opt = allOptions[i];
        if (opt.type === 'multi') return $store.length === 0
        else if (opt.type === 'date') return $store === ''
        else return $store === opt.values.filter(v=>!(v.itemType))[0].key
    })
})

export const setDateRange = (start, end) => {
    rawStart.set(start);
    rawEnd.set(end)
}

export const resetQuery = () => {
    allStores.forEach((store, i) => {
        const opt = allOptions[i]
        if (opt.type === 'multi') store.set([])
        else if (opt.type === 'date') store.set('')
        else store.set(opt.values.filter(v=>!(v.itemType))[0].key);
    })
    rawStart.set('');
    rawEnd.set('');
    // reset according to 
}

export default queryString