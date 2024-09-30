import React from 'react'

const Index = React.lazy(() => import('./routes/_index'))
const About = React.lazy(() => import('./routes/about'))

export const routes = [
  {
    path: '*',
    Component: () => 'Not found'
  },
  {
    path: '/',
    Component: Index
  },
  {
    path: '/about',
    Component: About
  }
]
