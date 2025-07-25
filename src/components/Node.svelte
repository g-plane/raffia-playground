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
  class="node"
  class:hovered
  role="listitem"
  onmouseover={select}
  onfocus={select}
  onmouseout={unselect}
  onblur={unselect}
>
  {#if !hideHead}
    <button onclick={() => expanded = !expanded}>
      <div>
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
  <ul class:hidden={!expanded && !hideHead}>
    {#each properties as [key, value]}
      <li>
        {#if Array.isArray(value)}
          <button onclick={() => childrenExpanded[key] = !childrenExpanded[key]}>
            <span class="caret-wrapper">
              {#if value.length === 0}
                &nbsp;
              {:else if childrenExpanded[key]}
                <i class="fa-solid fa-caret-down"></i>
              {:else}
                <i class="fa-solid fa-caret-right"></i>
              {/if}
            </span>
            <code>{key}</code>:
            <span class="array-length">
              {#if value.length === 0}
                <i>(empty array)</i>
              {:else if value.length === 1}
                <span>[ 1 element ]</span>
              {:else}
                <span>[ {value.length} elements ]</span>
              {/if}
            </span>
          </button>
          <div class="array-value" class:hidden={childrenExpanded[key]}>
            {#each value as item}
              <Node node={item} />
            {/each}
          </div>
        {:else if typeof value === 'object' && value != null}
          <button onclick={() => childrenExpanded[key] = !childrenExpanded[key]}>
            <span class="caret-wrapper">
              {#if childrenExpanded[key]}
                <i class="fa-solid fa-caret-down"></i>
              {:else}
                <i class="fa-solid fa-caret-right"></i>
              {/if}
            </span>
            <code>{key}</code>:
            {#if 'type' in value && typeof value.type === 'string'}
              <span class="ast-type">{value.type}</span>
            {/if}
          </button>
          {#if childrenExpanded[key]}
            <Node node={value} hideHead />
          {/if}
        {:else if typeof value === 'string'}
          <span class="key"><code>{key}</code>:</span>
          <code class="string">{value}</code>
        {:else if typeof value === 'number'}
          <span class="key"><code>{key}</code>:</span>
          <code class="number">{value}</code>
        {:else if typeof value === 'boolean' || value === null}
          <span class="key"><code>{key}</code>:</span>
          <code class="boolean">{String(value)}</code>
        {/if}
      </li>
    {/each}
  </ul>
</div>

<style>
  .node {
    display: flex;
    flex-direction: column;
    border-radius: 2px;
    &.hovered {
      background-color: #f1f3f5;
    }
    & button {
      outline: none;
      border: none;
      background: none;
      display: flex;
      line-height: 1.5rem;
      & > div {
        width: 1rem;
      }
    }
    & > ul {
      list-style: none;
      margin-left: 1rem;
    }
  }

  .caret-wrapper {
    width: 1rem;
  }
  span.key {
    margin: 0 0.25rem 0 1rem;
  }
  span.key code, .caret-wrapper + code {
    color: #5b21b6;
  }
  .array-length {
    margin-left: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.5rem;
  }
  .array-value {
    margin-left: 1rem;
  }
  .ast-type {
    margin-left: 0.75rem;
  }
  code.string {
    color: #9f1239;
  }
  code.number {
    color: #a16207;
  }
  code.boolean {
    color: #0369a1;
  }

  .hidden {
    display: none;
  }
</style>
