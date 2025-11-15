import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const resendApiKey = process.env.RESEND_API_KEY
const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "support@ousamo.sarl"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { companyName, email, phone, description, budget, selections } = body

    // Validate required fields
    if (!companyName || !email || !phone || !description || !budget) {
      console.error("[Quote Submit] Missing required fields:", { companyName, email, phone, description, budget })
      return NextResponse.json(
        { error: "Missing required fields: companyName, email, phone, description, budget" },
        { status: 400 },
      )
    }

    // Validate selections
    if (!selections || typeof selections !== "object" || Object.keys(selections).length === 0) {
      console.error("[Quote Submit] Missing or invalid selections:", selections)
      return NextResponse.json(
        { error: "Missing or invalid selections. Please complete all steps." },
        { status: 400 },
      )
    }

    const stepTitles: Record<number, string> = {
      1: "Type de Service",
      2: "Type de Projet",
      3: "Délai de Réalisation",
      4: "Budget Estimé",
    }

    // Normalize selections keys to numbers
    const normalizedSelections: Record<number, string> = {}
    Object.entries(selections).forEach(([key, value]) => {
      const numKey = Number.parseInt(key, 10)
      if (!isNaN(numKey) && value) {
        normalizedSelections[numKey] = String(value)
      }
    })

    const selectedOptions = Object.entries(normalizedSelections)
      .map(([stepId, optionId]) => {
        const stepNum = Number.parseInt(stepId, 10)
        return `${stepTitles[stepNum] || `Step ${stepId}`}: ${optionId}`
      })
      .join("\n")

    try {
      const quoteRequest = await prisma.quoteRequest.create({
        data: {
          companyName,
          email,
          phone,
          description,
          serviceType: normalizedSelections[1] || null,
          projectType: normalizedSelections[2] || null,
          timeline: normalizedSelections[3] || null,
          budgetRange: normalizedSelections[4] || null,
          status: "pending",
        },
      })

      if (!quoteRequest) {
        throw new Error("Failed to create quote request")
      }

    if (resendApiKey) {
      try {
        // Email to client
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "devis@ousamo.sarl",
            to: email,
            subject: "Confirmation de votre demande de devis - OUSAMO",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
                    .content { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .detail { margin: 12px 0; }
                    .detail-label { font-weight: bold; color: #1e40af; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1 style="margin: 0;">✓ Demande Reçue</h1>
                    </div>
                    
                    <p>Bonjour ${companyName},</p>
                    
                    <p>Merci de votre intérêt pour nos services. Nous avons bien reçu votre demande de devis et nous l'examinons actuellement.</p>
                    
                    <div class="content">
                      <h3 style="margin-top: 0;">Résumé de votre demande:</h3>
                      <div class="detail"><span class="detail-label">Entreprise:</span> ${companyName}</div>
                      <div class="detail"><span class="detail-label">Email:</span> ${email}</div>
                      <div class="detail"><span class="detail-label">Téléphone:</span> ${phone}</div>
                      ${description ? `<div class="detail"><span class="detail-label">Description:</span> ${description}</div>` : ""}
                      <div class="detail"><span class="detail-label">Sélections:</span><br>${selectedOptions.replace(/\n/g, "<br>")}</div>
                    </div>
                    
                    <p>Notre équipe spécialisée examinera votre demande et vous contactera très bientôt avec un devis détaillé et personnalisé en fonction de vos besoins.</p>
                    
                    <p>Cordialement,<br><strong>L'équipe OUSAMO</strong></p>
                    
                    <div class="footer">
                      <p>© 2025 OUSAMO. Tous droits réservés.<br>Numéro de suivi: #${quoteRequest.id}</p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          }),
        })

        // Email to admin
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "devis@ousamo.sarl",
            to: adminEmail,
            subject: `Nouvelle demande de devis - ${companyName}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
                    .content { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .detail { margin: 12px 0; }
                    .detail-label { font-weight: bold; color: #1e40af; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1 style="margin: 0;">Nouvelle Demande de Devis</h1>
                    </div>
                    
                    <div class="content">
                      <h3 style="margin-top: 0;">Détails du Client:</h3>
                      <div class="detail"><span class="detail-label">Entreprise:</span> ${companyName}</div>
                      <div class="detail"><span class="detail-label">Email:</span> ${email}</div>
                      <div class="detail"><span class="detail-label">Téléphone:</span> ${phone}</div>
                      ${description ? `<div class="detail"><span class="detail-label">Description:</span> ${description}</div>` : ""}
                      <div class="detail"><span class="detail-label">Sélections:</span><br>${selectedOptions.replace(/\n/g, "<br>")}</div>
                      <div class="detail"><span class="detail-label">Date:</span> ${new Date().toLocaleString("fr-FR")}</div>
                      <div class="detail"><span class="detail-label">ID Suivi:</span> #${quoteRequest.id}</div>
                    </div>
                  </div>
                </body>
              </html>
            `,
          }),
        })
      } catch (emailError) {
        console.error("[v0] Email sending error:", emailError)
        // Don't fail the request if email fails
      }
    }

      return NextResponse.json(
        {
          success: true,
          message: "Quote request submitted successfully",
          quoteId: quoteRequest.id,
        },
        { status: 200 },
      )
    } catch (dbError) {
      console.error("[Quote Submit] Database error:", dbError)
      return NextResponse.json(
        {
          error: "Failed to save quote request",
          details: process.env.NODE_ENV === "development" && dbError instanceof Error ? dbError.message : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[Quote Submit] Unexpected error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: "Failed to process quote request",
        details: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
