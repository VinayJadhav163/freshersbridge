'use client';

import React, { useRef, useState, useMemo } from 'react';
import { parseResumeToStructured, generateFaangPathResumeHtml } from '@/lib/resumeFormatters';
import { Download, Printer, Copy, Check, Loader2 } from 'lucide-react';

interface FaangPathResumeViewProps {
  resumeText: string;
  onDownloadPdf?: () => void;
}

export default function FaangPathResumeView({ resumeText }: FaangPathResumeViewProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const resumePaperRef = useRef<HTMLDivElement>(null);

  const structured = useMemo(() => parseResumeToStructured(resumeText), [resumeText]);

  // Direct PDF Download (Generates actual .pdf file with 0 headers/footers)
  const handleDirectDownloadPdf = async () => {
    if (!resumePaperRef.current) return;
    setIsDownloading(true);

    try {
      const element = resumePaperRef.current;
      const html2canvasModule = (await import('html2canvas')).default;
      const jsPDFModule = (await import('jspdf')).default;

      const canvas = await html2canvasModule(element, {
        scale: 2.2, // Crisp retina-quality rendering
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDFModule({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = 210;
      const pdfHeight = 297;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      const safeName = (structured.name || 'Candidate').trim().replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`${safeName}_Resume.pdf`);
    } catch (err) {
      console.error('Direct PDF export error:', err);
      // Fallback to clean print if canvas fails
      handleCleanPrint();
    } finally {
      setIsDownloading(false);
    }
  };

  // Browser Print option without URL/date headers/footers
  const handleCleanPrint = () => {
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
  const contactItems = useMemo(() => {
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
            Standard 1-Page FAANGPath ATS Resume (A4 Balanced)
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
            onClick={handleCleanPrint}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-all cursor-pointer shadow-2xs"
            title="Open browser print preview (zero headers/footers)"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDirectDownloadPdf}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#275df5] hover:bg-[#1d4ed8] disabled:opacity-70 text-white px-4 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Directly download clean PDF file with 0 browser headers or footers"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Download Resume (PDF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Document Sheet (Calibrated to exact A4 1-page proportions: 210mm x 297mm) */}
      <div className="overflow-x-auto pb-4">
        <div
          ref={resumePaperRef}
          style={{ width: '100%', maxWidth: '820px', minHeight: '1100px' }}
          className="relative mx-auto rounded-lg border border-border bg-white text-black p-8 sm:p-12 shadow-lg font-serif selection:bg-blue-100 flex flex-col justify-start"
        >
          {/* 1. Header (Centered Name + Diamond separated contacts) */}
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-black m-0 leading-tight">
              {structured.name.toUpperCase()}
            </h1>

            {contactItems.length > 0 && (
              <div className="mt-1.5 text-[11.5px] sm:text-[12.5px] text-gray-800 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
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

          {/* 2. OBJECTIVE */}
          {structured.objective && (
            <div className="mt-3.5">
              <h2 className="text-[12.5px] sm:text-[13.5px] font-bold tracking-wider uppercase text-black m-0">
                OBJECTIVE
              </h2>
              <div className="border-b-[1.5px] border-black my-1"></div>
              <p className="text-[11.5px] sm:text-[12px] text-black leading-relaxed text-justify m-0">
                {structured.objective}
              </p>
            </div>
          )}

          {/* 3. EDUCATION */}
          {structured.education.length > 0 && (
            <div className="mt-4">
              <h2 className="text-[12.5px] sm:text-[13.5px] font-bold tracking-wider uppercase text-black m-0">
                EDUCATION
              </h2>
              <div className="border-b-[1.5px] border-black my-1"></div>
              <div className="space-y-1.5">
                {structured.education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex items-baseline justify-between text-[12px] sm:text-[12.5px]">
                      <span className="font-bold text-black">{edu.institution}</span>
                      {edu.date && <span className="text-black shrink-0 font-medium">{edu.date}</span>}
                    </div>
                    {edu.details && (
                      <p className="text-[11px] sm:text-[11.5px] text-gray-800 m-0 mt-0.5">
                        {edu.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SKILLS */}
          {structured.skills.length > 0 && (
            <div className="mt-4">
              <h2 className="text-[12.5px] sm:text-[13.5px] font-bold tracking-wider uppercase text-black m-0">
                SKILLS
              </h2>
              <div className="border-b-[1.5px] border-black my-1"></div>
              <table className="w-full text-[11.5px] sm:text-[12px] border-collapse">
                <tbody>
                  {structured.skills.map((sk, idx) => (
                    <tr key={idx} className="align-top">
                      <td className="w-[190px] font-bold text-black py-1 pr-2 whitespace-nowrap">
                        {sk.category}:
                      </td>
                      <td className="text-black py-1 leading-snug">{sk.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. EXPERIENCE */}
          {structured.experience.length > 0 && (
            <div className="mt-4">
              <h2 className="text-[12.5px] sm:text-[13.5px] font-bold tracking-wider uppercase text-black m-0">
                EXPERIENCE
              </h2>
              <div className="border-b-[1.5px] border-black my-1"></div>
              <div className="space-y-2.5">
                {structured.experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex items-baseline justify-between text-[12px] sm:text-[12.5px]">
                      <span className="font-bold text-black">{exp.role}</span>
                      {exp.date && <span className="text-black shrink-0 font-medium">{exp.date}</span>}
                    </div>
                    <div className="flex items-baseline justify-between text-[11.5px] sm:text-[12px] italic text-gray-800 mt-0.5">
                      <span>{exp.company}</span>
                      {exp.location && <span>{exp.location}</span>}
                    </div>
                    {exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-4 m-0 mt-1 space-y-1 text-[11px] sm:text-[11.5px] leading-relaxed text-black">
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

          {/* 6. PROJECTS */}
          {structured.projects.length > 0 && (
            <div className="mt-4">
              <h2 className="text-[12.5px] sm:text-[13.5px] font-bold tracking-wider uppercase text-black m-0">
                PROJECTS
              </h2>
              <div className="border-b-[1.5px] border-black my-1"></div>
              <div className="space-y-2.5">
                {structured.projects.map((proj, idx) => (
                  <div key={idx}>
                    <div className="text-[12px] sm:text-[12.5px] font-bold text-black">
                      {proj.title}
                    </div>
                    {proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-4 m-0 mt-1 space-y-1 text-[11px] sm:text-[11.5px] leading-relaxed text-black">
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

          {/* 7. CERTIFICATIONS & ACHIEVEMENTS */}
          {structured.certifications && structured.certifications.length > 0 && (
            <div className="mt-4">
              <h2 className="text-[12.5px] sm:text-[13.5px] font-bold tracking-wider uppercase text-black m-0">
                CERTIFICATIONS & ACHIEVEMENTS
              </h2>
              <div className="border-b-[1.5px] border-black my-1"></div>
              <ul className="list-disc list-outside pl-4 m-0 mt-1 space-y-1 text-[11px] sm:text-[11.5px] leading-relaxed text-black">
                {structured.certifications.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
