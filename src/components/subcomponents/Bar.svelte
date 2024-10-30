<script>
  import dvColors from "../../colors/dv_colors_light.json";

  export let barWidth = 32;
  export let barHeight = 0;
  export let xPos = 0;
  export let yPos = 0;
  export let barFill = dvColors.dataFill.primary.default;
  export let rounded = true;
  export let delay = 0;

  const cornerRadius = 3;

  // Compute the path string for the bar shape with rounded top corners
  $: pathData = `M ${xPos} ${yPos + barHeight} 
                 V ${yPos + cornerRadius} 
                 Q ${xPos} ${yPos} ${xPos + cornerRadius} ${yPos} 
                 H ${xPos + barWidth - cornerRadius} 
                 Q ${xPos + barWidth} ${yPos} ${xPos + barWidth} ${yPos + cornerRadius} 
                 V ${yPos + barHeight} 
                 H ${xPos} Z`;
</script>

{#if rounded}
  <path d={pathData} fill={barFill} style="--animation-delay: {delay}s;" />
{:else}
  <rect x={xPos} y={yPos} width={barWidth} height={barHeight} fill={barFill} style="--animation-delay: {delay}s;" />
{/if}

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  path,
  rect {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
    animation-delay: var(--animation-delay);
  }

  @media (prefers-reduced-motion: reduce) {
    path,
    rect {
      animation: none; /* Disable animations */
    }
  }
</style>
