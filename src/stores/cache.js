import { writable, derived } from 'svelte/store'
import queryString, { queryStringWithoutLocalOpts, queryParameters } from './query'
import options from './options.json'

const start = options.startOptions.setter;
const end = options.endOptions.setter;

import {fetchExploreData} from './fetchData'

const cacheObj = writable({})

// this store value will tell you if the query is cached.
export const queryIsCached = derived([queryString, queryStringWithoutLocalOpts, cacheObj], ([_, $q, $cacheObj]) => {
    // this requires looking at the entire queryString to see if anything has changed,
    // though we will by default want to only use queryStringWithoutLocalOpts for the cache check.
    // hence the _.
    if (!($q in $cacheObj)) return false;
    else return true;
})

const removeLocalParams = (obj) => {
    const toRemove = Object.keys(obj).filter(f => {
        return Object.keys(options).filter(opt => options[opt].onlyLocal).map(opt=>options[opt].key).includes(f)
    })

    toRemove.forEach(r=>delete obj[r])
}

const dataset = derived([cacheObj, queryIsCached, queryStringWithoutLocalOpts, queryParameters, start, end], async ([$cacheObj, $isCached, $q, $qp, $start, $end]) => {
    if (!$isCached) {
        // remove unusd?
        const query = Object.assign({}, $qp)
        removeLocalParams(query)
        //removeLocalParams(query)
        if ($qp.mode === 'explore') {
            $cacheObj[$q] = await fetchExploreData(query);
        } else {
            $cacheObj[$q] = 'coming soon.'
        }
    }
    // local filters:
    let data = $cacheObj[$q]
        .filter(d => { // BY DATE
        return ($start !== '' ? d.date >= new Date($start ): true) && ($end !== '' ? d.date <= new Date($end) : true)
    }).map(d => {
        return Object.assign({}, d)
    })
    //

    return data
})

export default dataset