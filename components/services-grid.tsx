"use client"

import { motion } from "framer-motion"
import { companyData } from "@/lib/data"

export function ServicesGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            Nos Domaines de Compétence
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Trois axes stratégiques pour répondre à vos besoins industriels
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {companyData.services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 sm:p-8 border border-slate-200 hover:shadow-xl transition-shadow duration-300 focus-within:ring-2 focus-within:ring-blue-500"
            >
              <div className="mb-4 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">{service.id}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
