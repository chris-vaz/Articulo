'use client'
import { EditorCanvasTypes, EditorNodeType } from '@/lib/types'
import { useNodeConnections } from '@/providers/connections-provider'
import { useEditor } from '@/providers/editor-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import React, { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { CONNECTIONS, EditorCanvasDefaultCardTypes } from '@/lib/constant'
import {
  fetchBotSlackChannels,
  onConnections,
  onDragStart,
} from '@/lib/editor-utils'
import { NodeIcon } from '@/components/global/node-icons'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import RenderConnectionAccordion from './render-connection-accordion'
import RenderOutputAccordion from './render-output-accordian'
import { useFuzzieStore } from '@/store'

type Props = {
  nodes: EditorNodeType[]
}

const EditorCanvasSidebar = ({ nodes }: Props) => {
  const { state } = useEditor()
  const { nodeConnection } = useNodeConnections()
  const { googleFile, setSlackChannels } = useFuzzieStore()
  useEffect(() => {
    if (state) {
      onConnections(nodeConnection, state, googleFile)
    }
  }, [state])

  useEffect(() => {
    if (nodeConnection.slackNode.slackAccessToken) {
      fetchBotSlackChannels(setSlackChannels)
    }
  }, [nodeConnection.slackNode.slackAccessToken])

  return (
    <aside className="flex h-full min-h-0 flex-col">
      <Tabs
        defaultValue="actions"
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList className="mx-4 grid grid-cols-2">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent
          value="actions"
          className="flex flex-col gap-3 overflow-y-auto p-4"
        >
          <p className="text-xs text-muted-foreground">
            {nodes.length
              ? 'Drag an action onto the canvas, then connect it to the previous step.'
              : 'Start by dragging a trigger onto the canvas.'}
          </p>
          {Object.entries(EditorCanvasDefaultCardTypes)
            .filter(
              ([_, cardType]) =>
                (!nodes.length && cardType.type === 'Trigger') ||
                (nodes.length && cardType.type === 'Action')
            )
            .map(([cardKey, cardValue]) => (
              <div
                key={cardKey}
                draggable
                className="flex w-full cursor-grab items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/50 hover:bg-accent/40 active:cursor-grabbing"
                onDragStart={(event) =>
                  onDragStart(event, cardKey as EditorCanvasTypes)
                }
              >
                <NodeIcon type={cardKey} className="h-9 w-9" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{cardKey}</p>
                  <p className="text-xs text-muted-foreground">{cardValue.description}</p>
                </div>
              </div>
            ))}
        </TabsContent>
        <TabsContent
          value="settings"
          className="overflow-y-auto"
        >
          <div className="px-4 py-3 text-base font-semibold">
            {state.editor.selectedNode.data.title || 'Select a node on the canvas to configure it'}
          </div>

          <Accordion type="multiple">
            <AccordionItem
              value="Options"
              className="border-y-[1px] px-2"
            >
              <AccordionTrigger className="!no-underline">
                Account
              </AccordionTrigger>
              <AccordionContent>
                {CONNECTIONS.map((connection) => (
                  <RenderConnectionAccordion
                    key={connection.title}
                    state={state}
                    connection={connection}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="Expected Output"
              className="px-2"
            >
              <AccordionTrigger className="!no-underline">
                Action
              </AccordionTrigger>
              <RenderOutputAccordion
                state={state}
                nodeConnection={nodeConnection}
              />
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </aside>
  )
}

export default EditorCanvasSidebar