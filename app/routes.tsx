import React from 'react'

const Index = React.lazy(() => import('./routes/_index'))
const About = React.lazy(() => import('./routes/about'))

export const routes = [
  {
    path: '/about',
    Component: About
  },
  {
    path: '*',
    Component: Index
  }
]
