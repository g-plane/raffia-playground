import { createSignal } from 'solid-js'
import type { Span } from './raffia'

export const highlightedSpanSignal = createSignal<Span | null>(null)
