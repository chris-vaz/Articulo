'use server'

import { db } from '@/lib/db'
import { auth, currentUser } from '@clerk/nextjs/server'

export const getDashboardStats = async () => {
  const { userId } = await auth()
  const user = await currentUser()
  
  if (!userId || !user) return null

  const workflows = await db.workflows.count({
    where: {
      userId: userId,
    },
  })

  const publishedWorkflows = await db.workflows.count({
    where: {
      userId: userId,
      publish: true,
    },
  })

const executions = await db.workflowExecution.findMany({
  where: {
    workflow: {
      userId,
    },
  },
  select: {
    status: true,
  },
})

  const totalExecutions = executions.length
  const successfulExecutions = executions.filter((e) => e.status === 'SUCCESS').length
  const failedExecutions = executions.filter((e) => e.status === 'FAILED').length

  const userDetails = await db.user.findUnique({
      where: { clerkId: userId },
      select: { credits: true, tier: true }
  })

  return {
    workflows,
    publishedWorkflows,
    totalExecutions,
    successfulExecutions,
    failedExecutions,
    credits: userDetails?.credits || '0',
    tier: userDetails?.tier || 'Free',
  }
}
