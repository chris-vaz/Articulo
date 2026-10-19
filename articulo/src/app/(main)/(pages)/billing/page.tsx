import React from 'react'
import { getDbUser } from '@/lib/auth'
import { features } from '@/lib/env'
import { formatCredits, getPlan, getStripePriceId, PLANS } from '@/lib/plans'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PageHeader, { PageBody } from '@/components/global/page-header'
import { Check } from 'lucide-react'
import PlanButton from './_components/plan-button'
import ManageBillingButton from './_components/manage-billing-button'

type Props = {
  searchParams: Promise<{ success?: string; canceled?: string }>
}

const BillingPage = async ({ searchParams }: Props) => {
  const { success, canceled } = await searchParams
  const user = await getDbUser()
  if (!user) return null

  const currentPlan = getPlan(user.tier)
  const paymentsEnabled = features.stripe()

  return (
    <>
      <PageHeader title="Billing" description="Manage your plan and workflow runs." />
      <PageBody className="space-y-6">
        {success && (
          <p className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm">
            Payment received. Your plan updates as soon as Stripe confirms it.
          </p>
        )}
        {canceled && (
          <p className="rounded-lg border p-3 text-sm text-muted-foreground">
            Checkout canceled. You have not been charged.
          </p>
        )}
        {!paymentsEnabled && (
          <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm">
            Payments are not configured. Add STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET and the
            STRIPE_PRICE_* ids to your .env to enable upgrades (see SETUP.md).
          </p>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Current plan: {currentPlan.name}</CardTitle>
              <CardDescription>
                {formatCredits(user.credits)} workflow runs remaining
              </CardDescription>
            </div>
            {paymentsEnabled && user.stripeCustomerId && <ManageBillingButton />}
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan.id
            const purchasable =
              paymentsEnabled && !!getStripePriceId(plan) && !isCurrent
            return (
              <Card
                key={plan.id}
                className={`flex flex-col ${isCurrent ? 'border-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {isCurrent && <Badge>Current</Badge>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4">
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <ul className="flex-1 space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  {plan.stripePriceEnv && (
                    <PlanButton planId={plan.id} disabled={!purchasable}>
                      {isCurrent ? 'Current plan' : `Upgrade to ${plan.name}`}
                    </PlanButton>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </PageBody>
    </>
  )
}

export default BillingPage
