'use server'
import { Option } from '@/components/ui/multiple-selector'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import { getDbUser, requireWorkflow } from '@/lib/auth'
import { WORKFLOW_TEMPLATES } from '@/lib/templates'

export const getGoogleListener = async () => {
  const { userId } = await auth()
  if (!userId) return null

  return db.user.findUnique({
    where: { clerkId: userId },
    select: { googleResourceId: true },
  })
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  await requireWorkflow(workflowId)
  const published = await db.workflows.update({
    where: { id: workflowId },
    data: { publish: state },
  })

  if (published.publish) return 'Workflow published'
  return 'Workflow unpublished'
}

// Saves the message/template for an action node. Credentials are always read
// from the user's stored connection, never from the browser.
export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: Option[]
) => {
  const workflow = await requireWorkflow(workflowId)

  if (type === 'Discord') {
    await db.workflows.update({
      where: { id: workflowId },
      data: { discordTemplate: content },
    })
    return 'Discord template saved'
  }

  if (type === 'Slack') {
    const slack = await db.slack.findFirst({ where: { userId: workflow.userId } })
    if (!slack) return 'Connect Slack first'

    const slackChannels = [
      ...new Set((channels ?? []).map((channel) => channel.value)),
    ]
    await db.workflows.update({
      where: { id: workflowId },
      data: {
        slackTemplate: content,
        slackAccessToken: null,
        slackChannels,
      },
    })
    return 'Slack template saved'
  }

  if (type === 'Notion') {
    const notion = await db.notion.findFirst({ where: { userId: workflow.userId } })
    if (!notion) return 'Connect Notion first'

    await db.workflows.update({
      where: { id: workflowId },
      data: {
        notionTemplate: content,
        notionAccessToken: null,
        notionDbId: notion.databaseId,
      },
    })
    return 'Notion template saved'
  }
}

export const onGetWorkflows = async () => {
  const { userId } = await auth()
  if (!userId) return []
  return db.workflows.findMany({ where: { userId } })
}

export const onCreateWorkflow = async (
  name: string,
  description: string,
  templateId?: string
) => {
  const user = await getDbUser()
  if (!user) return { message: 'Please sign in' }

  const template = WORKFLOW_TEMPLATES.find((t) => t.id === templateId)

  const workflow = await db.workflows.create({
    data: {
      userId: user.clerkId,
      name,
      description,
      nodes: JSON.stringify(template?.nodes ?? []),
      edges: JSON.stringify(template?.edges ?? []),
    },
  })

  if (workflow) return { message: 'workflow created', id: workflow.id }
  return { message: 'Oops! try again' }
}

export const onGetNodesEdges = async (flowId: string) => {
  const { userId } = await auth()
  if (!userId) return null
  const nodesEdges = await db.workflows.findFirst({
    where: { id: flowId, userId },
    select: { nodes: true, edges: true },
  })
  if (nodesEdges?.nodes && nodesEdges?.edges) return nodesEdges
  return null
}

export const onDeleteWorkflow = async (workflowId: string) => {
  await requireWorkflow(workflowId)
  await db.workflows.delete({ where: { id: workflowId } })
  return 'Workflow deleted'
}
