import {derived} from 'svelte/store'
import createListStore from './list-store-creator'
import optionSet from './options.json'
const modeOptions = optionSet.modeOptions

const menuOptions = [
    optionSet.usageCriteriaOptions,
    optionSet.platformOptions,
    optionSet.countryOptions,
    optionSet.channelOptions
]

const allOptions =   [
    optionSet.modeOptions, ...menuOptions
]

const params = new URLSearchParams(window.location.search);

allOptions.forEach(opt => {
    let queryValue = params.get(opt.key) || undefined;
    opt.setter = createListStore(opt.values)(queryValue);
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