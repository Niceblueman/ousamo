"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X } from "lucide-react"
import { useLanguage } from "./language-provider"
import { extractGoogleAnalyticsData, type GoogleAnalyticsData } from "@/lib/google-analytics"

const COOKIE_CONSENT_KEY = "ousamo-cookie-consent"
const POPUP_SHOWN_KEY = "ousamo-popup-shown"
const GOOGLE_ADV_ID_KEY = "ousamo-google-adv-id"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [cookieAccepted, setCookieAccepted] = useState(false)
  const { language } = useLanguage()

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    const popupShown = localStorage.getItem(POPUP_SHOWN_KEY)

    if (consent && consent !== "declined") {
      // Consent was accepted (stored as timestamp)
      setCookieAccepted(true)
      
      // Try to extract and update Google Advertising ID if not already stored
      const storedAdvId = localStorage.getItem(GOOGLE_ADV_ID_KEY)
      if (!storedAdvId) {
        try {
          const googleData = extractGoogleAnalyticsData()
          if (googleData.advertisingId) {
            localStorage.setItem(GOOGLE_ADV_ID_KEY, googleData.advertisingId)
            localStorage.setItem("ousamo-google-analytics", JSON.stringify(googleData))
          }
        } catch (error) {
          // Silently fail
          console.debug("Failed to extract Google Advertising ID on mount:", error)
        }
      }
      
      // Show popup 10 seconds after acceptance if not already shown
      if (!popupShown) {
        const acceptTime = parseInt(consent, 10)
        if (!isNaN(acceptTime)) {
          const timeSinceAccept = Date.now() - acceptTime
          const delay = Math.max(0, 10000 - timeSinceAccept)

          const timer = setTimeout(() => {
            setShowPopup(true)
          }, delay)

          return () => clearTimeout(timer)
        }
      }
    } else {
      // Show banner if not accepted yet
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, Date.now().toString())
    setShowBanner(false)
    setCookieAccepted(true)

    // Extract Google Advertising ID from cookies
    try {
      const googleData = extractGoogleAnalyticsData()
      if (googleData.advertisingId) {
        // Store the Google Advertising ID
        localStorage.setItem(GOOGLE_ADV_ID_KEY, googleData.advertisingId)
        
        // Also store the full Google Analytics data as JSON
        localStorage.setItem("ousamo-google-analytics", JSON.stringify(googleData))

        // Optionally send to backend for tracking
        if (typeof fetch !== "undefined") {
          fetch("/api/tracking/google-id", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              advertisingId: googleData.advertisingId,
              clientId: googleData.clientId,
              sessionId: googleData.sessionId,
              timestamp: Date.now(),
            }),
          }).catch((err) => {
            // Silently fail - don't interrupt user experience
            console.debug("Failed to send Google ID to backend:", err)
          })
        }
      }
    } catch (error) {
      // Silently fail if cookie extraction fails
      console.debug("Failed to extract Google Advertising ID:", error)
    }

    // Show popup after 10 seconds
    setTimeout(() => {
      const popupShown = localStorage.getItem(POPUP_SHOWN_KEY)
      if (!popupShown) {
        setShowPopup(true)
      }
    }, 10000)
  }

  const handlePopupClose = () => {
    localStorage.setItem(POPUP_SHOWN_KEY, "true")
    setShowPopup(false)
  }

  const translations = {
    fr: {
      banner: {
        title: "Cookies et confidentialité",
        message: "Nous utilisons des cookies pour améliorer votre expérience sur notre site.",
        accept: "Accepter",
        decline: "Refuser",
      },
      popup: {
        title: "Merci d'avoir accepté nos cookies !",
        message: "Nous sommes ravis de vous avoir parmi nous. Explorez nos services de construction métallique et découvrez comment nous pouvons vous aider.",
        close: "Fermer",
      },
    },
    en: {
      banner: {
        title: "Cookies and Privacy",
        message: "We use cookies to enhance your experience on our website.",
        accept: "Accept",
        decline: "Decline",
      },
      popup: {
        title: "Thank you for accepting our cookies!",
        message: "We're thrilled to have you here. Explore our metal construction services and discover how we can help you.",
        close: "Close",
      },
    },
  }

  const t = translations[language as keyof typeof translations] || translations.fr

  return (
    <>
      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 shadow-2xl"
          >
            <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Cookie className="w-6 h-6 text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-1">{t.banner.title}</h3>
                  <p className="text-slate-400 text-sm">{t.banner.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
                    setShowBanner(false)
                  }}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  {t.banner.decline}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {t.banner.accept}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disposable Popup (shows 10s after accepting cookies) */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handlePopupClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700 shadow-2xl relative"
            >
              <button
                onClick={handlePopupClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center"
                >
                  <Cookie className="w-8 h-8 text-blue-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-3">{t.popup.title}</h2>
                <p className="text-slate-400 mb-6 leading-relaxed">{t.popup.message}</p>

                <button
                  onClick={handlePopupClose}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {t.popup.close}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

