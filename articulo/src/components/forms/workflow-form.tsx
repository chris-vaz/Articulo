'use client'
import { WorkflowFormSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { onCreateWorkflow } from '@/app/(main)/(pages)/workflows/_actions/workflow-connections'
import { WORKFLOW_TEMPLATES } from '@/lib/templates'
import { NodeIconRow } from '../global/node-icons'
import { cn } from '@/lib/utils'

type Props = {
  defaultTemplateId?: string
  onDone?: () => void
}

const Workflowform = ({ defaultTemplateId = 'blank', onDone }: Props) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof WorkflowFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(WorkflowFormSchema),
    defaultValues: {
      name: '',
      description: '',
      templateId: defaultTemplateId,
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const handleSubmit = async (values: z.infer<typeof WorkflowFormSchema>) => {
    const workflow = await onCreateWorkflow(values.name, values.description, values.templateId)
    if (workflow && 'id' in workflow && workflow.id) {
      toast.success('Workflow created')
      onDone?.()
      router.push(`/workflows/editor/${workflow.id}`)
    } else {
      toast.error(workflow?.message ?? 'Something went wrong')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 text-left"
      >
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start from</FormLabel>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="radiogroup">
                {WORKFLOW_TEMPLATES.map((template) => {
                  const selected = field.value === template.id
                  return (
                    <button
                      key={template.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(template.id)}
                      className={cn(
                        'flex flex-col gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-muted',
                        selected && 'border-primary bg-accent hover:bg-accent'
                      )}
                    >
                      <span className="text-sm font-medium">{template.name}</span>
                      {template.nodes.length ? (
                        <NodeIconRow types={template.nodes.map((n) => n.type)} />
                      ) : (
                        <span className="text-xs text-muted-foreground">Empty canvas</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </FormItem>
          )}
        />
        <FormField
          disabled={isSubmitting}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. New invoices to Slack" autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isSubmitting}
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="What does this automation do?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isSubmitting} type="submit">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> Creating
            </>
          ) : (
            'Create and open editor'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default Workflowform
