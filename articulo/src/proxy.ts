import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Everything is private except the landing page, auth pages and inbound webhooks.
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/clerk-webhook',
  '/api/stripe/webhook',
  '/api/drive-activity/notification',
  '/api/health',
])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return

  const { userId } = await auth()
  if (userId) return

  if (req.nextUrl.pathname.startsWith('/api/')) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }
  // Send signed-out visitors to sign in, then back to the page they wanted.
  const signIn = new URL('/sign-in', req.url)
  signIn.searchParams.set('redirect_url', req.nextUrl.pathname + req.nextUrl.search)
  return NextResponse.redirect(signIn)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
