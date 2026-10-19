'use server'

import { Option } from '@/components/ui/multiple-selector'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { listSlackBotChannels, postSlackMessages } from '@/lib/integrations/slack'

export const getSlackConnection = async () => {
  const { userId } = await auth()
  if (!userId) return null
  return db.slack.findFirst({ where: { userId } })
}

// Lists channels the Articulo bot has been added to in the user's workspace.
export const listMySlackChannels = async (): Promise<Option[]> => {
  const connection = await getSlackConnection()
  if (!connection) return []
  try {
    return await listSlackBotChannels(connection.slackAccessToken)
  } catch (error) {
    console.error('Error listing bot channels:', error)
    return []
  }
}

export const onTestSlackMessage = async (
  selectedSlackChannels: Option[],
  content: string
): Promise<{ message: string }> => {
  const connection = await getSlackConnection()
  if (!connection) return { message: 'Slack is not connected' }
  try {
    return await postSlackMessages(
      connection.slackAccessToken,
      (selectedSlackChannels ?? []).map((c) => c.value),
      content
    )
  } catch (error) {
    return { message: error instanceof Error ? error.message : 'Slack request failed' }
  }
}
