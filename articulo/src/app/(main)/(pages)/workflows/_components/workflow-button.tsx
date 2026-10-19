'use client'
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import Workflowform from '@/components/forms/workflow-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type Props = { label?: string; templateId?: string }

const WorkflowButton = ({ label = 'New workflow', templateId }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create a workflow</DialogTitle>
          <DialogDescription>
            Start from a template or a blank canvas. You can change everything later.
          </DialogDescription>
        </DialogHeader>
        <Workflowform defaultTemplateId={templateId} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default WorkflowButton
