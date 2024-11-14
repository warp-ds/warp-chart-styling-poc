<script>
  import { onMount } from "svelte";
  import "@warp-ds/elements";
  import BarChart from "./components/charts/BarChart.svelte";

  let data = [
    { category: "A", value: Math.floor(Math.random() * 95) },
    { category: "B", value: Math.floor(Math.random() * 95) },
    { category: "C", value: Math.floor(Math.random() * 95) },
    { category: "D", value: Math.floor(Math.random() * 95) },
    { category: "E", value: Math.floor(Math.random() * 95) },
    { category: "F", value: Math.floor(Math.random() * 95) },
    { category: "G", value: Math.floor(Math.random() * 95) },
    { category: "H", value: Math.floor(Math.random() * 95) },
  ];

  let selectedBrand = "Finn";
  let fontKey = 0;
  let dataKey = 0;
  $: combinedKey = `${fontKey}-${dataKey}`;

  let showGridlines = false;

  function newData() {
    const numCategories = Math.floor(Math.random() * 18) + 3;
    data = Array.from({ length: numCategories }, (_, i) => ({
      category: String.fromCharCode(65 + i),
      value: Math.floor(Math.random() * 95),
    }));
    dataKey += 1;
  }

  function handleSelectChange(event) {
    console.log("Select change:", event.detail.value);
  }

  async function switchBrand(brand) {
    console.log("Switching brand to:", brand);
    selectedBrand = brand;

    const brandUrls = {
      FINN: {
        fonts: "https://assets.finn.no/pkg/@warp-ds/fonts/v1/finn-no.css",
        tokens: "https://assets.finn.no/pkg/@warp-ds/css/v2/tokens/finn-no.css",
      },
      Tori: {
        fonts: "https://assets.finn.no/pkg/@warp-ds/fonts/v1/tori-fi.css",
        tokens: "https://assets.finn.no/pkg/@warp-ds/css/v2/tokens/tori-fi.css",
      },
      DBA: {
        fonts: "https://assets.finn.no/pkg/@warp-ds/fonts/v1/dba-dk.css",
        tokens: "https://assets.finn.no/pkg/@warp-ds/css/v2/tokens/dba-dk.css",
      },
    };

    if (brandUrls[brand]) {
      document.getElementById("brand-fonts").href = brandUrls[brand].fonts + `?t=${new Date().getTime()}`;
      document.getElementById("brand-tokens").href = brandUrls[brand].tokens + `?t=${new Date().getTime()}`;
    } else {
      console.error("Brand not found:", brand);
    }

    setTimeout(() => {
      fontKey += 1; // force re-render after font is loaded
    }, 1000);
  }
</script>

<main>
  <div class="flex gap-16">
    <!-- <w-select label="Brand" on:select-change={handleSelectChange}>
      <option value='FINN' selected>FINN</option>
      <option value='Tori'>Tori</option>
      <option value='DBA'>DBA</option>
      </w-select> -->
    <w-button type="button" variant="secondary" on:click={() => switchBrand("FINN")}>FINN</w-button>
    <w-button type="button" variant="secondary" on:click={() => switchBrand("Tori")}>Tori</w-button>
    <w-button type="button" variant="secondary" on:click={() => switchBrand("DBA")}>DBA</w-button>
  </div>

  <div class="s-bg-primary flex px-16 pt-8 mb-16 rounded">
    <h2 class="s-text-inverted-static">Brand: {selectedBrand}</h2>
  </div>

  <div class="flex gap-16 mb-16">
    <w-button variant="secondary" on:click={() => (showGridlines = !showGridlines)}>
      {showGridlines ? "Hide gridlines" : "Show gridlines"}
    </w-button>
    <w-button variant="secondary" on:click={() => newData()}>Random data</w-button>
  </div>

  <h2>Bar Chart Example</h2>
  <div style="width: 100%; max-width: 800px; height: 350px;">
    {#key combinedKey}
      <BarChart {data} {showGridlines} />
    {/key}
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
