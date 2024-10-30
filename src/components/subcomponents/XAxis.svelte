<script>
  import { select, axisBottom } from "d3";
  import dvColors from "../../colors/dv_colors_light.json";

  export let xScale;
  export let innerHeight;
  export let tickFormat = (d) => d; // Default tick formatting

  let xAxisGroup;

  // Retrieve font-family from CSS
  $: fontFamily = getComputedStyle(document.body).getPropertyValue("--w-font-family").trim();

  $: if (xAxisGroup) {
    const xAxis = axisBottom(xScale).tickFormat(tickFormat).tickSizeOuter(0); // Remove ticks at the start and end of the axis

    select(xAxisGroup).call(xAxis);

    // Style the axis path (the horizontal line)
    select(xAxisGroup)
      .select("path")
      .attr("stroke-linecap", "round")
      .attr("stroke", dvColors.chartLine.default)
      .attr("stroke-width", 2);

    // Style the tick lines
    select(xAxisGroup)
      .selectAll("line")
      .attr("stroke", dvColors.chartLine.default)
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2);

    // Style the tick labels (numbers or text on the axis)
    select(xAxisGroup)
      .selectAll("text")
      .attr("font-family", fontFamily)
      .attr("font-size", "16px")
      .attr("fill", dvColors.chartText.subtle)
      .style("text-anchor", "middle"); // Align the rotated text
  }
</script>

<g class="axis" bind:this={xAxisGroup} transform={`translate(0,${innerHeight})`}></g>
