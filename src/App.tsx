import type { Component } from 'solid-js'
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
  return (
    <div>
      <Header />
      <main class="grid grid-cols-2">
        <div>
          <Editor onInput={() => {}} />
        </div>
        <div class="border-l-width-1px p-2 bg-light-100">
          <Node node={ast} />
        </div>
      </main>
    </div>
  )
}

export default App
