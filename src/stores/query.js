import { derived } from 'svelte/store'
import { allOptions, allStores, rawStart, rawEnd, disabledDimensions } from './stores'
import optionSet from './options.json'

const start = optionSet.startOptions.setter;
const end = optionSet.endOptions.setter;

// this is the javascript object that contains all the currently-selected
// options.
export const queryParameters = derived(allStores, (stores) => {
    const outs = {}
    stores.forEach(($store,i) => {
        outs[allOptions[i].key] = $store;
    })
    return outs
})

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

// queryStringWithoutLocalOpts ---------------------------------
// this store specifically filters out all the options that have
// onlyLocal = true. Those particular options are not meaningful
// for the caching process (for instance, date ranges) since for 
// options where onlyLocal = true we further in-client.

export const queryStringWithoutLocalOpts = derived(allStores, (stores) => {
    const outs = stores
        .map(toQueryStringParts)
        .filter((_, i) => !allOptions[i].onlyLocal)
    return outs.join('&')
})

// isNotDefaultQueryset is a simple flag that is true if the user
// has at least one selector value != the default.
// This is used primarily in App.svelte, where we have a button
// appear that allows you to resetQuery (see below) if true.
export const isNotDefaultQueryset = derived(allStores, stores => {
    return !stores.every(($store, i) => {
        const opt = allOptions[i];
        if (opt.type === 'multi') return $store.length === 0
        else if (opt.type === 'date') return $store === ''
        else return $store === opt.values.filter(v=>!(v.itemType))[0].key
    })
})

export const setDateRange = (startVal, endVal) => {
    rawStart.set(startVal);
    rawEnd.set(endVal);
    //start.set(startVal);
    //end.set(endVal);
}

// resetQuery resets all of the stores associated with the parameters
// to their default values.
export const resetQuery = () => {
    allStores.forEach((store, i) => {
        const opt = allOptions[i]
        if (opt.type === 'multi') store.set([])
        else if (opt.type === 'date') store.set('')
        else store.set(opt.values.filter(v=>!(v.itemType))[0].key);
    })
    // these are specifically for the datepicker object.
    rawStart.set('');
    rawEnd.set('');
    disabledDimensions.set([]);
}

export default queryString