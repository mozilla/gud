import { derived } from 'svelte/store'
import { allOptions, allStores } from './stores'

export const queryParameters = derived(allStores, (stores) => {
    const outs = {}
    stores.forEach(($store,i) => {
        outs[allOptions[i].key] = $store;
    })
    return outs
})

const queryString = derived(
        allStores, 
        (stores) => {
    const outs = []
    stores.forEach(($store,i) => {
        const opt = allOptions[i]
        if (opt.type === 'multi') {
            outs.push(`${opt.key}=${encodeURIComponent(JSON.stringify($store.sort()))}`)
        }
        else outs.push(`${opt.key}=${$store.toString()}`)
        
    })
    const currentQuery = outs.join('&')
    return currentQuery
})

export const isNotDefaultQueryset = derived(allStores, stores => {
    return !stores.every(($store, i) => {
        const opt = allOptions[i];
        if (opt.type === 'multi') return $store.length === 0
        else return $store === opt.values[0].key
    })
})

export const resetQuery = () => {
    allStores.forEach((store, i) => {
        const opt = allOptions[i]
        if (opt.type === 'multi') store.set([])
        else store.set(opt.values[0].key);
    })
}

export default queryString