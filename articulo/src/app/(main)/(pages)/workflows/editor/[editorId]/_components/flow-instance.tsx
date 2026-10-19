'use client'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import {
  onCreateNodesEdges,
  onRunWorkflowNow,
} from '../_actions/workflow-connections'
import { onFlowPublish } from '../../../_actions/workflow-connections'
import { toast } from 'sonner'
import { Loader2, Play, Rocket, Save } from 'lucide-react'

type Props = {
  children: React.ReactNode
  edges: any[]
  nodes: any[]
}

const FlowInstance = ({ children, edges, nodes }: Props) => {
  const pathname = usePathname()
  const workflowId = pathname.split('/').pop()!
  const [isRunning, setIsRunning] = useState(false)

  // Ordered list of action types, following the edges from the trigger.
  const flowPath = useMemo(
    () =>
      edges
        .map((edge) => nodes.find((node) => node.id === edge.target)?.type)
        .filter(Boolean) as string[],
    [edges, nodes]
  )

  const onFlowAutomation = async () => {
    const flow = await onCreateNodesEdges(
      workflowId,
      JSON.stringify(nodes),
      JSON.stringify(edges),
      JSON.stringify(flowPath)
    )
    if (flow) toast.message(flow.message)
  }

  const onPublishWorkflow = async () => {
    await onFlowAutomation()
    const response = await onFlowPublish(workflowId, true)
    if (response) toast.message(response)
  }

  const onRunNow = async () => {
    setIsRunning(true)
    try {
      await onFlowAutomation()
      toast.message(await onRunWorkflowNow(workflowId))
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap gap-2 border-b p-4">
        <Button
          variant="outline"
          onClick={onFlowAutomation}
          disabled={flowPath.length < 1}
        >
          <Save /> Save
        </Button>
        <Button
          variant="outline"
          disabled={flowPath.length < 1 || isRunning}
          onClick={onRunNow}
        >
          {isRunning ? <Loader2 className="animate-spin" /> : <Play />}
          Run now
        </Button>
        <Button
          disabled={flowPath.length < 1}
          onClick={onPublishWorkflow}
          className="ml-auto"
        >
          <Rocket /> Publish
        </Button>
      </div>
      {children}
    </div>
  )
}

export default FlowInstance
