import {
  type Component,
  createSignal,
  Show,
  onCleanup,
  createEffect,
} from 'solid-js'

interface Props {
  syntax: string
  view: string
  onSyntaxChange(value: string): void
  onViewChange(value: string): void
}

const Header: Component<Props> = (props) => {
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

  const handleSyntaxChange = (event: Event) => {
    props.onSyntaxChange((event.target as HTMLSelectElement).value)
  }

  return (
    <header class="h-14 p-3 grid grid-cols-2 bg-emerald-50 border-b-width-2px border-b-emerald-200">
      <div class="text-lg font-semibold text-stone-900">Raffia Playground</div>
      <div class="flex justify-between items-center px-4 text-sm text-emerald-800">
        <div>
          <button
            class="btn-options border-emerald-600 border-width-1px rounded-sm px-2 py-1 hover:bg-emerald-100 active:bg-emerald-200 focus:bg-emerald-200 relative"
            classList={{ 'bg-emerald-200': showOptions() }}
            onClick={() => setShowOptions((show) => !show)}
          >
            <i class="fa-solid fa-gear mr-1"></i>Options
          </button>
          <Show when={showOptions()}>
            <section
              ref={el}
              class="border-emerald-600 border-width-1px rounded-sm p-3 w-60 bg-white fixed text-base text-stone-900 grid grid-cols-1 gap-y-2"
            >
              <p class="flex justify-between">
                <span>Syntax</span>
                <select value={props.syntax} onInput={handleSyntaxChange}>
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
                      checked={props.view === 'tree'}
                      onInput={[props.onViewChange, 'tree']}
                    />
                    Tree
                  </label>
                  <label>
                    <input
                      type="radio"
                      class="mr-0.5"
                      name="view"
                      value="json"
                      checked={props.view === 'json'}
                      onInput={[props.onViewChange, 'json']}
                    />
                    JSON
                  </label>
                </span>
              </p>
            </section>
          </Show>
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
