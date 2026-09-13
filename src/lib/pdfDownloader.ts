'use client';

import { parseResumeToStructured, parseContactItems, ContactItem } from './resumeFormatters';

/**
 * Client-side direct native vector PDF downloader for FAANGPath / LaTeX resume.
 * Generates 100% real selectable vector text (NOT an image/canvas snapshot) using standard PDF Times font.
 * Ensures 100% ATS parser compatibility, crisp vector rendering at any zoom level,
 * zero browser headers/footers, and precise mathematical underlines.
 */
export async function downloadDirectResumePdf(resumeText: string, jobRole?: string) {
  if (typeof window === 'undefined') return;

  const structured = parseResumeToStructured(resumeText);
  const jsPDFModule = (await import('jspdf')).default;

  const doc = new jsPDFModule({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182 mm

  // Estimate total content density to dynamically set scale and prevent multi-page spill
  let estimatedLines = 0;
  if (structured.objective) estimatedLines += Math.ceil(structured.objective.length / 95);
  estimatedLines += structured.education.length * 2;
  estimatedLines += structured.skills.length * 1.5;
  structured.experience.forEach((e) => {
    estimatedLines += 2 + e.bullets.length * 1.3;
  });
  structured.projects.forEach((p) => {
    estimatedLines += 1.5 + p.bullets.length * 1.3;
  });
  if (structured.certifications) estimatedLines += structured.certifications.length * 1.2;

  // Adaptive tuning: standard resumes use comfortable spacing; very dense resumes tighten slightly
  const isDense = estimatedLines > 38;
  const isVeryDense = estimatedLines > 46;

  const startY = isVeryDense ? 12 : isDense ? 14 : 16;
  const nameSize = isVeryDense ? 19 : isDense ? 20 : 21;
  const nameToContactGap = isVeryDense ? 4.8 : isDense ? 5.6 : 6.2;
  const contactSize = isVeryDense ? 8.5 : isDense ? 9.0 : 9.4;
  const headerSectionGap = isVeryDense ? 4.0 : isDense ? 4.8 : 5.6;
  const headerFontSize = isVeryDense ? 10 : 10.5;
  const bodyFontSize = isVeryDense ? 8.8 : isDense ? 9.2 : 9.5;
  const lineHeight = isVeryDense ? 3.9 : isDense ? 4.3 : 4.6;
  const bulletGap = isVeryDense ? 0.9 : isDense ? 1.2 : 1.5;
  const itemGap = isVeryDense ? 1.8 : isDense ? 2.5 : 3.2;
  const skillsRowGap = isVeryDense ? 0.6 : 1.1;

  let y = startY;

  // 1. Candidate Name (Centered, Bold, Helvetica Sans-Serif)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(nameSize);
  doc.setTextColor(0, 0, 0);
  const safeName = (structured.name || 'Candidate').trim();
  doc.text(safeName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += nameToContactGap;

  // 2. Contact Line (Centered, cleanly separated, with blue accent for email and social profiles)
  const contactItemsList =
    structured.contactItems && structured.contactItems.length > 0
      ? structured.contactItems
      : parseContactItems(structured.contactLines);

  if (contactItemsList.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(contactSize);

    const pipeStr = '  |  ';
    const pipeWidth = doc.getTextWidth(pipeStr);

    const renderContactLine = (items: ContactItem[], currentY: number) => {
      let totalLineW = 0;
      const itemWidths = items.map((it) => {
        const w = doc.getTextWidth(it.text);
        totalLineW += w;
        return w;
      });
      totalLineW += Math.max(0, items.length - 1) * pipeWidth;

      let curX = (pageWidth - totalLineW) / 2;
      items.forEach((it, i) => {
        if (it.href) {
          doc.setTextColor(29, 78, 216); // Royal blue accent matching portal preview
        } else {
          doc.setTextColor(50, 50, 50); // Dark neutral for phone & location
        }
        doc.text(it.text, curX, currentY);
        curX += itemWidths[i];

        if (i < items.length - 1) {
          doc.setTextColor(150, 150, 150);
          doc.text(pipeStr, curX, currentY);
          curX += pipeWidth;
        }
      });
    };

    let totalAllWidth =
      contactItemsList.reduce((acc, it) => acc + doc.getTextWidth(it.text), 0) +
      Math.max(0, contactItemsList.length - 1) * pipeWidth;
    if (totalAllWidth <= contentWidth) {
      renderContactLine(contactItemsList, y);
      y += isVeryDense ? 5.2 : isDense ? 5.8 : 6.5;
    } else {
      const mid = Math.ceil(contactItemsList.length / 2);
      renderContactLine(contactItemsList.slice(0, mid), y);
      y += 4.5;
      renderContactLine(contactItemsList.slice(mid), y);
      y += isVeryDense ? 5.0 : isDense ? 5.6 : 6.2;
    }
  }

  const pageHeight = 297;
  const maxContentY = 277;
  const topMargin = 16;

  // Helper to ensure enough vertical room on the current page, or create a clean new page
  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > maxContentY) {
      doc.addPage();
      y = topMargin;
    }
  };

  // Helper to draw clean section header with underline strictly below text baseline
  const drawSectionHeader = (title: string) => {
    ensureSpace(headerSectionGap + 16); // Prevent orphaned headers at the bottom of a page
    y += headerSectionGap;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(headerFontSize);
    doc.setTextColor(0, 0, 0);
    doc.text(title, marginX, y);

    const lineY = y + 1.8; // Exactly 1.8mm below text baseline (never cuts across letters)
    doc.setLineWidth(0.35);
    doc.setDrawColor(0, 0, 0);
    doc.line(marginX, lineY, pageWidth - marginX, lineY);

    y = lineY + (isVeryDense ? 3.4 : isDense ? 3.8 : 4.2); // Content starts cleanly below underline
  };

  // Helper to draw bullet point with crisp filled dot
  const drawBullet = (text: string) => {
    const lines = doc.splitTextToSize(text, contentWidth - 6);
    ensureSpace(lines.length * lineHeight + bulletGap);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(bodyFontSize);
    doc.setTextColor(0, 0, 0);

    // Draw solid bullet dot
    doc.setFillColor(50, 50, 50);
    doc.circle(marginX + 2.2, y - 0.9, 0.45, 'F');

    doc.text(lines, marginX + 5.5, y);
    y += lines.length * lineHeight + bulletGap;
  };

  // 3. OBJECTIVE
  if (structured.objective) {
    drawSectionHeader('OBJECTIVE');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(bodyFontSize);
    const objLines = doc.splitTextToSize(structured.objective, contentWidth);
    ensureSpace(objLines.length * lineHeight);
    doc.text(objLines, marginX, y);
    y += objLines.length * lineHeight;
  }

  // 4. EDUCATION
  if (structured.education.length > 0) {
    drawSectionHeader('EDUCATION');
    structured.education.forEach((edu) => {
      ensureSpace(lineHeight * 2 + itemGap);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(bodyFontSize + 0.5);
      doc.text(edu.institution, marginX, y);

      if (edu.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(bodyFontSize);
        doc.text(edu.date, pageWidth - marginX, y, { align: 'right' });
      }
      y += lineHeight;

      if (edu.details) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(bodyFontSize - 0.3);
        doc.setTextColor(60, 60, 60);
        doc.text(edu.details, marginX, y);
        doc.setTextColor(0, 0, 0);
        y += lineHeight;
      }
      y += itemGap * 0.5;
    });
  }

  // 5. SKILLS (Two-column layout)
  if (structured.skills.length > 0) {
    drawSectionHeader('SKILLS');
    const catColWidth = 50;
    const itemsWidth = contentWidth - catColWidth;

    structured.skills.forEach((sk) => {
      const itemLines = doc.splitTextToSize(sk.items, itemsWidth);
      ensureSpace(Math.max(1, itemLines.length) * lineHeight + skillsRowGap);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(bodyFontSize);
      doc.text(`${sk.category}:`, marginX, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(bodyFontSize);
      doc.text(itemLines, marginX + catColWidth, y);
      y += Math.max(1, itemLines.length) * lineHeight + skillsRowGap;
    });
  }

  // 6. EXPERIENCE
  if (structured.experience.length > 0) {
    drawSectionHeader('EXPERIENCE');
    structured.experience.forEach((exp) => {
      ensureSpace(lineHeight * 2 + 10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(bodyFontSize + 0.5);
      doc.text(exp.role, marginX, y);

      if (exp.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(bodyFontSize);
        doc.text(exp.date, pageWidth - marginX, y, { align: 'right' });
      }
      y += lineHeight;

      if (exp.company || exp.location) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(bodyFontSize);
        doc.setTextColor(60, 60, 60);
        doc.text(exp.company, marginX, y);
        if (exp.location) {
          doc.text(exp.location, pageWidth - marginX, y, { align: 'right' });
        }
        doc.setTextColor(0, 0, 0);
        y += lineHeight;
      }

      exp.bullets.forEach((b) => {
        drawBullet(b);
      });
      y += itemGap;
    });
  }

  // 7. PROJECTS
  if (structured.projects.length > 0) {
    drawSectionHeader('PROJECTS');
    structured.projects.forEach((proj) => {
      ensureSpace(lineHeight + 10);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(bodyFontSize + 0.5);
      doc.text(proj.title, marginX, y);
      y += lineHeight;

      proj.bullets.forEach((b) => {
        drawBullet(b);
      });
      y += itemGap;
    });
  }

  // 8. CERTIFICATIONS & ACHIEVEMENTS
  if (structured.certifications && structured.certifications.length > 0) {
    drawSectionHeader('CERTIFICATIONS & ACHIEVEMENTS');
    structured.certifications.forEach((c) => {
      drawBullet(c);
    });
  }

  // Multi-page footer labeling (Clean: only adds footer when resume actually has >1 page)
  const totalPages = typeof (doc as any).getNumberOfPages === 'function' 
    ? (doc as any).getNumberOfPages() 
    : 1;
  if (totalPages > 1) {
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(110, 110, 110);
      doc.text(`${safeName} — Page ${p} of ${totalPages}`, pageWidth - marginX, 290, { align: 'right' });
    }
  }

  // Direct download clean PDF with role suffix: Fname_Lname_ATS_Resume_Job_role
  const nameParts = safeName
    .split(/\s+/)
    .map((s) => s.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean);
  const cleanName = nameParts.length > 0 ? nameParts.join('_') : 'Candidate';

  let roleSuffix = '';
  if (jobRole && jobRole.trim()) {
    const cleanRole = jobRole
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
    if (cleanRole) {
      roleSuffix = `_${cleanRole}`;
    }
  }

  doc.save(`${cleanName}_ATS_Resume${roleSuffix}.pdf`);
}

