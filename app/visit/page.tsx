"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { MapPin, Navigation, Phone, Mail, MessageCircle, Clock, Car } from "lucide-react"
import { SectionReveal } from "@/components/motion/section-reveal"
import { SITE_CONFIG, DIRECTIONS } from "@/data/content"
import { buildWhatsAppUrl } from "@/lib/utils"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid international phone number"),
  email: z.string().email("Please enter a valid email address"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.number().min(1).max(4, "Maximum 4 guests allowed"),
  message: z.string().min(10, "Please provide more details about your enquiry"),
})

type ContactForm = z.infer<typeof contactSchema>

export default function VisitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      guests: 2,
    },
  })

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const message = `Contact Form Enquiry - Lake View Villa Tangalle:

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Check-in: ${data.checkIn}
Check-out: ${data.checkOut}
Guests: ${data.guests}

Message: ${data.message}`

      // Try WhatsApp first
      const whatsappUrl = buildWhatsAppUrl(message)
      window.open(whatsappUrl, "_blank")

      // Fallback to mailto
      const mailtoUrl = `mailto:info@lakeviewvillatangalle.com?subject=Villa Enquiry from ${data.name}&body=${encodeURIComponent(message)}`
      setTimeout(() => {
        window.location.href = mailtoUrl
      }, 1000)

      setSubmitStatus("success")
      reset()
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Visit Us
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Plan your journey to Lake View Villa Tangalle with our location guide and contact information
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map & Directions */}
          <div className="space-y-8">
            {/* Map Card */}
            <SectionReveal>
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <MapPin className="text-cyan-400" size={24} />
                  Location & Map
                </h2>

                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.123456789!2d${SITE_CONFIG.coordinates.lng}!3d${SITE_CONFIG.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDEnMDIuMCJOIDgwwrA0Nic1Mi40IkU!5e0!3m2!1sen!2slk!4v1234567890123!5m2!1sen!2slk`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lake View Villa Tangalle Location"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.a
                    href={SITE_CONFIG.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                  >
                    <Navigation size={20} />
                    Open in Google Maps
                  </motion.a>

                  <motion.button
                    onClick={() => {
                      const message =
                        "Hi! I need directions to Lake View Villa Tangalle. Can you help me with the exact location?"
                      const whatsappUrl = buildWhatsAppUrl(message)
                      window.open(whatsappUrl, "_blank")
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    <MessageCircle size={20} />
                    Get Directions
                  </motion.button>
                </div>
              </div>
            </SectionReveal>

            {/* How to Get Here */}
            <SectionReveal>
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Car className="text-cyan-400" size={24} />
                  How to Get Here
                </h2>

                <div className="space-y-4">
                  {DIRECTIONS.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-slate-300 pt-1">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="flex items-start gap-3">
                    <Clock className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Travel Time</h3>
                      <p className="text-slate-300 text-sm">
                        Approximately 3 hours from Colombo Airport • 45 minutes from Matara
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Contact Strip */}
            <SectionReveal>
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Contact</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <motion.a
                    href={`tel:${SITE_CONFIG.whatsappNumber}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <Phone className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-white font-medium">Call Us</p>
                      <p className="text-slate-400 text-sm">{SITE_CONFIG.whatsappNumber}</p>
                    </div>
                  </motion.a>

                  <motion.a
                    href="mailto:info@lakeviewvillatangalle.com"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <Mail className="text-cyan-400" size={20} />
                    <div>
                      <p className="text-white font-medium">Email Us</p>
                      <p className="text-slate-400 text-sm">info@lakeviewvillatangalle.com</p>
                    </div>
                  </motion.a>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Contact Form */}
          <SectionReveal>
            <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>

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

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Check-in *</label>
                    <input
                      {...register("checkIn")}
                      type="date"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    />
                    {errors.checkIn && <p className="text-red-400 text-sm mt-1">{errors.checkIn.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Check-out *</label>
                    <input
                      {...register("checkOut")}
                      type="date"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    />
                    {errors.checkOut && <p className="text-red-400 text-sm mt-1">{errors.checkOut.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Guests *</label>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Message *</label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none"
                    placeholder="Tell us about your stay requirements, special requests, or any questions you have..."
                  />
                  {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending Message..." : "Send Message"}
                </motion.button>

                {submitStatus === "success" && (
                  <div className="text-green-400 text-center" role="status" aria-live="polite">
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="text-red-400 text-center" role="status" aria-live="polite">
                    Something went wrong. Please try again or contact us directly.
                  </div>
                )}
              </form>
            </div>
          </SectionReveal>
        </div>
      </div>
    </div>
  )
}
