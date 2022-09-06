import { type Component, useContext } from 'solid-js'
import { globalOptionsContext } from '../state'

const OptionsDialog: Component<{ ref: HTMLDivElement | undefined }> = (
  props
) => {
  const [globalOptions, setGlobalOptions] = useContext(globalOptionsContext)

  return (
    <section
      ref={props.ref}
      class="border-emerald-600 border-width-1px rounded-sm p-3 w-60 bg-white fixed text-base text-stone-900 grid grid-cols-1 gap-y-2"
    >
      <p class="flex justify-between">
        <span>Syntax</span>
        <select
          value={globalOptions.syntax}
          onInput={(e) => setGlobalOptions('syntax', e.currentTarget.value)}
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
              setGlobalOptions('highlightOnHover', e.currentTarget.checked)
            }
          />
        </label>
      </p>
    </section>
  )
}

export default OptionsDialog
