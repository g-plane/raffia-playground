<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import type { ParseError } from '../raffia'
  import { highlightedSpan } from '../state.svelte.js'

  let { error, value, oninput }: {
    error?: ParseError,
    value: string,
    oninput: (value: string) => void,
  } = $props()

  let isEditorReady = $state(false)
  let container: HTMLDivElement | null = $state(null)
  let monaco: typeof import('monaco-editor') | null = $state(null)
  let editor: import('monaco-editor').editor.IStandaloneCodeEditor | null = $state(null)

  onMount(async () => {
    if (!container) {
      return
    }
    monaco = await import('monaco-editor')
    monaco.languages.css.cssDefaults.setOptions({
      validate: false,
    })
    editor = monaco.editor.create(container, {
      value,
      language: 'css',
      minimap: {
        enabled: false,
      },
      fontFamily: '"Cascadia Code", monospace',
      fontSize: 14,
      lineHeight: 24,
      tabSize: 2,
    })
    isEditorReady = true
    editor.onDidChangeModelContent(() => {
      if (editor) {
        oninput(editor.getValue())
      }
    })
  })

  $effect(() => {
    if (!monaco) {
      return
    }
    const model = editor?.getModel()
    if (!model) {
      return
    }
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

  let decorations: string[] = []
  $effect(() => {
    const model = editor?.getModel()
    if (!model) {
      decorations = []
      return
    }
    if ($highlightedSpan) {
      const start = model.getPositionAt($highlightedSpan.start)
      const end = model.getPositionAt($highlightedSpan.end)
      decorations = model.deltaDecorations(decorations, [
        {
          range: {
            startLineNumber: start.lineNumber,
            startColumn: start.column,
            endLineNumber: end.lineNumber,
            endColumn: end.column,
          },
          options: { className: 'highlighted-span' },
        },
      ])
    } else {
      decorations = model.deltaDecorations(decorations, [])
    }
  })

  onDestroy(() => {
    editor?.dispose()
  })
</script>

{#if !isEditorReady}
  <div class="loading">Loading editor...</div>
{/if}
<div bind:this={container} class="editor"></div>

<style>
  :global(.highlighted-span) {
    background-color: #e9ecef;
  }

  .loading {
    padding: 0.5rem;
  }

  .editor {
    height: 100%;
  }
</style>
