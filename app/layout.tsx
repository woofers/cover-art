import React from 'react'

export const Layout: React.FC<{ children?: React.ReactNode }> = ({
  children
}) => (
  <div className="flex min-h-screen flex-col text-zinc-800 bg-red font-sans">
    {children}
  </div>
)
