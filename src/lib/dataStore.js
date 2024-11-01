
import { writable } from "svelte/store";

export const activeBar = writable(null); 

export const tooltip = writable({
  visible: false,
  x: 0,
  y: 0,
  content: ""
});