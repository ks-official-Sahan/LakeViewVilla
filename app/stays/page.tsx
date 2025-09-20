/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import { RATES, OFFERS, SITE_CONFIG, BOOKING_FACTS } from "@/data/content";
import { buildWhatsAppUrl, cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import { GuestsSelect } from "@/components/ui/guests-select";

/* ---------- schema ---------- */
const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{1,14}$/,
      "Enter an international phone (e.g. +94717448391)"
    ),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  guests: z.number().min(1).max(4, "Maximum 4 guests allowed"),
  message: z.string().optional(),
});
type EnquiryForm = z.infer<typeof enquirySchema>;

/* ---------- helpers ---------- */
function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
    <path
      fill="#25D366"
      d="M16 3C9.373 3 4 8.373 4 15a11.9 11.9 0 0 0 1.77 6.23L4 29l7.95-1.74A11.93 11.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Z"
    />
    <path
      fill="#fff"
      d="M23.2 19.43c-.19.53-.94.96-1.52 1.08-.41.09-.94.16-2.73-.56-2.29-.95-3.76-3.28-3.88-3.43-.12-.15-.93-1.24-.93-2.37s.57-1.68.77-1.92c.2-.24.44-.3.58-.3.14 0 .29 0 .42.01.13.01.31-.05.48.37.19.46.64 1.6.69 1.71.05.11.08.23.01.38-.07.15-.11.23-.22.36-.11.13-.23.29-.33.4-.11.11-.22.24-.1.46.12.22.54.89 1.17 1.44.81.72 1.5.95 1.72 1.06.22.11.35.1.49-.06.14-.16.56-.64.71-.86.15-.22.31-.18.52-.11.21.07 1.34.63 1.57.74.23.11.38.17.43.27.05.1.05.58-.14 1.11Z"
    />
  </svg>
);

/** Reusable select */
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
            "px-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent",
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

