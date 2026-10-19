'use client'
import Link from 'next/link'
import { useAuth, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

// Client-side so the landing page itself can stay fully static.
const NavAuth = () => {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <div className="h-9 w-32" />

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <Button asChild size="sm">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <UserButton />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">Get started</Link>
      </Button>
    </div>
  )
}

export default NavAuth
