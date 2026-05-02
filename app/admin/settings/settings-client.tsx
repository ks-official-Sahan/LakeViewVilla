"use client";

import { useState } from "react";
import { updateSetting } from "@/lib/actions/settings";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type SettingType = "boolean" | "string" | "textarea";

type SettingItem = {
  key: string;
  label: string;
  type: SettingType;
  description: string;
};

type SettingGroup = {
  title: string;
  description: string;
  items: SettingItem[];
};

const SETTINGS_GROUPS: SettingGroup[] = [
  {
    title: "Site",
    description: "Branding and operational switches visible across the public site.",
    items: [
      {
        key: "site.maintenance",
        label: "Maintenance mode",
        type: "boolean",
        description: "When enabled, visitors see maintenance messaging instead of the normal site.",
      },
      {
        key: "site.name",
        label: "Property display name",
        type: "string",
        description: "Shown in titles, emails, and admin summaries.",
      },
      {
        key: "site.tagline",
        label: "Tagline",
        type: "string",
        description: "Short positioning line for hero areas or SEO fallback.",
      },
    ],
  },
  {
    title: "Contact",
    description: "How guests reach you from CTAs and the contact page.",
    items: [
      {
        key: "contact.whatsapp",
        label: "WhatsApp number",
        type: "string",
        description: "Include country code, digits only or E.164 (no spaces).",
      },
      {
        key: "contact.email",
        label: "Primary email",
        type: "string",
        description: "Displayed inquiries and booking follow-ups.",
      },
      {
        key: "contact.phone",
        label: "Phone (voice)",
        type: "string",
        description: "Optional landline or mobile for printed materials.",
      },
    ],
  },
  {
    title: "SEO",
    description: "Defaults when a page does not define its own meta.",
    items: [
      {
        key: "seo.defaultTitle",
        label: "Default title",
        type: "string",
        description: "Fallback document title for routes without explicit SEO.",
      },
      {
        key: "seo.defaultDescription",
        label: "Default meta description",
        type: "textarea",
        description: "Roughly 150–160 characters for search snippets.",
      },
      {
        key: "seo.defaultOgImage",
        label: "Default Open Graph image URL",
        type: "string",
        description: "Absolute HTTPS URL for social previews.",
      },
    ],
  },
  {
    title: "Features",
    description: "Toggle integrations and experimental behaviour.",
    items: [
      {
        key: "features.analyticsEnabled",
        label: "Analytics",
        type: "boolean",
        description: "Gate third-party analytics scripts when present in layout.",
      },
      {
        key: "features.bookingWidget",
        label: "Booking widget",
        type: "boolean",
        description: "Surface embedded booking or availability widgets.",
      },
      {
        key: "features.newsletterSignup",
        label: "Newsletter signup",
        type: "boolean",
        description: "Show optional email capture on relevant pages.",
      },
    ],
  },
];

export function SettingsClient({
  initialSettings,
}: {
  initialSettings: Record<string, unknown>;
}) {
  const [settings, setSettings] = useState<Record<string, unknown>>(initialSettings);
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (key: string, value: unknown) => {
    setSaving(key);
    try {
      const res = await updateSetting({ key, value });
      if (res.success) {
        toast.success("Setting saved.");
      } else {
        toast.error("error" in res && res.error ? String(res.error) : "Failed to save setting");
      }
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-10">
      {SETTINGS_GROUPS.map((group) => (
        <section key={group.title} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">{group.title}</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{group.description}</p>
          </div>

          <div className="space-y-4">
            {group.items.map((config) => {
              const value = settings[config.key];
              return (
                <div
                  key={config.key}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
                >
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h3 className="font-medium text-[var(--color-foreground)]">{config.label}</h3>
                      <p className="text-sm text-[var(--color-muted)]">{config.description}</p>
                      <div className="mt-1 font-mono text-xs text-[var(--color-muted)]/70">{config.key}</div>
                    </div>
                    <Button
                      disabled={saving === config.key}
                      onClick={() => handleSave(config.key, settings[config.key])}
                      className="shrink-0"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saving === config.key ? "Saving…" : "Save"}
                    </Button>
                  </div>

                  {config.type === "boolean" ? (
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) =>
                          setSettings({ ...settings, [config.key]: e.target.checked })
                        }
                        className="h-5 w-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                      <span className="text-sm font-medium">Enabled</span>
                    </label>
                  ) : config.type === "textarea" ? (
                    <textarea
                      value={value !== undefined && value !== null ? String(value) : ""}
                      onChange={(e) => setSettings({ ...settings, [config.key]: e.target.value })}
                      rows={4}
                      className="w-full max-w-2xl rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder={`Enter ${config.label.toLowerCase()}…`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value !== undefined && value !== null ? String(value) : ""}
                      onChange={(e) => setSettings({ ...settings, [config.key]: e.target.value })}
                      className="w-full max-w-md rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                      placeholder={`Enter ${config.label.toLowerCase()}…`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
