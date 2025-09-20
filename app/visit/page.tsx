/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { MapPin, Navigation, Phone, Mail, Clock, Car } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { SITE_CONFIG, DIRECTIONS } from "@/data/content";
import { buildWhatsAppUrl, cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { GuestsSelect } from "@/components/ui2/guests-select";

/* ---------- schema ---------- */
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Please enter a valid international number (E.164)"
    ),
  email: z.string().email("Please enter a valid email address"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.number().min(1).max(4, "Maximum 4 guests allowed"),
  message: z.string().min(10, "Please provide more details about your enquiry"),
});
type ContactForm = z.infer<typeof contactSchema>;

/* ---------- helpers ---------- */
function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

/** Glass select that keeps native popover; solves dark dropdown/datepicker */
function SelectField(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
  }
) {
  const { className, children, label, error, id, ...rest } = props;
  return (
    <div>
      {label ? (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-white mb-2"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={id}
          {...rest}
          className={cn(
            "appearance-none w-full rounded-xl bg-white/10 border border-white/20 text-white",
            "px-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent",
            "[color-scheme:dark] disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/75"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {error ? <p className="text-red-400 text-sm mt-1">{error}</p> : null}
    </div>
  );
}

export default function VisitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  //   watch,
  // } = useForm<ContactForm>({
  //   resolver: zodResolver(contactSchema),
  //   defaultValues: { guests: 2 },
  //   mode: "onTouched",
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control, // ⬅️ add this
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { guests: 2 },
    mode: "onTouched",
  });

  const checkIn = watch("checkIn");
  const minCheckout = useMemo(() => {
    if (!checkIn) return todayISO();
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [checkIn]);

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const message = [
        "Contact Form Enquiry — Lake View Villa Tangalle",
        "",
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Email: ${data.email}`,
        `Check-in: ${data.checkIn}`,
        `Check-out: ${data.checkOut}`,
        `Guests: ${data.guests}`,
        "",
        `Message: ${data.message}`,
        "",
        `Source: ${typeof window !== "undefined" ? window.location.href : ""}`,
      ].join("\n");

      // WhatsApp → fallback mailto
      const wa = buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, message);
      window.open(wa, "_blank", "noopener");

      setTimeout(() => {
        const mailto = `mailto:info@lakeviewvillatangalle.com?subject=${encodeURIComponent(
          `Villa Enquiry from ${data.name}`
        )}&body=${encodeURIComponent(message)}`;
        window.location.href = mailto;
      }, 800);

      setSubmitStatus("success");
      reset({ guests: 2 } as any);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stable, keyless embed
  const mapsEmbedSrc = useMemo(() => {
    const { lat, lng } = SITE_CONFIG.coordinates;
    return `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Ambient background (GPU-cheap) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_10%,rgba(56,189,248,0.16),transparent_70%),radial-gradient(50%_30%_at_80%_20%,rgba(45,212,191,0.14),transparent_70%),linear-gradient(180deg,#0b1220,#0b1220_30%,#0f172a)]"
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 mix-blend-screen opacity-70"
        animate={{ backgroundPosition: ["0px 0px", "36px 24px", "0px 0px"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0 1px,transparent 1px 6px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03) 0 1px,transparent 1px 6px)",
          backgroundSize: "18px 18px, 18px 18px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                  Visit Us
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300/95 max-w-2xl mx-auto">
                Plan your journey to Lake View Villa Tangalle with precise
                directions and fast contact options.
              </p>
            </div>
          </SectionReveal>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left column */}
          <div className="space-y-8">
            {/* Map */}
            <SectionReveal>
              <div className="rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 bg-white/10 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <MapPin className="text-cyan-300" size={24} />
                  Location & Map
                </h2>

                <motion.div
                  className="relative aspect-video rounded-xl overflow-hidden ring-1 ring-white/10"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                >
                  <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-cyan-400/30 to-emerald-400/30 blur-[6px]" />
                  <iframe
                    src={mapsEmbedSrc}
                    title="Lake View Villa Tangalle Location"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="relative z-10 h-full w-full"
                  />
                </motion.div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <motion.a
                    href={SITE_CONFIG.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -1, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-900 font-semibold shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 bg-[linear-gradient(135deg,#67e8f9,#22d3ee_40%,#34d399)]"
                  >
                    <Navigation size={20} />
                    Open in Google Maps
                  </motion.a>

                  <motion.button
                    onClick={() => {
                      const msg =
                        "Hi! I need directions to Lake View Villa Tangalle. Could you share the exact pin?";
                      window.open(
                        buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, msg),
                        "_blank",
                        "noopener"
                      );
                    }}
                    whileHover={{ y: -1, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 bg-white/10 hover:bg-white/14 ring-1 ring-white/15 transition"
                  >
                    <Navigation size={20} />
                    Get Directions via WhatsApp
                  </motion.button>
                </div>
              </div>
            </SectionReveal>

            {/* How to get here */}
            <SectionReveal>
              <div className="rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 bg-white/10 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Car className="text-cyan-300" size={24} />
                  How to Get Here
                </h2>

                <div className="space-y-4">
                  {DIRECTIONS.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-900 font-semibold text-sm">
                        {i + 1}
                      </div>
                      <p className="text-slate-200/90 pt-1">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl ring-1 ring-cyan-300/30 bg-cyan-400/10">
                  <div className="flex items-start gap-3">
                    <Clock
                      className="text-cyan-300 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <h3 className="font-semibold mb-1">
                        Typical Travel Time
                      </h3>
                      <p className="text-slate-300 text-sm">
                        ~3 hours from Colombo Airport • ~45 minutes from Matara
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Quick contact */}
            <SectionReveal>
              <div className="rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 bg-white/10 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6">Quick Contact</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <a
                    href={`tel:${SITE_CONFIG.whatsappNumber}`}
                    className="group flex items-center gap-3 p-4 rounded-xl bg-white/6 ring-1 ring-white/10 hover:bg-white/10 transition"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/90">
                      <Phone className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="text-slate-300 text-sm">
                        {SITE_CONFIG.whatsappNumber}
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@lakeviewvillatangalle.com"
                    className="group flex items-center gap-3 p-4 rounded-xl bg-white/6 ring-1 ring-white/10 hover:bg-white/10 transition"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/90">
                      <Mail className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <p className="font-medium">Email Us</p>
                      <p className="text-slate-300 text-sm">
                        info@lakeviewvillatangalle.com
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* Right column: form */}
          <SectionReveal>
            <div className="rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 bg-white/10 backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
                aria-busy={isSubmitting}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-white mb-2"
                      htmlFor="v-name"
                    >
                      Full Name *
                    </label>
                    <input
                      id="v-name"
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/55 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent [color-scheme:dark]"
                      placeholder="Your full name"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-white mb-2"
                      htmlFor="v-phone"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="v-phone"
                      {...register("phone")}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/55 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent [color-scheme:dark]"
                      placeholder="+94717448391"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-white mb-2"
                    htmlFor="v-email"
                  >
                    Email Address *
                  </label>
                  <input
                    id="v-email"
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/55 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent [color-scheme:dark]"
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-white mb-2"
                      htmlFor="v-in"
                    >
                      Check-in *
                    </label>
                    <input
                      id="v-in"
                      {...register("checkIn")}
                      type="date"
                      min={todayISO()}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent [color-scheme:dark]"
                      aria-invalid={!!errors.checkIn}
                    />
                    {errors.checkIn && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.checkIn.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-white mb-2"
                      htmlFor="v-out"
                    >
                      Check-out *
                    </label>
                    <input
                      id="v-out"
                      {...register("checkOut")}
                      type="date"
                      min={minCheckout}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent [color-scheme:dark]"
                      aria-invalid={!!errors.checkOut}
                    />
                    {errors.checkOut && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.checkOut.message}
                      </p>
                    )}
                  </div>

                  {/* <SelectField
                    id="v-guests"
                    {...register("guests", { valueAsNumber: true })}
                    label="Guests *"
                    error={errors.guests?.message}
                  >
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option
                        key={g}
                        value={g}
                        className="text-accent bg-accent-foreground"
                      >
                        {g} {g === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </SelectField> */}
                  <Controller
                    name="guests"
                    control={control}
                    render={({ field }) => (
                      <GuestsSelect
                        id="visit-guests"
                        label="Guests *"
                        value={field.value ?? 2}
                        onChange={field.onChange} // GuestsSelect returns a number
                        error={errors.guests?.message}
                        min={1}
                        max={4}
                      />
                    )}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-white mb-2"
                    htmlFor="v-msg"
                  >
                    Message *
                  </label>
                  <textarea
                    id="v-msg"
                    {...register("message")}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/55 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none [color-scheme:dark]"
                    placeholder="Tell us your dates, flexibility, special requests…"
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ y: -1, scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full py-4 px-6 rounded-xl text-slate-900 font-semibold shadow-xl disabled:opacity-60 disabled:cursor-not-allowed bg-[linear-gradient(135deg,#67e8f9,#22d3ee_40%,#34d399)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                >
                  {isSubmitting ? "Sending…" : "Send Message"}
                </motion.button>

                {submitStatus === "success" && (
                  <div
                    className="text-emerald-400 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    Message sent! We’ll get back to you shortly.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div
                    className="text-red-400 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    Something went wrong. Please try again or contact us
                    directly.
                  </div>
                )}
              </form>
            </div>
          </SectionReveal>
        </div>
      </div>
    </div>
  );
}
