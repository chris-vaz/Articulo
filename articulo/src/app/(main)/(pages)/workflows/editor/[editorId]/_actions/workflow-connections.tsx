'use server'

import { db } from '@/lib/db'
import { requireWorkflow } from '@/lib/auth'
import { runWorkflow } from '@/lib/workflow-runner'

export const onCreateNodesEdges = async (
  flowId: string,
  nodes: string,
  edges: string,
  flowPath: string
) => {
  await requireWorkflow(flowId)
  const flow = await db.workflows.update({
    where: { id: flowId },
    data: { nodes, edges, flowPath },
  })

  if (flow) return { message: 'flow saved' }
}

// Runs the saved workflow once right now (uses one credit).
export const onRunWorkflowNow = async (flowId: string) => {
  const flow = await requireWorkflow(flowId)
  const result = await runWorkflow(flow, 'Manual')
  if (result.status === 'SKIPPED') return 'Save the workflow with at least one action first'
  return result.status === 'SUCCESS'
    ? 'Workflow ran successfully'
    : 'Workflow failed. Check the Logs page for details'
}
