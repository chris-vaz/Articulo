import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

const EmptyState = ({ icon: Icon, title, description, action, className }: Props) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 px-6 py-16 text-center',
      className
    )}
  >
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
)

export default EmptyState
