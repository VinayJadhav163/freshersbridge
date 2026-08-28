'use client';

import React, { useState } from 'react';
import { Check, Copy, AlertCircle, Code2, Terminal, Sparkles } from 'lucide-react';

interface GuideContentRendererProps {
  content: string;
  tableOfContents?: { id: string; title: string }[];
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-lg">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#1e293b]/80 px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            {language || 'code'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-md bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="overflow-x-auto p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
        <pre className="m-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

function formatInlineMarkdown(text: string): string {
  if (!text) return '';
  return text
    // 1. Escape angle brackets so tags like `<header>`, `<nav>`, `<T>` are visible in the browser
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // 2. Bold text: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    // 3. Inline code: `code` (decode escaped entities inside code blocks so they render cleanly)
    .replace(/`([^`]+)`/g, '<code class="bg-secondary text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
    // 4. Clean quotes
    .replace(/\*["“](.*?)["”]\*/g, '"$1"')
    .replace(/\*['‘](.*?)['’]\*/g, "'$1'")
    .replace(/\*([^\*]+)\*/g, '<em class="italic text-foreground/90">$1</em>')
    // 5. Checklist boxes: [x] only (case-sensitive lowercase with space)
    .replace(/(?:^|\s)\[x\]\s+/g, ' <span class="inline-flex items-center justify-center h-4 w-4 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold mr-1.5 text-xs">✓</span> ')
    .replace(/(?:^|\s)\[ \]\s+/g, ' <span class="inline-flex items-center justify-center h-4 w-4 rounded border border-muted-foreground/40 mr-1.5 text-xs"></span> ')
    // 6. Markdown Links: [Text](URL)
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="font-bold text-indigo-600 dark:text-indigo-400 hover:underline underline-offset-4 decoration-indigo-400/60 transition-colors inline-flex items-center gap-0.5">$1</a>');
}

export default function GuideContentRenderer({ content, tableOfContents = [] }: GuideContentRendererProps) {
  if (!content) return null;

  // Helper to map heading text to TOC ID with 100% precision
  const getHeadingId = (headingText: string): string => {
    // 1. Match by numeric prefix (e.g. "1. Overview", "2. Detailed Exam Pattern")
    const numMatch = headingText.match(/^(\d+)[\.\)]\s*(.*)/);
    if (numMatch) {
      const idx = parseInt(numMatch[1], 10) - 1;
      if (tableOfContents[idx]) {
        return tableOfContents[idx].id;
      }
    }

    // 2. Fuzzy match against TOC titles
    const cleanHeading = headingText.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    for (const item of tableOfContents) {
      const cleanItem = item.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if (cleanHeading.includes(cleanItem) || cleanItem.includes(cleanHeading)) {
        return item.id;
      }
    }

    return headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Split content into major blocks
  const sections = content.split(/\n(?=###?\s)/g);

  return (
    <div className="space-y-8 text-foreground/90 leading-relaxed text-sm sm:text-base">
      {sections.map((section, index) => {
        const lines = section.split('\n');
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
          const line = lines[i];
          const trimmed = line.trim();

          if (!trimmed) {
            i++;
            continue;
          }

          // Horizontal Divider: `---`
          if (trimmed === '---') {
            elements.push(
              <hr key={`hr-${index}-${i}`} className="my-8 border-border/80" />
            );
            i++;
            continue;
          }

          // H2 Heading: `## ...`
          if (trimmed.startsWith('## ')) {
            const headingText = trimmed.replace(/^##\s+/, '');
            const id = getHeadingId(headingText);
            elements.push(
              <h2
                key={`h2-${index}-${i}`}
                id={id}
                className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight scroll-mt-24 pt-6 pb-2 border-b border-border/60"
              >
                {headingText}
              </h2>
            );
            i++;
            continue;
          }

          // H3 Heading: `### ...`
          if (trimmed.startsWith('### ')) {
            const headingText = trimmed.replace(/^###\s+/, '');
            const id = getHeadingId(headingText);
            elements.push(
              <h3
                key={`h3-${index}-${i}`}
                id={id}
                className="text-lg sm:text-xl font-bold text-foreground tracking-tight scroll-mt-24 pt-5 pb-1 flex items-center gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                {headingText}
              </h3>
            );
            i++;
            continue;
          }

          // H4 Sub-heading: `#### ...`
          if (trimmed.startsWith('#### ')) {
            const headingText = trimmed.replace(/^####\s+/, '');
            elements.push(
              <h4
                key={`h4-${index}-${i}`}
                className="text-sm sm:text-base font-bold text-foreground/90 pt-3 pb-1"
              >
                {headingText}
              </h4>
            );
            i++;
            continue;
          }

          // Code Block: ```language ... ```
          if (trimmed.startsWith('```')) {
            const langMatch = trimmed.match(/^```(\w+)?/);
            const language = langMatch && langMatch[1] ? langMatch[1].toLowerCase() : 'code';
            i++;
            const codeLines = [];
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
              codeLines.push(lines[i]);
              i++;
            }
            if (i < lines.length && lines[i].trim().startsWith('```')) {
              i++; // consume closing ```
            }
            elements.push(
              <CodeBlock key={`code-${index}-${i}`} code={codeLines.join('\n')} language={language} />
            );
            continue;
          }

          // Callout / Blockquote: `> ...`
          if (trimmed.startsWith('>')) {
            const quoteLines = [];
            while (i < lines.length && lines[i].trim().startsWith('>')) {
              quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
              i++;
            }
            const fullQuote = quoteLines.join(' ');
            const isModelAnswer = fullQuote.includes('"') || fullQuote.includes('“') || fullQuote.includes('Subject:');

            elements.push(
              <div
                key={`quote-${index}-${i}`}
                className={`my-5 rounded-xl border p-4 sm:p-5 flex items-start gap-3 shadow-2xs ${
                  isModelAnswer
                    ? 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200'
                    : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200'
                }`}
              >
                {isModelAnswer ? (
                  <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}
                <div
                  className="text-xs sm:text-sm font-medium leading-relaxed space-y-1 italic"
                  dangerouslySetInnerHTML={{
                    __html: formatInlineMarkdown(fullQuote),
                  }}
                />
              </div>
            );
            continue;
          }

          // Markdown Table: lines starting with `|`
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            const tableLines = [];
            while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
              tableLines.push(lines[i].trim());
              i++;
            }

            if (tableLines.length >= 2) {
              const parseRow = (r: string) =>
                r
                  .split('|')
                  .slice(1, -1)
                  .map((cell) => cell.trim());

              const headerCells = parseRow(tableLines[0]);
              // skip divider line if present (e.g. |---|---|)
              const bodyRows = tableLines
                .slice(1)
                .filter((r) => !r.includes('---'))
                .map((r) => parseRow(r));

              elements.push(
                <div
                  key={`table-${index}-${i}`}
                  className="my-6 overflow-x-auto rounded-xl border border-border bg-card shadow-2xs"
                >
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-secondary/80 border-b border-border text-foreground font-bold">
                      <tr>
                        {headerCells.map((cell, cIdx) => (
                          <th
                            key={cIdx}
                            className="px-4 py-3 font-extrabold tracking-wide uppercase text-xs text-muted-foreground"
                            dangerouslySetInnerHTML={{
                              __html: formatInlineMarkdown(cell),
                            }}
                          />
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {bodyRows.map((row, rIdx) => {
                        const isEven = rIdx % 2 === 0;
                        return (
                          <tr
                            key={rIdx}
                            className={`transition-colors hover:bg-secondary/40 ${
                              isEven ? 'bg-transparent' : 'bg-secondary/20'
                            }`}
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className="px-4 py-3 text-foreground/90 font-medium whitespace-pre-line"
                                dangerouslySetInnerHTML={{
                                  __html: formatInlineMarkdown(cell),
                                }}
                              />
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
              continue;
            }
          }

          // Bullet List item: `- ...` or `* ...` or `1. ...`
          if (/^[\*\-]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
            const isOrdered = /^\d+\.\s+/.test(trimmed);
            const listItems: string[] = [];
            while (
              i < lines.length &&
              lines[i].trim() &&
              (/^[\*\-]\s+/.test(lines[i].trim()) || /^\d+\.\s+/.test(lines[i].trim()))
            ) {
              listItems.push(lines[i].trim().replace(/^[\*\-]\s+/, '').replace(/^\d+\.\s+/, ''));
              i++;
            }

            if (isOrdered) {
              elements.push(
                <ol key={`list-${index}-${i}`} className="list-decimal list-outside ml-6 space-y-2 my-4 text-foreground/90 leading-relaxed marker:font-bold marker:text-foreground">
                  {listItems.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="pl-1"
                      dangerouslySetInnerHTML={{
                        __html: formatInlineMarkdown(item),
                      }}
                    />
                  ))}
                </ol>
              );
            } else {
              elements.push(
                <ul key={`list-${index}-${i}`} className="list-disc list-outside ml-6 space-y-2 my-4 text-foreground/90 leading-relaxed marker:text-foreground">
                  {listItems.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="pl-1"
                      dangerouslySetInnerHTML={{
                        __html: formatInlineMarkdown(item),
                      }}
                    />
                  ))}
                </ul>
              );
            }
            continue;
          }

          // Regular Paragraph
          elements.push(
            <p
              key={`p-${index}-${i}`}
              className="text-foreground/90 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: formatInlineMarkdown(trimmed),
              }}
            />
          );
          i++;
        }

        return <div key={index} className="space-y-4">{elements}</div>;
      })}
    </div>
  );
}
