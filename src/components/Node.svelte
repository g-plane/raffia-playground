<script lang="ts">
  import { globalOptions, highlightedSpan } from '../state.svelte.js'
  import Node from './Node.svelte'

  let { node, hideHead }: {
    node: any,
    hideHead?: boolean,
  } = $props()

  let expanded = $state(true)
  let childrenExpanded = $state(
    Object.fromEntries(Object.keys(node).map((key) => [key, true])),
  )
  let hovered = $state(false)
  let properties = $derived(
    Object.entries(node).filter(
      ([key]) =>
        (!globalOptions.hideSpan || key !== 'span') &&
        (!globalOptions.hideType || key !== 'type'),
    ),
  )

  function isSpanLike(object: any) {
    return (
      Object.keys(object).length === 2 &&
      typeof object.start === 'number' &&
      typeof object.end === 'number'
    )
  }

  const select = (event: MouseEvent | FocusEvent) => {
    if (!globalOptions.highlightOnHover) {
      return
    }
    event.stopPropagation()
    hovered = true
    if (node.span) {
      highlightedSpan.set(node.span)
    } else if (isSpanLike(node)) {
      highlightedSpan.set(node)
    }
  }

  const unselect = (event: MouseEvent | FocusEvent) => {
    if (!globalOptions.highlightOnHover) {
      return
    }
    event.stopPropagation()
    hovered = false
    highlightedSpan.set(null)
  }
</script>

<div
  class="flex flex-col rounded-sm node"
  class:hovered
  role="listitem"
  onmouseover={select}
  onfocus={select}
  onmouseout={unselect}
  onblur={unselect}
>
  {#if !hideHead}
    <button
      class="outline-none border-none bg-none h-min flex"
      onclick={() => expanded = !expanded}
    >
      <div class="w-4">
        {#if expanded}
          <i class="fa-solid fa-caret-down"></i>
        {:else}
          <i class="fa-solid fa-caret-right"></i>
        {/if}
      </div>
      <span>
        {#if isSpanLike(node)}
          Span
        {:else}
          {node.type}
        {/if}
      </span>
    </button>
  {/if}
  <ul class="list-none ml-4" class:hidden={!expanded && !hideHead}>
    {#each properties as [key, value]}
      <li>
        {#if Array.isArray(value)}
          <button
            class="h-min flex items-center"
            onclick={() => childrenExpanded[key] = !childrenExpanded[key]}
          >
            <span class="w-4">
              {#if value.length === 0}
                &nbsp;
              {:else if childrenExpanded[key]}
                <i class="fa-solid fa-caret-down"></i>
              {:else}
                <i class="fa-solid fa-caret-right"></i>
              {/if}
            </span>
            <code class="text-purple-800">{key}</code>:
            <span class="ml-3 text-sm">
              {#if value.length === 0}
                <i>(empty array)</i>
              {:else if value.length === 1}
                <span>[ 1 element ]</span>
              {:else}
                <span>[ {value.length} elements ]</span>
              {/if}
            </span>
          </button>
          <div class="ml-4" class:hidden={childrenExpanded[key]}>
            {#each value as item}
              <Node node={item} />
            {/each}
          </div>
        {:else if typeof value === 'object' && value != null}
          <button
            class="h-min flex items-center"
            onclick={() => childrenExpanded[key] = !childrenExpanded[key]}
          >
            <span class="w-4">
              {#if childrenExpanded[key]}
                <i class="fa-solid fa-caret-down"></i>
              {:else}
                <i class="fa-solid fa-caret-right"></i>
              {/if}
            </span>
            <code class="text-purple-800">{key}</code>:
            {#if 'type' in value && typeof value.type === 'string'}
              <span class="ml-3">
                {value.type}
              </span>
            {/if}
          </button>
          {#if childrenExpanded[key]}
            <Node node={value} hideHead />
          {/if}
        {:else if typeof value === 'string'}
          <span class="ml-4 mr-1">
            <code class="text-purple-800">{key}</code>:
          </span>
          <code class="text-rose-800 ml-1">{value}</code>
        {:else if typeof value === 'number'}
          <span class="ml-4 mr-1">
            <code class="text-purple-800">{key}</code>:
          </span>
          <code class="text-yellow-700 ml-1">{value}</code>
        {:else if typeof value === 'boolean' || value === null}
          <span class="ml-4 mr-1">
            <code class="text-purple-800">{key}</code>:
          </span>
          <code class="text-sky-700 ml-1">{String(value)}</code>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .node {
    display: flex;
    flex-direction: column;
  }
  .node.hovered {
    background-color: #f1f3f5;
  }

  .hidden {
    display: none;
  }
</style>