export default function StaysPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   watch,
  //   reset,
  // } = useForm<EnquiryForm>({
  //   resolver: zodResolver(enquirySchema),
  //   defaultValues: { guests: 2 },
  //   mode: "onTouched",
  // });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    control, // ⬅️ make sure this is here
  } = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { guests: 2 },
    mode: "onTouched",
  });

  const { name, checkIn, checkOut, guests } = watch();

  const minCheckout = useMemo(() => {
    if (!checkIn) return todayISO();
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, [checkIn]);

  const onSubmit = async (data: EnquiryForm) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const composed = [
        "WhatsApp Enquiry — Lake View Villa Tangalle",
        "",
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Check-in: ${data.checkIn}`,
        `Check-out: ${data.checkOut}`,
        `Guests: ${data.guests}`,
        data.message ? `\nMessage: ${data.message}` : "",
        "",
        `Source: ${typeof window !== "undefined" ? window.location.href : ""}`,
      ]
        .filter(Boolean)
        .join("\n");

      const wa = buildWhatsAppUrl(SITE_CONFIG.whatsappNumber, composed);
      window.open(wa, "_blank", "noopener");

      setSubmitStatus("success");
      reset({ guests: 2 } as any);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const rating = BOOKING_FACTS?.reviewMetrics?.average ?? null;
  const ratingCount = BOOKING_FACTS?.reviewMetrics?.count ?? null;

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Ambient background */}
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
                  Stays & Rates
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300/95 max-w-2xl mx-auto">
                Experience tranquility on a serene lagoon—best rates via direct
                WhatsApp.
              </p>
              {(rating || ratingCount) && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 backdrop-blur-md">
                  <Star className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium">
                    {rating ? `${rating.toFixed(1)}/10` : ""} ·{" "}
                    {ratingCount ?? 0} reviews
                  </span>
                </div>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Rates + Offers */}
          <div className="space-y-8">
            <SectionReveal>
              <div className="rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 bg-white/10 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Star className="text-yellow-300" size={22} />
                  Rates & Availability
                </h2>

                <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
                  <table className="w-full text-sm md:text-base text-white/95">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left py-3 px-3 font-semibold">
                          Season
                        </th>
                        <th className="text-left py-3 px-3 font-semibold">
                          Period
                        </th>
                        <th className="text-left py-3 px-3 font-semibold">
                          Rate
                        </th>
                        <th className="text-left py-3 px-3 font-semibold">
                          Min Nights
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {RATES.map((r, i) => (
                        <tr key={i} className="border-t border-white/10">
                          <td className="py-4 px-3 font-medium text-white">
                            {r.season}
                          </td>
                          <td className="py-4 px-3 text-slate-300">
                            {r.period}
                          </td>
                          <td className="py-4 px-3">
                            <span className="inline-flex items-center rounded-md px-2 py-1 bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/30">
                              {r.nightly}
                            </span>
                          </td>
                          <td className="py-4 px-3 text-slate-300">
                            {r.minNights}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {RATES[0]?.notes ? (
                  <p className="text-xs md:text-sm text-slate-400 mt-4">
                    {RATES[0].notes}
                  </p>
                ) : null}
              </div>
            </SectionReveal>

            <SectionReveal>
              <div className="rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 bg-white/10 backdrop-blur-xl">
                <h2 className="text-2xl font-bold mb-6">Special Offers</h2>
                <div className="space-y-4">
                  {OFFERS.map((offer, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white/6 ring-1 ring-white/10 hover:bg-white/10 transition"
                    >
                      <Check
                        className="text-emerald-400 mt-1 flex-shrink-0"
                        size={20}
                      />
                      <div>
                        <h3 className="font-semibold">{offer.title}</h3>
                        <p className="text-slate-300 text-sm">
                          {offer.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>

          {/* WhatsApp enquiry form */}
          <SectionReveal>
            <div className="rounded-2xl p-8 shadow-2xl ring-1 ring-white/10 bg-white/10 backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <WhatsappIcon className="h-5 w-5" />
                WhatsApp Enquiry
              </h2>

              {/* Live summary chip */}
              <div className="mb-5 text-slate-300 text-sm">
                <span className="mr-2">Preview:</span>
                <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/10">
                  {name || "Your name"} • {checkIn || "Check-in"} →{" "}
                  {checkOut || "Check-out"} • {guests ?? 2}{" "}
                  {guests === 1 ? "guest" : "guests"}
                </span>
              </div>

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
                      htmlFor="s-name"
                    >
                      Full Name *
                    </label>
                    <input
                      id="s-name"
                      {...register("name")}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/55 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent [color-scheme:dark]"
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
                      htmlFor="s-phone"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="s-phone"
                      {...register("phone")}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/55 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent [color-scheme:dark]"
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-medium text-white mb-2"
                      htmlFor="s-in"
                    >
                      Check-in *
                    </label>
                    <input
                      id="s-in"
                      {...register("checkIn")}
                      type="date"
                      min={todayISO()}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent [color-scheme:dark]"
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
                      htmlFor="s-out"
                    >
                      Check-out *
                    </label>
                    <input
                      id="s-out"
                      {...register("checkOut")}
                      type="date"
                      min={minCheckout}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent [color-scheme:dark]"
                      aria-invalid={!!errors.checkOut}
                    />
                    {errors.checkOut && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.checkOut.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* <SelectField
                  id="s-guests"
                  {...register("guests", { valueAsNumber: true })}
                  label="Guests *"
                  error={errors.guests?.message}
                >
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option
                      key={g}
                      value={g}
                      className="text-accent bg-accent-foreground rounded-2xl"
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
                      id="stays-guests"
                      label="Guests *"
                      value={field.value ?? 2}
                      onChange={field.onChange}
                      error={errors.guests?.message}
                      min={1}
                      max={4}
                    />
                  )}
                />

                <div>
                  <label
                    className="block text-sm font-medium text-white mb-2"
                    htmlFor="s-msg"
                  >
                    Additional Message
                  </label>
                  <textarea
                    id="s-msg"
                    {...register("message")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/55 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent resize-none [color-scheme:dark]"
                    placeholder="Any special requests or questions…"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ y: -1, scale: 1.01 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full py-4 px-6 rounded-xl text-slate-900 font-semibold shadow-xl disabled:opacity-60 disabled:cursor-not-allowed bg-[linear-gradient(135deg,#67e8f9,#22d3ee_40%,#34d399)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 inline-flex items-center justify-center gap-2"
                >
                  <WhatsappIcon className="h-5 w-5" />
                  {isSubmitting ? "Sending…" : "Send WhatsApp Enquiry"}
                </motion.button>

                {submitStatus === "success" && (
                  <div
                    className="text-emerald-400 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    Enquiry sent! We’ll reply on WhatsApp soon.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div
                    className="text-red-400 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    Something went wrong. Please try again.
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
