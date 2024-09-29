import React from 'react'
import Index from './routes/_index'
import './tailwind.css'
import Delay from './delay'
import type { AssetMap } from './utils'

const App: React.FC<{ assetMap: AssetMap }> = ({ assetMap }) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="/cover-art/favicon.ico" />
      {assetMap.css && <link rel="stylesheet" href={assetMap.css}></link>}
    </head>
    <body>
      <div id="root">
        <div className="flex min-h-screen flex-col text-zinc-800 bg-red font-sans">
          <React.Suspense fallback={<p>Loading 1</p>}>
            <Delay delay={2000} />
          </React.Suspense>

          <React.Suspense fallback={<p>Loading 5</p>}>
            <Delay delay={5000} />
          </React.Suspense>
          <React.Suspense fallback={<p>Loading 3</p>}>
            <Delay delay={1000} />
          </React.Suspense>
        </div>
      </div>
    </body>
  </html>
)

export default App
