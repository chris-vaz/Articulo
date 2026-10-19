import 'server-only'
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from './db'

// Returns the signed-in user's database row, creating it on first visit.
// The Clerk webhook also creates users, but webhooks can't reach localhost,
// so this keeps the app working without one.
export const getDbUser = async () => {
  const { userId } = await auth()
  if (!userId) return null

  const existing = await db.user.findUnique({ where: { clerkId: userId } })
  if (existing) return existing

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${userId}@users.articulo.local`

  return db.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email,
      name: clerkUser.firstName ?? '',
      profileImage: clerkUser.imageUrl ?? '',
    },
  })
}

export const requireUserId = async () => {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

// Ensures the workflow belongs to the signed-in user before touching it.
export const requireWorkflow = async (workflowId: string) => {
  const userId = await requireUserId()
  const workflow = await db.workflows.findFirst({
    where: { id: workflowId, userId },
  })
  if (!workflow) throw new Error('Workflow not found')
  return workflow
}
