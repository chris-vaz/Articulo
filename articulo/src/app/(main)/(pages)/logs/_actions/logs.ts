'use server'

import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export const getWorkflowExecutions = async () => {
  const { userId } = await auth()
  if (!userId) return []

  const executions = await db.workflowExecution.findMany({
    where: {
      workflow: {
        userId: userId,
      },
    },
    include: {
      workflow: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return executions
}
