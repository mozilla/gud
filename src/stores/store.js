import produce from "immer";
import { writable, derived } from "svelte/store";
import { timeFormat } from "d3-time-format";

import options from "./options.json";

const timeFormatter = timeFormat("%Y-%m-%d");
const maxEndDate = timeFormatter(new Date());

function getDefaultState(
  { basedOnQueryParams } = { basedOnQueryParams: false }
) {
  const params = new URLSearchParams(window.location.search);

  const state = Object.values(options).reduce(
    (acc, { key: field, type, values }) => {
      let value;

      if (type === "divider") {
        // no-op
      } else if (type === "multi") {
        if (basedOnQueryParams && params.get(field)) {
          value = params.get(field);
        } else {
          value = "[]";
        }
        acc[field] = JSON.parse(value);
      } else if (field === "startDate") {
        if (basedOnQueryParams && params.get(field)) {
          value = params.get(field);
          acc[field] = value;
        }
      } else if (field === "endDate") {
        if (basedOnQueryParams && params.get(field)) {
          value = params.get(field);
        } else {
          value = maxEndDate;
        }
        acc[field] = value;
      } else {
        if (basedOnQueryParams && params.get(field)) {
          value = params.get(field);
        } else {
          value = values.find((l) => !l.itemType).key;
        }
        acc[field] = value;
      }

      // If the default usage criteria has disabled dimensions, record them
      if (field === "usage") {
        const selected = values.find((v) => v.key === value);
        if (selected.disabledDimensions) {
          acc.disabledDimensions = [...selected.disabledDimensions];
        } else {
          acc.disabledDimensions = [];
        }
      }

      return acc;
    },
    {}
  );
  state.mode = "explore";
  state.maxEndDate = maxEndDate;

  return state;
}

const internalStore = writable(getDefaultState({ basedOnQueryParams: true }));

export const store = {
  subscribe: internalStore.subscribe,
  setField(field, value) {
    internalStore.update(
      produce((draftState) => {
        draftState[field] = value;
      })
    );
  },
  setDateRange(startDate, endDate) {
    internalStore.update(
      produce((draftState) => {
        draftState.startDate = startDate;
        draftState.endDate = endDate;
      })
    );
  },
  resetQuery() {
    internalStore.set(getDefaultState());
  },
};

export const settingChanged = derived(store, ($store) => {
  return Object.keys($store).some((field) => {
    const option = Object.values(options).find((o) => o.key === field);
    if (!option) return false;

    if (option.type === "multi") {
      return $store[field].length !== 0;
    }
    if (field === "startDate") {
      if (!$store.minStartDate) {
        return false;
      }
      return $store.startDate !== $store.minStartDate;
    }
    if (field === "endDate") {
      return $store.endDate !== $store.maxEndDate;
    }
    return $store[field] !== option.values.filter((v) => !v.itemType)[0].key;
  });
});

export const modeIsImplemented = derived(store, ($store) => {
  return $store.mode === "explore";
});
