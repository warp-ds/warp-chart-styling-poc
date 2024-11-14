<script>
  import { onMount } from "svelte";
  import { scaleBand, scaleLinear } from "d3";
  import { tooltipVisible, activeBar, touchDevice, forcedReduceMotion } from "../../lib/dataStore.js";

  let currentActiveBar;
  activeBar.subscribe((value) => {
    currentActiveBar = value;
    console.log("Other component activeBar updated:", currentActiveBar);
  });

  import Bar from "../subcomponents/Bar.svelte";
  import XAxis from "../subcomponents/XAxis.svelte";
  import YAxis from "../subcomponents/YAxis.svelte";
  import Tooltip from "../subcomponents/Tooltip.svelte";

  export let data = [];
  export let margin = { top: 20, right: 30, bottom: 40, left: 50 };
  export let tickFormat = (d) => d;
  export let showGridlines = false;

  let container;
  let width = 0;
  let height = 0;
  let showBars = false;
  let borderWidth = 2;

// Test in one of your components:
setTimeout(() => {
  activeBar.set(2); // Set to a test value
  console.log("Manually setting activeBar to 2");
}, 2000);
  
  $: innerWidth = Math.max(0, width - margin.left - margin.right);
  $: innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Scales
  $: xScale = scaleBand()
    .domain(data.map((d) => d.category))
    .range([0, innerWidth]);

  $: yScale = scaleLinear()
    .domain([0, Math.max(...data.map((d) => d.value)) * 1.05])
    .nice()
    .range([innerHeight, 0]);

  // Create a reactive array of bar positions and sizes
  $: barData = data.map((d, i) => ({
    xPos: xScale(d.category),
    yPos: yScale(d.value),
    barWidth: xScale.bandwidth(),
    barHeight: innerHeight - yScale(d.value),
    delay: 0.1,
  }));

  // Use ResizeObserver to detect changes in the container size
  onMount(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Update width and height based on the container's size
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
    });

    // Observe the container div
    resizeObserver.observe(container);

    // Delay to show the bars
    setTimeout(() => {
      showBars = true;
    }, 200);

    // Cleanup observer on unmount
    return () => resizeObserver.disconnect();
  });
</script>

<div class="chart-container" bind:this={container}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <svg {width} {height} viewBox={`0 0 ${width} ${height}`} on:mouseleave={() => tooltipVisible.set(false)}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <!-- Render the reusable Y-axis with gridlines -->
      <YAxis {yScale} {innerWidth} {showGridlines} />

      {#if showBars}
        <!-- Render Bars -->
        {#each barData as bar, i (i + "-" + innerWidth + "-" + innerHeight)}
          <Bar
            xPos={bar.xPos}
            yPos={bar.yPos - borderWidth/2}
            barWidth={bar.barWidth}
            barHeight={bar.barHeight + borderWidth/2}
            delay={$forcedReduceMotion ? 0 : i * 0.1}
            value={data[i].value}
            index={i}
            rounded={true}
            {borderWidth}
            {innerHeight}
          ></Bar>
        {/each}
      {/if}
      <!-- Render the reusable X-axis -->
      <XAxis {xScale} {innerHeight} {tickFormat} />
    </g>
  </svg>
  {#if $tooltipVisible}
    <Tooltip {margin} />
  {/if}
</div>
<!-- <p>Active bar: {currentActiveBar}</p>
<p>Touch device: {$touchDevice} </p> -->

<style>
  .chart-container {
    font-size: inherit;
    font-family: inherit;
    color: inherit;
    position: relative;
    width: 100%;
    height: 100%;
  }

  svg {
    display: block;
  }
</style>
