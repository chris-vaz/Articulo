import React from 'react'
import { Option } from './content-based-on-title'
import { ConnectionProviderProps } from '@/providers/connections-provider'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { onTestDiscordMessage } from '@/app/(main)/(pages)/connections/_actions/discord-connection'
import { onTestNotionPage } from '@/app/(main)/(pages)/connections/_actions/notion-connection'
import { onTestSlackMessage } from '@/app/(main)/(pages)/connections/_actions/slack-connection'
import { onCreateNodeTemplate } from '../../../_actions/workflow-connections'
import { toast } from 'sonner'

type Props = {
  currentService: string
  nodeConnection: ConnectionProviderProps
  channels?: Option[]
  setChannels?: (value: Option[]) => void
}

const ActionButton = ({
  currentService,
  nodeConnection,
  channels,
  setChannels,
}: Props) => {
  const pathname = usePathname()

  const onSendDiscordMessage = async () => {
    const response = await onTestDiscordMessage(nodeConnection.discordNode.content)

    if (response.message == 'success') {
      toast.success('Message sent to Discord')
      nodeConnection.setDiscordNode((prev: any) => ({
        ...prev,
        content: '',
      }))
    } else {
      toast.error(response.message)
    }
  }

  const onStoreNotionContent = async () => {
    const response = await onTestNotionPage(nodeConnection.notionNode.content)
    if (response.message == 'success') {
      toast.success('Test page created in Notion')
    } else {
      toast.error(response.message)
    }
  }

  const onStoreSlackContent = async () => {
    const response = await onTestSlackMessage(
      channels!,
      nodeConnection.slackNode.content
    )
    if (response.message == 'Success') {
      toast.success('Message sent successfully')
      nodeConnection.setSlackNode((prev: any) => ({
        ...prev,
        content: '',
      }))
      setChannels!([])
    } else {
      toast.error(response.message)
    }
  }

  const onCreateLocalNodeTempate = async () => {
    const workflowId = pathname.split('/').pop()!
    let response: string | undefined

    if (currentService === 'Discord') {
      response = await onCreateNodeTemplate(
        nodeConnection.discordNode.content,
        currentService,
        workflowId
      )
    }
    if (currentService === 'Slack') {
      response = await onCreateNodeTemplate(
        nodeConnection.slackNode.content,
        currentService,
        workflowId,
        channels
      )
    }
    if (currentService === 'Notion') {
      response = await onCreateNodeTemplate(
        JSON.stringify(nodeConnection.notionNode.content),
        currentService,
        workflowId
      )
    }

    if (response) toast.message(response)
  }

  const renderActionButton = () => {
    switch (currentService) {
      case 'Discord':
        return (
          <>
            <Button
              variant="outline"
              onClick={onSendDiscordMessage}
            >
              Test Message
            </Button>
            <Button
              onClick={onCreateLocalNodeTempate}
              variant="outline"
            >
              Save Template
            </Button>
          </>
        )

      case 'Notion':
        return (
          <>
            <Button
              variant="outline"
              onClick={onStoreNotionContent}
            >
              Test
            </Button>
            <Button
              onClick={onCreateLocalNodeTempate}
              variant="outline"
            >
              Save Template
            </Button>
          </>
        )

      case 'Slack':
        return (
          <>
            <Button
              variant="outline"
              onClick={onStoreSlackContent}
            >
              Send Message
            </Button>
            <Button
              onClick={onCreateLocalNodeTempate}
              variant="outline"
            >
              Save Template
            </Button>
          </>
        )

      default:
        return null
    }
  }
  return renderActionButton()
}

export default ActionButton
