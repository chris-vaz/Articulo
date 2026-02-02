import React from 'react'
import { getWorkflowExecutions } from './_actions/logs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const LogsPage = async () => {
  const executions = await getWorkflowExecutions()

  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Logs
      </h1>
      <div className="flex flex-col gap-4 p-6 w-full">
        {executions.length === 0 ? (
          <div className="flex items-center justify-center w-full h-24 text-muted-foreground">
            No execution logs found.
          </div>
        ) : (
          <div className="grid gap-4">
            {executions.map((execution) => (
              <Card key={execution.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-lg font-medium">
                      {execution.workflow.name}
                    </CardTitle>
                    <CardDescription>
                      Trigger: {execution.trigger}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      execution.status === 'SUCCESS'
                        ? 'default'
                        : execution.status === 'FAILED'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {execution.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex justify-between">
                        <span>Started:</span>
                        <span>{new Date(execution.createdAt).toLocaleString()}</span>
                    </div>
                    {execution.completedAt && (
                        <div className="flex justify-between">
                            <span>Completed:</span>
                            <span>{new Date(execution.completedAt).toLocaleString()}</span>
                        </div>
                    )}
                    {execution.error && (
                        <div className="text-red-500 font-semibold mt-2">
                            Error: {execution.error}
                        </div>
                    )}
                  </div>
                  
                  {execution.logs && execution.logs !== '[]' && (
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="logs">
                        <AccordionTrigger>View Execution Steps</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-2 mt-2">
                            {JSON.parse(execution.logs).map((log: any, index: number) => (
                              <div key={index} className="flex flex-col gap-1 border-l-2 border-muted pl-4 py-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{log.status}</Badge>
                                  <span className="font-semibold">{log.step}</span>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LogsPage
