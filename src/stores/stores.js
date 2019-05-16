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

const menuOptions = [
    usageCriteriaOptions,
    platformOptions,
    countryOptions,
    channelOptions
]

const allOptions =   [
    modeOptions, ...menuOptions
]

const params = new URLSearchParams(window.location.search);

allOptions.forEach(opt => {
    let queryValue = params.get(opt.key) || undefined;
    opt.setter = createListStore(opt.values)(queryValue);
})

const mode = modeOptions.setter;

const allStores = allOptions.map(option => option.setter)

export {
    allOptions,
    menuOptions,
    allStores,
    mode, modeOptions
}