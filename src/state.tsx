import { Component, createContext, createSignal, type JSX } from 'solid-js'
import { createStore, type SetStoreFunction } from 'solid-js/store'
import type { Span } from './raffia'

export const highlightedSpanSignal = createSignal<Span | null>(null)

export type GlobalOptions = {
  highlightOnHover: boolean
}

export const globalOptionsContext = createContext<
  [GlobalOptions, SetStoreFunction<GlobalOptions>]
>(undefined!)

export const GlobalOptionsProvider: Component<{ children: JSX.Element }> = (
  props
) => {
  const [options, setOptions] = createStore<GlobalOptions>({
    highlightOnHover: true,
  })

  return (
    <globalOptionsContext.Provider value={[options, setOptions]}>
      {props.children}
    </globalOptionsContext.Provider>
  )
}
