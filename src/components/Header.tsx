import {
  type Component,
  createSignal,
  Show,
  onCleanup,
  createEffect,
} from 'solid-js'
import OptionsDialog from './OptionsDialog'

interface Props {
  onShare(): void
}

const Header: Component<Props> = ({ onShare }) => {
  const [showOptions, setShowOptions] = createSignal(false)

  let el: HTMLDivElement | undefined
  createEffect(() => {
    if (!showOptions()) {
      return
    }

    const handler = (event: MouseEvent) => {
      if (el && !el.contains(event.target as HTMLElement)) {
        setShowOptions(false)
      }
    }
    document.body.addEventListener('click', handler)
    onCleanup(() => document.body.removeEventListener('click', handler))
  })

  return (
    <header class="h-14 p-3 grid grid-cols-2 bg-emerald-50 border-b-width-2px border-b-emerald-200">
      <div class="text-lg font-semibold text-stone-900">Raffia Playground</div>
      <div class="flex justify-between items-center px-4 text-sm text-emerald-800">
        <div class="flex gap-x-3">
          <div>
            <button
              class="btn-options border-emerald-600 border-width-1px rounded-sm px-2 py-1 hover:bg-emerald-100 active:bg-emerald-200 focus:bg-emerald-200 relative"
              classList={{ 'bg-emerald-200': showOptions() }}
              onClick={() => setShowOptions((show) => !show)}
            >
              <i class="fa-solid fa-gear mr-1"></i>Options
            </button>
            <Show when={showOptions()}>
              <OptionsDialog ref={el} />
            </Show>
          </div>
          <button
            class="btn-options border-emerald-600 border-width-1px rounded-sm px-2 py-1 hover:bg-emerald-100 active:bg-emerald-200 focus:bg-emerald-200 relative"
            onClick={onShare}
          >
            <i class="fa-solid fa-share mr-1"></i>Share
          </button>
        </div>

        <div class="flex items-center underline">
          <a
            href="https://github.com/g-plane/raffia"
            target="_blank"
            rel="noopener noreferrer"
            class="mr-4"
          >
            <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i>
            Raffia Repo
          </a>
          <a
            href="https://github.com/g-plane/raffia-playground"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa-solid fa-arrow-up-right-from-square mr-1"></i>
            Playground Repo
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
