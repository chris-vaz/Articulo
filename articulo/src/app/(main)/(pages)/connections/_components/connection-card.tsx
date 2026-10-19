import { ConnectionTypes } from '@/lib/types'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Props = {
  type: ConnectionTypes
  icon: string
  title: ConnectionTypes
  description: string
  callback?: () => void
  connected: {} & any
  configured?: boolean
}

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected,
  configured = true,
}: Props) => {
  const isConnected = !!connected[type]
  const isGoogle = title === 'Google Drive'

  return (
    <Card className="flex items-start gap-4 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-background">
        <Image src={icon} alt="" height={24} width={24} className="object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          {isConnected && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" /> Connected
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {isGoogle && !isConnected
            ? 'Link Google in your profile menu (top right → Manage account → Connected accounts).'
            : description}
        </p>
      </div>
      <div className="shrink-0">
        {isGoogle || (isConnected && !configured) ? null : !configured ? (
          <Badge
            variant="muted"
            title="Add this integration's keys to .env to enable it (see SETUP.md)"
          >
            Not configured
          </Badge>
        ) : (
          <Button asChild size="sm" variant={isConnected ? 'outline' : 'default'}>
            <Link href={`/api/auth/connect/${title.toLowerCase()}`} prefetch={false}>
              {isConnected ? 'Reconnect' : 'Connect'}
            </Link>
          </Button>
        )}
      </div>
    </Card>
  )
}

export default ConnectionCard
