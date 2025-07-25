<script lang="ts">
  import { globalOptions } from '../state.svelte.js'

  let { show = $bindable() }: { show: boolean } = $props()

  let el: HTMLElement | null = $state(null)

  function handleBodyClick(event: MouseEvent) {
    if (el && !el.contains(event.target as HTMLElement)) {
      show = false
    }
  }
</script>

<section
  bind:this={el}
  class="border-emerald-600 border-width-1px rounded-sm p-3 w-80 bg-white fixed text-base text-stone-900 grid grid-cols-1 gap-y-2"
>
  <p class="flex justify-between">
    <span>Syntax</span>
    <select
      value={globalOptions.syntax}
      oninput={(e) => globalOptions.syntax = e.currentTarget.value}
    >
      <option value="css">CSS</option>
      <option value="scss">SCSS</option>
      <option value="sass">Sass</option>
      <option value="less">Less</option>
    </select>
  </p>

  <p class="flex justify-between">
    <span>View</span>
    <span class="grid grid-cols-2 gap-x-1">
      <label>
        <input
          type="radio"
          class="mr-0.5"
          name="view"
          value="tree"
          checked={globalOptions.view === 'tree'}
          oninput={() => globalOptions.view = 'tree'}
        >
        Tree
      </label>
      <label>
        <input
          type="radio"
          class="mr-0.5"
          name="view"
          value="json"
          checked={globalOptions.view === 'json'}
          oninput={() => globalOptions.view = 'json'}
        >
        JSON
      </label>
    </span>
  </p>

  <p>
    <label class="flex justify-between items-center">
      <span>Highlight on Hover</span>
      <input
        type="checkbox"
        checked={globalOptions.highlightOnHover}
        oninput={(e) => globalOptions.highlightOnHover = e.currentTarget.checked}
      >
    </label>
  </p>

  <p>
    <label class="flex justify-between items-center">
      <span>Hide Span in Tree View</span>
      <input
        type="checkbox"
        checked={globalOptions.hideSpan}
        oninput={(e) => globalOptions.hideSpan = e.currentTarget.checked}
      >
    </label>
  </p>

  <p>
    <label class="flex justify-between items-center">
      <span>Hide Node Type in Tree View</span>
      <input
        type="checkbox"
        checked={globalOptions.hideType}
        oninput={(e) => globalOptions.hideType = e.currentTarget.checked}
      >
    </label>
  </p>
</section>

<svelte:body onclick={handleBodyClick} />
