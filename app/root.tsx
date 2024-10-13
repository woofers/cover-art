import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { HydrationBoundary, useQueryClient } from '@tanstack/react-query'
import { useDehydratedState } from 'hooks/use-dehydrated-state'

const Hydrate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dehydratedState = useDehydratedState()
  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  )
}

const Root: React.FC<{}> = () => (
  <Hydrate>
    <Outlet />
  </Hydrate>
)

export default Root
