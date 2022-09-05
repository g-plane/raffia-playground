import {
  type Component,
  createSignal,
  Match,
  Switch,
  createResource,
} from 'solid-js'
import Editor from './components/Editor'
import Header from './components/Header'
import Node from './components/Node'
import { loadWasm } from './wasm'

const App: Component = () => {
  const [code, setCode] = createSignal('')
  const [syntax, setSyntax] = createSignal('css')
  const [view, setView] = createSignal('tree')
  const [wasmURL] = createSignal(
    'https://raffia-wasm.vercel.app/wasm.generated.js'
  )
  const [parser] = createResource(wasmURL, loadWasm)

  const ast = () => {
    const parseStylesheet = parser()
    if (!parseStylesheet) {
      return {}
    }
    try {
      return parseStylesheet(code(), syntax())
    } catch {
      return {}
    }
  }

  return (
    <div>
      <Header
        syntax={syntax()}
        onSyntaxChange={setSyntax}
        view={view()}
        onViewChange={setView}
      />
      <main class="grid grid-cols-2">
        <div>
          <Editor onInput={setCode} />
        </div>
        <div class="border-l-width-1px p-2 bg-light-100">
          <Switch>
            <Match when={parser.loading}>Loading WebAssembly module...</Match>
            <Match when={view() === 'tree'}>
              <Node node={ast()} />
            </Match>
          </Switch>
        </div>
      </main>
    </div>
  )
}

export default App
