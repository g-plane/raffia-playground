import {
  type Component,
  onMount,
  createSignal,
  onCleanup,
  Show,
} from 'solid-js'

interface Props {
  onInput(value: string): void
}

const Editor: Component<Props> = ({ onInput }) => {
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
      onInput(editor.getValue())
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
