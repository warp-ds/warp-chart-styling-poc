# WARP chart components experiment

**This is a prototype / Proof Of Concept (POC) to test:**
- Hover states (colour changes on selected element vs other elements)
  - Is it necessary to define hover colours?
- Using DataViz colours from a JSON
- Changing text style in a chart, according to selected brand
- Interactivity on touch devices:
  - Tap and double tap
  - Long press / touch and hold
  - Swipe
  - Pinch
  - Drag / flick
- Animation (loading chart, tooltip placement, responsive)
- Responsivity (horizontal scaling of chart, bar widths etc)
- Components, sub components, props for components

## How to run

`npm install`
`npm run dev`

Built using Vite & Svelte. D3 is used for scales.

## Current components and props
- **Bar chart** props:
  - `data`: json object
- **Bar** component (used in Bar chart). Props:
  - `xPos`: left edge of bar with background
  - `yPos`: top edge of bar with background
  - `barWidth`: width of full bar with background
  - `barHeight`: height of bar, without background
  - `delay`: delay for enter transition
  - `value`: tooltip value
  - `index`: bar number (used for delay)
  - `rounded`: bar shape
  - `innerHeight`: height of bar area including background
- **Tooltip** component (used in Bar chart). Props:
  - `margin`: JS object with four margin values

Interactive state is handled in a dataStore, so multiple components can read/write the state. 
