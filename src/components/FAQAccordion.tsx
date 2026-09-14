'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  defaultOpenIndex?: number;
}

export default function FAQAccordion({ items, defaultOpenIndex }: FAQAccordionProps) {
  // All closed by default unless explicitly specified
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpenIndex !== undefined ? defaultOpenIndex : null
  );

  // Single-open accordion: opening one closes any other open question
  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-3 w-full">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`overflow-hidden rounded-xl border transition-all duration-500 ease-in-out ${
              isOpen
                ? 'border-[#275df5]/50 bg-blue-50/25 dark:bg-blue-950/15 shadow-xs'
                : 'border-border bg-card hover:border-[#275df5]/40 shadow-2xs'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left transition-colors group cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <span
                className={`text-sm sm:text-base transition-colors duration-300 ${
                  isOpen
                    ? 'font-bold text-[#275df5] dark:text-[#3b82f6]'
                    : 'font-semibold text-foreground group-hover:text-[#275df5]'
                }`}
              >
                {item.question}
              </span>
              
              {/* Enhanced + Icon with Interactive Hover Glow & Slower Smooth 500ms Rotation */}
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-in-out transform ${
                  isOpen
                    ? 'bg-[#275df5] text-white rotate-45 shadow-sm scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-[#275df5]/15 group-hover:text-[#275df5] group-hover:scale-110 group-hover:ring-2 group-hover:ring-[#275df5]/25 rotate-0'
                }`}
              >
                <Plus className="h-4 w-4 stroke-[2.5] transition-transform duration-500" />
              </span>
            </button>

            {/* Slower, Smooth Ease-In-Out Expansion Container */}
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-in-out"
              style={{
                gridTemplateRows: isOpen ? '1fr' : '0fr',
              }}
            >
              <div className="overflow-hidden">
                <div
                  className={`px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3 transition-all duration-500 ease-in-out ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
