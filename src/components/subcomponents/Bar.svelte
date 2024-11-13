<script>
  import dvColors from "../../colors/dv_colors_light.json";
  import { activeBar, tooltipPos, visible, content } from "../../lib/dataStore.js";

  export let index; // Unique index for each bar
  export let value; // Value to display in tooltip
  export let barWidth = 32;
  export let barHeight = 0;
  export let xPos = 0;
  export let yPos = 0;
  export let barFill = dvColors.dataFill.primary.default;
  export let rounded = true;
  export let delay = 0;
  export let innerHeight = 0;

  $: barPadding = 0.2 * barWidth;
  $: innerXPos = xPos + barPadding;
  $: innerBarWidth = barWidth - barPadding * 2;

  let reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  // Animation
  let startSize = 0.7;

  const cornerRadius = 4;

  // 50% height path for the animation start
  $: pathDataAnimationStart = `M ${innerXPos} ${yPos + barHeight} 
                 V ${yPos + barHeight - startSize * barHeight + cornerRadius} 
                 Q ${innerXPos} ${yPos + barHeight - startSize * barHeight} ${innerXPos + cornerRadius} ${yPos + barHeight - startSize * barHeight} 
                 H ${innerXPos + innerBarWidth - cornerRadius} 
                 Q ${innerXPos + innerBarWidth} ${yPos + barHeight - startSize * barHeight} ${innerXPos + innerBarWidth} ${yPos + barHeight - startSize * barHeight + cornerRadius} 
                 V ${yPos + barHeight} 
                 H ${innerXPos} Z`;

  // Compute the path string for the bar shape with rounded top corners
  $: pathData = `M ${innerXPos} ${yPos + barHeight} 
                 V ${yPos + cornerRadius} 
                 Q ${innerXPos} ${yPos} ${innerXPos + cornerRadius} ${yPos} 
                 H ${innerXPos + innerBarWidth - cornerRadius} 
                 Q ${innerXPos + innerBarWidth} ${yPos} ${innerXPos + innerBarWidth} ${yPos + cornerRadius} 
                 V ${yPos + barHeight} 
                 H ${innerXPos} Z`;

  function showTooltip(event) {
    activeBar.set(index); // Set the active bar
    visible.set(true);
    content.set(`Value: ${value}`);
    tooltipPos.set({
      x: xPos + barWidth / 2,
      y: yPos - 20,
    });

    console.log("showTooltip:", index, value);
  }

  function hideTooltip() {
    // activeBar.set(null); // Clear the active bar
    // tooltip.set({ visible: false, content: "" });
    console.log("hideTooltip:");
  }

  function handleFocus(event) {
    activeBar.set(index); // Set the active bar for keyboard focus
    visible.set(true);
    content.set(`Value: ${value}`);
    tooltipPos.set({
      x: xPos + barWidth / 2,
      y: yPos - 20,
    });
    console.log("handleFocus:", index, value);
  }

  function handleBlur() {
    hideTooltip(); // Hide tooltip on blur
    console.log("handleBlur");
  }
</script>

<g
  role="button"
  tabindex="0"
  on:mouseenter={showTooltip}
  on:mouseleave={hideTooltip}
  on:focus={handleFocus}
  on:blur={handleBlur}
>
  <!-- Full height hover -->
  <rect
    x={xPos}
    y="0"
    width={barWidth}
    height={innerHeight}
    fill={$visible && $activeBar === index ? "#9FA2A726" : "#9FA2A700"}
    style="transition: fill 0.3s ease;"
  ></rect>

  {#if rounded}
    <path
      d={pathData}
      fill={$visible && $activeBar === index ? "#007CCB" : barFill}
      style="--animation-delay: {delay}s; transition: fill 0.3s ease;"
      stroke="white"
      stroke-width="2"
    >
      {#if !reducedMotion}
        <animate attributeName="d" from={pathDataAnimationStart} to={pathData} dur="1s" begin="{delay}s" />
      {/if}
    </path>
  {:else}
    <rect
      x={innerXPos}
      y={yPos}
      width={innerBarWidth}
      height={barHeight}
      fill={$visible && $activeBar === index ? "#007CCB" : barFill}
      stroke="white"
      stroke-width="2"
      style="--animation-delay: {delay}s; transition: fill 0.3s ease;"
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
      opacity: 1;
      animation: none; /* Disable animations */
    }
  }
</style>
