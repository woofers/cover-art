import React from 'react'
import { Link, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  }
})

function RootComponent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}