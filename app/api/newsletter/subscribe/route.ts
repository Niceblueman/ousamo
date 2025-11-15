import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"
import { subscribeToNewsletter } from "@/lib/newsletter"

const resendApiKey = process.env.RESEND_API_KEY
const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "support@ousamo.sarl"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      )
    }

    // Use the newsletter helper function
    const wasAlreadySubscribed = !(await subscribeToNewsletter(email))

    if (wasAlreadySubscribed) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 409 },
      )
    }

    // Send confirmation email if Resend is configured
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "newsletter@ousamo.sarl",
            to: email,
            subject: "Confirmation d'abonnement - OUSAMO",
            html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <style>
                      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                      .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
                      .content { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; }
                      .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="header">
                        <h1 style="margin: 0;">✓ Abonnement confirmé</h1>
                      </div>
                      
                      <div class="content">
                        <p>Bonjour,</p>
                        <p>Merci de vous être abonné à notre newsletter ! Vous recevrez désormais nos dernières actualités, annonces et offres spéciales.</p>
                        <p>Restez informé de nos projets et réalisations en construction métallique.</p>
                      </div>
                      
                      <p>Cordialement,<br><strong>L'équipe OUSAMO</strong></p>
                      
                      <div class="footer">
                        <p>© ${new Date().getFullYear()} OUSAMO. Tous droits réservés.</p>
                      </div>
                    </div>
                  </body>
                </html>
              `,
          }),
        })
      } catch (emailError) {
        console.error("[Newsletter] Email sending error:", emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    })
  } catch (error) {
    console.error("[Newsletter] Database error:", error)
    return NextResponse.json(
      {
        error: "Failed to subscribe to newsletter",
        details: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
