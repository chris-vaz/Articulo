'use client'
import React, { useTransition } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, UserRound } from 'lucide-react'

// The uploader widget is heavy, so it's only loaded when it's actually shown.
const UploadCareButton = dynamic(() => import('./uploadcare-button'), {
  ssr: false,
  loading: () => <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />,
})

type Props = {
  userImage: string | null
  onDelete?: () => Promise<unknown>
  onUpload: (url: string) => Promise<unknown>
  uploadsEnabled?: boolean
}

const ProfilePicture = ({ userImage, onDelete, onUpload, uploadsEnabled = true }: Props) => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const onRemoveProfileImage = () =>
    startTransition(async () => {
      await onDelete?.()
      router.refresh()
    })

  return (
    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border bg-muted">
        {userImage ? (
          <Image src={userImage} alt="Profile picture" fill className="object-cover" sizes="96px" />
        ) : (
          <UserRound className="absolute inset-0 m-auto h-10 w-10 text-muted-foreground" />
        )}
      </div>
      {userImage ? (
        <Button variant="outline" onClick={onRemoveProfileImage} disabled={pending}>
          <Trash2 /> Remove photo
        </Button>
      ) : uploadsEnabled ? (
        <UploadCareButton onUpload={onUpload} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Uploads are disabled. Set NEXT_PUBLIC_UPLOADCARE_PUB_KEY to enable them.
        </p>
      )}
    </div>
  )
}

export default ProfilePicture
