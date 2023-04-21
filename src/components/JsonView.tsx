import { type Component, onMount } from 'solid-js'
import Prismjs from 'prismjs'
import 'prismjs/themes/prism.min.css'
import 'prismjs/components/prism-json.min'
import '../styles/prism-override.css'

interface Props {
  ast: any
}

const JsonView: Component<Props> = (props) => {
  const json = JSON.stringify(props.ast, null, 2)
  let ref: HTMLPreElement | undefined

  onMount(() => {
    if (ref) {
      Prismjs.highlightElement(ref)
    }
  })

  return (
    <pre ref={ref} class="language-json">
      <code>{json}</code>
    </pre>
  )
}

export default JsonView
