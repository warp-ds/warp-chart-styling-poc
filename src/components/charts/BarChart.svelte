<script>
  import { onMount } from "svelte";
  import { scaleBand, scaleLinear } from "d3";

  import Bar from "../subcomponents/Bar.svelte";
  import XAxis from "../subcomponents/XAxis.svelte";
  import YAxis from "../subcomponents/YAxis.svelte";

  export let data = [];
  export let margin = { top: 20, right: 30, bottom: 40, left: 50 };
  export let tickFormat = (d) => d;

  let container;
  let width = 0;
  let height = 0;

  $: innerWidth = Math.max(0, width - margin.left - margin.right);
  $: innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Scales
  $: xScale = scaleBand()
    .domain(data.map((d) => d.category))
    .range([0, innerWidth])
    .padding(0.4);

  $: yScale = scaleLinear()
    .domain([0, Math.max(...data.map((d) => d.value))])
    .nice()
    .range([innerHeight, 0]);

  // Use ResizeObserver to detect changes in the container size
  onMount(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Update width and height based on the container's size
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        console.log(width, height);
      }
    });

    // Observe the container div
    resizeObserver.observe(container);

    // Cleanup observer on unmount
    return () => resizeObserver.disconnect();
  });
</script>

<div class="chart-container" bind:this={container}>
  <svg {width} {height} viewBox={`0 0 ${width} ${height}`}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <!-- Render the reusable Y-axis with gridlines -->
      <YAxis {yScale} {innerWidth} showGridlines={false} />

      <!-- Render Bars -->
      {#each data as d, i}
        <Bar
          xPos={xScale(d.category)}
          yPos={yScale(d.value)}
          barWidth={xScale.bandwidth()}
          barHeight={innerHeight - yScale(d.value)}
          delay={i * 0.1}
        ></Bar>
      {/each}

      <!-- Render the reusable X-axis -->
      <XAxis {xScale} {innerHeight} {tickFormat} />
    </g>
  </svg>
</div>

<style>
  .chart-container {
    width: 100%;
    height: 100%;
  }

  svg {
    display: block;
  }
</style>
