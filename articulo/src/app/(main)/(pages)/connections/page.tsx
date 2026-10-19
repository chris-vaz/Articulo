import { CONNECTIONS } from '@/lib/constant'
import React from 'react'
import ConnectionCard from './_components/connection-card'
import { db } from '@/lib/db'
import { getDbUser } from '@/lib/auth'
import { features } from '@/lib/env'
import { getGoogleAccessToken } from '@/lib/integrations/google'
import PageHeader, { PageBody } from '@/components/global/page-header'

type Props = {
  searchParams: Promise<{ connected?: string; error?: string; warning?: string }>
}

const Notice = ({ tone, children }: { tone: 'success' | 'warning' | 'error'; children: React.ReactNode }) => (
  <p
    role="status"
    className={
      tone === 'success'
        ? 'rounded-lg border border-success/30 bg-success/10 p-3 text-sm'
        : tone === 'warning'
          ? 'rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm'
          : 'rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm'
    }
  >
    {children}
  </p>
)

const Connections = async ({ searchParams }: Props) => {
  const { connected, error, warning } = await searchParams
  const user = await getDbUser()
  if (!user) return null

  const [userConnections, googleToken] = await Promise.all([
    db.connections.findMany({
      where: { userId: user.clerkId },
      select: { type: true },
    }),
    getGoogleAccessToken(user.clerkId),
  ])

  const connections: Record<string, boolean> = Object.fromEntries(
    userConnections.map((c) => [c.type, true])
  )
  // Google Drive access comes from signing in with Google through Clerk.
  connections['Google Drive'] = !!googleToken

  const configured: Record<string, boolean> = {
    'Google Drive': true,
    Discord: features.discord(),
    Notion: features.notion(),
    Slack: features.slack(),
  }

  return (
    <>
      <PageHeader
        title="Connections"
        description="Connect the apps your workflows use. Reconnect anytime to refresh access."
      />
      <PageBody className="space-y-4">
        {connected && <Notice tone="success">{connected} connected successfully.</Notice>}
        {warning && <Notice tone="warning">{warning}</Notice>}
        {error && <Notice tone="error">{error}</Notice>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {CONNECTIONS.map((connection) => (
            <ConnectionCard
              key={connection.title}
              description={connection.description}
              title={connection.title}
              icon={connection.image}
              type={connection.title}
              connected={connections}
              configured={configured[connection.title]}
            />
          ))}
        </div>
      </PageBody>
    </>
  )
}

export default Connections
