import React from "react"

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
  return (
    <div className="flex h-screen">
      <div className="w-full h-full overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export default Layout
