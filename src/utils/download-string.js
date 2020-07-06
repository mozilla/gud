import { csvFormat } from "d3-dsv";
import { storeToQuery } from "../stores/cache";
import smooth from "./smoothing";
import { toDate } from "./date";
import CONFIG from "../stores/options.json";

export default function downloadString(text, fileType = "text", fileName) {
  const blob = new Blob([text], { type: fileType });
  const a = document.createElement("a");
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
  }, 1500);
}

export function exportData(dataset, store) {
  const storeValue = { ...store };
  delete storeValue.graphSize;
  delete storeValue.commonScales;
  delete storeValue.mode;
  let filename = storeToQuery(storeValue);
  filename = `${filename.replaceAll("&", "__").replaceAll("%20", "-")}.csv`;
  let exported = dataset.map((di) => ({ ...di }));
  // if $store.smoothing, we will need to make sure to smooth all the columns that matter.
  if (storeValue.smoothing) {
    const metrics =
      storeValue.metric === "all"
        ? CONFIG.metric.values
            .filter((v) => v.key !== "all" && v.itemType !== "divider")
            .map((v) => v.key)
        : [storeValue.metric];
    metrics.forEach((m) => {
      const smoothed = smooth(exported, m);
      smoothed.forEach((sm, i) => {
        exported[i] = { ...exported[i], ...sm };
      });
    });
  }
  // Filter data outside of the current date.
  const startDate = toDate(storeValue.startDate);
  const endDate = toDate(storeValue.endDate);
  exported = exported.filter((di) => {
    return di.date >= startDate && di.date <= endDate;
  });
  // get rid of metrics that are enot there
  if (storeValue.metric !== "all") {
    const m = storeValue.metric;

    exported = exported.map((e) => {
      return {
        [m]: e[m],
        [`${m}_low`]: e[`${m}_low`],
        [`${m}_high`]: e[`${m}_high`],
        date: e.date,
      };
    });
  }
  exported.forEach((e) => {
    e.date = e.date.toISOString().slice(0, 10);
  });
  exported = csvFormat(exported);
  downloadString(exported, "text", filename);
}
