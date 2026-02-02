
import { db } from './db'

export const startExecution = async (workflowId: string, trigger: string) => {
  try {
    const execution = await db.workflowExecution.create({
      data: {
        workflowId,
        trigger,
        status: 'PENDING',
        logs: '[]',
      },
    })
    return execution.id
  } catch (error) {
    console.error('Failed to start execution log', error)
    return null
  }
}

export const logStep = async (
  executionId: string,
  stepName: string,
  details: any,
  status: 'SUCCESS' | 'FAILED'
) => {
  try {
    const execution = await db.workflowExecution.findUnique({
      where: { id: executionId },
      select: { logs: true },
    })

    if (!execution) return

    const logs = execution.logs ? JSON.parse(execution.logs) : []
    logs.push({
      step: stepName,
      details,
      status,
      timestamp: new Date().toISOString(),
    })

    await db.workflowExecution.update({
      where: { id: executionId },
      data: {
        logs: JSON.stringify(logs),
      },
    })
  } catch (e) {
    console.error('Failed to log step', e)
  }
}

export const completeExecution = async (
  executionId: string,
  status: 'SUCCESS' | 'FAILED',
  error?: string
) => {
  try {
    await db.workflowExecution.update({
      where: { id: executionId },
      data: {
        status,
        completedAt: new Date(),
        error,
      },
    })
  } catch (e) {
    console.error('Failed to complete execution log', e)
  }
}
