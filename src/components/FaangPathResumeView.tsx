'use client';

import React, { useMemo } from 'react';
import { parseResumeToStructured } from '@/lib/resumeFormatters';

interface FaangPathResumeViewProps {
  resumeText: string;
}

export default function FaangPathResumeView({ resumeText }: FaangPathResumeViewProps) {
  const structured = useMemo(() => parseResumeToStructured(resumeText), [resumeText]);

  // Format contact links
  const contactItems = useMemo(() => {
    if (structured.contactLines.length === 0) return [];
    const rawContact = structured.contactLines.join(' | ');
    return rawContact.split('|').map((p) => p.trim()).filter(Boolean);
  }, [structured.contactLines]);

  return (
    <div className="overflow-x-auto pb-4">
      {/* Document Sheet (Calibrated to exact A4 1-page proportions: 210mm x 297mm) */}
      <div
        style={{ width: '100%', maxWidth: '820px', minHeight: '1100px' }}
        className="relative mx-auto rounded-lg border border-border bg-white text-black p-8 sm:p-12 shadow-lg font-sans selection:bg-blue-100 flex flex-col justify-start"
      >
        {/* 1. Header (Centered Name + Diamond separated contacts) */}
        <div className="text-center mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-black m-0 leading-tight">
            {structured.name.toUpperCase()}
          </h1>

          {contactItems.length > 0 && (
            <div className="mt-1.5 text-[11.5px] sm:text-[12.5px] text-gray-800 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
              {contactItems.map((rawItem, idx) => {
                const item = rawItem.replace(/%Ç|⋄|◇/g, '').trim();
                if (!item) return null;
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span className="text-gray-400 font-bold mx-1">|</span>}
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
                );
              })}
            </div>
          )}
        </div>

        {/* 2. OBJECTIVE */}
        {structured.objective && (
          <div className="mt-3.5">
            <div className="border-b-[1.5px] border-black pb-0.5 mb-1.5">
              <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0 leading-tight">
                OBJECTIVE
              </h2>
            </div>
            <p className="text-[11.5px] sm:text-[12.5px] text-black leading-relaxed text-justify m-0">
              {structured.objective}
            </p>
          </div>
        )}

        {/* 3. EDUCATION */}
        {structured.education.length > 0 && (
          <div className="mt-4">
            <div className="border-b-[1.5px] border-black pb-0.5 mb-1.5">
              <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0 leading-tight">
                EDUCATION
              </h2>
            </div>
            <div className="space-y-2">
              {structured.education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex items-baseline justify-between text-[12px] sm:text-[13px]">
                    <span className="font-bold text-black">{edu.institution}</span>
                    {edu.date && <span className="text-black shrink-0 font-medium">{edu.date}</span>}
                  </div>
                  {edu.details && (
                    <p className="text-[11px] sm:text-[12px] text-gray-800 m-0 mt-0.5">
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
            <div className="border-b-[1.5px] border-black pb-0.5 mb-1.5">
              <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0 leading-tight">
                SKILLS
              </h2>
            </div>
            <table className="w-full text-[11.5px] sm:text-[12.5px] border-collapse">
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
            <div className="border-b-[1.5px] border-black pb-0.5 mb-1.5">
              <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0 leading-tight">
                EXPERIENCE
              </h2>
            </div>
            <div className="space-y-3">
              {structured.experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex items-baseline justify-between text-[12px] sm:text-[13px]">
                    <span className="font-bold text-black">{exp.role}</span>
                    {exp.date && <span className="text-black shrink-0 font-medium">{exp.date}</span>}
                  </div>
                  <div className="flex items-baseline justify-between text-[11.5px] sm:text-[12px] italic text-gray-800 mt-0.5">
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 m-0 mt-1 space-y-1.5 text-[11px] sm:text-[12px] leading-relaxed text-black">
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
            <div className="border-b-[1.5px] border-black pb-0.5 mb-1.5">
              <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0 leading-tight">
                PROJECTS
              </h2>
            </div>
            <div className="space-y-3">
              {structured.projects.map((proj, idx) => (
                <div key={idx}>
                  <h3 className="text-[12px] sm:text-[13px] font-bold text-black m-0 leading-tight">
                    {proj.title}
                  </h3>
                  {proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 m-0 mt-1 space-y-1.5 text-[11px] sm:text-[12px] leading-relaxed text-black">
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
          <div className="mt-3.5">
            <div className="border-b-[1.5px] border-black pb-0.5 mb-1.5">
              <h2 className="text-[12px] sm:text-[13px] font-bold tracking-wider uppercase text-black m-0 leading-tight">
                CERTIFICATIONS & ACHIEVEMENTS
              </h2>
            </div>
            <ul className="list-disc list-outside pl-4 m-0 mt-1 space-y-1 text-[11px] sm:text-[11.5px] leading-relaxed text-black">
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
