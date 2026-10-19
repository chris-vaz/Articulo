import Image from 'next/image'
import { MousePointerClick, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NODE_IMAGES: Record<string, string> = {
  'Google Drive': '/googleDrive.png',
  Slack: '/slack.png',
  Notion: '/notion.png',
  Discord: '/discord.png',
}

// Small app logo for a workflow node type, used in lists and templates.
export const NodeIcon = ({ type, className }: { type: string; className?: string }) => {
  const src = NODE_IMAGES[type]
  return (
    <span
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg border bg-background',
        className
      )}
      title={type}
    >
      {src ? (
        <Image src={src} alt={type} width={18} height={18} className="object-contain" />
      ) : type === 'Trigger' ? (
        <MousePointerClick className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Zap className="h-4 w-4 text-muted-foreground" />
      )}
    </span>
  )
}

export const NodeIconRow = ({ types }: { types: string[] }) => {
  if (!types.length) return null
  return (
    <div className="flex items-center">
      {types.map((type, i) => (
        <span key={`${type}-${i}`} className="flex items-center">
          {i > 0 && <span className="h-px w-3 bg-border" />}
          <NodeIcon type={type} />
        </span>
      ))}
    </div>
  )
}

// Reads the node types out of a workflow's saved nodes JSON.
export const nodeTypesOf = (nodes: string | null | undefined) => {
  try {
    const parsed = JSON.parse(nodes ?? '[]')
    return Array.isArray(parsed) ? parsed.map((n: any) => String(n.type)) : []
  } catch {
    return []
  }
}
