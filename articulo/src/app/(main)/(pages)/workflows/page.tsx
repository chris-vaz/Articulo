import React from 'react'
import WorkflowButton from './_components/workflow-button'
import Workflows from './_components'
import PageHeader, { PageBody } from '@/components/global/page-header'

const Page = () => {
  return (
    <>
      <PageHeader
        title="Workflows"
        description="Build automations that connect your apps. Toggle a workflow on to make it live."
        actions={<WorkflowButton />}
      />
      <PageBody>
        <Workflows />
      </PageBody>
    </>
  )
}

export default Page
