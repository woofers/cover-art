import { useSyncExternalStore } from 'react'

const empty = () => () => {}

export const useSsr = () =>
  useSyncExternalStore(
    empty,
    () => false,
    () => true
  )
