import {writable, derived} from 'svelte/store'
import {createListStore, createMultiselectStore} from './list-store-creator'
import optionSet from './options.json'
const modeOptions = optionSet.modeOptions

const menuOptions = [
    optionSet.usageCriteriaOptions,
    optionSet.platformOptions,
    optionSet.countryOptions,
    optionSet.channelOptions,
    optionSet.startOptions,
    optionSet.endOptions
]

const allOptions =   [
    optionSet.modeOptions, 
    , ...menuOptions
]

const params = new URLSearchParams(window.location.search);

allOptions.forEach(opt => {
    if (opt.type === 'multi') {
        const queryValue = params.get(opt.key) || '[]';
        opt.setter = createMultiselectStore(opt.values)(JSON.parse(queryValue))
    }
    else {
        const queryValue = params.get(opt.key) || undefined;
        if (opt.type === 'date') opt.setter = writable(queryValue || '')
        else opt.setter = createListStore(opt.values)(queryValue);
    }
})

const mode = modeOptions.setter;

const allStores = allOptions.map(option => option.setter)

const modeIsImplemented = derived(mode, ($mode) => {
    // check if mode is same.
    return ['explore'].includes($mode)
})

export {
    allOptions,
    menuOptions,
    allStores,
    mode, modeOptions,
    modeIsImplemented
}