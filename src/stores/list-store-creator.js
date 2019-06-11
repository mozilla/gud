import { writable } from 'svelte/store';

export function createMultiselectStore(list) {
    return function(startingValue=[]) {
        const { subscribe, set } = writable([...startingValue])
        return {
            subscribe,
            set: (v) => {
                //if (!list.map(l=>l.key).includes(v)) throw Error(`${v} not recognized in store`);
                set([...v]);
            },
            options: () => list
        }
    }
}

export function createListStore(list) {
    const filteredList = list.filter((l) => !(l.itemType))
    return function(startingValue=filteredList[0].key) {
        const { subscribe, set } = writable(startingValue)
        return {
            subscribe,
            set: (v) => {
                if (!filteredList.map(l=>l.key).includes(v)) throw Error(`${v} not recognized in store`);
                set(v);
            },
            options: () => filteredList
        }
    }
}