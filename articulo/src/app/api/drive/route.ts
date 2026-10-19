import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDriveClient } from '@/lib/integrations/google'

export const runtime = 'nodejs'

// Lists the most recent Drive files so the editor can use file details in templates.
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const drive = await getDriveClient(userId)
  if (!drive) {
    return NextResponse.json({ message: { files: [] }, connected: false })
  }

  try {
    const response = await drive.files.list({
      pageSize: 10,
      orderBy: 'modifiedTime desc',
      fields: 'files(id, name, kind, mimeType)',
    })
    return NextResponse.json({ message: response.data, connected: true })
  } catch (error) {
    console.error('Drive list failed', error)
    return NextResponse.json({ message: { files: [] }, connected: false })
  }
}
