import {
  type Component,
  onMount,
  createSignal,
  onCleanup,
  Show,
  createEffect,
  splitProps,
} from 'solid-js'
import type { ParseError } from '../raffia'

interface Props {
  error?: ParseError
  onInput(value: string): void
}

const Editor: Component<Props> = (props) => {
  const [isEditorReady, setIsEditorReady] = createSignal(false)
  let container: HTMLDivElement | undefined

  onMount(async () => {
    if (!container) {
      return
    }

    const monaco = await import('monaco-editor')
    monaco.languages.css.cssDefaults.setOptions({
      validate: false,
    })
    const editor = monaco.editor.create(container, {
      language: 'css',
      minimap: {
        enabled: false,
      },
      fontFamily: '"Cascadia Code", monospace',
      fontSize: 15,
      tabSize: 2,
    })
    setIsEditorReady(true)

    editor.onDidChangeModelContent(() => {
      props.onInput(editor.getValue())
    })

    createEffect(() => {
      const model = editor.getModel()
      if (!model) {
        return
      }

      const [{ error }] = splitProps(props, ['error'])
      if (error) {
        const start = model.getPositionAt(error[0].span.start)
        const end = model.getPositionAt(error[0].span.end)
        monaco.editor.setModelMarkers(model, 'raffia', [
          {
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: start.lineNumber,
            startColumn: start.column,
            endLineNumber: end.lineNumber,
            endColumn: end.column,
            message: error[1],
          },
        ])
      } else {
        monaco.editor.setModelMarkers(model, 'raffia', [])
      }
    })

    onCleanup(() => {
      editor.dispose()
    })
  })

  return (
    <>
      <Show when={!isEditorReady()}>
        <div class="p-2">Loading editor...</div>
      </Show>
      <div ref={container} class="h-full"></div>
    </>
  )
}

export default Editor
