<script>
  import "@warp-ds/elements";
  import BarChart from "./components/charts/BarChart.svelte";

  // Define the data for the bar chart
  const data = [
    { category: "A", value: 30 },
    { category: "B", value: 80 },
    { category: "C", value: 45 },
    { category: "D", value: 60 },
    { category: "E", value: 20 },
    { category: "F", value: 90 },
    { category: "G", value: 55 },
    { category: "H", value: 75 },
  ];

  // Define optional properties for the chart (e.g., size)
  let chartWidth = 800;
  let chartHeight = 400;
</script>

<main>
  <h1>Warp Design System</h1>
  <w-button variant="primary">Primary button</w-button>
  <h2>Bar Chart Example</h2>
  <div style="width: 100%; max-width: 800px; height: 400px;">
    <BarChart {data} />
  </div>

</main>

<style>
  main {
    padding: 16px;
    margin: 32px auto;
    max-width: 800px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
