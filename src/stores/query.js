import { derived } from 'svelte/store'
import { allOptions, allStores } from './stores'

export const queryParameters = derived(allStores, (stores) => {
    const outs = {}
    stores.forEach(($store,i) => {
        outs[allOptions[i].key] = $store;
    })
    return outs
})

const filterDates = ($store, i) => {
    const opt = allOptions[i]
    return opt.type !== 'date'
}

const toQueryStringParts = ($store,i) => {
    const opt = allOptions[i]
    if (opt.type === 'multi') {
        return `${opt.key}=${encodeURIComponent(JSON.stringify($store.sort()))}`
    }
    else  return `${opt.key}=${$store.toString()}`
}

const queryString = derived(
        allStores, 
        (stores) => {
    const outs = stores.map(toQueryStringParts)
    const currentQuery = outs.join('&')
    return currentQuery
})

export const queryStringWithoutDates = derived(allStores, (stores) => {
    const outs = stores.map(toQueryStringParts).filter(filterDates)
    return outs.join('&')
})

export const isNotDefaultQueryset = derived(allStores, stores => {
    return !stores.every(($store, i) => {
        const opt = allOptions[i];
        if (opt.type === 'multi') return $store.length === 0
        if (opt.type === 'date') return $store !== ''
        else return $store === opt.values[0].key
    })
})

export const resetQuery = () => {
    allStores.forEach((store, i) => {
        const opt = allOptions[i]
        if (opt.type === 'multi') store.set([])
        if (opt.type === 'date') store.set('')
        else store.set(opt.values[0].key);
    })
}

export default queryString