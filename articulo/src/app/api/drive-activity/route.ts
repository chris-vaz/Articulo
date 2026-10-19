import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'
import { getDriveClient } from '@/lib/integrations/google'
import { publicWebhookUrl } from '@/lib/env'

export const runtime = 'nodejs'

// Starts watching the user's Google Drive for changes.
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: 'User not found' }, { status: 401 })
  }

  const drive = await getDriveClient(userId)
  if (!drive) {
    return new NextResponse(
      'No Google account linked. Sign in with Google to use the Drive trigger.',
      { status: 400 }
    )
  }

  try {
    const startPageTokenRes = await drive.changes.getStartPageToken({})
    const startPageToken = startPageTokenRes.data.startPageToken
    if (!startPageToken) throw new Error('startPageToken is unexpectedly null')

    const listener = await drive.changes.watch({
      pageToken: startPageToken,
      supportsAllDrives: true,
      requestBody: {
        id: uuidv4(),
        type: 'web_hook',
        address: `${publicWebhookUrl()}/api/drive-activity/notification`,
        token: process.env.GOOGLE_DRIVE_WEBHOOK_SECRET,
        kind: 'api#channel',
      },
    })

    if (listener.status === 200) {
      await db.user.update({
        where: { clerkId: userId },
        data: { googleResourceId: listener.data.resourceId },
      })
      return new NextResponse('Listening to changes...')
    }
  } catch (error) {
    console.error('Drive watch failed', error)
  }

  return new NextResponse('Oops! something went wrong, try again', { status: 500 })
}
