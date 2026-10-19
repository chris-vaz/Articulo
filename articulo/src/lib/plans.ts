// Subscription plans. Prices live in Stripe; set the Stripe Price IDs in .env.
// `credits` is the number of workflow runs per billing period (-1 = unlimited).

export type PlanId = 'Free' | 'Pro' | 'Unlimited'

export type Plan = {
  id: PlanId
  name: string
  price: string
  description: string
  credits: number
  features: string[]
  stripePriceEnv?: string
}

export const UNLIMITED_CREDITS = -1

export const PLANS: Plan[] = [
  {
    id: 'Free',
    name: 'Starter',
    price: '$0',
    description: 'Perfect for trying out Articulo.',
    credits: 10,
    features: ['10 workflow runs / month', 'All integrations', 'Execution logs'],
  },
  {
    id: 'Pro',
    name: 'Pro',
    price: '$29',
    description: 'For people automating serious workflows.',
    credits: 1000,
    features: ['1,000 workflow runs / month', 'All integrations', 'Priority support'],
    stripePriceEnv: 'STRIPE_PRICE_PRO',
  },
  {
    id: 'Unlimited',
    name: 'Unlimited',
    price: '$99',
    description: 'For teams that run everything through Articulo.',
    credits: UNLIMITED_CREDITS,
    features: ['Unlimited workflow runs', 'All integrations', 'Priority support'],
    stripePriceEnv: 'STRIPE_PRICE_UNLIMITED',
  },
]

export const getPlan = (id: string | null | undefined) =>
  PLANS.find((p) => p.id === id) ?? PLANS[0]

export const getStripePriceId = (plan: Plan) =>
  plan.stripePriceEnv ? process.env[plan.stripePriceEnv] : undefined

export const getPlanByPriceId = (priceId: string | null | undefined) =>
  PLANS.find((p) => priceId && getStripePriceId(p) === priceId)

export const formatCredits = (credits: number) =>
  credits === UNLIMITED_CREDITS ? 'Unlimited' : String(credits)
