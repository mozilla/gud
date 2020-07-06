import produce from "immer";
import { writable, derived } from "svelte/store";
import { timeFormat } from "d3-time-format";

import options from "./options.json";

const timeFormatter = timeFormat("%Y-%m-%d");
const maxEndDate = timeFormatter(new Date());

function getUsageCriterion(usage) {
  return options.usage.values.find((v) => v.key === usage);
}

function setDisabledDimensions(draft, usage) {
  const criterion = getUsageCriterion(usage);
  if (criterion.disabledDimensions) {
    draft.disabledDimensions = criterion.disabledDimensions;
  } else {
    draft.disabledDimensions = [];
  }
}

function setDisabledMetrics(draft, usage) {
  const criterion = getUsageCriterion(usage);
  if (criterion.disabledMetrics) {
    draft.disabledMetrics = criterion.disabledMetrics;
    if (criterion.disabledMetrics.includes(draft.metric)) {
      draft.metric = "all"; // eslint-disable-line
    }
  } else {
    draft.disabledMetrics = [];
  }
}

function getDefaultState(
  { basedOnQueryParams } = { basedOnQueryParams: false }
) {
  const search = `${window.location.hash.split("?")[1]}`;
  const params = new URLSearchParams(search);
  const state = Object.values(options).reduce(
    (acc, { key: field, type, values, defaultValue, dataType }) => {
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
          if (dataType === "boolean") value = value === "true";
        } else if (defaultValue !== undefined) value = defaultValue;
        else value = values.find((l) => !l.itemType).key;
        acc[field] = value;
      }

      return acc;
    },
    {}
  );
  // set defaults for state.
  setDisabledDimensions(state, state.usage);
  setDisabledMetrics(state, state.usage);

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
        if (field === "usage") {
          setDisabledMetrics(draftState, value);
          setDisabledDimensions(draftState, value);
          draftState.startDate = draftState.minStartDate;
          draftState.endDate = draftState.maxEndDate;
        }
        draftState[field] = value;
      })
    );
  },
  // FIXME: simplify this!
  setDateRange(startDate, endDate) {
    internalStore.update(
      produce((draftState) => {
        draftState.startDate = startDate;
        draftState.endDate = endDate;
        draftState.brushTransitioning = true;
      })
    );
    setTimeout(() => {
      internalStore.update(
        produce((draftState) => {
          draftState.brushTransitioning = false;
        })
      );
    }, 300);
  },
  resetDateRange() {
    internalStore.update(
      produce((draftState) => {
        draftState.startDate = draftState.minStartDate;
        draftState.endDate = draftState.maxEndDate;
        draftState.brushTransitioning = true;
      })
    );
    setTimeout(() => {
      internalStore.update(
        produce((draftState) => {
          draftState.brushTransitioning = false;
        })
      );
    }, 300);
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
