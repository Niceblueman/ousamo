"use client"

import { RealisationCard } from "@/components/realisation-card"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { motion } from "framer-motion"

export default function RealisationsClient({ realisations }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-4">
            Nos Réalisations
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
            Explorez nos projets de construction métallique, travaux industriels et solutions de décoration
          </p>
        </motion.div>

        {/* Filter/Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 md:mb-12"
        >
          <p className="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400">
            {realisations.length} projet{realisations.length > 1 ? "s" : ""} réalisé{realisations.length > 1 ? "s" : ""}
          </p>
        </motion.div>

        {/* Grid */}
        {realisations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {realisations.map((realisation, index) => (
              <RealisationCard
                key={realisation.slug}
                title={realisation.title}
                description={realisation.description}
                category={realisation.category}
                year={realisation.year}
                image={realisation.image}
                images={realisation.images}
                stats={realisation.stats}
                highlights={realisation.highlights}
                content={realisation.content}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <p className="text-lg text-slate-600 dark:text-slate-400">Aucune réalisation disponible pour le moment</p>
          </motion.div>
        )}
      </div>
      <ThemeSwitcher />
    </main>
  )
}
