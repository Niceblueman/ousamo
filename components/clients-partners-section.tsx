"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { companyData } from "@/lib/data"
import Image from "next/image"

export function ClientsPartnersSection() {
  const [isHovered, setIsHovered] = useState(false)

  // Duplicate the clients array for seamless infinite scroll
  const duplicatedClients = [...companyData.clients, ...companyData.clients]

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3 sm:mb-4">
            Nos Partenaires & Clients
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Des entreprises de confiance qui nous font confiance
          </p>
        </motion.div>

        {/* Infinite Scroll Container */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-slate-800 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-slate-800 to-transparent z-10 pointer-events-none" />

          <div
            className={`flex gap-8 sm:gap-12 lg:gap-16 ${isHovered ? "" : "animate-scroll"}`}
          >
            {duplicatedClients.map((client, index) => (
              <Tooltip key={`${client.id}-${index}`}>
                <TooltipTrigger asChild>
                  <motion.div
                    className="flex-shrink-0 flex items-center justify-center w-48 h-32 sm:w-56 sm:h-36 lg:w-64 lg:h-40 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={client.logo}
                        alt={client.name}
                        fill
                        className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                        sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
                      />
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-slate-900 text-white p-4 rounded-lg shadow-xl">
                  <div className="space-y-2">
                    <h4 className="font-bold text-base">{client.name}</h4>
                    <p className="text-sm text-gray-300">{client.description}</p>
                    <div className="pt-2 border-t border-gray-700 space-y-1">
                      {client.stats.map((stat, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-400">{stat.label}:</span>
                          <span className="font-semibold">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

