export function inArmagaddon(dt, m, isDesktop = false) {
  if (!isDesktop) return false;
  if (m === "dau") {
    return dt >= new Date("2019-05-03") && dt <= new Date("2019-05-11");
  }
  if (m === "wau") {
    return dt >= new Date("2019-05-03") && dt <= new Date("2019-05-17");
  }
  if (m === "mau") {
    return dt >= new Date("2019-05-03") && dt <= new Date("2019-06-06");
  }
  if (m === "intensity") {
    return dt >= new Date("2019-05-03") && dt <= new Date("2019-05-17");
  }
  if (m === "retention_1_week_new_profile") {
    return dt >= new Date("2019-04-13") && dt <= new Date("2019-05-17");
  }
  if (m === "retention_1_week_active_in_week_0") {
    return dt >= new Date("2019-04-13") && dt <= new Date("2019-05-17");
  }
  return false;
}
