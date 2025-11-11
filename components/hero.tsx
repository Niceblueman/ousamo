"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Ensure video plays
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay prevented:", error)
      })
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 pt-20">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://res.cloudinary.com/dmkxk0zjk/video/upload/v1762820086/stock-footage-riyadh-saudi-arabia-oct-drone-aerial-footage-of-industrial-steel-structure-building-under_pykjth.webm" type="video/webm" />
        <source src="https://res.cloudinary.com/dmkxk0zjk/video/upload/v1762820086/stock-footage-riyadh-saudi-arabia-oct-drone-aerial-footage-of-industrial-steel-structure-building-under_pykjth.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-0">
        {/* Logo with Industrial Animation */}
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          <motion.img
            src="/hero_logo.svg"
            alt="OUSAMO Logo"
            className="w-24 h-24 mr-6 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
            animate={{
              filter: [
                "brightness(1) drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))",
                "brightness(1.2) drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))",
                "brightness(1) drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))",
              ]
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <h3 className="text-4xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            <motion.span
              animate={{
                textShadow: [
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.5)",
                  "0 0 10px rgba(59, 130, 246, 0.5)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              OUSAMO
            </motion.span>
          </h3>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-6 sm:mb-8 font-light">
            L'Art de la Conception Métallique
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed"
        >
          De l'acier à l'innovation, nous donnons vie à vos projets industriels les plus ambitieux.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <Link href="/realisations">
            <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 text-white rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 active:scale-95 w-full sm:w-auto justify-center">
              Découvrez Nos Réalisations
              <ArrowRight size={20} />
            </button>
          </Link>
          <Link href="/quote">
          <button className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-gray-400 text-gray-300 hover:bg-gray-800/50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg font-semibold transition-all duration-200 active:scale-95 w-full sm:w-auto">
            Demander un Devis
          </button>
          </Link>
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-1 h-2 bg-gray-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
