import 'server-only'
import axios from 'axios'

export type SlackChannelOption = { label: string; value: string }

export const listSlackBotChannels = async (
  slackAccessToken: string
): Promise<SlackChannelOption[]> => {
  const { data } = await axios.get('https://slack.com/api/conversations.list', {
    params: { types: 'public_channel,private_channel', limit: 200 },
    headers: { Authorization: `Bearer ${slackAccessToken}` },
  })
  if (!data.ok) throw new Error(data.error)

  return (data.channels ?? [])
    .filter((ch: any) => ch.is_member)
    .map((ch: any) => ({ label: ch.name, value: ch.id }))
}

export const postSlackMessages = async (
  slackAccessToken: string,
  channelIds: string[],
  content: string
) => {
  if (!content) return { message: 'Content is empty' }
  if (!channelIds.length) return { message: 'Channel not selected' }

  const results = await Promise.all(
    channelIds.map(async (channel) => {
      const { data } = await axios.post(
        'https://slack.com/api/chat.postMessage',
        { channel, text: content },
        {
          headers: {
            Authorization: `Bearer ${slackAccessToken}`,
            'Content-Type': 'application/json;charset=utf-8',
          },
        }
      )
      return data.ok ? null : `${channel}: ${data.error}`
    })
  )

  const errors = results.filter(Boolean)
  if (errors.length) throw new Error(`Slack error ${errors.join(', ')}`)
  return { message: 'Success' }
}
