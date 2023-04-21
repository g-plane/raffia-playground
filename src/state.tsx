import { type Component, createContext, createSignal, type JSX } from 'solid-js'
import { createStore, type SetStoreFunction } from 'solid-js/store'
import type { Span } from './raffia'

export const highlightedSpanSignal = createSignal<Span | null>(null)

export type GlobalOptions = {
  syntax: string
  view: string
  highlightOnHover: boolean
  hideSpan: boolean
  hideType: boolean
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
  props
) => {
  const [options, setOptions] = createStore<GlobalOptions>(defaultGlobalOptions)

  return (
    <globalOptionsContext.Provider value={[options, setOptions]}>
      {props.children}
    </globalOptionsContext.Provider>
  )
}
