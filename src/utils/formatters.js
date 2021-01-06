import { format } from "d3-format";

export const percentage2d = format("+.2%");

export function percentageDifference(start, end) {
  return (end - start) / start;
}
