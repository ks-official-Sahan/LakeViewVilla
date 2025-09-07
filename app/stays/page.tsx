"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { MessageCircle, Check, Star } from "lucide-react"
import { SectionReveal } from "@/components/motion/section-reveal"
import { RATES, OFFERS } from "@/data/content"
import { buildWhatsAppUrl } from "@/lib/utils"
import { generateBreadcrumbSchema, generateOfferSchema } from "@/lib/structured-data"
import Head from "next/head"

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid international phone number (e.g., +94771234567)"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.number().min(1).max(4, "Maximum 4 guests allowed"),
  message: z.string().optional(),
})

type EnquiryForm = z.infer<typeof enquirySchema>

export default function StaysPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      guests: 2,
    },
  })

  const watchedValues = watch()

  const onSubmit = async (data: EnquiryForm) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Simulate form processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const message = `Hi! I'd like to enquire about Lake View Villa Tangalle:

Name: ${data.name}
Phone: ${data.phone}
Check-in: ${data.checkIn}
Check-out: ${data.checkOut}
Guests: ${data.guests}
${data.message ? `Message: ${data.message}` : ""}

Please send me the best available rate and availability. Thank you!`

      const whatsappUrl = buildWhatsAppUrl(message)
      window.open(whatsappUrl, "_blank")

      setSubmitStatus("success")
      reset()
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Stays & Rates - Lake View Villa Tangalle</title>
        <meta
          name="description"
          content="Book your stay at Lake View Villa Tangalle. View our seasonal rates, special offers, and make an enquiry through WhatsApp for the best available rates."
        />
        <link rel="canonical" href="https://lakeviewvillatangalle.com/stays" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateBreadcrumbSchema([
                { name: "Home", url: "https://lakeviewvillatangalle.com/" },
                { name: "Stays", url: "https://lakeviewvillatangalle.com/stays" },
              ]),
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateOfferSchema(
                OFFERS.map((offer) => ({
                  name: offer.title,
                  price: "Contact for rates",
                  description: offer.description,
                })),
              ),
            ),
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Header */}
        <div className="relative z-10 pt-24 pb-12">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Stays & Rates
                  </span>
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Experience luxury and tranquility at Lake View Villa Tangalle
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Rates & Offers */}
            <div className="space-y-8">
              {/* Rates Table */}
              <SectionReveal>
                <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Star className="text-cyan-400" size={24} />
                    Rates & Availability
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full text-white">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-3 px-2">Season</th>
                          <th className="text-left py-3 px-2">Period</th>
                          <th className="text-left py-3 px-2">Rate</th>
                          <th className="text-left py-3 px-2">Min Nights</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RATES.map((rate, index) => (
                          <tr key={index} className="border-b border-white/10">
                            <td className="py-4 px-2 font-medium">{rate.season}</td>
                            <td className="py-4 px-2 text-slate-300">{rate.period}</td>
                            <td className="py-4 px-2 text-cyan-400 font-semibold">{rate.nightly}</td>
                            <td className="py-4 px-2 text-slate-300">{rate.minNights}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm text-slate-400 mt-4">{RATES[0]?.notes}</p>
                </div>
              </SectionReveal>

              {/* Offers */}
              <SectionReveal>
                <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6">Special Offers</h2>

                  <div className="space-y-4">
                    {OFFERS.map((offer, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <Check className="text-green-400 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h3 className="font-semibold text-white mb-1">{offer.title}</h3>
                          <p className="text-slate-300 text-sm">{offer.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* Enquiry Form */}
            <SectionReveal>
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <MessageCircle className="text-cyan-400" size={24} />
                  WhatsApp Enquiry
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                      <input
                        {...register("name")}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
                      <input
                        {...register("phone")}
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="+94771234567"
                      />
                      {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Check-in Date *</label>
                      <input
                        {...register("checkIn")}
                        type="date"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      />
                      {errors.checkIn && <p className="text-red-400 text-sm mt-1">{errors.checkIn.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Check-out Date *</label>
                      <input
                        {...register("checkOut")}
                        type="date"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      />
                      {errors.checkOut && <p className="text-red-400 text-sm mt-1">{errors.checkOut.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Number of Guests *</label>
                    <select
                      {...register("guests", { valueAsNumber: true })}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                    </select>
                    {errors.guests && <p className="text-red-400 text-sm mt-1">{errors.guests.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Additional Message</label>
                    <textarea
                      {...register("message")}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                      placeholder="Any special requests or questions..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send WhatsApp Enquiry"}
                  </motion.button>

                  {submitStatus === "success" && (
                    <div className="text-green-400 text-center" role="status" aria-live="polite">
                      Enquiry sent successfully! Check your WhatsApp.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="text-red-400 text-center" role="status" aria-live="polite">
                      Something went wrong. Please try again.
                    </div>
                  )}
                </form>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </>
  )
}
