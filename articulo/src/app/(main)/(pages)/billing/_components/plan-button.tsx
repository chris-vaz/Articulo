'use client'

import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { onCheckout } from '../_actions/billing'

type Props = { planId: string; disabled?: boolean; children: React.ReactNode }

const PlanButton = ({ planId, disabled, children }: Props) => {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      disabled={disabled || pending}
      onClick={() =>
        startTransition(async () => {
          const result = await onCheckout(planId)
          if (result?.error) toast.error(result.error)
        })
      }
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}

export default PlanButton
