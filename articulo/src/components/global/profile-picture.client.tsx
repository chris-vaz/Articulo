'use client'

import ProfilePicture from '@/app/(main)/(pages)/settings/_components/profile-picture'
import { useRouter } from 'next/navigation'

type Props = {
  userImage: string | null
}

const ProfilePictureClient = ({ userImage }: Props) => {
  const router = useRouter()

  const onUpload = async (cdnUrl: string) => {
    // TODO: call API / server action to save image
    console.log('Uploaded:', cdnUrl)

    router.refresh()
    return true
  }

  const onDelete = async () => {
    // TODO: call API / server action to delete image
    console.log('Deleted image')

    router.refresh()
    return true
  }

  return (
    <ProfilePicture
      userImage={userImage}
      onUpload={onUpload}
      onDelete={onDelete}
    />
  )
}

export default ProfilePictureClient
