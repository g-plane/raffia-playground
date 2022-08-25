import type { Component } from 'solid-js'
import Editor from './components/Editor'
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
    <div class="grid grid-cols-2 h-100vh">
      <div>
        <Editor onInput={() => {}} />
      </div>
      <div class="border-l-width-1px border-l-warm-gray-300 p-2">
        <Node node={ast} />
      </div>
    </div>
  )
}

export default App
