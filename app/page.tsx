"use client"

import dynamic from "next/dynamic"
import { Hero } from "@/components/hero"
import { ServicesGrid } from "@/components/services-grid"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"

// Lazy load below-the-fold components for better initial load performance
const StatsCounter = dynamic(() => import("@/components/stats-counter").then(mod => ({ default: mod.StatsCounter })), {
  loading: () => <div className="min-h-[400px]" />,
})
const ClientsPartnersSection = dynamic(() => import("@/components/clients-partners-section").then(mod => ({ default: mod.ClientsPartnersSection })), {
  loading: () => <div className="min-h-[300px]" />,
})
const CertificatesSection = dynamic(() => import("@/components/certificates-section").then(mod => ({ default: mod.CertificatesSection })), {
  loading: () => <div className="min-h-[400px]" />,
})
const VisionSection = dynamic(() => import("@/components/vision-section").then(mod => ({ default: mod.VisionSection })), {
  loading: () => <div className="min-h-[400px]" />,
})
const ContactSection = dynamic(() => import("@/components/contact-section").then(mod => ({ default: mod.ContactSection })), {
  loading: () => <div className="min-h-[400px]" />,
})
const Footer = dynamic(() => import("@/components/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => null,
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ServicesGrid />
      <StatsCounter />
      <ClientsPartnersSection />
      <CertificatesSection />
      <VisionSection />
      <ContactSection />
      <Footer />
      <ThemeSwitcher />
      <LanguageSwitcher />
    </main>
  )
}
