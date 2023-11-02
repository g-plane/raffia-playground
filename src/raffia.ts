interface Parser {
  (source: string, syntax: string): any
}

export async function loadWasm(url: string): Promise<Parser> {
  const { default: init, parseStylesheet } = await import(
    /* @vite-ignore */ url
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
