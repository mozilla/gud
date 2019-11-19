import { writable, derived } from "svelte/store";
import { createListStore, createMultiselectStore } from "./list-store-creator";
import optionSet from "./options.json";
const modeOptions = optionSet.modeOptions;

const menuOptions = Object.keys(optionSet)
  .filter(k => optionSet[k].inMenu)
  .map(k => optionSet[k]);

const allOptions = [optionSet.modeOptions, , ...menuOptions];
const rawStart = writable("");
const rawEnd = writable("");

const params = new URLSearchParams(window.location.search);
let initialDisabledDimensions = [];
allOptions.forEach(opt => {
  let queryValue;
  if (opt.itemType === "divider") {
  } else if (opt.type === "multi") {
    queryValue = params.get(opt.key) || "[]";
    opt.setter = createMultiselectStore(opt.values)(JSON.parse(queryValue));
  } else {
    queryValue = params.get(opt.key) || undefined;
    if (opt.type === "date") {
      if (opt.label === "Start") rawStart.set(queryValue || "");
      if (opt.label === "End") rawEnd.set(queryValue || "");

      opt.setter = writable(queryValue || "");
    } else {
      opt.setter = createListStore(opt.values)(queryValue);
    }
  }
  // if the default usage criteria has disabled dimensions, make sure to
  // set the initialDisabledDimensions
  if (opt.key === "usage") {
    const selected = opt.values.find(v => v.key === queryValue);
    if (selected.disabledDimensions) {
      initialDisabledDimensions = [...selected.disabledDimensions];
    }
  }
});

// get current value to set any disabled dimensions before going on your merry way.
const disabledDimensions = writable(initialDisabledDimensions);

const mode = modeOptions.setter;

const allStores = allOptions.map(option => option.setter);

const modeIsImplemented = derived(mode, $mode => {
  // check if mode is same.
  return ["explore"].includes($mode);
});

// writables for handling raw inputs on date selector.
// if we deprecate DatePicker.svelte, these can leave.
// until then, it's nice to have these store values
// so we can reset these as needed.

export {
  allOptions,
  menuOptions,
  allStores,
  mode,
  modeOptions,
  modeIsImplemented,
  rawStart,
  rawEnd,
  disabledDimensions
};