/**
 * Client-side direct native vector PDF downloader for Cover Letter.
 * Renders professional formatted letterhead and formatted text cleanly onto A4 PDF.
 */
export async function downloadDirectCoverLetterPdf(
  coverLetterText: string,
  candidateName?: string,
  jobRole?: string
) {
  if (typeof window === 'undefined') return;

  const jsPDFModule = (await import('jspdf')).default;
  const doc = new jsPDFModule({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2; // 170 mm
  const lineHeight = 5.2;
  let y = 24;

  const safeName = (candidateName || '').trim();
  const nameParts = safeName
    .split(/\s+/)
    .map((s) => s.replace(/[^a-zA-Z0-9]/g, ''))
    .filter(Boolean);
  const cleanName = nameParts.length > 0 ? nameParts.join('_') : 'Candidate';

  let roleSuffix = '';
  if (jobRole && jobRole.trim()) {
    const cleanRole = jobRole
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
    if (cleanRole) {
      roleSuffix = `_${cleanRole}`;
    }
  }

  // Document Title / Header
  if (safeName) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(safeName.toUpperCase(), marginX, y);
    y += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Job Application Cover Letter', marginX, y);
    y += 4;

    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.4);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 8;
  }

  // Letter Body Content
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59); // slate-800

  // Split text by lines and paragraphs
  const rawParagraphs = coverLetterText.split('\n');
  for (const para of rawParagraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      y += 4; // paragraph gap
      continue;
    }

    const wrappedLines = doc.splitTextToSize(trimmed, contentWidth);
    if (y + wrappedLines.length * lineHeight > 275) {
      doc.addPage();
      y = 20;
    }

    wrappedLines.forEach((line: string) => {
      doc.text(line, marginX, y);
      y += lineHeight;
    });
  }

  doc.save(`${cleanName}_Cover_Letter${roleSuffix}.pdf`);
}
