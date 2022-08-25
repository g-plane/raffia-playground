/* @refresh reload */
import 'windi.css'
import './style.css'
import { render } from 'solid-js/web'
import App from './App'

self.MonacoEnvironment = {
  getWorker: async () => {
    const cssWorker = await import(
      'monaco-editor/esm/vs/language/css/css.worker?worker'
    )
    return new cssWorker.default()
  },
}

render(() => <App />, document.querySelector('#root')!)
