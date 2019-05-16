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
        outs.push(`${allOptions[i].key}=${$store}`)
    })
    const currentQuery = outs.join('&')
    return currentQuery
})

export const isNotDefaultQueryset = derived(allStores, stores => {
    return !stores.every(($store, i) => {
        return $store === allOptions[i].values[0].key
    })
})

export const resetQuery = () => {
    allStores.forEach((store, i) => {
        store.set(allOptions[i].values[0].key);
    })
}

export default queryString