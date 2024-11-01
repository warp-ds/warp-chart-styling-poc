<script>
  import { activeBar, tooltip } from "../../lib/dataStore.js";
  import { fly } from 'svelte/transition';
  $: ({ visible, x, y, content } = $tooltip);

  export let margin = {};
</script>

{#if visible}
  <div class="tooltip" style="top: {y + margin.top}px; left: {x + margin.left}px;" transition:fly={{ y: 10 }}>
    {content}
  </div>
{/if}

<style>
  .tooltip {
    position: absolute;
    padding: 4px 8px;
    background: black;
    color: white;
    border-radius: 4px;
    pointer-events: none;
    font-size: 12px;
  }
</style>
