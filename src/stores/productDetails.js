import { readable, derived } from "svelte/store";

import optionSet from "./options.json";
import { store } from "./store";

const productDetails = readable(undefined, async (set) => {
  // if (!hasLoaded) {
  const request = await fetch(
    "https://product-details.mozilla.org/1.0/all.json"
  );
  const data = await request.json();
  set(data.releases);
  return () => undefined;
});

// filter
// const productDetails = derived([usage, rawProductDetails], ([$usage, $productDetails]) => {
//     const thisCriterion = optionSet.usageCriteriaOptions.values.find(opt => opt.key===$usage)
//     console.log('...', thisCriterion)
//     if (!thisCriterion || thisCriterion.markerSet !== 'productDetails') return undefined
//     return $productDetails
// })

export const showFirefoxDesktopDetails = derived(store, ($store) => {
  const thisCriterion = optionSet.usageCriteriaOptions.values.find(
    (opt) => opt.key === $store.usage
  );
  return thisCriterion && thisCriterion.markerSet === "firefoxDesktopVersions";
});

export const majorReleases = derived(productDetails, ($pd) => {
  // get $usage for optionSet.
  if ($pd === undefined) return undefined;
  return Object.entries($pd)
    .filter(([key, { category }]) => {
      return category === "major" && key.includes("firefox");
    })
    .sort(([_a, { date: ad }], [_b, { date: bd }]) => {
      if (ad > bd) return 1;
      if (ad < bd) return -1;
      return 0;
    })
    .map(([_, info]) => {
      info.str = info.date;
      info.date = new Date(info.date);
      let version = parseInt(info.version);
      if (version >= 4) version = ~~version;
      version = `${version}`;
      info.label = version;
      return info;
    })
    .filter((info) => {
      return info.str > "2016-06-01";
    });
});

export default productDetails;
