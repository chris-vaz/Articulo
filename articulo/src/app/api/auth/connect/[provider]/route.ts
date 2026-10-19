import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import {
  buildAuthorizeUrl,
  connectionsRedirect,
  createOAuthState,
  isOAuthProvider,
  isProviderConfigured,
} from '@/lib/oauth'

// Starts the OAuth flow for an integration: /api/auth/connect/discord|notion|slack
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params
  const { userId } = await auth()
  if (!userId) return connectionsRedirect({ error: 'Please sign in first' })

  if (!isOAuthProvider(provider)) {
    return connectionsRedirect({ error: 'Unknown integration' })
  }
  if (!isProviderConfigured(provider)) {
    return connectionsRedirect({
      error: `${provider} is not configured yet. Add its keys to .env (see SETUP.md).`,
    })
  }

  const state = await createOAuthState()
  return NextResponse.redirect(buildAuthorizeUrl(provider, state))
}
