import {
  type Component,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from 'solid-js'

const Node: Component<{ node: any }> = (props) => {
  const [expanded, setExpanded] = createSignal(props.node.type === 'Stylesheet')
  const [childrenExpanded, setChildrenExpanded] = createSignal(
    Object.fromEntries(Object.keys(props.node).map((key) => [key, false]))
  )

  return (
    <div class="flex flex-col">
      <button
        class="outline-none border-none bg-none h-min flex"
        onClick={() => setExpanded(!expanded())}
      >
        <div class="w-4">
          <Show
            when={expanded()}
            fallback={<i class="fa-solid fa-caret-right"></i>}
          >
            <i class="fa-solid fa-caret-down"></i>
          </Show>
        </div>
        <span>{props.node.type}</span>
      </button>
      <ul class="list-none ml-4" classList={{ hidden: !expanded() }}>
        <For each={Object.entries(props.node)}>
          {([key, value]) => (
            <li>
              <Show
                when={Array.isArray(value)}
                fallback={
                  <>
                    <span class="ml-4 mr-1">{key}:</span>
                    <Switch>
                      <Match when={typeof value === 'object' && value != null}>
                        <Node node={value} />
                      </Match>
                      <Match
                        when={
                          typeof value === 'string' ||
                          typeof value === 'number' ||
                          typeof value === 'boolean'
                        }
                      >
                        <span>{value as string | number | boolean}</span>
                      </Match>
                    </Switch>
                  </>
                }
              >
                <button
                  class="h-min flex items-center"
                  onClick={() =>
                    setChildrenExpanded((state) => ({
                      ...state,
                      [key]: !state[key],
                    }))
                  }
                >
                  <span class="w-4">
                    <Show
                      when={childrenExpanded()[key]}
                      fallback={<i class="fa-solid fa-caret-right"></i>}
                    >
                      <i class="fa-solid fa-caret-down"></i>
                    </Show>
                  </span>
                  {key}:
                  <span class="ml-3">
                    <Switch
                      fallback={
                        <span>[ {(value as unknown[]).length} elements ]</span>
                      }
                    >
                      <Match when={(value as unknown[]).length === 0}>
                        <i>(empty array)</i>
                      </Match>
                      <Match when={(value as unknown[]).length === 1}>
                        <span>[ 1 element ]</span>
                      </Match>
                    </Switch>
                  </span>
                </button>
                <div
                  class="ml-4"
                  classList={{ hidden: childrenExpanded()[key] }}
                >
                  <For each={value as unknown[]}>
                    {(item) => <Node node={item} />}
                  </For>
                </div>
              </Show>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

export default Node
