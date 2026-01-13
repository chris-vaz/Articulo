"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { MenuIcon } from "lucide-react"

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`
    fixed top-0 left-0 right-0 z-[100]
    flex items-center justify-between px-4 py-4
    transition-all duration-300
    ${scrolled
          ? "bg-white/40 backdrop-blur-lg text-black"
          : "bg-black/40 backdrop-blur-lg text-white"
        }
  `}
    >
      {/* Logo */}
      <aside className="flex items-center gap-2">
        <p className="text-3xl font-bold">Articulo</p>
      </aside>

      {/* Center Nav */}
      <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <ul className="flex items-center gap-6">
          {[
            "Products",
            "Pricing",
            "Clients",
            "Resources",
            "Documentation",
            "Enterprise",
          ].map((item) => (
            <li key={item}>
              <Link
                href="#"
                className={`transition-colors ${scrolled
                  ? "text-black hover:text-neutral-600"
                  : "text-white hover:text-neutral-300"
                  }`}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right Actions */}
      <aside className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px]"
        >
          {/* Animated border */}
          <span className="absolute inset-[-1000%] z-0 animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

          {/* Button content */}
          <span
            className={`relative z-10 inline-flex h-full w-full items-center justify-center rounded-full px-4 text-sm font-medium transition-colors ${scrolled
              ? "bg-black text-white"
              : "bg-slate-950 text-white"
              }`}
          >
            Get Started
          </span>
        </Link>

        <MenuIcon
          className={`md:hidden ${scrolled ? "text-black" : "text-white"
            }`}
        />
      </aside>
    </header>
  )
}

export default Navbar
