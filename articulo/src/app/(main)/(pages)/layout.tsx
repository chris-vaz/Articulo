import React from 'react'

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
  return <div className="h-full">{children}</div>
}

export default Layout
