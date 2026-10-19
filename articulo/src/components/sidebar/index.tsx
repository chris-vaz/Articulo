'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Sparkles } from 'lucide-react'
import { menuOptions } from '@/lib/constant'
import { cn } from '@/lib/utils'
import Logo from '@/components/global/logo'
import { Progress } from '@/components/ui/progress'

export type PlanSummary = {
  planName: string
  credits: number
  allowance: number
  unlimited: boolean
}

export const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathName = usePathname()

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {menuOptions.map(({ name, href, icon: Icon }) => {
        const active = pathName === href || pathName.startsWith(`${href}/`)
        return (
          <Link
            key={name}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                active ? 'text-primary' : 'group-hover:text-foreground'
              )}
            />
            {name}
          </Link>
        )
      })}
    </nav>
  )
}

export const PlanWidget = ({ plan }: { plan: PlanSummary }) => {
  const used = plan.unlimited ? 0 : Math.max(plan.allowance - plan.credits, 0)
  const pct = plan.unlimited || !plan.allowance ? 100 : (plan.credits / plan.allowance) * 100

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{plan.planName} plan</span>
        <span className="text-muted-foreground">
          {plan.unlimited ? '∞' : `${plan.credits}/${plan.allowance}`}
        </span>
      </div>
      <Progress value={pct} className="mt-3 h-1.5" aria-label="Workflow runs remaining" />
      <p className="mt-2 text-xs text-muted-foreground">
        {plan.unlimited ? 'Unlimited workflow runs' : `${used} runs used this period`}
      </p>
      {plan.planName !== 'Unlimited' && (
        <Link
          href="/billing"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Sparkles className="h-3.5 w-3.5" /> Upgrade
        </Link>
      )}
    </div>
  )
}

const Sidebar = ({ plan }: { plan: PlanSummary }) => {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar px-3 py-4 md:flex">
      <Logo href="/dashboard" className="px-3 pb-6" />
      <NavLinks />
      <div className="mt-auto">
        <PlanWidget plan={plan} />
      </div>
    </aside>
  )
}

export default Sidebar
