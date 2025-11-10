import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demande de Devis - OUSAMO",
  description: "Obtenez un devis personnalisé pour votre projet de construction métallique, travaux industriels ou décoration métallique",
  openGraph: {
    title: "Demande de Devis - OUSAMO",
    description: "Obtenez un devis personnalisé pour votre projet de construction métallique",
    type: "website",
  },
}

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

