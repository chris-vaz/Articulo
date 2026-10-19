import { EditorCanvasCardType } from '@/lib/types'
import { useEditor } from '@/providers/editor-provider'
import React from 'react'
import { Position, useNodeId } from 'reactflow'
import CustomHandle from './custom-handle'
import { NodeIcon } from '@/components/global/node-icons'
import { EditorCanvasDefaultCardTypes } from '@/lib/constant'
import { cn } from '@/lib/utils'

const EditorCanvasCardSingle = ({ data }: { data: EditorCanvasCardType }) => {
  const { dispatch, state } = useEditor()
  const nodeId = useNodeId()
  const isTrigger = EditorCanvasDefaultCardTypes[data.type]?.type === 'Trigger'
  const isSelected = state.editor.selectedNode.id === nodeId

  return (
    <>
      {!isTrigger && (
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{ zIndex: 100 }}
        />
      )}
      <div
        onClick={(e) => {
          e.stopPropagation()
          const val = state.editor.elements.find((n) => n.id === nodeId)
          if (val)
            dispatch({
              type: 'SELECTED_ELEMENT',
              payload: {
                element: val,
              },
            })
        }}
        className={cn(
          'w-[280px] rounded-xl border bg-card p-4 shadow-sm transition-shadow',
          isSelected ? 'border-primary ring-2 ring-primary/30' : 'hover:shadow-md'
        )}
      >
        <div className="flex items-start gap-3">
          <NodeIcon type={data.type} className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold">{data.title}</p>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                  isTrigger ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {isTrigger ? 'Trigger' : 'Action'}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{data.description}</p>
          </div>
        </div>
      </div>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        id="a"
      />
    </>
  )
}

export default EditorCanvasCardSingle
