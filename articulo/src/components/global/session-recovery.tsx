'use client'
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const RELOAD_KEY = 'articulo:session-recovery'

const toSignIn = () =>
  `/sign-in?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search)}`

// Rendered when the server saw no session (e.g. the short-lived session token
// expired on a cold page load). Clerk refreshes the token in the browser; then
// we re-render the same page, or send genuinely signed-out visitors to sign in.
const SessionRecovery = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.replace(toSignIn())
      return
    }

    let cancelled = false
    // Fetching a fresh token also rewrites the session cookie the server reads.
    getToken({ skipCache: true })
      .catch(() => null)
      .finally(() => {
        if (!cancelled) router.refresh()
      })

    // If a soft refresh wasn't enough, do one full reload; never loop.
    const timer = setTimeout(() => {
      let attempts = 0
      try {
        attempts = Number(sessionStorage.getItem(RELOAD_KEY) || 0)
        sessionStorage.setItem(RELOAD_KEY, String(attempts + 1))
      } catch {}
      if (attempts < 1) window.location.reload()
      else router.replace(toSignIn())
    }, 4000)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [isLoaded, isSignedIn, getToken, router])

  return (
    <div className="flex h-dvh items-center justify-center" aria-busy="true">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}

// Clears the reload guard once the app has rendered with a valid session.
export const SessionRecovered = () => {
  useEffect(() => {
    try {
      sessionStorage.removeItem(RELOAD_KEY)
    } catch {}
  }, [])
  return null
}

export default SessionRecovery
