/**
 * Typed field definitions for selected CMS sections.
 * Keys are `${pageSlug}/${sectionSlug}`. Sections without an entry use raw JSON in the editor.
 */

export type SectionField =
  | { key: string; type: "text"; label: string; maxLength?: number }
  | { key: string; type: "textarea"; label: string; maxLength?: number }
  | { key: string; type: "url"; label: string };

export type SectionSchema = {
  label: string;
  fields: SectionField[];
};

export const SECTION_SCHEMAS: Record<string, SectionSchema> = {
  "home/hero": {
    label: "Home — Hero",
    fields: [
      { key: "headline", type: "text", label: "Headline", maxLength: 120 },
      { key: "subheadline", type: "textarea", label: "Subheadline", maxLength: 280 },
      { key: "ctaLabel", type: "text", label: "CTA label", maxLength: 48 },
      { key: "ctaHref", type: "url", label: "CTA URL" },
    ],
  },
  "stays/hero": {
    label: "Stays — Hero",
    fields: [
      { key: "headline", type: "text", label: "Headline", maxLength: 120 },
      { key: "subheadline", type: "textarea", label: "Subheadline", maxLength: 280 },
    ],
  },
  "gallery/hero": {
    label: "Gallery — Hero",
    fields: [
      { key: "headline", type: "text", label: "Headline", maxLength: 120 },
      { key: "subheadline", type: "textarea", label: "Subheadline", maxLength: 200 },
    ],
  },
  "visit/hero": {
    label: "Visit — Hero",
    fields: [
      { key: "headline", type: "text", label: "Headline", maxLength: 120 },
      { key: "subheadline", type: "textarea", label: "Subheadline", maxLength: 280 },
    ],
  },
  "faq/hero": {
    label: "FAQ — Hero",
    fields: [
      { key: "headline", type: "text", label: "Headline", maxLength: 120 },
      { key: "subheadline", type: "textarea", label: "Intro", maxLength: 400 },
    ],
  },
};

export function sectionSchemaKey(pageSlug: string, sectionSlug: string): string {
  return `${pageSlug}/${sectionSlug}`;
}
