import {
  type Component,
  createSignal,
  Match,
  Switch,
  createResource,
} from 'solid-js'
import { Ok, Err, type Result } from 'ts-results'
import Editor from './components/Editor'
import Header from './components/Header'
import Node from './components/Node'
import { loadWasm, type ParseError } from './raffia'
import { GlobalOptionsProvider } from './state'

const App: Component = () => {
  const [code, setCode] = createSignal('')
  const [syntax, setSyntax] = createSignal('css')
  const [view, setView] = createSignal('tree')
  const [wasmURL] = createSignal(
    'https://raffia-wasm.vercel.app/wasm.generated.js'
  )
  const [parser] = createResource(wasmURL, loadWasm)

  const result = (): Result<unknown, ParseError> => {
    const parseStylesheet = parser()
    if (!parseStylesheet) {
      return Ok({})
    }
    try {
      return Ok(parseStylesheet(code(), syntax()))
    } catch (error) {
      return Err(error as ParseError)
    }
  }

  return (
    <GlobalOptionsProvider>
      <div>
        <Header
          syntax={syntax()}
          onSyntaxChange={setSyntax}
          view={view()}
          onViewChange={setView}
        />
        <main class="grid grid-cols-2">
          <div>
            <Editor
              error={result().err ? (result().val as ParseError) : undefined}
              onInput={setCode}
            />
          </div>
          <div
            class="border-l-width-1px p-2 bg-light-100 overflow-y-scroll"
            style={{ height: 'calc(100vh - 56px)' }}
          >
            <Switch>
              <Match when={parser.loading}>Loading WebAssembly module...</Match>
              <Match when={result().err}>
                {(result().val as ParseError)[1]}
              </Match>
              <Match when={view() === 'tree'}>
                <Node node={result().val} />
              </Match>
            </Switch>
          </div>
        </main>
      </div>
    </GlobalOptionsProvider>
  )
}

export default App
