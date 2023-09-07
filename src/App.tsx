import {
  type Component,
  createSignal,
  Match,
  Switch,
  createResource,
  useContext,
  createEffect,
} from 'solid-js'
import { Ok, Err, type Result } from 'ts-results'
import { gzip, ungzip } from 'pako'
import { Base64 } from 'js-base64'
import Editor from './components/Editor'
import Header from './components/Header'
import JsonView from './components/JsonView'
import Node from './components/Node'
import { loadWasm, type ParseError } from './raffia'
import { globalOptionsContext } from './state'

const STORAGE_KEY_CODE = 'v1.code'
const STORAGE_KEY_SYNTAX = 'v1.syntax'

const App: Component = () => {
  const [globalOptions, setGlobalOptions] = useContext(globalOptionsContext)
  const [code, setCode] = createSignal('')
  const [wasmURL] = createSignal('https://raffia.netlify.app/wasm.js')
  const [parser] = createResource(wasmURL, loadWasm)

  const result = (): Result<unknown, ParseError> => {
    const parseStylesheet = parser()
    if (!parseStylesheet) {
      return Ok({})
    }
    try {
      return Ok(parseStylesheet(code(), globalOptions.syntax))
    } catch (error) {
      return Err(error as ParseError)
    }
  }

  createEffect(() => {
    const url = new URL(location.href)
    const encodedInput = url.searchParams.get('code')
    const storedInput = localStorage.getItem(STORAGE_KEY_CODE)
    if (encodedInput) {
      setCode(ungzip(Base64.toUint8Array(encodedInput), { to: 'string' }))
    } else if (storedInput) {
      setCode(storedInput)
    }

    const syntax = url.searchParams.get('syntax')
    if (syntax) {
      setGlobalOptions('syntax', syntax)
    }
  })

  createEffect(() => {
    localStorage.setItem(STORAGE_KEY_CODE, code())
    localStorage.setItem(STORAGE_KEY_SYNTAX, globalOptions.syntax)
  })

  function handleShare() {
    const url = new URL(location.href)
    url.searchParams.set('code', Base64.fromUint8Array(gzip(code())))
    url.searchParams.set('syntax', globalOptions.syntax)
    history.replaceState(null, '', url.toString())
    navigator.clipboard.writeText(url.toString())
  }

  return (
    <div>
      <Header onShare={handleShare} />
      <main class="grid grid-cols-2">
        <div>
          <Editor
            error={result().err ? (result().val as ParseError) : undefined}
            value={code()}
            onInput={setCode}
          />
        </div>
        <div
          class="border-l-width-1px p-2 bg-light-100 overflow-y-scroll"
          style={{ height: 'calc(100vh - 56px)' }}
        >
          <Switch>
            <Match when={parser.loading}>Loading WebAssembly module...</Match>
            <Match when={result().err}>{(result().val as ParseError)[1]}</Match>
            <Match when={globalOptions.view === 'tree'}>
              <Node node={result().val} />
            </Match>
            <Match when={globalOptions.view === 'json'}>
              <JsonView ast={result().val} />
            </Match>
          </Switch>
        </div>
      </main>
    </div>
  )
}

export default App
