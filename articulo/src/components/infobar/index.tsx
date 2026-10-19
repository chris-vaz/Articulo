'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Zap } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { ModeToggle } from '../global/mode-toggle'
import Logo from '../global/logo'
import { NavLinks, PlanSummary, PlanWidget } from '../sidebar'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog'

const InfoBar = ({ plan }: { plan: PlanSummary }) => {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu />
      </Button>
      <Logo href="/dashboard" className="md:hidden" />

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/billing"
          className="hidden items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
        >
          <Zap className="h-3.5 w-3.5 text-primary" />
          {plan.unlimited ? 'Unlimited runs' : `${plan.credits} runs left`}
        </Link>
        <ModeToggle />
        <UserButton />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="left-0 top-0 h-full max-h-none w-72 translate-x-0 translate-y-0 rounded-none border-y-0 border-l-0 p-4 data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-top-0 data-[state=open]:slide-in-from-top-0 data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-left-full sm:rounded-none">
          <DialogTitle className="sr-only">Navigation</DialogTitle>
          <div className="flex h-full flex-col">
            <Logo href="/dashboard" className="px-3 pb-6" />
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="mt-auto">
              <PlanWidget plan={plan} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}

export default InfoBar
