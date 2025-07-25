/* @refresh reload */
import './styles/main.css'
import { mount } from 'svelte'
import App from './App.svelte'

self.MonacoEnvironment = {
  getWorker: async () => {
    const cssWorker = await import(
      // @ts-expect-error
      'monaco-editor/esm/vs/language/css/css.worker?worker'
    )
    return new cssWorker.default()
  },
}

mount(App, {
  target: document.querySelector('#app')!,
})
