import type React from 'react'
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
      <link rel="shortcut icon" href="/favicon.ico" />
      {assetMap.css?.map(style => (
        <link key={style} rel="stylesheet" href={style} />
      ))}
    </head>
    <body>{children}</body>
  </html>
)

export default App
