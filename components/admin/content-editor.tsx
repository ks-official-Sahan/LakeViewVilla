"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { saveContentBlock } from "@/lib/admin/content-actions";
import { SECTION_SCHEMAS, sectionSchemaKey, type SectionField } from "@/lib/admin/section-schemas";
import { ChevronDown, ChevronRight, Save, Code, Layout } from "lucide-react";
import { toast } from "sonner";

interface ContentEditorProps {
  pageSlug: string;
  sections: string[];
  initialBlocks: { sectionSlug: string; data: unknown }[];
}

function parseDataMap(
  sections: string[],
  initialBlocks: ContentEditorProps["initialBlocks"],
): Record<string, string> {
  const map: Record<string, string> = {};
  sections.forEach((sec) => {
    const existing = initialBlocks.find((b) => b.sectionSlug === sec);
    map[sec] = existing ? JSON.stringify(existing.data, null, 2) : "{\n  \n}";
  });
  return map;
}

function safeParseObject(raw: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(raw) as unknown;
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      return v as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

export function ContentEditor({ pageSlug, sections, initialBlocks }: ContentEditorProps) {
  const [activeSection, setActiveSection] = useState<string | null>(sections[0] || null);
  const [saving, setSaving] = useState(false);
  const [dataMap, setDataMap] = useState<Record<string, string>>(() =>
    parseDataMap(sections, initialBlocks),
  );

  const schemaForActive = useMemo(() => {
    if (!activeSection) return undefined;
    return SECTION_SCHEMAS[sectionSchemaKey(pageSlug, activeSection)];
  }, [pageSlug, activeSection]);

  const [viewMode, setViewMode] = useState<"json" | "form">("json");

  useEffect(() => {
    setViewMode("json");
  }, [activeSection]);

  const handleSave = async (sectionSlug: string) => {
    try {
      setSaving(true);
      const dataStr = dataMap[sectionSlug];
      const parsedData = JSON.parse(dataStr) as unknown;
      await saveContentBlock(pageSlug, sectionSlug, parsedData);
      toast.success("Saved successfully.");
    } catch {
      toast.error("Invalid JSON. Fix syntax errors before saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleDataChange = useCallback((sectionSlug: string, newValue: string) => {
    setDataMap((prev) => ({ ...prev, [sectionSlug]: newValue }));
  }, []);

  const setFieldValue = useCallback(
    (sectionSlug: string, key: string, value: string) => {
      setDataMap((prev) => {
        const raw = prev[sectionSlug];
        const base = safeParseObject(raw) ?? {};
        const next = { ...base, [key]: value };
        return { ...prev, [sectionSlug]: JSON.stringify(next, null, 2) };
      });
    },
    [],
  );

  const switchToForm = () => {
    if (!activeSection || !schemaForActive) return;
    const parsed = safeParseObject(dataMap[activeSection]);
    if (!parsed) {
      toast.error("Fix JSON syntax before using the form editor.");
      return;
    }
    setViewMode("form");
  };

  const renderFieldInput = (sectionSlug: string, field: SectionField, obj: Record<string, unknown>) => {
    const rawVal = obj[field.key];
    const strVal = rawVal === undefined || rawVal === null ? "" : String(rawVal);

    const common =
      "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-foreground)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]";

    const maxLen = "maxLength" in field ? field.maxLength : undefined;

    if (field.type === "textarea") {
      return (
        <textarea
          value={strVal}
          maxLength={maxLen}
          rows={4}
          onChange={(e) => setFieldValue(sectionSlug, field.key, e.target.value)}
          className={common}
        />
      );
    }

    return (
      <input
        type={field.type === "url" ? "url" : "text"}
        value={strVal}
        maxLength={maxLen}
        onChange={(e) => setFieldValue(sectionSlug, field.key, e.target.value)}
        className={common}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="space-y-2 lg:col-span-1">
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-background)] p-4">
            <h3 className="font-medium text-[var(--color-foreground)]">Page sections</h3>
          </div>
          <div className="space-y-1 p-2">
            {sections.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setActiveSection(sec)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeSection === sec
                    ? "bg-[var(--color-primary)]/10 font-medium text-[var(--color-primary)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]"
                }`}
              >
                <span className="capitalize">{sec.replace(/-/g, " ")}</span>
                {activeSection === sec ? (
                  <ChevronDown className="h-4 w-4 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        {activeSection ? (
          <div className="flex h-[min(720px,75vh)] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-4">
              <div>
                <h2 className="text-lg font-semibold capitalize text-[var(--color-foreground)]">
                  {activeSection.replace(/-/g, " ")} content
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  {schemaForActive
                    ? `${schemaForActive.label} — switch between form fields and raw JSON.`
                    : "Edit JSON only for this section (no form schema yet)."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {schemaForActive ? (
                  <div className="mr-1 flex rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-1">
                    <button
                      type="button"
                      onClick={switchToForm}
                      className={`flex items-center gap-1 rounded-md p-1.5 text-xs font-medium transition-colors ${
                        viewMode === "form"
                          ? "bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm"
                          : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                      }`}
                    >
                      <Layout className="h-3.5 w-3.5" /> Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("json")}
                      className={`flex items-center gap-1 rounded-md p-1.5 text-xs font-medium transition-colors ${
                        viewMode === "json"
                          ? "bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm"
                          : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                      }`}
                    >
                      <Code className="h-3.5 w-3.5" /> JSON
                    </button>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => handleSave(activeSection)}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary)]/90 disabled:opacity-70"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              {viewMode === "json" || !schemaForActive ? (
                <textarea
                  value={dataMap[activeSection]}
                  onChange={(e) => handleDataChange(activeSection, e.target.value)}
                  className="h-full min-h-[320px] w-full resize-none bg-[#1e1e1e] p-4 font-mono text-sm text-[#d4d4d4] outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-inset"
                  spellCheck={false}
                />
              ) : (
                <div className="flex h-full min-h-0 flex-col gap-4 overflow-auto p-4 lg:flex-row">
                  <div className="min-w-0 flex-1 space-y-4">
                    {schemaForActive.fields.map((field) => {
                      const obj = safeParseObject(dataMap[activeSection]) ?? {};
                      return (
                        <label key={field.key} className="block space-y-1.5">
                          <span className="text-xs font-medium text-[var(--color-muted)]">{field.label}</span>
                          {renderFieldInput(activeSection, field, obj)}
                          {"maxLength" in field && field.maxLength ? (
                            <span className="text-[10px] text-[var(--color-muted)]">
                              Max {field.maxLength} characters
                            </span>
                          ) : null}
                        </label>
                      );
                    })}
                  </div>
                  <div className="shrink-0 lg:w-[42%]">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
                      Live JSON (read-only)
                    </p>
                    <pre className="max-h-[480px] overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3 font-mono text-[11px] leading-relaxed text-[var(--color-muted)]">
                      {dataMap[activeSection]}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] text-[var(--color-muted)]">
            Select a section from the sidebar.
          </div>
        )}
      </div>
    </div>
  );
}
