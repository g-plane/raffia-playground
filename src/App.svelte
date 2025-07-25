<script lang="ts">
  import { Base64 } from 'js-base64'
  import { gzip, ungzip } from 'pako'
  import { onMount } from 'svelte'
  import { Err, Ok } from 'ts-results'
  import Editor from './components/Editor.svelte'
  import Header from './components/Header.svelte'
  import JsonView from './components/JsonView.svelte'
  import Node from './components/Node.svelte'
  import { type ParseError, type Parser, loadWasm } from './raffia'
  import { globalOptions } from './state.svelte.js'

  const STORAGE_KEY_CODE = 'v1.code'
  const STORAGE_KEY_SYNTAX = 'v1.syntax'

  let code = $state('')
  let parser: Parser | null = $state(null)

  let result = $derived.by(() => {
    if (!parser) {
      return Ok({})
    }
    try {
      return Ok(parser(code, globalOptions.syntax))
    } catch (error) {
      return Err(error as ParseError)
    }
  })

  onMount(async () => {
    const url = new URL(location.href)
    const encodedInput = url.searchParams.get('code')
    const storedInput = localStorage.getItem(STORAGE_KEY_CODE)
    if (encodedInput) {
      code = ungzip(Base64.toUint8Array(encodedInput), { to: 'string' })
    } else if (storedInput) {
      code = storedInput
    }

    const encodedSyntax = url.searchParams.get('syntax')
    const storedSyntax = localStorage.getItem(STORAGE_KEY_SYNTAX)
    if (encodedSyntax) {
      globalOptions.syntax = encodedSyntax
    } else if (storedSyntax) {
      globalOptions.syntax = storedSyntax
    }

    parser = await loadWasm()
  })

  $effect(() => {
    localStorage.setItem(STORAGE_KEY_CODE, code)
    localStorage.setItem(STORAGE_KEY_SYNTAX, globalOptions.syntax)
  })

  function handleShare() {
    const url = new URL(location.href)
    url.searchParams.set('code', Base64.fromUint8Array(gzip(code)))
    url.searchParams.set('syntax', globalOptions.syntax)
    history.replaceState(null, '', url.toString())
    navigator.clipboard.writeText(url.toString())
  }
</script>

<div>
  <Header onshare={handleShare} />
  <main>
    <div>
      <Editor
        error={result.err ? result.val : undefined}
        value={code}
        oninput={(value) => code = value}
      />
    </div>
    <div class="right">
      {#if !parser}
        Loading WebAssembly module...
      {:else if result.err}
        {result.val[1]}
      {:else if globalOptions.view === 'tree'}
        <Node node={result.val} />
      {:else if globalOptions.view === 'json'}
        <JsonView ast={result.val} />
      {/if}
    </div>
  </main>
</div>

<style>
  main {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    min-height: calc(100vh - 3.5rem);
  }

  .right {
    background: #fcfcfc;
    border-left-width: 1px;
    padding: 0.5rem;
    overflow-y: scroll;
    height: calc(100vh - 56px);
  }
</style>
