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
                    <span class="ml-4 mr-1">
                      <code class="text-purple-800">{key}</code>:
                    </span>
                    <Switch>
                      <Match when={typeof value === 'object' && value != null}>
                        <Node node={value} />
                      </Match>
                      <Match when={typeof value === 'string'}>
                        <code class="text-rose-800 ml-1">
                          {value as string}
                        </code>
                      </Match>
                      <Match when={typeof value === 'number'}>
                        <code class="text-yellow-700 ml-1">
                          {value as number}
                        </code>
                      </Match>
                      <Match
                        when={typeof value === 'boolean' || value === null}
                      >
                        <code class="text-sky-700 ml-1">{String(value)}</code>
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
                  <code class="text-purple-800">{key}</code>:
                  <span class="ml-3 text-sm">
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
