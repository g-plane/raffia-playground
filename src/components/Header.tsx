import {
  type Component,
  createSignal,
  Show,
  onCleanup,
  createEffect,
  useContext,
} from 'solid-js'
import { globalOptionsContext } from '../state'

const Header: Component = () => {
  const [showOptions, setShowOptions] = createSignal(false)
  const [globalOptions, setGlobalOptions] = useContext(globalOptionsContext)

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
                <select
                  value={globalOptions.syntax}
                  onInput={(e) =>
                    setGlobalOptions('syntax', e.currentTarget.value)
                  }
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
                      onInput={() => setGlobalOptions('view', 'tree')}
                    />
                    Tree
                  </label>
                  <label>
                    <input
                      type="radio"
                      class="mr-0.5"
                      name="view"
                      value="json"
                      checked={globalOptions.view === 'json'}
                      onInput={() => setGlobalOptions('view', 'json')}
                    />
                    JSON
                  </label>
                </span>
              </p>
              <p>
                <label class="flex justify-between items-center">
                  <span>Highlight On Hover</span>
                  <input
                    type="checkbox"
                    checked={globalOptions.highlightOnHover}
                    onInput={(e) =>
                      setGlobalOptions(
                        'highlightOnHover',
                        e.currentTarget.checked
                      )
                    }
                  />
                </label>
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
