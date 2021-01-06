import { readable, derived } from "svelte/store";

export const productDetails = fetch(
  "https://product-details.mozilla.org/1.0/all.json"
)
  .then((r) => r.json())
  .then((data) => data.releases);

export const firefoxReleases = productDetails.then(($pd) => {
  const releases = Object.entries($pd)
    .filter(
      ([key, { category }]) => category === "major" && key.includes("firefox")
    )
    .sort(([_a, { date: ad }], [_b, { date: bd }]) => {
      if (ad > bd) return 1;
      if (ad < bd) return -1;
      return 0;
    })
    .map(([_, i]) => {
      const info = { ...i };
      info.str = info.date;
      info.date = new Date(info.date);
      let version = parseInt(info.version, 10);
      if (version >= 4) version = ~~version; // eslint-disable-line
      info.label = version;
      return info;
    })
    .filter((info) => info.str > "2016-06-01");
  return releases;
});

export const firefoxVersionMarkers = firefoxReleases.then(($releases) => {
  return $releases.map((r) => ({ label: r.label, date: r.date }));
});
