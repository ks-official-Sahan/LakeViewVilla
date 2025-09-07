import { z } from "zod"

export const ImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  w: z.number(),
  h: z.number(),
})

export const RoomSchema = z.object({
  name: z.string(),
  sleeps: z.number(),
  features: z.array(z.string()),
})

export const ReviewMetricsSchema = z.object({
  average: z.number(),
  count: z.number(),
})

export const RateSchema = z.object({
  season: z.string(),
  period: z.string(),
  nightly: z.string(),
  minNights: z.number(),
  notes: z.string().optional(),
})

export const OfferSchema = z.object({
  title: z.string(),
  description: z.string(),
})

export const HeroSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  ctas: z.array(z.string()),
})

export const BookingFactsSchema = z.object({
  hero: HeroSchema.optional(),
  images: z.array(ImageSchema).optional(),
  rooms: z.array(RoomSchema).optional(),
  amenities: z.array(z.string()).optional(),
  reviewMetrics: ReviewMetricsSchema.optional(),
  rates: z.array(RateSchema),
  offers: z.array(OfferSchema),
})

export type Image = z.infer<typeof ImageSchema>
export type Room = z.infer<typeof RoomSchema>
export type ReviewMetrics = z.infer<typeof ReviewMetricsSchema>
export type Rate = z.infer<typeof RateSchema>
export type Offer = z.infer<typeof OfferSchema>
export type Hero = z.infer<typeof HeroSchema>
export type BookingFacts = z.infer<typeof BookingFactsSchema>
