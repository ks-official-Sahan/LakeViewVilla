"use client";

import { useState } from "react";
import { updateSetting } from "@/lib/actions/settings";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsClient({
  initialSettings,
}: {
  initialSettings: Record<string, any>;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (key: string, value: any) => {
    setSaving(key);
    try {
      const res = await updateSetting({ key, value });
      if (res.success) {
        alert("Setting saved successfully");
      } else {
        alert(res.error || "Failed to save setting");
      }
    } finally {
      setSaving(null);
    }
  };

  const SETTINGS_CONFIG = [
    {
      key: "site.maintenance",
      label: "Maintenance Mode",
      type: "boolean",
      description: "Enable to show a maintenance page to visitors.",
    },
    {
      key: "contact.whatsapp",
      label: "WhatsApp Number",
      type: "string",
      description: "Primary contact number (with country code).",
    },
    {
      key: "seo.defaultTitle",
      label: "Default SEO Title",
      type: "string",
      description: "Fallback title for pages without one.",
    },
  ];

  return (
    <div className="space-y-4">
      {SETTINGS_CONFIG.map((config) => {
        const value = settings[config.key] ?? "";
        return (
          <div
            key={config.key}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm"
          >
            <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="font-medium text-[var(--color-foreground)]">{config.label}</h3>
                <p className="text-sm text-[var(--color-muted)]">{config.description}</p>
                <div className="mt-1 text-xs text-[var(--color-muted)]/70 font-mono">
                  {config.key}
                </div>
              </div>
              <Button
                disabled={saving === config.key}
                onClick={() => handleSave(config.key, settings[config.key])}
                className="shrink-0"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving === config.key ? "Saving..." : "Save"}
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
            ) : (
              <input
                type="text"
                value={String(value)}
                onChange={(e) => setSettings({ ...settings, [config.key]: e.target.value })}
                className="w-full max-w-md rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder={`Enter ${config.label.toLowerCase()}...`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
