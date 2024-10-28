import { defineConfig } from 'unocss';
import { presetWarp } from '@warp-ds/uno';
import { classes } from '@warp-ds/css/component-classes/classes';

export default defineConfig({
  presets: [
    presetWarp({
      externalClasses: classes,
      skipResets: true,  // Optional: Skip the reset CSS if necessary
    }),
  ],
});