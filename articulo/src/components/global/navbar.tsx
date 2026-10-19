import Link from 'next/link'
import React from 'react'
import Logo from './logo'
import NavAuth from './nav-auth'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden md:block" aria-label="Main">
          <ul className="flex items-center gap-8 text-sm text-muted-foreground">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <NavAuth />
      </div>
    </header>
  )
}

export default Navbar
