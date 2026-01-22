'use client'
import React from 'react'
import UploadCareButton from './uploadcare-button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type Props = {
    userImage: string | null
    onDelete?: any
    onUpload: any
}

const ProfilePicture = ({ userImage, onDelete, onUpload }: Props) => {
    const router = useRouter()

    const onRemoveProfileImage = async () => {
        const response = await onDelete()
        if (response) {
            router.refresh()
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Title */}
            <p className="text-lg font-medium text-white">Profile Picture</p>

            <div className="flex h-[30vh] items-center justify-center">
                {userImage ? (
                    <div className="flex flex-col items-center gap-4">
                        {/* Avatar */}
                        <div className="relative h-36 w-36 overflow-hidden rounded-full border border-white/20 bg-white/5">
                            <Image
                                src={userImage}
                                alt="User profile picture"
                                fill
                                className="object-cover"
                                sizes="144px"
                                priority
                            />
                        </div>

                        {/* Remove button */}
                        <Button
                            onClick={onRemoveProfileImage}
                            variant="ghost"
                            className="
              text-sm text-white/60
              hover:text-red-400
              hover:bg-transparent
              transition-colors
            "
                        >
                            <X className="mr-1 h-4 w-4" />
                            Remove photo
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <UploadCareButton onUpload={onUpload} />
                        <p className="text-sm text-white/40">
                            Upload a profile picture
                        </p>
                    </div>
                )}
            </div>
        </div>
    )

}

export default ProfilePicture