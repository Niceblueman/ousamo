import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import "./globals.css"

const geist = Geist({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "OUSAMO - Construction Métallique & Équipements Industriels",
    template: "%s | OUSAMO",
  },
  description: "OUSAMO spécialiste en construction métallique, travaux industriels et décoration métallique. Solutions sur mesure pour vos projets industriels et architecturaux.",
  keywords: ["construction métallique", "travaux industriels", "décoration métallique", "charpente métallique", "soudure", "fabrication métallique"],
  authors: [{ name: "OUSAMO" }],
  creator: "OUSAMO",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://ousamo.sarl",
    siteName: "OUSAMO",
    title: "OUSAMO - Construction Métallique & Équipements Industriels",
    description: "OUSAMO spécialiste en construction métallique, travaux industriels et décoration métallique",
  },
  twitter: {
    card: "summary_large_image",
    title: "OUSAMO - Construction Métallique & Équipements Industriels",
    description: "OUSAMO spécialiste en construction métallique, travaux industriels et décoration métallique",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Only set language, let next-themes handle theme
                  const lang = localStorage.getItem('ousamo-language') || (navigator.language && navigator.language.startsWith('en') ? 'en' : 'fr');
                  document.documentElement.lang = lang;
                  // Add scroll-smooth class
                  if (!document.documentElement.className.includes('scroll-smooth')) {
                    document.documentElement.className = (document.documentElement.className + ' scroll-smooth').trim();
                  }
                } catch (e) {
                  document.documentElement.lang = 'fr';
                  if (!document.documentElement.className.includes('scroll-smooth')) {
                    document.documentElement.className = (document.documentElement.className + ' scroll-smooth').trim();
                  }
                }
              })();
            `,
          }}
        />
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
