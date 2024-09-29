import type { AssetMap } from "./utils"

declare global {
    interface Window {
      assetPath: AssetMap
    }
  }
  

export {}