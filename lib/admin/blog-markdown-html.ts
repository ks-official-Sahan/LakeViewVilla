import { marked } from "marked";
import TurndownService from "turndown";

marked.use({
  gfm: true,
  breaks: true,
});

let turndownSingleton: TurndownService | null = null;

function getTurndown(): TurndownService {
  if (!turndownSingleton) {
    turndownSingleton = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });
  }
  return turndownSingleton;
}

/** Markdown stored in DB → HTML for TipTap */
export function blogMarkdownToHtml(markdown: string): string {
  const raw = markdown ?? "";
  const out = marked.parse(raw, { async: false });
  return typeof out === "string" ? out : "";
}

/** TipTap document HTML → Markdown for persistence (remark pipeline on public site). */
export function blogHtmlToMarkdown(html: string): string {
  return getTurndown().turndown(html || "<p></p>");
}
