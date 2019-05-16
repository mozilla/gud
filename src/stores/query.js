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

export default queryString