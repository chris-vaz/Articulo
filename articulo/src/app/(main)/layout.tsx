import React from 'react'
import SessionRecovery, { SessionRecovered } from '@/components/global/session-recovery'
import Sidebar from '@/components/sidebar'
import InfoBar from '@/components/infobar'
import { getDbUser } from '@/lib/auth'
import { getPlan, UNLIMITED_CREDITS } from '@/lib/plans'

type Props = { children: React.ReactNode }

const Layout = async ({ children }: Props) => {
  // Also creates the user's database row on their first visit.
  const user = await getDbUser()
  // Session not ready yet (e.g. expired token on a cold load): let Clerk re-establish it.
  if (!user) return <SessionRecovery />
  const plan = getPlan(user?.tier)
  const summary = {
    planName: plan.id,
    credits: user?.credits ?? 0,
    allowance: plan.credits,
    unlimited: user?.credits === UNLIMITED_CREDITS,
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <SessionRecovered />
      <Sidebar plan={summary} />
      <div className="flex min-w-0 flex-1 flex-col">
        <InfoBar plan={summary} />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default Layout
