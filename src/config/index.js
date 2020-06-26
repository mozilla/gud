import { format } from "d3-format";

const withCommas = format(",");
const count = (v) => (v !== undefined ? withCommas(Math.round(v)) : "missing");

export function graphSize(size) {
  let width;
  let height;
  if (size === "small") {
    width = 375;
    height = 250;
  } else if (size === "medium") {
    width = 550;
    height = 325;
  } else if (size === "large") {
    width = 1000;
    height = 500;
  }
  return [width, height];
}

export const metrics = [
  {
    name: "Daily Active Users",
    key: "dau",
    type: "count",
    metricClass: "actives",
    axisFormat: format("~s"),
    hoverFormat: count,
  },
  {
    name: "Weekly Active Users",
    key: "wau",
    type: "count",
    metricClass: "actives",
    axisFormat: format("~s"),
    hoverFormat: count,
  },
  {
    name: "Monthly Active Users",
    key: "mau",
    type: "count",
    metricClass: "actives",
    axisFormat: format("~s"),
    hoverFormat: count,
  },
  {
    name: "Avg. Days / Week",
    key: "intensity",
    type: "rate",
    yMax: 7,
    axisFormat: format(".1f"),
    hoverFormat: format(".2f"),
  },
  {
    name: "1-Wk. Retention (new clients)",
    key: "retention_1_week_new_profile",
    type: "percentage",
    yMax: 1,
    axisFormat: format(".0%"),
    hoverFormat: format(".2%"),
  },
  {
    name: "1-Wk. Retention ",
    key: "retention_1_week_active_in_week_0",
    type: "percentage",
    yMax: 1,
    axisFormat: format(".0%"),
    hoverFormat: format(".2%"),
  },
];
