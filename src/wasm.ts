interface Parser {
  (source: string, syntax: string): any
}

export async function loadWasm(url: string): Promise<Parser> {
  const { instantiate } = await import(url)
  const { parseStylesheet } = await instantiate()
  return parseStylesheet
}
