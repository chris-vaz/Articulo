'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { createNotionPage } from '@/lib/integrations/notion'

export const getNotionConnection = async () => {
  const { userId } = await auth()
  if (!userId) return null
  return db.notion.findFirst({ where: { userId } })
}

// Creates a test page in the signed-in user's connected Notion database.
export const onTestNotionPage = async (content: unknown) => {
  const connection = await getNotionConnection()
  if (!connection) return { message: 'Notion is not connected' }
  try {
    await createNotionPage(connection.databaseId, connection.accessToken, content)
    return { message: 'success' }
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Notion request failed' }
  }
}
