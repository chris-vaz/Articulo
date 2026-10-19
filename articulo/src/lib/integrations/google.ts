import 'server-only'
import { clerkClient } from '@clerk/nextjs/server'
import { google } from 'googleapis'

// Google sign-in is handled by Clerk. We reuse the Google OAuth token Clerk
// stores for the user (requires the Drive scope on Clerk's Google provider).
export const getGoogleAccessToken = async (userId: string) => {
  try {
    const client = await clerkClient()
    const res = await client.users.getUserOauthAccessToken(userId, 'oauth_google')
    return res.data[0]?.token ?? null
  } catch {
    return null
  }
}

export const getDriveClient = async (userId: string) => {
  const accessToken = await getGoogleAccessToken(userId)
  if (!accessToken) return null
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
  oauth2Client.setCredentials({ access_token: accessToken })
  return google.drive({ version: 'v3', auth: oauth2Client })
}
