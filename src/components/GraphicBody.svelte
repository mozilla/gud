<script>
  import { fly } from "svelte/transition";
  import { timeFormat } from "d3-time-format";
  import LineChartWithCI from "./LineChartWithCI.svelte";
  import { storeToQuery, removeLocalParams } from "../stores/cache";
  import optionSet from "../stores/options.json";
  import { store, modeIsImplemented } from "../stores/store";
  import { majorReleases, showProductDetails } from "../stores/productDetails";

  import AnnotationsAndRemarks from "./AnnotationsAndRemarks.svelte";

  // these are the markers.

  export let data;
  export let title;

  let outdata;

  const formatKeyString = timeFormat("%Y-%m-%d");
  let showProductMarkers = true;

  const getMetricInformation = m => {
    return optionSet.metricOptions.values.find(v => v.key === m);
  };

  const TWO_WEEKS_AGO = new Date();
  TWO_WEEKS_AGO.setDate(TWO_WEEKS_AGO.getDate() - 15);

  function carveData(rawData, visibleMetrics) {
    let disabledMetrics =
      optionSet.usageCriteriaOptions.values.find(v => v.key === $store.usage)
        .disabledMetrics || [];
    let metrics = Object.keys(rawData[0])
      .filter(m => {
        return (
          !m.includes("_low") && !m.includes("_high") && !m.includes("date")
        );
      })
      .filter(m => {
        // take out everything not in the $metricsSet, or default to all if $store.metric === 'all'
        if (visibleMetrics === "all") return true;
        return visibleMetrics === m;
      })
      .filter(m => {
        return !disabledMetrics.includes(m);
      });
    outdata = metrics.map(m => {
      const metricInfo = getMetricInformation(m);

      return {
        metric: m,
        title: metricInfo.label,
        rolloverLabel: metricInfo.short,
        shortDescription: metricInfo.shortDescription,
        whatKind: metricInfo.needsExplanation ? metricInfo.shortsub : undefined,
        format: metricInfo.format,
        activeUsersYMax:
          $store.metric === "all" && ["dau", "wau", "mau"].includes(m)
            ? $store.activeUsersYMax
            : metricInfo.activeUsersYMax,
        yMin: 0,
        key: metricInfo.key,
        data: rawData.map(d => {
          const di = { date: d.date };
          di.value = d[m];
          di.lower = Math.max(d[`${m}_low`], 0);
          di.upper = d[`${m}_high`];
          di.key = formatKeyString(di.date);
          return di;
        })
      };
    });
    return outdata;
  }

  $: outdata = carveData(data, $store.metric);

  let showProductDetailsValue;
  showProductDetails.subscribe(v => {
    showProductDetailsValue = v;
  });

  let majorReleasesValue;
  majorReleases.subscribe(v => {
    majorReleasesValue = v;
  });
</script>

<div class="graphic-body">
  {#if $modeIsImplemented}
    <!-- <h2 class=graphic-body-header>
            {title}
        </h2> -->
    <div
      class:all-graphics={$store.metric === 'all'}
      class:one-graphic={$store.metric !== 'all'}>
      <!-- changing the ID to include all of the relevant local-but-requires-redraw
                seems like a hack, but it does work pretty elegantly.
             -->
      {#each outdata as dataset, i (dataset.title + $store.metric + storeToQuery(removeLocalParams($store)))}
        <LineChartWithCI
          size={$store.metric === 'all' ? 'small' : 'large'}
          title={dataset.title}
          whatKind={dataset.whatKind}
          shortDescription={dataset.shortDescription}
          rolloverLabel={dataset.rolloverLabel}
          yType={dataset.format}
          data={dataset.data}
          splitCriterion={dataset.key.includes('retention') ? d => {
                return d.date >= TWO_WEEKS_AGO;
              } : false}
          markers={showProductDetailsValue ? majorReleasesValue : []}
          filterMarkerCallback={(release, graphXMin, graphXMax) => {
            const size = $store.metric === 'all' ? 'small' : 'large';
            const ONE_YEAR = 1000 * 60 * 60 * 24 * (365 * (size === 'large' ? 2 : 1));
            const onlyEveryFive = graphXMax - graphXMin >= ONE_YEAR ? parseInt(release.version) % 5 === 0 : true;
            return onlyEveryFive && release.date >= graphXMin && release.date <= graphXMax;
          }}
          xMin={$store.startDate}
          xMax={$store.endDate}
          yMin={dataset.yMin}
          activeUsersYMax={dataset.activeUsersYMax}
          yRangeGroup={$store.metric === 'all' ? dataset.yRangeGroup : undefined}
          onDragFinish={(mouseDownStartValue, mouseDownEndValue) => {
            const firstVal = mouseDownStartValue > mouseDownEndValue ? mouseDownEndValue : mouseDownStartValue;
            const secondVal = mouseDownStartValue > mouseDownEndValue ? mouseDownStartValue : mouseDownEndValue;
            store.setDateRange(formatKeyString(firstVal), formatKeyString(secondVal));
          }} />
      {/each}
    </div>
    <!-- <AnnotationsAndRemarks /> -->
  {:else}
    <div in:fly={{ y: -30, duration: 300, delay: 250 }} class="coming-soon">
      <div>coming soon</div>
    </div>
  {/if}
</div>
