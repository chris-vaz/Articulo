import React from 'react'
import { Workflow as WorkflowIcon } from 'lucide-react'
import Workflow from './workflow'
import WorkflowButton from './workflow-button'
import EmptyState from '@/components/global/empty-state'
import { nodeTypesOf } from '@/components/global/node-icons'
import { onGetWorkflows } from '../_actions/workflow-connections'

const Workflows = async () => {
  const workflows = await onGetWorkflows()

  if (!workflows.length) {
    return (
      <EmptyState
        icon={WorkflowIcon}
        title="No workflows yet"
        description="Create your first automation from a template or a blank canvas."
        action={<WorkflowButton label="Create workflow" />}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {workflows.map((flow) => (
        <Workflow
          key={flow.id}
          id={flow.id}
          name={flow.name}
          description={flow.description}
          publish={flow.publish}
          nodeTypes={nodeTypesOf(flow.nodes)}
        />
      ))}
    </div>
  )
}

export default Workflows
