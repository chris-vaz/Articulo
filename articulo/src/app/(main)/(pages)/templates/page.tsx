import React from 'react'
import { Card } from '@/components/ui/card'
import { WORKFLOW_TEMPLATES } from '@/lib/templates'
import PageHeader, { PageBody } from '@/components/global/page-header'
import { NodeIconRow } from '@/components/global/node-icons'
import WorkflowButton from '../workflows/_components/workflow-button'

const TemplatesPage = () => {
  const templates = WORKFLOW_TEMPLATES.filter((t) => t.nodes.length)

  return (
    <>
      <PageHeader
        title="Templates"
        description="Ready-made automations. Pick one, connect your apps, and publish."
      />
      <PageBody>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col gap-4 p-5">
              <NodeIconRow types={template.nodes.map((n) => n.type)} />
              <div className="flex-1">
                <h3 className="font-semibold">{template.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
              </div>
              <WorkflowButton label="Use template" templateId={template.id} />
            </Card>
          ))}
        </div>
      </PageBody>
    </>
  )
}

export default TemplatesPage
