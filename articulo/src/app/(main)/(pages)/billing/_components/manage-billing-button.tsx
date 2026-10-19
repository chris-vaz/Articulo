'use client'

import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { onManageBilling } from '../_actions/billing'

const ManageBillingButton = () => {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await onManageBilling()
          if (result?.error) toast.error(result.error)
        })
      }
    >
      Manage subscription
    </Button>
  )
}

export default ManageBillingButton
