import { writable, derived } from 'svelte/store'
import queryString, { queryParameters } from './query'

import {fetchExploreData} from './fetchData'

const cacheObj = writable({})

// this store value will tell you if the query is cached.
export const queryIsCached = derived([queryString, cacheObj], ([$q, $cacheObj]) => {
    if (!($q in $cacheObj)) return false;
    else return true;
})

const dataset = derived([cacheObj, queryIsCached, queryString, queryParameters], async ([$cacheObj, $isCached, $q, $qp]) => {
    // this block is where we should do the fetch request! So easy.
    if (!$isCached) {
        $cacheObj[$q] = await fetchExploreData($qp);
    } 
    return $cacheObj[$q]
})

export default dataset