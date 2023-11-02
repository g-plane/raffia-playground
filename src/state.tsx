import { type Component, type JSX, createContext, createSignal } from 'solid-js'
import { type SetStoreFunction, createStore } from 'solid-js/store'
import type { Span } from './raffia'

export const highlightedSpanSignal = createSignal<Span | null>(null)

export type GlobalOptions = {
  syntax: string,
  view: string,
  highlightOnHover: boolean,
  hideSpan: boolean,
  hideType: boolean,
}

const defaultGlobalOptions: GlobalOptions = {
  syntax: 'css',
  view: 'tree',
  highlightOnHover: true,
  hideSpan: false,
  hideType: false,
}

export const globalOptionsContext = createContext<
  [GlobalOptions, SetStoreFunction<GlobalOptions>]
>([defaultGlobalOptions, () => {}])

export const GlobalOptionsProvider: Component<{ children: JSX.Element }> = (
  props,
) => {
  const [options, setOptions] = createStore<GlobalOptions>(defaultGlobalOptions)

  return (
    <globalOptionsContext.Provider value={[options, setOptions]}>
      {props.children}
    </globalOptionsContext.Provider>
  )
}
