<script>
  import { tooltipPos, content, touchDevice } from "../../lib/dataStore.js";
  import { fly } from "svelte/transition";
  $: ({ x, y } = $tooltipPos);

  export let margin = {};
  let tooltipWidth;
  let tooltipHeight;

  const yNudge = 10;

  $: yPosition = $touchDevice ? margin.top + yNudge - tooltipHeight : y + margin.top + yNudge - tooltipHeight;
  $: xPosition = x + margin.left - tooltipWidth / 2;

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
    transition:
      top 300ms ease,
      left 300ms ease;
  }

  .tooltip::after {
    content: ""; /* Required for the pseudo-element */
    position: absolute;
    bottom: -6px; /* Position the arrow slightly below the tooltip */
    left: 50%; /* Center the arrow horizontally */
    transform: translateX(-50%); /* Adjust the arrow's position */
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid black; /* Matches the tooltip background */
  }

 
</style>
