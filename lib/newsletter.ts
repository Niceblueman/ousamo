import { prisma } from "./db"

/**
 * Subscribe a user to the newsletter
 * Returns true if successfully subscribed, false if already subscribed
 * @param email - User email address
 * @param source - Source of subscription (default: 'website')
 */
export async function subscribeToNewsletter(email: string, source: string = "website"): Promise<boolean> {
  try {
    // Check if email already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email },
      select: { id: true, status: true },
    })

    if (existing) {
      if (existing.status === "active") {
        // Already subscribed
        return false
      } else {
        // Resubscribe
        await prisma.newsletterSubscription.update({
          where: { email },
          data: {
            status: "active",
            subscribedAt: new Date(),
            unsubscribedAt: null,
            source,
          },
        })
        return true
      }
    } else {
      // Insert new subscription
      await prisma.newsletterSubscription.create({
        data: {
          email,
          status: "active",
          source,
        },
      })
      return true
    }
  } catch (error) {
    console.error("[Newsletter] Error subscribing user:", error)
    return false
  }
}

