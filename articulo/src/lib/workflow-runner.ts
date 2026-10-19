import 'server-only'
import type { Workflows } from '@prisma/client'
import { db } from './db'
import { UNLIMITED_CREDITS } from './plans'
import { startExecution, logStep, completeExecution } from './workflow-logger'
import { postToDiscordWebhook } from './integrations/discord'
import { postSlackMessages } from './integrations/slack'
import { createNotionPage } from './integrations/notion'

// Takes one credit from the user. Returns false when they have none left.
// Done in a single conditional UPDATE so concurrent runs can't overspend.
export const consumeCredit = async (clerkId: string) => {
  const user = await db.user.findUnique({
    where: { clerkId },
    select: { credits: true },
  })
  if (!user) return false
  if (user.credits === UNLIMITED_CREDITS) return true

  const { count } = await db.user.updateMany({
    where: { clerkId, credits: { gt: 0 } },
    data: { credits: { decrement: 1 } },
  })
  return count > 0
}

const parseFlowPath = (flowPath: string | null): string[] => {
  try {
    const parsed = JSON.parse(flowPath ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const runStep = async (flow: Workflows, step: string) => {
  switch (step) {
    case 'Discord': {
      const webhook = await db.discordWebhook.findFirst({
        where: { userId: flow.userId },
        select: { url: true },
      })
      if (!webhook) throw new Error('Discord is not connected')
      await postToDiscordWebhook(flow.discordTemplate ?? '', webhook.url)
      return { message: 'Posted to Discord' }
    }
    case 'Slack': {
      const slack = await db.slack.findFirst({
        where: { userId: flow.userId },
        select: { slackAccessToken: true },
      })
      if (!slack) throw new Error('Slack is not connected')
      await postSlackMessages(
        slack.slackAccessToken,
        flow.slackChannels,
        flow.slackTemplate ?? ''
      )
      return { message: 'Posted to Slack', channels: flow.slackChannels }
    }
    case 'Notion': {
      const notion = await db.notion.findFirst({
        where: { userId: flow.userId },
        select: { accessToken: true, databaseId: true },
      })
      if (!notion) throw new Error('Notion is not connected')
      await createNotionPage(
        flow.notionDbId || notion.databaseId,
        notion.accessToken,
        flow.notionTemplate ?? ''
      )
      return { message: 'Created page in Notion' }
    }
    default:
      return { message: `Skipped unsupported step "${step}"` }
  }
}

export const runWorkflow = async (flow: Workflows, trigger: string) => {
  const steps = parseFlowPath(flow.flowPath)
  if (!steps.length) return { status: 'SKIPPED' as const }

  const executionId = await startExecution(flow.id, trigger)
  if (!executionId) return { status: 'FAILED' as const }

  if (!(await consumeCredit(flow.userId))) {
    await completeExecution(executionId, 'FAILED', 'Out of credits. Upgrade your plan to keep running workflows.')
    return { status: 'FAILED' as const }
  }

  for (const step of steps) {
    try {
      const details = await runStep(flow, step)
      await logStep(executionId, step, details, 'SUCCESS')
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      await logStep(executionId, step, { error: message }, 'FAILED')
      await completeExecution(executionId, 'FAILED', `${step}: ${message}`)
      return { status: 'FAILED' as const }
    }
  }

  await completeExecution(executionId, 'SUCCESS')
  return { status: 'SUCCESS' as const }
}

// Runs every published workflow belonging to the user.
export const runPublishedWorkflows = async (clerkId: string, trigger: string) => {
  const flows = await db.workflows.findMany({
    where: { userId: clerkId, publish: true },
  })
  const results = []
  for (const flow of flows) results.push(await runWorkflow(flow, trigger))
  return results
}
