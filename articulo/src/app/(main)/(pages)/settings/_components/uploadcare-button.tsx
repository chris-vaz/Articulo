'use client'

import React from 'react'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next'
import '@uploadcare/react-uploader/core.css'
import { useRouter } from 'next/navigation'

type Props = {
  onUpload: (cdnUrl: string) => Promise<unknown> | unknown
}

export default function UploadCareButton({ onUpload }: Props) {
  const router = useRouter()

  return (
    <FileUploaderRegular
      pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY!}
      multiple={false}
      imgOnly
      sourceList="local, url, camera"
      onFileUploadSuccess={async (file) => {
        if (file?.cdnUrl) {
          await onUpload(file.cdnUrl)
          router.refresh()
        }
      }}
    />
  )
}
