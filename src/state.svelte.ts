import { writable } from 'svelte/store'
import type { Span } from './raffia'

export const highlightedSpan = writable<Span | null>(null)

export type GlobalOptions = {
  syntax: string,
  view: string,
  highlightOnHover: boolean,
  hideSpan: boolean,
  hideType: boolean,
}

export const globalOptions: GlobalOptions = $state({
  syntax: 'css',
  view: 'tree',
  highlightOnHover: true,
  hideSpan: false,
  hideType: false,
})
