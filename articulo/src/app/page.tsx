import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  GitBranch,
  History,
  LayoutTemplate,
  Lock,
  MousePointerClick,
  Plug,
  Rocket,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import Navbar from '@/components/global/navbar'
import Logo from '@/components/global/logo'
import { Button } from '@/components/ui/button'
import { PLANS } from '@/lib/plans'

// Fully static marketing page: no client JS beyond the auth buttons in the navbar.
export const dynamic = 'force-static'

const integrations = [
  { name: 'Google Drive', src: '/googleDrive.png' },
  { name: 'Slack', src: '/slack.png' },
  { name: 'Notion', src: '/notion.png' },
  { name: 'Discord', src: '/discord.png' },
]

const features = [
  {
    icon: MousePointerClick,
    title: 'Visual workflow builder',
    body: 'Drag, drop and connect steps on an infinite canvas. No code, no YAML.',
  },
  {
    icon: Plug,
    title: 'Native integrations',
    body: 'Google Drive, Slack, Notion and Discord connected with secure OAuth.',
  },
  {
    icon: Zap,
    title: 'Real-time triggers',
    body: 'Workflows start the moment something changes in your Google Drive.',
  },
  {
    icon: History,
    title: 'Step-by-step logs',
    body: 'Every run is recorded with the result of each step, so nothing is a black box.',
  },
  {
    icon: LayoutTemplate,
    title: 'Ready-made templates',
    body: 'Start from proven automations and customise them in minutes.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by default',
    body: 'Tokens stay on the server, every request is scoped to your account.',
  },
]

const steps = [
  { icon: Plug, title: 'Connect your apps', body: 'Sign in with Google and link Slack, Notion or Discord in one click.' },
  { icon: GitBranch, title: 'Design the flow', body: 'Pick a trigger, add actions and write the messages each step should send.' },
  { icon: Rocket, title: 'Publish and relax', body: 'Flip the switch. Articulo runs it for you and logs every result.' },
]

const faqs = [
  {
    q: 'Do I need to know how to code?',
    a: 'No. Workflows are built visually by dragging steps onto a canvas and connecting them.',
  },
  {
    q: 'What counts as a workflow run?',
    a: 'Each time a published workflow is triggered and executes its steps, that is one run. Test messages from the editor are free.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Manage or cancel your subscription from the billing page at any time. You keep access until the end of the period.',
  },
  {
    q: 'Is my data safe?',
    a: 'Access tokens are stored server-side and never exposed to other users. You can disconnect an app at any time.',
  },
]

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        {/* Hero */}
        <section className="relative pt-32 sm:pt-40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]"
          />
          <div className="container flex flex-col items-center text-center">
            <Link
              href="#features"
              className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Visual automation for modern teams
              <ArrowRight className="h-3 w-3" />
            </Link>
            <h1 className="max-w-4xl animate-fade-up text-balance text-4xl font-semibold tracking-tight text-gradient [animation-delay:80ms] sm:text-6xl lg:text-7xl">
              Automate your work across <span className="text-gradient-brand">every app</span>
            </h1>
            <p className="mt-6 max-w-2xl animate-fade-up text-balance text-lg text-muted-foreground [animation-delay:160ms]">
              Articulo connects Google Drive, Slack, Notion and Discord with workflows you build
              visually. Set it up once and let it run.
            </p>
            <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Start for free <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
            <p className="mt-4 animate-fade-up text-xs text-muted-foreground [animation-delay:300ms]">
              Free plan included · No credit card required
            </p>

            <div className="relative mt-16 w-full max-w-6xl animate-fade-up [animation-delay:360ms]">
              <div
                aria-hidden="true"
                className="absolute -inset-x-10 -top-10 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-b from-primary/30 to-transparent blur-3xl"
              />
              <div className="rounded-2xl border bg-card/60 p-2 shadow-2xl backdrop-blur">
                <Image
                  src="/screenshots/editor.webp"
                  alt="The Articulo workflow editor connecting Google Drive, Slack and Notion"
                  width={1920}
                  height={1200}
                  priority
                  sizes="(min-width: 1280px) 1152px, 100vw"
                  className="rounded-xl border"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="container py-20" aria-label="Integrations">
          <p className="text-center text-sm text-muted-foreground">
            Works with the tools you already use
          </p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {integrations.map((app) => (
              <li
                key={app.name}
                className="flex items-center gap-3 rounded-xl border bg-card px-5 py-3 text-sm font-medium"
              >
                <Image src={app.src} alt="" width={22} height={22} />
                {app.name}
              </li>
            ))}
          </ul>
        </section>

        {/* Features */}
        <section id="features" className="container scroll-mt-24 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to automate the busywork
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="container scroll-mt-24 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">How it works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              From idea to automation in three steps
            </h2>
          </div>
          <ol className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="relative rounded-2xl border bg-card p-8">
                <span className="text-5xl font-semibold text-muted/80 dark:text-muted">
                  0{i + 1}
                </span>
                <Icon className="absolute right-8 top-8 h-5 w-5 text-primary" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { src: '/screenshots/dashboard.webp', alt: 'Articulo dashboard with run statistics' },
              { src: '/screenshots/logs.webp', alt: 'Step-by-step execution logs in Articulo' },
            ].map(({ src, alt }) => (
              <div key={src} className="rounded-2xl border bg-card p-2">
                <Image
                  src={src}
                  alt={alt}
                  width={1920}
                  height={1200}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-xl border"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="container scroll-mt-24 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">Pricing</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple pricing that scales with you
            </h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you need more runs.</p>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan) => {
              const featured = plan.id === 'Pro'
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border bg-card p-8 ${
                    featured ? 'border-primary shadow-xl shadow-primary/10' : ''
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  <p className="mt-6 text-4xl font-semibold tracking-tight">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-8" variant={featured ? 'default' : 'outline'}>
                    <Link href="/sign-up">{plan.id === 'Free' ? 'Get started' : `Start with ${plan.name}`}</Link>
                  </Button>
                </div>
              )
            })}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container max-w-3xl scroll-mt-24 py-20">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-12 divide-y rounded-2xl border bg-card">
            {faqs.map((faq) => (
              <details key={faq.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {faq.q}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container py-20">
          <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-16 text-center sm:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/25 blur-[100px]"
            />
            <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to automate your workflow?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Build your first automation in minutes. No credit card required.
            </p>
            <Button asChild size="lg" className="relative mt-8">
              <Link href="/sign-up">
                Get started for free <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 text-sm text-muted-foreground sm:flex-row">
          <Logo />
          <p className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" /> © {new Date().getFullYear()} Articulo. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}
