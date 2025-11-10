"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, ChevronRight } from "lucide-react"

interface RealisationCardProps {
  title: string
  description: string
  category: string
  year: number
  image: string
  images: string[]
  stats: Array<{ label: string; value: string }>
  highlights: string[]
  content: string
  index: number
}

export function RealisationCard({
  title,
  description,
  category,
  year,
  image,
  images,
  stats,
  highlights,
  content,
  index,
}: RealisationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

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
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold rounded-full"
            >
              {category}
            </motion.span>
          </div>
          {/* Year Badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-block px-3 py-1 bg-black/50 text-white text-xs font-semibold rounded-full">
              {year}
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <div className="p-5 sm:p-6 lg:p-7 flex flex-col h-full">
          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{title}</h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-4 flex-grow line-clamp-2">
            {description}
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm"
          >
            <span>Découvrir le projet</span>
            <motion.div initial={{ x: 0 }} whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
              <ChevronRight className="w-4 h-4 ml-2" />
            </motion.div>
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
              className="fixed inset-4 md:inset-8 lg:inset-20 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl z-50 overflow-auto max-h-[90vh] w-fit mx-auto"
            >
              <div className="relative max-w-4xl mx-auto">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-6 right-6 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </motion.button>

                {/* Image Gallery */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-2xl mx-6 md:mx-0 mt-6 md:mt-0 bg-slate-200 dark:bg-slate-700"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={`${title} - Image ${currentImageIndex + 1}`}
                      loading="eager"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 dark:bg-slate-700/90 hover:bg-white dark:hover:bg-slate-600 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6 text-slate-900 dark:text-white rotate-180" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 dark:bg-slate-700/90 hover:bg-white dark:hover:bg-slate-600 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6 text-slate-900 dark:text-white" />
                      </motion.button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-black/60 text-white text-xs font-semibold rounded-full">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="px-6 md:px-8 lg:px-10 py-8 md:py-10"
                >
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-xs font-semibold rounded-full">
                        {category}
                      </span>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{year}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                      {title}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
                  </div>

                  {/* Stats */}
                  {stats.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {stats.map((stat, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                          className="p-4 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600"
                        >
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {stat.label}
                          </p>
                          <p className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {stat.value}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Content */}
                  {content && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="mb-10 prose dark:prose-invert max-w-none"
                    >
                      <div
                        className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 text-base md:text-lg"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </motion.div>
                  )}

                  {/* Highlights */}
                  {highlights.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">
                        Points clés
                      </h3>
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5, staggerChildren: 0.1 }}
                      >
                        {highlights.map((highlight, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
                            className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-600"
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
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
