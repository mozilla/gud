import { derived } from 'svelte/store'
import createListStore from './list-store-creator'

const modeOptions = {
    label: 'Mode',
    key: 'mode',
    values: [
    { label: 'Explore', key: 'explore' }, 
    { label: 'Compare', key: 'compare' }, 
    { label: 'Table', key: 'table' }
]}

const usageCriteriaOptions = {
    label: 'Usage Criteria',
    key: 'usageCriteria',
    values: [
    {   
        label:'Any Desktop Activity',
        key: 'any-desktop',
        description: 'sodnfosfidosfndiosnfodifnsodifnsdoifn'
    }, 
    {
        label: 'Any Fennec Activity',
        key: 'any-fennec',
        description: 'sodnfosfidosfndiosnfodifnsodifnsdoifn'
    },
    { 
        label: 'FxA Active',
        key: 'fxa-active',
        description: 'sodnfosfidosfndiosnfodifnsodifnsdoifn'
    },
]}

const platformOptions = {
    label: 'Platform',
    key: 'platform',
    values: [
    {label: "All", key: 'all'},
    {label: "Windows", key: 'win'},
    {label: "Mac", key: 'mac'},
    {label: "Linux", key: 'linux'},
]}

const countryOptions = {
    label: 'Country',
    key: 'country',
    values: [
        {label: "All", key: 'all'},

        {label: "United States", key: 'US'},
        {label: "Germany", key: 'DE'},
        {label: "Great Britain", key: 'GB'},
        {label: "France", key: 'FR'},
        {label: "Brazil", key: 'BR'},
        {label: "Russia", key: 'RU'},

        {label: "Poland", key: 'PL'},
        {label: "China", key: 'CN'},
        {label: "India", key: 'IN'},
        {label: "Italy", key: 'IT'},
        {label: "Canada", key: 'CA'},

        {label: "Spain", key: 'ES'},
        {label: "Indonesia", key: 'ID'},
    ]
}
const channelOptions = {
    label: "Channel",
    key: 'channel',
    values: [
    {label: 'Release', key: 'release'},
    {label: 'Beta', key: 'beta'},
    {label: 'Nighty', key: 'nightly'},
]}



const mode =  createListStore(modeOptions.values)()
const usageCriteria = createListStore(usageCriteriaOptions.values)()
const platform = createListStore(platformOptions.values)()
const country = createListStore(countryOptions.values)()
const channel = createListStore(channelOptions.values)()

modeOptions.setter = mode;
usageCriteriaOptions.setter = usageCriteria;
platformOptions.setter = platform;
countryOptions.setter = country;
channelOptions.setter = channel;

const allOptions = [
    [mode, modeOptions], 
    [usageCriteria, usageCriteriaOptions],
    [platform, platformOptions],
    [country, countryOptions],
    [channel, channelOptions]
]

const optionSet = allOptions.map(([_,o]) => o)

const allStores = [mode, usageCriteria, platform, country, channel];

export {
    optionSet,
    allOptions,
    allStores,
    modeOptions, usageCriteriaOptions, platformOptions, countryOptions, channelOptions,
    mode, usageCriteria, platform, country, channel
}