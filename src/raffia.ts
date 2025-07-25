export interface Parser {
  (source: string, syntax: string): any
}

export async function loadWasm(): Promise<Parser> {
  const { default: init, parseStylesheet } = await import(
    // @ts-expect-error
    /* @vite-ignore */ 'https://raffia.netlify.app/wasm.js'
  )
  await init()
  return parseStylesheet
}

export type Span = { start: number, end: number }

export type SyntaxError = {
  kind: unknown,
  span: Span,
}

export type ParseError = [SyntaxError, string]
