'use client'

import React from 'react'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next'
import '@uploadcare/react-uploader/core.css'
import { useRouter } from 'next/navigation'

type Props = {
    onUpload: (cdnUrl: string) => Promise<any> | any
}

export default function UploadCareButton({ onUpload }: Props) {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto p-4 border rounded-lg bg-neutral-900">
            <p className="text-white font-medium text-center">
                Upload your profile picture
            </p>
            <div className="flex items-center justify-center h-[8vh]">
                <FileUploaderRegular
                    pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY!}
                    multiple={false}
                    // imagesOnly={true}         
                    onChange={(files) => {
                        if (!files) return

                        const fileArray = Array.isArray(files) ? files : [files]
                        fileArray.forEach((file) => {
                            if (file?.cdnUrl) {
                                onUpload(file.cdnUrl)
                                router.refresh()
                            }
                        })
                    }}
                    className="w-full"
                />
            </div>
        </div>
    )
}
