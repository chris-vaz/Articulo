import React from 'react'
import Logo from '@/components/global/logo'

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]"
      />
      <Logo />
      {children}
    </div>
  )
}

export default Layout
