import { writable, derived } from 'svelte/store'
import queryString, { queryStringWithoutDates, queryParameters } from './query'
import options from './options.json'

const start = options.startOptions.setter;
const end = options.endOptions.setter;

import {fetchExploreData} from './fetchData'

const cacheObj = writable({})

// this store value will tell you if the query is cached.
export const queryIsCached = derived([queryString, queryStringWithoutDates, cacheObj], ([_, $q, $cacheObj]) => {
    // this requires looking at the entire queryString to see if anything has changed,
    // though we will by default want to only use queryStringWithoutDates for the cache check.
    // hence the _.
    if (!($q in $cacheObj)) return false;
    else return true;
})

const dataset = derived([cacheObj, queryIsCached, queryStringWithoutDates, queryParameters, start, end], async ([$cacheObj, $isCached, $q, $qp, $start, $end]) => {
    if (!$isCached) {
        if ($qp.mode === 'explore') {
            $cacheObj[$q] = await fetchExploreData($qp);
        } else {
            $cacheObj[$q] = 'coming soon.'
        }
        
    }
    // local filters:
    let data = $cacheObj[$q]
        .filter(d => { // BY DATE
        return ($start !== '' ? d.date >= new Date($start ): true) && ($end !== '' ? d.date <= new Date($end) : true)
    })

    return data
})

export default dataset