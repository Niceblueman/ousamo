"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X } from "lucide-react"

interface AppleStatsCardProps {
  id: number
  label: string
  value: string
  image: string
  description: string
  details: {
    title: string
    content: string
    highlights: string[]
  }
  index: number
}

export function AppleStatsCard({ id, label, value, image, description, details, index }: AppleStatsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {/* Card */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        onClick={() => setIsExpanded(true)}
        className="group relative h-full text-left overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Image Container */}
        <motion.div
          className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <img
            src={image || "/placeholder.svg"}
            alt={label}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
          />
        </motion.div>

        {/* Content */}
        <div className="p-5 sm:p-6 lg:p-7 flex flex-col h-full">
          {/* Label */}
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            {label}
          </p>

          {/* Value */}
          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
            viewport={{ once: true }}
            className="mb-2"
          >
            <p className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
              {value}
            </p>
          </motion.div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-grow">
            {description}
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm"
          >
            <span>Découvrir plus</span>
            <motion.svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded Detail Modal */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-md z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-12 lg:inset-20 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl z-50 overflow-auto w-fit mx-auto"
            >
              <div className="relative max-w-2xl mx-auto">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </motion.button>

                {/* Large Image */}
                <motion.img
                  src={image}
                  alt={label}
                  loading="eager"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="w-full h-80 md:h-96 object-cover rounded-2xl mb-8 md:mb-10 px-6 md:px-0 mt-6 md:mt-0"
                />

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="px-6 md:px-8 pb-8"
                >
                  {/* Stats Value */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      {label}
                    </p>
                    <p className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-2">
                      {value}
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    {details.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                    {details.content}
                  </p>

                  {/* Highlights */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                      Points clés
                    </h4>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3, staggerChildren: 0.1 }}
                    >
                      {details.highlights.map((highlight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                          className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            className="flex-shrink-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-3"
                          />
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{highlight}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
