<script lang="ts">
  import Prismjs from 'prismjs'
  import 'prismjs/themes/prism.min.css'
  import 'prismjs/components/prism-json.min'
  import '../styles/prism-override.css'

  let { ast }: { ast: unknown } = $props()

  let el: HTMLElement | null = $state(null)

  let json = $derived(JSON.stringify(ast, null, 2))

  $effect(() => {
    if (el) {
      Prismjs.highlightElement(el)
    }
  })
</script>

<pre bind:this={el} class="language-json">
  <code>{json}</code>
</pre>
