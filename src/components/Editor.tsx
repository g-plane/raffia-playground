import {
  type Component,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js'
import type { ParseError } from '../raffia'
import { highlightedSpanSignal } from '../state'

interface Props {
  error?: ParseError
  value: string
  onInput(value: string): void
}

const Editor: Component<Props> = (props) => {
  const [isEditorReady, setIsEditorReady] = createSignal(false)
  let container: HTMLDivElement | undefined
  const [highlightedSpan] = highlightedSpanSignal

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
      fontSize: 14,
      lineHeight: 24,
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

      const [{ error, value }] = splitProps(props, ['error', 'value'])

      if (value !== model.getValue()) {
        model.setValue(value)
      }

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
            source: 'Raffia',
          },
        ])
      } else {
        monaco.editor.setModelMarkers(model, 'raffia', [])
      }
    })

    createEffect<string[]>((decorations) => {
      const model = editor.getModel()
      if (!model) {
        return [] as string[]
      }

      const span = highlightedSpan()
      if (span) {
        const start = model.getPositionAt(span.start)
        const end = model.getPositionAt(span.end)
        return model.deltaDecorations(decorations, [
          {
            range: {
              startLineNumber: start.lineNumber,
              startColumn: start.column,
              endLineNumber: end.lineNumber,
              endColumn: end.column,
            },
            options: { className: 'bg-light-700' },
          },
        ])
      } else {
        return model.deltaDecorations(decorations, [])
      }
    }, [])

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
