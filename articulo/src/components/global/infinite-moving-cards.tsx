'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: { href: string }[]
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
  className?: string
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLUListElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current || initialized.current)
      return

    initialized.current = true

    const scrollerContent = Array.from(scrollerRef.current.children)

    scrollerContent.forEach((item) => {
      scrollerRef.current!.appendChild(item.cloneNode(true))
    })

    // Direction
    containerRef.current.style.setProperty(
      '--animation-direction',
      direction === 'left' ? 'forwards' : 'reverse'
    )

    // Speed
    const duration =
      speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s'
    containerRef.current.style.setProperty(
      '--animation-duration',
      duration
    )
  }, [direction, speed])

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max flex-nowrap gap-10 py-4 animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]'
        )}
      >
        {items.map((item, idx) => (
          <li key={`${item.href}-${idx}`} className="flex-shrink-0">
            <Image
              width={170}
              height={100}
              src={item.href}
              alt={`Client logo ${idx + 1}`}
              className="rounded-2xl object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
