import React from 'react'
import { ScrollText } from 'lucide-react'
import { getWorkflowExecutions, LOGS_PAGE_SIZE } from './_actions/logs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import PageHeader, { PageBody } from '@/components/global/page-header'
import StatusBadge, { timeAgo } from '@/components/global/status-badge'
import EmptyState from '@/components/global/empty-state'
import { NodeIcon } from '@/components/global/node-icons'

type LogStep = { step: string; status: string; timestamp: string; details: unknown }

const parseLogs = (logs: string | null): LogStep[] => {
  try {
    const parsed = JSON.parse(logs ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const duration = (start: Date, end: Date | null) => {
  if (!end) return null
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`
}

const LogsPage = async () => {
  const executions = await getWorkflowExecutions()

  return (
    <>
      <PageHeader
        title="Logs"
        description={`Every workflow run, step by step. Showing the latest ${LOGS_PAGE_SIZE}.`}
      />
      <PageBody>
        {executions.length === 0 ? (
          <EmptyState
            icon={ScrollText}
            title="No runs yet"
            description="Publish a workflow or press “Run now” in the editor to see results here."
          />
        ) : (
          <Card className="overflow-hidden">
            <Accordion type="single" collapsible>
              {executions.map((execution) => {
                const steps = parseLogs(execution.logs)
                const took = duration(execution.createdAt, execution.completedAt)
                return (
                  <AccordionItem key={execution.id} value={execution.id} className="px-5 last:border-b-0">
                    <AccordionTrigger className="gap-4 py-4 hover:no-underline">
                      <div className="flex min-w-0 flex-1 items-center gap-4 text-left">
                        <StatusBadge status={execution.status} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{execution.workflow.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {execution.trigger} · {timeAgo(execution.createdAt)}
                            {took && ` · ${took}`}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {execution.error && (
                        <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                          {execution.error}
                        </p>
                      )}
                      {steps.length ? (
                        <ol className="space-y-3">
                          {steps.map((log, index) => (
                            <li key={index}>
                              <div className="flex items-center gap-2">
                                <NodeIcon type={log.step} className="h-7 w-7 rounded-md" />
                                <span className="text-sm font-medium">{log.step}</span>
                                <Badge variant={log.status === 'SUCCESS' ? 'success' : 'destructive'}>
                                  {log.status.toLowerCase()}
                                </Badge>
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <pre className="ml-9 mt-2 overflow-x-auto rounded-lg bg-muted p-3 text-xs">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-sm text-muted-foreground">No steps recorded.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </Card>
        )}
      </PageBody>
    </>
  )
}

export default LogsPage
