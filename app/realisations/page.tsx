import { getRealisations } from "@/lib/mdx-loader"
import RealisationsClient from "./client"

export const metadata = {
  title: "Réalisations - OUSAMO",
  description: "Découvrez nos projets de construction métallique et travaux industriels",
}

export default async function RealisationsPage() {
  const realisations = await getRealisations()

  return <RealisationsClient realisations={realisations} />
}
