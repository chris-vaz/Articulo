import 'server-only'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export const LOGS_PAGE_SIZE = 50

export const getWorkflowExecutions = async () => {
  const { userId } = await auth()
  if (!userId) return []

  return db.workflowExecution.findMany({
    where: { workflow: { userId } },
    include: { workflow: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: LOGS_PAGE_SIZE,
  })
}
