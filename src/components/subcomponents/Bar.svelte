<script>
  import dvColors from "../../colors/dv_colors_light.json";
  import { activeBar, tooltip } from "../../lib/dataStore.js";

  export let index; // Unique index for each bar
  export let value; // Value to display in tooltip
  export let barWidth = 32;
  export let barHeight = 0;
  export let xPos = 0;
  export let yPos = 0;
  export let barFill = dvColors.dataFill.primary.default;
  export let rounded = true;
  export let delay = 0;
 
  // Animation
  let startSize = 0.7;

  const cornerRadius = 4;

  // 50% height path for the animation start
  $: pathDataAnimationStart = `M ${xPos} ${yPos + barHeight} 
                 V ${yPos + barHeight - startSize * barHeight + cornerRadius} 
                 Q ${xPos} ${yPos + barHeight - startSize * barHeight} ${xPos + cornerRadius} ${yPos + barHeight - startSize * barHeight} 
                 H ${xPos + barWidth - cornerRadius} 
                 Q ${xPos + barWidth} ${yPos + barHeight - startSize * barHeight} ${xPos + barWidth} ${yPos + barHeight - startSize * barHeight + cornerRadius} 
                 V ${yPos + barHeight} 
                 H ${xPos} Z`;

  // Compute the path string for the bar shape with rounded top corners
  $: pathData = `M ${xPos} ${yPos + barHeight} 
                 V ${yPos + cornerRadius} 
                 Q ${xPos} ${yPos} ${xPos + cornerRadius} ${yPos} 
                 H ${xPos + barWidth - cornerRadius} 
                 Q ${xPos + barWidth} ${yPos} ${xPos + barWidth} ${yPos + cornerRadius} 
                 V ${yPos + barHeight} 
                 H ${xPos} Z`;

  function showTooltip(event) {
    activeBar.set(index); // Set the active bar
    tooltip.set({
      visible: true,
      x: xPos,
      y: yPos - 20,
      content: `Value: ${value}`,
    });
    console.log("showTooltip:", index, value);
  }

  function hideTooltip() {
    activeBar.set(null); // Clear the active bar
    tooltip.set({ visible: false, content: "" });
    console.log("hideTooltip:");
  }

  function handleFocus(event) {
    activeBar.set(index); // Set the active bar for keyboard focus
    tooltip.set({
      visible: true,
      x: xPos + barWidth,
      y: yPos - 20,
      content: `Value: ${value}`,
    });
    console.log("handleFocus:", index, value);
  }

  function handleBlur() {
    hideTooltip(); // Hide tooltip on blur
    console.log("handleBlur");
  }
  
</script>

<g role="button"
  tabindex="0" 
  on:mouseenter={showTooltip} 
  on:mouseleave={hideTooltip} 
  on:focus={handleFocus} 
  on:blur={handleBlur}>
  {#if rounded}
    <path d={pathData} fill={barFill} style="--animation-delay: {delay}s;">
      <animate attributeName="d" from={pathDataAnimationStart} to={pathData} dur="1s" fill={$activeBar === index ? "steelblue" : "yellow"} begin="{delay}s" />
    </path>
  {:else}
    <rect
      x={xPos}
      y={yPos}
      width={barWidth}
      height={barHeight}
      fill={barFill}
      style="--animation-delay: {delay}s;"
    ></rect>
  {/if}
</g>

<style>
  path,
  rect {
    animation: fadeIn 0.5s ease-out forwards;
    opacity: 0;
    animation-delay: var(--animation-delay);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    path,
    rect {
      animation: none; /* Disable animations */
    }
  }
</style>
