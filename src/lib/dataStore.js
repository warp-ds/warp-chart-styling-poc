
import { writable } from "svelte/store";

export const activeBar = writable(null);  
export const tooltipVisible = writable(false);
export const content = writable("");
export const touchDevice = writable(false);
export const forcedReduceMotion = writable(false);
export const dimOtherBars = writable(false);
export const intensifyActiveBar = writable(false);

export const tooltipPos = writable({
  x: 0,
  y: 0
});
