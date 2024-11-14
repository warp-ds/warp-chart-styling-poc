<script>
  import dvColors from "../../colors/dv_colors_light.json";
  import { activeBar, tooltipPos, tooltipVisible, content, touchDevice, forcedReduceMotion } from "../../lib/dataStore.js";

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
  export let borderWidth = 2;

  // $: innerBarWidth = (barWidth * 1.618) / 2.618; // Golden ratio bar width
  $: innerBarWidth = barWidth * 0.66; // custom percentage bar width
  $: barPadding = (barWidth - innerBarWidth) / 2;
  $: innerXPos = xPos + barPadding;

  let systemReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
  $: reducedMotion = systemReducedMotion || $forcedReduceMotion;
  $: transitionTime = reducedMotion ? "0s" : "0.3s";

  // Animation start size for the bar
  let startSize = 0.7;

  const cornerRadius = 4;

  let isTouchActive = false; // Track if touch is active on mobile
  let isFocused = false; // Track if the bar is focused

  function handleTouchStart() {
    touchDevice.set(true);
    isTouchActive = true;
    showTooltip();
    activeBar.set(index);
  }

  function handleTouchMove(event) {
    if (isTouchActive) {
      // Prevent default scrolling on touch move
      event.preventDefault();
      const touch = event.touches[0];
      const touchedElement = document.elementFromPoint(touch.clientX, touch.clientY);

      // Check if the touched element is a bar and set it as active
      if (touchedElement && touchedElement.closest("g")) {
        const targetIndex = +touchedElement.closest("g").getAttribute("data-index"); // Assuming data-index holds the bar's index

        // console.log("handleTouchMove:", targetIndex, index);

        if (targetIndex !== index) {
          activeBar.set(targetIndex);
          console.log("Setting target index to:", targetIndex);
          console.log("active bar:", $activeBar);
        }
        showTooltip();
      }
    }
  }

  function handleTouchEnd() {
    isTouchActive = false;
    hideTooltip();
  }

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
    activeBar.set(index);
    console.log("show tooltip", index);
    tooltipVisible.set(true);
    content.set(`Value: ${value}`);
    tooltipPos.set({
      x: xPos + barWidth / 2,
      y: yPos - 20,
    });

    // console.log("showTooltip:", index, value);
  }

  function hideTooltip() {
    // activeBar.set(null); // Clear the active bar
    // tooltip.set({ tooltipVisible: false, content: "" });
    // console.log("hideTooltip:");
  }

  function handleFocus(event) {
    if (!isTouchActive) {
      isFocused = true;
      activeBar.set(index); // Set the active bar for keyboard focus
      tooltipVisible.set(true);
      content.set(`Value: ${value}`);
      tooltipPos.set({
        x: xPos + barWidth / 2,
        y: yPos - 20,
      });
      console.log("handleFocus:", index, value);
    }
  }

  function handleBlur() {
    if (!isTouchActive) {
      isFocused = false;
      hideTooltip(); // Hide tooltip on blur
      console.log("handleBlur");
    }
  }
</script>

<g
  role="presentation"
  data-index={index}
  on:mouseenter={showTooltip}
  on:mouseleave={hideTooltip}
  on:touchstart={handleTouchStart}
  on:touchmove={handleTouchMove}
  on:touchend={handleTouchEnd}
>
  <!-- Full height hover background -->
  <rect
    x={xPos}
    y="0"
    width={barWidth}
    height={innerHeight}
    fill={$tooltipVisible && !isFocused && $activeBar === index ? "#9FA2A73B" : "#9FA2A700"}
    style="transition: fill 0.5s ease; opacity: 0;"
    aria-hidden="true"    
  ></rect>

  {#if rounded}
    <path
      d={pathData}
      fill={$tooltipVisible && $activeBar === index ? "#007CCB" : barFill}
      fill-opacity= {$tooltipVisible && $activeBar != index ? "80%" : "100%"} 
      style="--animation-delay: {delay}s; transition: fill {transitionTime} ease-in; transition: fill-opacity {transitionTime} ease;"
      stroke="white"
      stroke-width="{borderWidth}"
      tabindex="0"                
      role="button"               
      aria-label={`Bar at index ${index}`}
      on:focus={handleFocus}
      on:blur={handleBlur}
      class={isFocused ? "focused" : ""}
    >
      {#if !reducedMotion}
        <animate
          attributeName="d"
          from={pathDataAnimationStart}
          to={pathData}
          dur="1s"
          begin="{delay}s"
          calcMode="spline"
          keySplines="0.42 0 1 1"
        />
      {/if}
    </path>
  {:else}
    <rect
      x={innerXPos}
      y={yPos}
      width={innerBarWidth}
      height={barHeight}
      fill={$tooltipVisible && $activeBar === index ? "#007CCB" : barFill}
      stroke="white"
      stroke-width="{borderWidth}"
      style="--animation-delay: {delay}s; transition: fill {transitionTime}  ease-in;"
      tabindex="0"                
      role="button"               
      aria-label={`Bar at index ${index}`}
      on:focus={handleFocus}
      on:blur={handleBlur}
      class={isFocused ? "focused" : ""}
    ></rect>
  {/if}
</g>

<style>
  path,
  rect {
    animation: fadeIn 0.5s ease-in forwards;
    opacity: 0;
    animation-delay: var(--animation-delay);
  }

  path:focus,
  rect:focus  {
    outline: 3px solid #06befb;
    outline-offset: -1px; 
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
