import {
  type Component,
  createSignal,
  For,
  Match,
  Show,
  Switch,
  useContext,
} from 'solid-js'
import { globalOptionsContext, highlightedSpanSignal } from '../state'

interface Props {
  node: any
  hideHead?: boolean
}

const Node: Component<Props> = (props) => {
  const [expanded, setExpanded] = createSignal(true)
  const [childrenExpanded, setChildrenExpanded] = createSignal(
    Object.fromEntries(Object.keys(props.node).map((key) => [key, true]))
  )
  const [globalOptions] = useContext(globalOptionsContext)
  const [hovered, setHovered] = createSignal(false)
  const [, setHighlightedSpan] = highlightedSpanSignal

  const handleMouseOver = (event: MouseEvent) => {
    if (!globalOptions.highlightOnHover) {
      return
    }
    event.stopPropagation()
    setHovered(true)
    if (props.node.span) {
      setHighlightedSpan(props.node.span)
    }
  }

  const handleMouseOut = (event: MouseEvent) => {
    if (!globalOptions.highlightOnHover) {
      return
    }
    event.stopPropagation()
    setHovered(false)
    setHighlightedSpan(null)
  }

  const properties = () =>
    Object.entries(props.node).filter(
      ([key]) =>
        (!globalOptions.hideSpan || key !== 'span') &&
        (!globalOptions.hideType || key !== 'type')
    )

  return (
    <div
      class="flex flex-col rounded-sm"
      classList={{ 'bg-light-600': hovered() }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Show when={!props.hideHead}>
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
      </Show>
      <ul
        class="list-none ml-4"
        classList={{ hidden: !expanded() && !props.hideHead }}
      >
        <For each={properties()}>
          {([key, value]) => (
            <li>
              <Switch>
                <Match when={Array.isArray(value)}>
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
                      <Switch
                        fallback={<i class="fa-solid fa-caret-right"></i>}
                      >
                        <Match when={(value as unknown[]).length === 0}>
                          &nbsp;
                        </Match>
                        <Match when={childrenExpanded()[key]}>
                          <i class="fa-solid fa-caret-down"></i>
                        </Match>
                      </Switch>
                    </span>
                    <code class="text-purple-800">{key}</code>:
                    <span class="ml-3 text-sm">
                      <Switch
                        fallback={
                          <span>
                            [ {(value as unknown[]).length} elements ]
                          </span>
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
                </Match>
                <Match when={typeof value === 'object' && value != null}>
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
                    <Show
                      when={
                        typeof (value as { type?: string }).type === 'string'
                      }
                    >
                      <span class="ml-3">
                        {(value as { type: string }).type}
                      </span>
                    </Show>
                  </button>
                  <Show when={childrenExpanded()[key]}>
                    <Node node={value} hideHead />
                  </Show>
                </Match>
                <Match when={typeof value === 'string'}>
                  <span class="ml-4 mr-1">
                    <code class="text-purple-800">{key}</code>:
                  </span>
                  <code class="text-rose-800 ml-1">{value as string}</code>
                </Match>
                <Match when={typeof value === 'number'}>
                  <span class="ml-4 mr-1">
                    <code class="text-purple-800">{key}</code>:
                  </span>
                  <code class="text-yellow-700 ml-1">{value as number}</code>
                </Match>
                <Match when={typeof value === 'boolean' || value === null}>
                  <span class="ml-4 mr-1">
                    <code class="text-purple-800">{key}</code>:
                  </span>
                  <code class="text-sky-700 ml-1">{String(value)}</code>
                </Match>
              </Switch>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

export default Node
