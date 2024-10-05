import React from 'react'
import './tailwind.css'
import type { AssetMap } from './utils'

const App: React.FC<{ assetMap: AssetMap; children: React.ReactNode }> = ({
  assetMap,
  children
}) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="/cover-art/favicon.ico" />
      {assetMap.css &&
        assetMap.css.map(style => (
          <link key={style} rel="stylesheet" href={style}></link>
        ))}
    </head>
    <body>
      <div id="root">
        <div className="flex min-h-screen flex-col text-zinc-800 bg-red font-sans">
          {children}
        </div>
      </div>
    </body>
  </html>
)

export default App
