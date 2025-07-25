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

<section bind:this={el}>
  <p>
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

  <p>
    <span>View</span>
    <span class="radio-group">
      <label>
        <input
          type="radio"
          name="view"
          value="tree"
          checked={globalOptions.view === 'tree'}
          oninput={() => globalOptions.view = 'tree'}
        >Tree
      </label>
      <label>
        <input
          type="radio"
          name="view"
          value="json"
          checked={globalOptions.view === 'json'}
          oninput={() => globalOptions.view = 'json'}
        >JSON
      </label>
    </span>
  </p>

  <p class="boolean">
    <label>
      <span>Highlight on Hover</span>
      <input
        type="checkbox"
        checked={globalOptions.highlightOnHover}
        oninput={(e) => globalOptions.highlightOnHover = e.currentTarget.checked}
      >
    </label>
  </p>

  <p class="boolean">
    <label>
      <span>Hide Span in Tree View</span>
      <input
        type="checkbox"
        checked={globalOptions.hideSpan}
        oninput={(e) => globalOptions.hideSpan = e.currentTarget.checked}
      >
    </label>
  </p>

  <p class="boolean">
    <label>
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

<style>
  section {
    border: 1px solid #059669;
    border-radius: 2px;
    padding: 0.75rem;
    width: 20rem;
    background: #ffffff;
    position: fixed;
    font-size: 1rem;
    line-height: 1.5rem;
    color: #1c1917;
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
  }

  p:not(.boolean) {
    display: flex;
    justify-content: space-between;
  }
  .radio-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 0.25rem;
    & input {
      margin-right: 0.125rem;
    }
  }
  p.boolean label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
