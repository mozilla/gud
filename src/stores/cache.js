import { writable, derived } from 'svelte/store'
import queryString, { queryStringWithoutLocalOpts, queryParameters } from './query'
import options from './options.json'

const start = options.startOptions.setter;
const end = options.endOptions.setter;

import {fetchExploreData} from './fetchData'

const cacheObj = writable({})

// simply put, if $q is in the cacheObj, then return true.
export const queryIsCached = derived([queryStringWithoutLocalOpts, cacheObj], ([$q, $cacheObj]) => {
    // this requires looking at the entire queryString to see if anything has changed,
    // though we will by default want to only use queryStringWithoutLocalOpts for the cache check.
    // hence the _ - we weant this to fire when queryString changes, but we don't need it.
    // console.log('   queryIsCached', $q in $cacheObj)
    return $q in $cacheObj
})

const removeLocalParams = (obj) => {
    const toRemove = Object.keys(obj).filter(f => {
        return Object.keys(options).filter(opt => options[opt].onlyLocal).map(opt=>options[opt].key).includes(f)
    })

    toRemove.forEach(r=>delete obj[r])
}

const cachedRequest = derived([cacheObj, queryStringWithoutLocalOpts, queryParameters], ([$cacheObj, $q, $qp, ]) => {
    if ($qp.mode !== 'explore') return undefined;
    // this removes queryIsCached. Right idea? I dunno. TIme to figure that iout!
    if (!($q in $cacheObj)) {
        // save the fetch request here as a promise.
        const query = Object.assign({}, $qp)
        removeLocalParams(query)
        $cacheObj[$q] = fetchExploreData(query, $q);
    }
    // console.log('      cachedRequest')
    return $cacheObj[$q]
})

const dataset = derived([cachedRequest], async ([$data])=> {
    let response;
    try {
        response = await $data
    } catch(err) {
        console.log('yep', err)
        throw new Error(err.message)
    }
    return response
})

export default dataset