function mean(array) {
  return array.reduce((a, b) => a + b, 0) / array.length;
}

export default function smooth(data, key, days = 7) {
  const hi = `${key}High`;
  const lo = `${key}Low`;
  const series = data.map((di) => ({
    date: di.date,
    [key]: di[key],
    [lo]: di[lo],
    [hi]: di[hi],
  }));
  const l = data.length - 1;
  series.forEach((di, i) => {
    // only smooth a date that has a value.
    if (di[key] !== undefined) {
      const w = data
        .slice(Math.max(0, i - days), i)
        .filter((di) => di[key] !== undefined);
      if (w.length) {
        const estimate7 = w.map((di) => di[key]);
        const hi7 = w.map((di) => di[hi]);
        const lo7 = w.map((di) => di[lo]);
        di[key] = mean(estimate7);
        di[hi] = mean(hi7);
        di[lo] = mean(lo7);
      }
    }
  });
  return series;
}
