<script>
  import { onMount } from "svelte";
  import { scaleBand, scaleLinear } from "d3";
  import { visible } from "../../lib/dataStore.js";

  import Bar from "../subcomponents/Bar.svelte";
  import XAxis from "../subcomponents/XAxis.svelte";
  import YAxis from "../subcomponents/YAxis.svelte";
  import Tooltip from "../subcomponents/Tooltip.svelte";

  export let data = [];
  export let margin = { top: 20, right: 30, bottom: 40, left: 50 };
  export let tickFormat = (d) => d;

  let container;
  let width = 0;
  let height = 0;
  let showBars = false;

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
    delay: 0.2,
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
  <svg {width} {height} viewBox={`0 0 ${width} ${height}`} on:mouseleave={() => visible.set(false)}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <!-- Render the reusable Y-axis with gridlines -->
      <YAxis {yScale} {innerWidth} showGridlines={false} />

      {#if showBars}
        <!-- Render Bars -->
        {#each barData as bar, i (i + "-" + innerWidth + "-" + innerHeight)}
          <Bar
            xPos={bar.xPos}
            yPos={bar.yPos}
            barWidth={bar.barWidth}
            barHeight={bar.barHeight}
            delay={i * 0.2}
            value={data[i].value}
            index={i}
            rounded={true}
            innerHeight={innerHeight}
          ></Bar>
        {/each}
      {/if}
      <!-- Render the reusable X-axis -->
      <XAxis {xScale} {innerHeight} {tickFormat} />
    </g>
  </svg>
  {#if $visible}
    <Tooltip {margin} />
  {/if}
</div>

<style>
  .chart-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  svg {
    display: block;
  }
</style>
