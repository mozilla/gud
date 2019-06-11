import {writable, derived} from 'svelte/store'
import {createListStore, createMultiselectStore} from './list-store-creator'
import optionSet from './options.json'
const modeOptions = optionSet.modeOptions

const menuOptions = Object.keys(optionSet).filter(k => optionSet[k].inMenu).map(k => optionSet[k])

const allOptions =   [
    optionSet.modeOptions, 
    , ...menuOptions
]

const params = new URLSearchParams(window.location.search);

allOptions.forEach(opt => {
    if (opt.itemType === 'divider') {
    } else if (opt.type === 'multi') {
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

// writables for handling raw inputs on date selector.
// if we deprecate DatePicker.svelte, these can leave.
// until then, it's nice to have these store values
// so we can reset these as needed.
const rawStart = writable('')
const rawEnd = writable('')

export {
    allOptions,
    menuOptions,
    allStores,
    mode, modeOptions,
    modeIsImplemented,
    rawStart,
    rawEnd
}