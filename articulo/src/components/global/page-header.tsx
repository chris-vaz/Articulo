import React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

const PageHeader = ({ title, description, actions, className }: Props) => (
  <div
    className={cn(
      'flex flex-col gap-4 border-b px-6 py-6 sm:flex-row sm:items-end sm:justify-between lg:px-8',
      className
    )}
  >
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
)

export const PageBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('mx-auto w-full max-w-6xl px-6 py-6 lg:px-8', className)}>{children}</div>
)

export default PageHeader
