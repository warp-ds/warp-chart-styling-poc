<script>
  import { tooltipPos, content } from "../../lib/dataStore.js";
  import { fly } from "svelte/transition";
  $: ({ x, y } = $tooltipPos);

  export let margin = {};
  let tooltipWidth;
  let tooltipHeight;

  const yNudge = 10;

  $: xPosition = x + margin.left - tooltipWidth / 2;
  $: yPosition = y + margin.top + yNudge - tooltipHeight;
</script>

<div
  class="tooltip"
  style="top: {yPosition}px; left: {xPosition}px;"
  transition:fly={{ y: 5 }}
  bind:clientWidth={tooltipWidth}
  bind:clientHeight={tooltipHeight}
>
  {$content}
</div>

<style>
  .tooltip {
    position: absolute;
    padding: 4px 8px;
    background: black;
    color: white;
    border-radius: 4px;
    pointer-events: none;
    font-size: 12px;
    transition: top 300ms ease, left 300ms ease;
  }
</style>
