import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { ArrowLeft } from 'lucide-react'
import { ConnectionsProvider } from '@/providers/connections-provider'
import EditorProvider from '@/providers/editor-provider'
import { db } from '@/lib/db'
import EditorCanvas from './_components/editor-canvas'

type Props = { params: Promise<{ editorId: string }> }

const Page = async ({ params }: Props) => {
  const { editorId } = await params
  const { userId } = await auth()
  // No session yet: the layout shows SessionRecovery and re-renders once it's back.
  if (!userId) return null
  const workflow = await db.workflows.findFirst({
    where: { id: editorId, userId },
    select: { name: true, publish: true },
  })
  if (!workflow) notFound()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b px-4 py-2.5">
        <Link
          href="/workflows"
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Workflows
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="truncate text-sm font-medium">{workflow.name}</span>
        <span
          className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
            workflow.publish ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'
          }`}
        >
          {workflow.publish ? 'Live' : 'Draft'}
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <EditorProvider>
          <ConnectionsProvider>
            <EditorCanvas />
          </ConnectionsProvider>
        </EditorProvider>
      </div>
    </div>
  )
}

export default Page
