const readManifest = async () => {
  const data = await import('../build/build-manifest.json')
  return data
}

const serverRender = async (c, assetMap) => {
  const importedApp = await import('../build/server/index.js')
  const ua = c.request.headers.get('user-agent')
  const response = await importedApp.render({
    request: c.request,
    ua,
    assetMap
  })
  return response
}

export const onRequest = async (c) => {
  const manifest = await readManifest()
  try {
    const res = await serverRender(c, manifest)
    return res
  } catch (err) {
    console.error('SSR render error\n', err)
    if (err instanceof Response) {
        return err
    }
    return new Response('<h1>Something went wrong</h1>', {
        status: 500,
        headers
      })
  }
}


