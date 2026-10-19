import 'server-only'
import Stripe from 'stripe'
import { db } from './db'
import { getPlan, getPlanByPriceId, PLANS } from './plans'

let client: Stripe | null = null

export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY)
  return client
}

// Moves the user onto a plan and resets their credits to that plan's allowance.
export const applyPlan = async (
  clerkId: string,
  planId: string,
  subscriptionId: string | null
) => {
  const plan = getPlan(planId)
  await db.user.update({
    where: { clerkId },
    data: {
      tier: plan.id,
      credits: plan.credits,
      stripeSubscriptionId: subscriptionId,
    },
  })
}

// Reads the plan from a subscription's first price.
export const planFromSubscription = (subscription: Stripe.Subscription) => {
  const priceId = subscription.items.data[0]?.price.id
  return getPlanByPriceId(priceId) ?? PLANS[0]
}
