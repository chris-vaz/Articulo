import ProfileForm from '@/components/forms/profile-form'
import React from 'react'
import ProfilePicture from './_components/profile-picture'
import { db } from '@/lib/db'
import { getDbUser } from '@/lib/auth'
import { currentUser } from '@clerk/nextjs/server'
import PageHeader, { PageBody } from '@/components/global/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { features } from '@/lib/env'

type Props = {}

const Settings = async (props: Props) => {
  const authUser = await currentUser()
  if (!authUser) return null

  const user = await getDbUser()
  if (!user) return null
  const removeProfileImage = async () => {
    'use server'
    const response = await db.user.update({
      where: {
        clerkId: authUser.id,
      },
      data: {
        profileImage: '',
      },
    })
    return response
  }

  const uploadProfileImage = async (image: string) => {
    'use server'
    const id = authUser.id
    const response = await db.user.update({
      where: {
        clerkId: id,
      },
      data: {
        profileImage: image,
      },
    })

    return response
  }

  const updateUserInfo = async (name: string) => {
    'use server'

    const updateUser = await db.user.update({
      where: {
        clerkId: authUser.id,
      },
      data: {
        name,
      },
    })
    return updateUser
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile." />
      <PageBody className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile picture</CardTitle>
            <CardDescription>Shown across Articulo.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfilePicture
              onDelete={removeProfileImage}
              userImage={user?.profileImage || ''}
              onUpload={uploadProfileImage}
              uploadsEnabled={features.uploadcare()}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Your name and email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} onUpdate={updateUserInfo} />
          </CardContent>
        </Card>
      </PageBody>
    </>
  )
}

export default Settings
