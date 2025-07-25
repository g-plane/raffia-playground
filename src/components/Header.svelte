<script lang="ts">
  import OptionsDialog from './OptionsDialog.svelte'

  let { onshare }: { onshare: () => void } = $props()

  let showOptions = $state(false)

  function toggleShowOptions(event: MouseEvent) {
    event.stopPropagation()
    showOptions = !showOptions
  }
</script>

<header>
  <div class="title">Raffia Playground</div>
  <div class="right">
    <div class="buttons">
      <div>
        <button class="btn-options" class:active={showOptions} onclick={toggleShowOptions}>
          <i class="fa-solid fa-gear"></i>Options
        </button>
        {#if showOptions}
          <OptionsDialog bind:show={showOptions} />
        {/if}
      </div>
      <button class="btn-options" onclick={onshare}>
        <i class="fa-solid fa-share"></i>Share
      </button>
    </div>

    <div class="links">
      <a href="https://github.com/g-plane/raffia" target="_blank" rel="noopener noreferrer">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>Raffia Repo
      </a>
      <a
        href="https://github.com/g-plane/raffia-playground"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="fa-solid fa-arrow-up-right-from-square"></i>Playground Repo
      </a>
    </div>
  </div>
</header>

<style>
  header {
    height: 56px;
    padding: 12px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    background: #ecfdf5;
    border-bottom: 2px solid #a7f3d0;
  }

  .title {
    font-size: 1.12rem;
    line-height: 1.75rem;
    font-weight: 600;
    color: #1c1917;
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #065f46;
  }

  .buttons {
    display: flex;
    column-gap: 12px;
  }
  .btn-options {
    border: 1px solid #059669;
    border-radius: 2px;
    padding: 0.25rem 0.5rem;
    position: relative;
    &:hover {
      background: #d1fae5;
    }
    &.active, &:active, &:focus {
      background: #a7f3d0;
    }
  }

  .links {
    display: flex;
    align-items: center;
    text-decoration: underline;
  }
  a:not(:last-of-type) {
    margin-right: 1rem;
  }
  i {
    margin-right: 0.25rem;
  }
</style>
