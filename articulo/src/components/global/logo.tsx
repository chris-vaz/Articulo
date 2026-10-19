import { useId } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const LogoMark = ({ className }: { className?: string }) => {
  // Unique per instance: a shared id breaks when the first logo is hidden (display: none).
  const gradientId = useId()
  return (
  <svg
    viewBox="0 0 32 32"
    aria-hidden="true"
    className={cn('h-7 w-7', className)}
  >
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a78bfa" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
    <circle cx="10" cy="10" r="3" fill="white" />
    <circle cx="22" cy="22" r="3" fill="white" />
    <circle cx="22" cy="10" r="2" fill="white" fillOpacity=".55" />
    <path d="M10 10 C 18 10, 14 22, 22 22" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
  )
}

const Logo = ({ href = '/', className }: { href?: string; className?: string }) => (
  <Link
    href={href}
    className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}
    aria-label="Articulo home"
  >
    <LogoMark />
    <span className="text-lg">articulo</span>
  </Link>
)

export default Logo
