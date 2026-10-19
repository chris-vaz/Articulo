import React from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Circle,
  CreditCard,
  LayoutTemplate,
  Layers,
  Plug,
  ScrollText,
  Zap,
} from 'lucide-react'
import { getDashboardStats } from './_actions/dashboard-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader, { PageBody } from '@/components/global/page-header'
import StatusBadge, { timeAgo } from '@/components/global/status-badge'
import EmptyState from '@/components/global/empty-state'
import WorkflowButton from '../workflows/_components/workflow-button'
import { formatCredits } from '@/lib/plans'
import { cn } from '@/lib/utils'

const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: React.ReactNode
  hint: React.ReactNode
  icon: React.ElementType
}) => (
  <Card>
    <CardContent className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight sm:mt-3 sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </CardContent>
  </Card>
)

const DashboardPage = async () => {
  const stats = await getDashboardStats()
  if (!stats) return null

  const successRate = stats.totalExecutions
    ? Math.round((stats.successfulExecutions / stats.totalExecutions) * 100)
    : null

  const steps = [
    { label: 'Connect an app', done: stats.connections > 0, href: '/connections' },
    { label: 'Create your first workflow', done: stats.workflows > 0, href: '/workflows' },
    { label: 'Publish a workflow', done: stats.publishedWorkflows > 0, href: '/workflows' },
    { label: 'Run an automation', done: stats.totalExecutions > 0, href: '/workflows' },
  ]
  const stepsDone = steps.filter((s) => s.done).length

  return (
    <>
      <PageHeader
        title={stats.name ? `Welcome back, ${stats.name}` : 'Dashboard'}
        description="An overview of your automations."
        actions={<WorkflowButton label="New workflow" />}
      />
      <PageBody className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Workflows"
            value={stats.workflows}
            hint={`${stats.publishedWorkflows} published`}
            icon={Layers}
          />
          <StatCard
            label="Total runs"
            value={stats.totalExecutions}
            hint={
              <span className="flex gap-3">
                <span className="text-success">{stats.successfulExecutions} succeeded</span>
                <span className="text-destructive">{stats.failedExecutions} failed</span>
              </span>
            }
            icon={Activity}
          />
          <StatCard
            label="Success rate"
            value={successRate === null ? '—' : `${successRate}%`}
            hint="Across all runs"
            icon={CheckCircle2}
          />
          <StatCard
            label="Runs remaining"
            value={formatCredits(stats.credits)}
            hint={
              <Link href="/billing" className="hover:text-foreground">
                {stats.tier} plan · Manage →
              </Link>
            }
            icon={Zap}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Recent runs</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/logs">
                  View all <ArrowRight />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats.recentExecutions.length ? (
                <ul className="divide-y">
                  {stats.recentExecutions.map((run) => (
                    <li key={run.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{run.workflow.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {run.trigger} · {timeAgo(run.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={run.status} />
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={ScrollText}
                  title="No runs yet"
                  description="When your workflows run, the results show up here."
                  className="border-0 bg-transparent py-10"
                />
              )}
            </CardContent>
          </Card>

          {stepsDone < steps.length ? (
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">Getting started</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {stepsDone} of {steps.length} complete
                </p>
              </CardHeader>
              <CardContent className="space-y-1">
                {steps.map((step) => (
                  <Link
                    key={step.label}
                    href={step.href}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={cn(step.done && 'text-muted-foreground line-through')}>
                      {step.label}
                    </span>
                  </Link>
                ))}
                {stats.connections === 0 && (
                  <Button asChild variant="outline" className="mt-3 w-full">
                    <Link href="/connections">
                      <Plug /> Connect your apps
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">Quick actions</CardTitle>
                <p className="text-sm text-muted-foreground">Keep your automations moving.</p>
              </CardHeader>
              <CardContent className="grid gap-2">
                {[
                  { href: '/templates', label: 'Browse templates', icon: LayoutTemplate },
                  { href: '/connections', label: 'Manage connections', icon: Plug },
                  { href: '/logs', label: 'Review failed runs', icon: ScrollText },
                  { href: '/billing', label: 'Plans & billing', icon: CreditCard },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:border-primary/40 hover:bg-muted"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </PageBody>
    </>
  )
}

export default DashboardPage
