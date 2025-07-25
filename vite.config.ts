import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
    }),
    UnoCSS(),
  ],
})
