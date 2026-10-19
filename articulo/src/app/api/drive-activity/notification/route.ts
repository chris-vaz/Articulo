import { db } from '@/lib/db'
import { runPublishedWorkflows } from '@/lib/workflow-runner'
import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

// Google Drive push notifications (see /api/drive-activity for the watch setup).
export async function POST(req: NextRequest) {
  const resourceId = req.headers.get('x-goog-resource-id')
  const resourceState = req.headers.get('x-goog-resource-state')
  const channelToken = req.headers.get('x-goog-channel-token')

  // Reject anything that wasn't sent with our secret channel token.
  const secret = process.env.GOOGLE_DRIVE_WEBHOOK_SECRET
  if (secret && channelToken !== secret) {
    return Response.json({ message: 'invalid token' }, { status: 401 })
  }

  // Google sends a "sync" message when the channel is created. Nothing to run.
  if (!resourceId || resourceState === 'sync') {
    return Response.json({ message: 'ok' })
  }

  const user = await db.user.findFirst({
    where: { googleResourceId: resourceId },
    select: { clerkId: true },
  })
  if (!user) return Response.json({ message: 'ok' })

  const results = await runPublishedWorkflows(user.clerkId, 'Google Drive')
  return Response.json({ message: 'flow completed', results })
}
