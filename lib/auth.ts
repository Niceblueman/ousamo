import { auth } from "@/app/api/auth/[...nextauth]/route"

export async function getSession() {
  return await auth()
}

export async function requireAdmin() {
  const session = await getSession()

  if (!session?.user) {
    throw new Error("Unauthorized: No session found")
  }

  const isAdmin = (session.user as any).isAdmin === true

  if (!isAdmin) {
    throw new Error("Forbidden: Admin access required")
  }

  return session
}

