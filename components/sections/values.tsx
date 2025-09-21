"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Car,
  Waves,
  Utensils,
  Wind,
  Trees,
  ShowerHead,
  ChevronDown,
} from "lucide-react";
import { VALUES_ITEMS } from "@/data/content";
import { ArchedMedia } from "../ui2/arched-media";
import { SectionReveal } from "../motion/section-reveal";

const iconMap = {
  car: Car,
  waves: Waves,
  utensils: Utensils,
  wind: Wind,
  trees: Trees,
  shower: ShowerHead,
} as const;

export function ValuesSection() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* Left: arch image */}
          <div className="order-2 lg:order-1">
            <SectionReveal>
              <ArchedMedia
                src="/villa/with_guests_02.jpeg"
                alt="Garden & lake view"
                priority
                className="lg:sticky lg:top-24"
              />
            </SectionReveal>
          </div>

          {/* Right: copy + list */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold text-sky-600/90 mb-2">
              Our Values
            </p>
            <h2 className="text-[clamp(28px,3.6vw,44px)] leading-tight font-extrabold text-slate-800 tracking-tight">
              The Value We Provide to You
              <span className="align-middle inline-block ml-1.5 h-2 w-2 rounded-full bg-amber-400" />
            </h2>

            <div className="mt-4 space-y-1.5 text-slate-500">
              <p>Closest Beach: Goyambokka Beach (less than 1 km)</p>
              <p>Notable Landmarks: Hummanaya Blow Hole (10 km)</p>
              <p>Facilities: Free WiFi, Air Conditioning, Free Parking</p>
            </div>

            <Accordion type="single" collapsible className="mt-6 space-y-4">
              {VALUES_ITEMS.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Car;
                return (
                  <SectionReveal>
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="rounded-2xl border border-slate-200 bg-white shadow-[0_6px_24px_rgba(2,6,23,0.06)] data-[state=open]:shadow-[0_10px_32px_rgba(2,6,23,0.08)]"
                    >
                      <AccordionTrigger className="group px-4 sm:px-6 py-4 sm:py-5 hover:no-underline">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-100 text-sky-600 ring-1 ring-sky-200">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="text-base sm:text-[17px] font-semibold text-slate-700">
                            {item.title}
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-6 pb-5 pt-0 text-slate-600">
                        {item.body}
                      </AccordionContent>
                    </AccordionItem>
                  </SectionReveal>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
