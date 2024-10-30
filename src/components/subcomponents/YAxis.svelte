<script>

  import { select, axisLeft } from "d3";
  import dvColors from "../../colors/dv_colors_light.json";

  export let yScale;
  export let innerWidth; // The width of the chart area (used for gridlines)
  export let showGridlines = false; // Whether to show gridlines

  let yAxisGroup;

  $: if (yAxisGroup) {
  // Retrieve font-family from CSS
  const fontFamily = getComputedStyle(document.body).getPropertyValue('--w-font-family').trim();

const yAxis = axisLeft(yScale);

select(yAxisGroup).call(yAxis);

// Style vertical line. Hide it
select(yAxisGroup)
  .select(".domain")
  .attr("stroke", "none");

// Style tick marks (if no gridlines)
select(yAxisGroup)
  .selectAll(".tick line")
  .attr("x2", 2)
  .attr("stroke", dvColors.chartLine.default)
  .attr("stroke-linecap", "round")
  .attr("stroke-width", 2);

// Optionally render gridlines
if (showGridlines) {
  select(yAxisGroup)
    .selectAll(".tick line")
    .attr("x2", innerWidth) // Extend lines across the width of the chart
    .attr("stroke", dvColors.chartLine.subtle)
    .attr("stroke-width", "2")
    .attr("stroke-linecap", "round")
    .attr("stroke-dasharray", "4 6");
}

// Style the tick labels
select(yAxisGroup)
  .selectAll("text")
  .attr("font-family", fontFamily)
  .attr("font-size", "16px")
  .attr("fill", dvColors.chartText.subtle)
  .style("text-anchor", "right");
    
  }

</script>

<g bind:this={yAxisGroup}></g>

