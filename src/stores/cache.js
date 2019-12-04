import produce from "immer";
import { derived, get } from "svelte/store";
import { timeFormat } from "d3-time-format";

import options from "./options.json";
import { fetchExploreData } from "./fetchData";
import { store } from "./store";

const cacheObj = {};

export const removeLocalParams = obj => {
  const toRemove = Object.keys(obj).filter(f => {
    return Object.keys(options)
      .filter(opt => options[opt].onlyLocal)
      .map(opt => options[opt].key)
      .includes(f);
  });

  return produce(obj, draft => {
    toRemove.forEach(r => {
      delete draft[r];
    });
    delete draft.disabledDimensions;
  });
};

function toQueryStringParts(key, val) {
  const opt = Object.values(options).find(o => o.key === key);
  if (opt.type === "multi") {
    return `${opt.key}=${encodeURIComponent(JSON.stringify([...val].sort()))}`;
  }
  return `${opt.key}=${encodeURIComponent(val)}`;
}

export const storeToQuery = $store => {
  return Object.entries($store)
    .filter(
      ([key]) =>
        ![
          "activeUsersYMax",
          "minStartDate",
          "maxEndDate",
          "disabledDimensions"
        ].includes(key)
    )
    .map(([key, val]) => {
      return toQueryStringParts(key, val);
    })
    .join("&");
};

function setRanges(data) {
  const $store = get(store);
  const timeFormatter = timeFormat("%Y-%m-%d");
  const earliestDateInData = timeFormatter(data[0].date);

  // Avoid infinite loop
  if (!$store.minStartDate || $store.minStartDate !== earliestDateInData) {
    store.setField("minStartDate", earliestDateInData);

    // Don't overwrite the startDate if it's set in a query parameter
    if (!$store.startDate) {
      store.setField("startDate", earliestDateInData);
    }
  }

  const activeUsersYMax = Math.max(
    ...data.flatMap(({ dau_high, wau_high, mau_high }) => [
      dau_high,
      wau_high,
      mau_high
    ])
  );

  // Avoid infinite loop
  if (
    !get(store).activeUsersYMax ||
    get(store).activeUsersYMax !== activeUsersYMax
  ) {
    store.setField("activeUsersYMax", activeUsersYMax);
  }

  return data;
}

const cachedRequest = derived(store, $store => {
  const queryParams = removeLocalParams($store);
  const q = storeToQuery(queryParams);

  if ($store.mode !== "explore") return undefined;
  if (!(q in cacheObj)) {
    cacheObj[q] = fetchExploreData(queryParams, q);
  }
  return cacheObj[q].then(setRanges);
});

export default cachedRequest;
