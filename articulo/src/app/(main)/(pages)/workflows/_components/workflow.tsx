'use client'
import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { NodeIconRow } from '@/components/global/node-icons'
import { onDeleteWorkflow, onFlowPublish } from '../_actions/workflow-connections'

type Props = {
  name: string
  description: string
  id: string
  publish: boolean | null
  nodeTypes: string[]
}

const Workflow = ({ description, id, name, publish, nodeTypes }: Props) => {
  const router = useRouter()
  const [published, setPublished] = useState(!!publish)
  const [pending, startTransition] = useTransition()

  const onToggle = (checked: boolean) => {
    setPublished(checked)
    startTransition(async () => {
      try {
        toast.success(await onFlowPublish(id, checked))
      } catch {
        setPublished(!checked)
        toast.error('Could not update workflow')
      }
    })
  }

  const onDelete = () => {
    startTransition(async () => {
      await onDeleteWorkflow(id)
      toast.success('Workflow deleted')
      router.refresh()
    })
  }

  return (
    <Card className="group relative flex flex-col gap-4 p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <NodeIconRow types={nodeTypes.length ? nodeTypes : ['Trigger']} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative z-10 -mr-2 -mt-2 h-8 w-8" aria-label="Workflow actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/workflows/editor/${id}`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={onDelete}
              disabled={pending}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="min-w-0 flex-1">
        <Link href={`/workflows/editor/${id}`} className="after:absolute after:inset-0">
          <h3 className="truncate font-semibold">{name}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={`h-2 w-2 rounded-full ${published ? 'bg-success' : 'bg-muted-foreground/40'}`}
          />
          {published ? 'Live' : 'Draft'}
        </span>
        <Switch
          checked={published}
          onCheckedChange={onToggle}
          disabled={pending}
          aria-label={published ? 'Unpublish workflow' : 'Publish workflow'}
          className="relative z-10"
        />
      </div>
    </Card>
  )
}

export default Workflow
