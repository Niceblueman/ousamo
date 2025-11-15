"use client"

import { Download } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { NewsletterSubscribe } from "@/components/newsletter-subscribe"

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-slate-900 text-gray-300 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Newsletter Section */}
        <div className="mb-12">
          <NewsletterSubscribe />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">OUSAMO</h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">{t("common.services")}</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Construction métallique
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Travaux industriels
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  Décoration métallique
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">{t("common.company")}</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  {t("common.about")}
                </a>
              </li>
              <li>
                <a
                  href="/realisations"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  {t("realisations.title")}
                </a>
              </li>
              <li>
                <a
                  href="/quote"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  {t("quote.title")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                >
                  {t("common.contact")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm sm:text-base">{t("common.information")}</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400 mb-4">
              <li>{t("footer.created")}</li>
              <li>{t("footer.capital")}</li>
              <li>{t("footer.location")}</li>
            </ul>
            <a
              href="/tax-fiscal-marocain.pdf"
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <Download className="w-4 h-4" />
              {t("footer.taxFiscal")}
            </a>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} OUSAMO. {t("footer.rights")}.</p>
        </div>
      </div>
    </footer>
  )
}
