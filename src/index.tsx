/* @refresh reload */
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import './styles/main.css'
import { render } from 'solid-js/web'
import App from './App'
import { GlobalOptionsProvider } from './state'

self.MonacoEnvironment = {
  getWorker: async () => {
    const cssWorker = await import(
      'monaco-editor/esm/vs/language/css/css.worker?worker'
    )
    return new cssWorker.default()
  },
}

render(
  () => (
    <GlobalOptionsProvider>
      <App />
    </GlobalOptionsProvider>
  ),
  document.querySelector('#root')!
)
