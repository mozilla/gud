import { toDate } from "./date";

export function inArmagaddon(dt, m, isDesktop = false) {
  if (!isDesktop) return false;
  if (m === "dau") {
    return dt >= toDate("2019-05-03") && dt <= toDate("2019-05-11");
  }
  if (m === "wau") {
    return dt >= toDate("2019-05-03") && dt <= toDate("2019-05-17");
  }
  if (m === "mau") {
    return dt >= toDate("2019-05-03") && dt <= toDate("2019-06-06");
  }
  if (m === "intensity") {
    return dt >= toDate("2019-05-03") && dt <= toDate("2019-05-17");
  }
  if (m === "retention_1_week_new_profile") {
    return dt >= toDate("2019-04-13") && dt <= toDate("2019-05-17");
  }
  if (m === "retention_1_week_active_in_week_0") {
    return dt >= toDate("2019-04-13") && dt <= toDate("2019-05-17");
  }
  return false;
}

export function dataQualityReason(dt, m, isDesktop = false) {
  if (!isDesktop) return undefined;
  const armagaddon = inArmagaddon(dt, m);
  if (armagaddon) return "no data (Armagaddon)";
  return undefined;
}
