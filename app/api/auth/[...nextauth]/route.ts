import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { subscribeToNewsletter } from "@/lib/newsletter"

// Custom Prisma adapter wrapper to add admin logic
function CustomPrismaAdapter() {
  const adapter = PrismaAdapter(prisma)

  return {
    ...adapter,
    async createUser(user: any) {
      // Check if email is in admin list
      const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || []
      const isAdmin = adminEmails.includes(user.email || "")

      const newUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.name,
          image: user.image,
          isAdmin,
        },
      })

      // Automatically subscribe user to newsletter when they sign in with Google
      if (user.email) {
        try {
          await subscribeToNewsletter(user.email, "google_auth")
        } catch (error) {
          console.debug("Failed to subscribe user to newsletter:", error)
        }
      }

      return {
        id: String(newUser.id),
        email: newUser.email,
        name: newUser.name,
        image: newUser.image,
        emailVerified: null,
      }
    },
    async getUserByAccount({ providerAccountId, provider }: any) {
      const account = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        include: { user: true },
      })

      if (!account) return null

      const user = account.user

      // Ensure user is subscribed to newsletter (in case they weren't before)
      if (user.email) {
        try {
          await subscribeToNewsletter(user.email, "google_auth")
        } catch (error) {
          console.debug("Failed to subscribe user to newsletter on login:", error)
        }
      }

      return {
        id: String(user.id),
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: null,
      }
    },
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: CustomPrismaAdapter(),
  callbacks: {
    async session({ session, user }: any) {
      const dbUser = await prisma.user.findUnique({
        where: { id: Number(user.id) },
        select: { isAdmin: true },
      })

      if (session.user) {
        ;(session.user as any).isAdmin = dbUser?.isAdmin || false
        ;(session.user as any).id = user.id

        // Ensure user is subscribed to newsletter when they have an active session
        if (session.user.email) {
          try {
            await subscribeToNewsletter(session.user.email, "google_auth")
          } catch (error) {
            console.debug("Failed to subscribe user to newsletter in session:", error)
          }
        }
      }

      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "database" as const,
  },
} satisfies any

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
export const { GET, POST } = handlers

