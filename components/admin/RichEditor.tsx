"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Link, Quote, Code, Minus, Eye, Edit3, RotateCcw, RotateCw,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  autoSaveKey?: string;
}

// ─── Markdown Renderer (lightweight) ────────────────────────────────────────

function renderMarkdown(md: string): string {
  return md
    .replace(/^#{3} (.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2} (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/^---$/gm, "<hr />")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|l|b|p|h|c])(.+)$/gm, "<p>$1</p>");
}

// ─── Toolbar Button ──────────────────────────────────────────────────────────

function ToolbarBtn({
  onClick,
  title,
  children,
  active,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition ${
        active
          ? "bg-[var(--color-primary)] text-white"
          : "text-[var(--color-muted)] hover:bg-[var(--color-border)]/40 hover:text-[var(--color-foreground)]"
      }`}
    >
      {children}
    </button>
  );
}

const DIVIDER = <div className="mx-1 h-5 w-px bg-[var(--color-border)]" />;

// ─── Component ───────────────────────────────────────────────────────────────

export function RichEditor({
  value,
  onChange,
  placeholder = "Start writing…",
  minHeight = 400,
  autoSaveKey,
}: RichEditorProps) {
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Auto-save ──
  useEffect(() => {
    if (!autoSaveKey) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      try { localStorage.setItem(autoSaveKey, value); } catch { /* ignore */ }
    }, 30_000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [value, autoSaveKey]);

  const pushHistory = useCallback((newVal: string) => {
    setHistory((h) => [...h.slice(0, historyIdx + 1), newVal].slice(-50));
    setHistoryIdx((i) => Math.min(i + 1, 49));
  }, [historyIdx]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    pushHistory(e.target.value);
  };

  function undo() {
    if (historyIdx <= 0) return;
    const newIdx = historyIdx - 1;
    setHistoryIdx(newIdx);
    onChange(history[newIdx]);
  }

  function redo() {
    if (historyIdx >= history.length - 1) return;
    const newIdx = historyIdx + 1;
    setHistoryIdx(newIdx);
    onChange(history[newIdx]);
  }

  // ── Insert at cursor ──
  const insert = useCallback((
    before: string,
    after = "",
    defaultText = "text"
  ) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || defaultText;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    pushHistory(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }, [value, onChange, pushHistory]);

  const insertLine = useCallback((prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
    pushHistory(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }, [value, onChange, pushHistory]);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
        <ToolbarBtn title="Heading 2" onClick={() => insertLine("## ")}>
          <Heading2 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3" onClick={() => insertLine("### ")}>
          <Heading3 className="h-4 w-4" />
        </ToolbarBtn>
        {DIVIDER}
        <ToolbarBtn title="Bold" onClick={() => insert("**", "**", "bold text")}>
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" onClick={() => insert("*", "*", "italic text")}>
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Code" onClick={() => insert("`", "`", "code")}>
          <Code className="h-4 w-4" />
        </ToolbarBtn>
        {DIVIDER}
        <ToolbarBtn title="Blockquote" onClick={() => insertLine("> ")}>
          <Quote className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Bullet List" onClick={() => insertLine("- ")}>
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Numbered List" onClick={() => insertLine("1. ")}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Divider" onClick={() => {
          const next = value + "\n\n---\n\n";
          onChange(next);
          pushHistory(next);
        }}>
          <Minus className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Link" onClick={() => insert("[", "](https://)", "link text")}>
          <Link className="h-4 w-4" />
        </ToolbarBtn>
        {DIVIDER}
        <ToolbarBtn title="Undo" onClick={undo} active={false}>
          <RotateCcw className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Redo" onClick={redo} active={false}>
          <RotateCw className="h-4 w-4" />
        </ToolbarBtn>
        <div className="flex-1" />
        <ToolbarBtn title="Toggle Preview" onClick={() => setPreview((p) => !p)} active={preview}>
          {preview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </ToolbarBtn>
      </div>

      {/* Editor / Preview */}
      {preview ? (
        <div
          className="prose prose-sm max-w-none px-4 py-4 text-[var(--color-foreground)]"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || `<p class="text-gray-400 italic">${placeholder}</p>` }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          spellCheck
          aria-label="Blog content editor"
          className="w-full resize-none bg-transparent px-4 py-4 font-mono text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] focus:outline-none"
          style={{ minHeight }}
        />
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5">
        <span className="text-xs text-[var(--color-muted)]">
          {value.trim().split(/\s+/).filter(Boolean).length} words
        </span>
        {autoSaveKey && (
          <span className="text-xs text-[var(--color-muted)]">Auto-saves every 30s</span>
        )}
      </div>
    </div>
  );
}
