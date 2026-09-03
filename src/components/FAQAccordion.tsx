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
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    defaultOpenIndex !== undefined ? [defaultOpenIndex] : [0] // default first one open for discovery
  );

  const toggle = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-3 w-full">
      {items.map((item, idx) => {
        const isOpen = openIndexes.includes(idx);
        return (
          <div
            key={idx}
            className={`overflow-hidden rounded-xl border transition-all duration-300 ${
              isOpen
                ? 'border-[#275df5]/50 bg-blue-50/20 dark:bg-blue-950/10 shadow-xs'
                : 'border-border bg-card hover:border-[#275df5]/30 shadow-2xs'
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left transition-colors group cursor-pointer select-none"
              aria-expanded={isOpen}
            >
              <span
                className={`text-sm sm:text-base transition-colors ${
                  isOpen
                    ? 'font-bold text-[#275df5] dark:text-[#3b82f6]'
                    : 'font-semibold text-foreground group-hover:text-[#275df5]'
                }`}
              >
                {item.question}
              </span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  isOpen
                    ? 'bg-[#275df5] text-white rotate-45 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-foreground group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                }`}
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
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
