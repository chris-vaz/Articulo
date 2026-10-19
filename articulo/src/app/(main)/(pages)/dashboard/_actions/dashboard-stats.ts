import 'server-only'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export const getDashboardStats = async () => {
  const { userId } = await auth()
  if (!userId) return null

  const [workflows, publishedWorkflows, statusCounts, connections, user, recentExecutions] =
    await Promise.all([
      db.workflows.count({ where: { userId } }),
      db.workflows.count({ where: { userId, publish: true } }),
      db.workflowExecution.groupBy({
        by: ['status'],
        where: { workflow: { userId } },
        _count: { _all: true },
      }),
      db.connections.count({ where: { userId } }),
      db.user.findUnique({
        where: { clerkId: userId },
        select: { credits: true, tier: true, name: true },
      }),
      db.workflowExecution.findMany({
        where: { workflow: { userId } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          status: true,
          trigger: true,
          createdAt: true,
          workflow: { select: { name: true } },
        },
      }),
    ])

  const countOf = (status: string) =>
    statusCounts.find((s) => s.status === status)?._count._all ?? 0
  const totalExecutions = statusCounts.reduce((sum, s) => sum + s._count._all, 0)

  return {
    name: user?.name ?? '',
    workflows,
    publishedWorkflows,
    connections,
    totalExecutions,
    successfulExecutions: countOf('SUCCESS'),
    failedExecutions: countOf('FAILED'),
    credits: user?.credits ?? 0,
    tier: user?.tier ?? 'Free',
    recentExecutions,
  }
}
