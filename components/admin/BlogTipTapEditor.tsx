"use client";

import { useEffect, useReducer, useRef } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Minus,
  Link2,
  ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { blogHtmlToMarkdown, blogMarkdownToHtml } from "@/lib/admin/blog-markdown-html";

export interface BlogTipTapEditorProps {
  markdown: string;
  onMarkdownChange: (next: string) => void;
  placeholder?: string;
}

function TipToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const btn = (active: boolean) =>
    `rounded-lg p-2 transition-colors ${
      active
        ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
        : "text-[var(--color-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-foreground)]"
    }`;

  const run = (fn: () => boolean) => () => {
    fn();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--color-border)] bg-[var(--color-background)] px-2 py-1.5">
      <button type="button" className={btn(editor.isActive("bold"))} onClick={run(() => editor.chain().focus().toggleBold().run())} aria-label="Bold" title="Bold">
        <Bold className="h-4 w-4" />
      </button>
      <button type="button" className={btn(editor.isActive("italic"))} onClick={run(() => editor.chain().focus().toggleItalic().run())} aria-label="Italic" title="Italic">
        <Italic className="h-4 w-4" />
      </button>
      <button type="button" className={btn(editor.isActive("underline"))} onClick={run(() => editor.chain().focus().toggleUnderline().run())} aria-label="Underline" title="Underline">
        <UnderlineIcon className="h-4 w-4" />
      </button>
      <button type="button" className={btn(editor.isActive("strike"))} onClick={run(() => editor.chain().focus().toggleStrike().run())} aria-label="Strikethrough" title="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </button>
      <span className="mx-1 h-5 w-px bg-[var(--color-border)]" aria-hidden />
      <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} aria-label="Heading 2" title="Heading 2">
        <Heading2 className="h-4 w-4" />
      </button>
      <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={run(() => editor.chain().focus().toggleHeading({ level: 3 }).run())} aria-label="Heading 3" title="Heading 3">
        <Heading3 className="h-4 w-4" />
      </button>
      <span className="mx-1 h-5 w-px bg-[var(--color-border)]" aria-hidden />
      <button type="button" className={btn(editor.isActive("bulletList"))} onClick={run(() => editor.chain().focus().toggleBulletList().run())} aria-label="Bullet list" title="Bullet list">
        <List className="h-4 w-4" />
      </button>
      <button type="button" className={btn(editor.isActive("orderedList"))} onClick={run(() => editor.chain().focus().toggleOrderedList().run())} aria-label="Numbered list" title="Numbered list">
        <ListOrdered className="h-4 w-4" />
      </button>
      <button type="button" className={btn(editor.isActive("blockquote"))} onClick={run(() => editor.chain().focus().toggleBlockquote().run())} aria-label="Quote" title="Quote">
        <Quote className="h-4 w-4" />
      </button>
      <button type="button" className={btn(editor.isActive("code"))} onClick={run(() => editor.chain().focus().toggleCode().run())} aria-label="Inline code" title="Inline code">
        <Code className="h-4 w-4" />
      </button>
      <button type="button" className={btn(editor.isActive("codeBlock"))} onClick={run(() => editor.chain().focus().toggleCodeBlock().run())} aria-label="Code block" title="Code block">
        <Code2 className="h-4 w-4" />
      </button>
      <button type="button" className={btn(false)} onClick={run(() => editor.chain().focus().setHorizontalRule().run())} aria-label="Horizontal rule" title="Horizontal rule">
        <Minus className="h-4 w-4" />
      </button>
      <span className="mx-1 h-5 w-px bg-[var(--color-border)]" aria-hidden />
      <button
        type="button"
        className={btn(editor.isActive("link"))}
        onClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          const href =
            typeof window !== "undefined"
              ? window.prompt("Link URL", prev ?? "https://")
              : null;
          if (href === null) return;
          if (href === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
        }}
        aria-label="Link"
        title="Link"
      >
        <Link2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={btn(false)}
        onClick={() => {
          const src =
            typeof window !== "undefined"
              ? window.prompt("Image URL (e.g. Cloudinary)", "https://")
              : null;
          if (!src?.trim()) return;
          editor.chain().focus().setImage({ src: src.trim() }).run();
        }}
        aria-label="Insert image"
        title="Insert image"
      >
        <ImageIcon className="h-4 w-4" />
      </button>
      <span className="mx-1 h-5 w-px bg-[var(--color-border)]" aria-hidden />
      <button type="button" className={btn(false)} onClick={run(() => editor.chain().focus().undo().run())} disabled={!editor.can().undo()} aria-label="Undo" title="Undo">
        <Undo2 className="h-4 w-4" />
      </button>
      <button type="button" className={btn(false)} onClick={run(() => editor.chain().focus().redo().run())} disabled={!editor.can().redo()} aria-label="Redo" title="Redo">
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function BlogTipTapEditor({
  markdown,
  onMarkdownChange,
  placeholder = "Write your story…",
}: BlogTipTapEditorProps) {
  const internalMdRef = useRef(markdown);
  const [, toolbarTick] = useReducer((n: number) => n + 1, 0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[var(--color-primary)] underline underline-offset-2",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    editorProps: {
      attributes: {
        class:
          "tiptap-blog prose prose-sm max-w-none dark:prose-invert px-4 py-3 min-h-[420px] outline-none focus:outline-none text-[var(--color-foreground)]",
      },
    },
    content: blogMarkdownToHtml(markdown),
    onUpdate: ({ editor: ed }) => {
      const md = blogHtmlToMarkdown(ed.getHTML());
      internalMdRef.current = md;
      onMarkdownChange(md);
    },
    onSelectionUpdate: () => {
      toolbarTick();
    },
    onTransaction: () => {
      toolbarTick();
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (markdown === internalMdRef.current) return;
    const html = blogMarkdownToHtml(markdown);
    editor.commands.setContent(html, { emitUpdate: false });
    internalMdRef.current = markdown;
  }, [markdown, editor]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-xl bg-[var(--color-surface)]">
      <TipToolbar editor={editor} />
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
