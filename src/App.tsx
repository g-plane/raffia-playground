import type { Component } from 'solid-js'
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
      <Node node={ast} />
    </div>
  )
}

export default App
