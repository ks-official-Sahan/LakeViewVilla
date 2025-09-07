"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { SectionReveal } from "@/components/motion/section-reveal"
import { FAQ_ITEMS } from "@/data/content"

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  // JSON-LD structured data for FAQ
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <>
      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Header */}
        <div className="relative z-10 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Frequently Asked Questions
                  </span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Find answers to common questions about Lake View Villa Tangalle
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <SectionReveal>
              <div className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-inset"
                      aria-expanded={openItems.includes(index)}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <div className="flex items-center gap-4">
                        <HelpCircle className="text-cyan-400 flex-shrink-0" size={24} />
                        <h3 className="text-lg font-semibold text-white pr-4">{item.question}</h3>
                      </div>
                      <motion.div
                        animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown className="text-slate-400" size={24} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {openItems.includes(index) && (
                        <motion.div
                          id={`faq-answer-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-8 pb-6 pt-2">
                            <div className="pl-10">
                              <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </SectionReveal>

            {/* Contact CTA */}
            <SectionReveal>
              <div className="mt-12 text-center">
                <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
                  <p className="text-slate-300 mb-6">
                    We're here to help! Contact us directly for personalized assistance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP?.replace("+", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                    >
                      <HelpCircle size={20} />
                      Ask on WhatsApp
                    </motion.a>
                    <motion.a
                      href="/visit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300"
                    >
                      Contact Form
                    </motion.a>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </>
  )
}
