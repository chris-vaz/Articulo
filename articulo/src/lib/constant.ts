import {
  CreditCard,
  LayoutDashboard,
  LayoutTemplate,
  Plug,
  ScrollText,
  Settings,
  Workflow,
} from 'lucide-react'
import { Connection } from './types'

export const menuOptions = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Workflows', icon: Workflow, href: '/workflows' },
  { name: 'Templates', icon: LayoutTemplate, href: '/templates' },
  { name: 'Logs', icon: ScrollText, href: '/logs' },
  { name: 'Connections', icon: Plug, href: '/connections' },
  { name: 'Billing', icon: CreditCard, href: '/billing' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

// Nodes available in the editor. Only nodes the workflow runner can execute
// are listed, so users can't build automations that silently do nothing.
export const EditorCanvasDefaultCardTypes = {
  'Google Drive': {
    description:
      'Start the workflow when files change in your Google Drive.',
    type: 'Trigger',
  },
  Trigger: {
    description: 'Start the workflow manually with the Run now button.',
    type: 'Trigger',
  },
  Slack: { description: 'Send a notification to Slack channels.', type: 'Action' },
  Notion: { description: 'Create entries directly in a Notion database.', type: 'Action' },
  Discord: {
    description: 'Post messages to your Discord server.',
    type: 'Action',
  },
} as Record<string, { description: string; type: 'Trigger' | 'Action' }>

export const CONNECTIONS: Connection[] = [
  {
    title: 'Google Drive',
    description: 'Start workflows when files change in your Google Drive.',
    image: '/googleDrive.png',
    connectionKey: 'googleNode',
    alwaysTrue: true,
  },
  {
    title: 'Discord',
    description: 'Post messages to a channel in your Discord server.',
    image: '/discord.png',
    connectionKey: 'discordNode',
    accessTokenKey: 'webhookURL',
  },
  {
    title: 'Notion',
    description: 'Create pages in a Notion database automatically.',
    image: '/notion.png',
    connectionKey: 'notionNode',
    accessTokenKey: 'accessToken',
  },
  {
    title: 'Slack',
    description: 'Send notifications to Slack channels through your own bot.',
    image: '/slack.png',
    connectionKey: 'slackNode',
    accessTokenKey: 'slackAccessToken',
    slackSpecial: true,
  },
]