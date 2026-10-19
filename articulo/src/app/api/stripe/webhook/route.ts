import type Stripe from 'stripe'
import { db } from '@/lib/db'
import { applyPlan, getStripe, planFromSubscription } from '@/lib/stripe'

export const runtime = 'nodejs'

const findClerkId = async (customerId: string | null, metadata?: Stripe.Metadata | null) => {
  if (metadata?.clerkId) return metadata.clerkId
  if (!customerId) return null
  const user = await db.user.findUnique({
    where: { stripeCustomerId: customerId },
    select: { clerkId: true },
  })
  return user?.clerkId ?? null
}

const customerIdOf = (customer: string | { id: string } | null) =>
  typeof customer === 'string' ? customer : customer?.id ?? null

export async function POST(req: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return new Response('Stripe is not configured', { status: 501 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get('stripe-signature') ?? '',
      secret
    )
  } catch (error) {
    console.error('Invalid Stripe signature', error)
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object
        const clerkId = await findClerkId(customerIdOf(sub.customer), sub.metadata)
        if (!clerkId) break
        if (['active', 'trialing'].includes(sub.status)) {
          await applyPlan(clerkId, planFromSubscription(sub).id, sub.id)
        } else if (['canceled', 'unpaid', 'incomplete_expired'].includes(sub.status)) {
          await applyPlan(clerkId, 'Free', null)
        }
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object
        const clerkId = await findClerkId(customerIdOf(sub.customer), sub.metadata)
        if (clerkId) await applyPlan(clerkId, 'Free', null)
        break
      }
      // Each paid renewal refills the plan's credits.
      case 'invoice.paid': {
        const invoice = event.data.object
        if (invoice.billing_reason !== 'subscription_cycle') break
        const user = await db.user.findUnique({
          where: { stripeCustomerId: customerIdOf(invoice.customer) ?? '' },
          select: { clerkId: true, tier: true, stripeSubscriptionId: true },
        })
        if (user) await applyPlan(user.clerkId, user.tier, user.stripeSubscriptionId)
        break
      }
    }
  } catch (error) {
    console.error('Stripe webhook handler failed', error)
    return new Response('Webhook handler failed', { status: 500 })
  }

  return new Response('ok')
}
