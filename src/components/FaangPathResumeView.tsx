'use client';

import React from 'react';
import { parseResumeToStructured, generateFaangPathResumeHtml } from '@/lib/resumeFormatters';
import { Download, Printer, Copy, Check } from 'lucide-react';

interface FaangPathResumeViewProps {
  resumeText: string;
  onDownloadPdf?: () => void;
}

export default function FaangPathResumeView({ resumeText, onDownloadPdf }: FaangPathResumeViewProps) {
  const [copied, setCopied] = React.useState(false);
  const structured = React.useMemo(() => parseResumeToStructured(resumeText), [resumeText]);

  const handlePrint = () => {
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }
    const htmlContent = generateFaangPathResumeHtml(resumeText);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format contact links
  const contactItems = React.useMemo(() => {
    if (structured.contactLines.length === 0) return [];
    const rawContact = structured.contactLines.join(' | ');
    return rawContact.split('|').map((p) => p.trim()).filter(Boolean);
  }, [structured.contactLines]);

  return (
    <div className="space-y-4">
      {/* Top action toolbar for formatted view */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary/50 border border-border p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-foreground">
            Standard Overleaf / FAANGPath ATS Format (Single Page)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-all cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#275df5] hover:bg-[#1d4ed8] text-white px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Download formatted 1-page PDF matching FAANGPath layout"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Resume (PDF)</span>
          </button>
        </div>
      </div>

      {/* Document Sheet (Mimics printed paper) */}
      <div className="relative mx-auto w-full max-w-[820px] rounded-lg border border-border bg-white text-black p-8 sm:p-12 shadow-md font-serif selection:bg-blue-100 leading-normal">
        {/* Name Header */}
        <div className="text-center mb-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide uppercase text-black m-0 leading-tight">
            {structured.name.toUpperCase()}
          </h1>

          {/* Contact Line 1 & 2 */}
          {contactItems.length > 0 && (
            <div className="mt-1 text-[11px] sm:text-[12px] text-gray-800 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-gray-400 font-bold">&#9671;</span>}
                  {item.includes('@') ? (
                    <a href={`mailto:${item}`} className="text-blue-700 hover:underline">
                      {item}
                    </a>
                  ) : /linkedin\.com|github\.com/i.test(item) ? (
                    <a
                      href={item.startsWith('http') ? item : `https://${item}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline"
                    >
                      {item}
                    </a>
                  ) : (
                    <span>{item}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* 1. OBJECTIVE */}
        {structured.objective && (
          <div className="mt-3">
            <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0">
              OBJECTIVE
            </h2>
            <div className="border-b-[1.5px] border-black my-1"></div>
            <p className="text-[11px] sm:text-[12px] text-black leading-snug text-justify m-0">
              {structured.objective}
            </p>
          </div>
        )}

        {/* 2. EDUCATION */}
        {structured.education.length > 0 && (
          <div className="mt-3.5">
            <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0">
              EDUCATION
            </h2>
            <div className="border-b-[1.5px] border-black my-1"></div>
            <div className="space-y-1.5">
              {structured.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex items-baseline justify-between text-[11px] sm:text-[12px]">
                    <span className="font-bold text-black">{edu.institution}</span>
                    {edu.date && <span className="text-black shrink-0 font-medium">{edu.date}</span>}
                  </div>
                  {edu.details && (
                    <p className="text-[10.5px] sm:text-[11px] text-gray-800 m-0 mt-0.5">
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SKILLS */}
        {structured.skills.length > 0 && (
          <div className="mt-3.5">
            <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0">
              SKILLS
            </h2>
            <div className="border-b-[1.5px] border-black my-1"></div>
            <table className="w-full text-[11px] sm:text-[12px] border-collapse">
              <tbody>
                {structured.skills.map((sk, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="w-[180px] font-bold text-black py-0.5 pr-2 whitespace-nowrap">
                      {sk.category}:
                    </td>
                    <td className="text-black py-0.5">{sk.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. EXPERIENCE */}
        {structured.experience.length > 0 && (
          <div className="mt-3.5">
            <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0">
              EXPERIENCE
            </h2>
            <div className="border-b-[1.5px] border-black my-1"></div>
            <div className="space-y-2">
              {structured.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex items-baseline justify-between text-[11px] sm:text-[12px]">
                    <span className="font-bold text-black">{exp.role}</span>
                    {exp.date && <span className="text-black shrink-0 font-medium">{exp.date}</span>}
                  </div>
                  <div className="flex items-baseline justify-between text-[10.5px] sm:text-[11.5px] italic text-gray-800">
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 m-0 mt-1 space-y-0.5 text-[10.5px] sm:text-[11.5px] leading-snug text-black">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="text-justify">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PROJECTS */}
        {structured.projects.length > 0 && (
          <div className="mt-3.5">
            <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0">
              PROJECTS
            </h2>
            <div className="border-b-[1.5px] border-black my-1"></div>
            <div className="space-y-2">
              {structured.projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="text-[11px] sm:text-[12px] font-bold text-black">
                    {proj.title}
                  </div>
                  {proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 m-0 mt-1 space-y-0.5 text-[10.5px] sm:text-[11.5px] leading-snug text-black">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="text-justify">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. CERTIFICATIONS */}
        {structured.certifications && structured.certifications.length > 0 && (
          <div className="mt-3.5">
            <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0">
              CERTIFICATIONS & ACHIEVEMENTS
            </h2>
            <div className="border-b-[1.5px] border-black my-1"></div>
            <ul className="list-disc list-outside pl-4 m-0 mt-1 space-y-0.5 text-[10.5px] sm:text-[11.5px] leading-snug text-black">
              {structured.certifications.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
