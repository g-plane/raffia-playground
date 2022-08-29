import { type Component, createSignal, Match, Switch } from 'solid-js'
import Editor from './components/Editor'
import Header from './components/Header'
import Node from './components/Node'

const ast = {
  type: 'Stylesheet',
  statements: [
    {
      type: 'AtRule',
      name: 'media',
      prelude: null,
      block: [{ type: 'Declaration', name: 'width', value: [] }],
    },
    {
      type: 'Declaration',
      name: 'color',
      value: [{ type: 'Ident', name: 'red' }],
    },
  ],
}

const App: Component = () => {
  const [syntax, setSyntax] = createSignal('css')
  const [view, setView] = createSignal('tree')

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
          <Editor onInput={() => {}} />
        </div>
        <div class="border-l-width-1px p-2 bg-light-100">
          <Switch>
            <Match when={view() === 'tree'}>
              <Node node={ast} />
            </Match>
          </Switch>
        </div>
      </main>
    </div>
  )
}

export default App
