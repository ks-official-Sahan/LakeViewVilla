"use client";

import { useState } from "react";
import { saveContentBlock } from "@/lib/admin/content-actions";
import { ChevronDown, ChevronRight, Save, Code, Layout } from "lucide-react";

interface ContentEditorProps {
  pageSlug: string;
  sections: string[];
  initialBlocks: any[];
}

export function ContentEditor({ pageSlug, sections, initialBlocks }: ContentEditorProps) {
  const [activeSection, setActiveSection] = useState<string | null>(sections[0] || null);
  const [saving, setSaving] = useState(false);
  
  // Create a map of section data
  const [dataMap, setDataMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    sections.forEach(sec => {
      const existing = initialBlocks.find(b => b.sectionSlug === sec);
      map[sec] = existing ? JSON.stringify(existing.data, null, 2) : "{\n  \n}";
    });
    return map;
  });

  const [viewMode, setViewMode] = useState<"json" | "form">("json");

  const handleSave = async (sectionSlug: string) => {
    try {
      setSaving(true);
      const dataStr = dataMap[sectionSlug];
      const parsedData = JSON.parse(dataStr); // Validate JSON
      
      await saveContentBlock(pageSlug, sectionSlug, parsedData);
      alert("Saved successfully!");
    } catch (e) {
      alert("Invalid JSON format. Please check for errors before saving.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDataChange = (sectionSlug: string, newValue: string) => {
    setDataMap(prev => ({ ...prev, [sectionSlug]: newValue }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-background)]">
            <h3 className="font-medium text-[var(--color-foreground)]">Page Sections</h3>
          </div>
          <div className="p-2 space-y-1">
            {sections.map(sec => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                  activeSection === sec 
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium" 
                    : "text-[var(--color-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]"
                }`}
              >
                <span className="capitalize">{sec.replace("-", " ")}</span>
                {activeSection === sec ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="lg:col-span-3">
        {activeSection ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-foreground)] capitalize">
                  {activeSection.replace("-", " ")} Content
                </h2>
                <p className="text-xs text-[var(--color-muted)]">Configure the content data for this section.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-[var(--color-background)] rounded-lg p-1 border border-[var(--color-border)] mr-2">
                  <button
                    onClick={() => setViewMode("form")}
                    disabled
                    className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                      viewMode === "form" ? "bg-[var(--color-surface)] shadow-sm text-[var(--color-foreground)]" : "text-[var(--color-muted)] opacity-50 cursor-not-allowed"
                    }`}
                    title="Form View (Coming Soon)"
                  >
                    <Layout className="h-3.5 w-3.5" /> Form
                  </button>
                  <button
                    onClick={() => setViewMode("json")}
                    className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                      viewMode === "json" ? "bg-[var(--color-surface)] shadow-sm text-[var(--color-foreground)]" : "text-[var(--color-muted)]"
                    }`}
                  >
                    <Code className="h-3.5 w-3.5" /> JSON
                  </button>
                </div>

                <button
                  onClick={() => handleSave(activeSection)}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-xl hover:bg-[var(--color-primary)]/90 transition-colors disabled:opacity-70"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Content"}
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 p-0 relative">
              {viewMode === "json" ? (
                <textarea
                  value={dataMap[activeSection]}
                  onChange={(e) => handleDataChange(activeSection, e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm bg-[#1e1e1e] text-[#d4d4d4] resize-none outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-inset"
                  spellCheck={false}
                />
              ) : (
                <div className="p-8 text-center text-[var(--color-muted)] flex flex-col items-center justify-center h-full">
                  <Layout className="h-12 w-12 mb-4 opacity-20" />
                  <p>Structured form view is under development.</p>
                  <p className="text-sm mt-2">Please use the JSON editor to modify content blocks.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-border)] border-dashed h-[400px] flex items-center justify-center text-[var(--color-muted)]">
            Select a section from the sidebar to edit its content.
          </div>
        )}
      </div>
    </div>
  );
}
