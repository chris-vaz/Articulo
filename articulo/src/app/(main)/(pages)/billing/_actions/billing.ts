'use server'

import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getDbUser } from '@/lib/auth'
import { appUrl } from '@/lib/env'
import { getPlan, getStripePriceId } from '@/lib/plans'
import { getStripe } from '@/lib/stripe'

export const onCheckout = async (planId: string) => {
  const stripe = getStripe()
  const user = await getDbUser()
  if (!stripe || !user) return { error: 'Payments are not configured yet.' }

  const plan = getPlan(planId)
  const priceId = getStripePriceId(plan)
  if (!priceId) return { error: `No Stripe price set for the ${plan.name} plan.` }

  let customerId = user.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { clerkId: user.clerkId },
    })
    customerId = customer.id
    await db.user.update({
      where: { clerkId: user.clerkId },
      data: { stripeCustomerId: customerId },
    })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.clerkId,
    metadata: { clerkId: user.clerkId, planId: plan.id },
    subscription_data: { metadata: { clerkId: user.clerkId, planId: plan.id } },
    success_url: `${appUrl()}/billing?success=1`,
    cancel_url: `${appUrl()}/billing?canceled=1`,
    allow_promotion_codes: true,
  })

  redirect(session.url!)
}

export const onManageBilling = async () => {
  const stripe = getStripe()
  const user = await getDbUser()
  if (!stripe || !user?.stripeCustomerId) {
    return { error: 'No billing account found.' }
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${appUrl()}/billing`,
  })
  redirect(session.url)
}
