import { db } from '@/lib/db'
import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Keeps the User table in sync with Clerk. Configure the endpoint in the Clerk
// dashboard and put its signing secret in CLERK_WEBHOOK_SIGNING_SECRET.
export async function POST(req: NextRequest) {
  let evt
  try {
    evt = await verifyWebhook(req)
  } catch (error) {
    console.error('Invalid Clerk webhook', error)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  try {
    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id, email_addresses, primary_email_address_id, first_name, image_url } = evt.data
      const email =
        email_addresses.find((e) => e.id === primary_email_address_id)?.email_address ??
        email_addresses[0]?.email_address
      if (!email) return new NextResponse('No email on user', { status: 200 })

      await db.user.upsert({
        where: { clerkId: id },
        update: { email, name: first_name ?? '', profileImage: image_url ?? '' },
        create: { clerkId: id, email, name: first_name ?? '', profileImage: image_url ?? '' },
      })
    }

    if (evt.type === 'user.deleted' && evt.data.id) {
      await db.user.deleteMany({ where: { clerkId: evt.data.id } })
    }

    return new NextResponse('ok', { status: 200 })
  } catch (error) {
    console.error('Error updating database:', error)
    return new NextResponse('Error updating user in database', { status: 500 })
  }
}
