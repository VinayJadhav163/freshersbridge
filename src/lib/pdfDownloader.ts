'use client';

import { parseResumeToStructured } from './resumeFormatters';

/**
 * Client-side direct native vector PDF downloader for FAANGPath / LaTeX resume.
 * Generates 100% real selectable vector text (NOT an image/canvas snapshot) using standard PDF Times font.
 * Ensures 100% ATS parser compatibility, crisp vector rendering at any zoom level,
 * zero browser headers/footers, and precise mathematical underlines.
 */
export async function downloadDirectResumePdf(resumeText: string) {
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

  const nameSize = isVeryDense ? 19 : isDense ? 20 : 21;
  const headerSectionGap = isVeryDense ? 3.2 : isDense ? 3.8 : 4.4;
  const headerFontSize = isVeryDense ? 10 : 10.5;
  const bodyFontSize = isVeryDense ? 8.8 : isDense ? 9.2 : 9.5;
  const lineHeight = isVeryDense ? 3.7 : isDense ? 4.0 : 4.2;
  const bulletGap = isVeryDense ? 0.6 : 0.9;
  const itemGap = isVeryDense ? 1.5 : 2.0;

  let y = isVeryDense ? 13 : 15;

  // 1. Candidate Name (Centered, Bold, Times)
  doc.setFont('times', 'bold');
  doc.setFontSize(nameSize);
  doc.setTextColor(0, 0, 0);
  const safeName = (structured.name || 'Candidate').trim();
  doc.text(safeName.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += isVeryDense ? 5.2 : 6.0;

  // 2. Contact Line (Centered, separated by dots or pipes)
  if (structured.contactLines.length > 0) {
    const rawContact = structured.contactLines.join(' | ');
    const parts = rawContact.split('|').map((p) => p.trim()).filter(Boolean);
    const contactText = parts.join('   \u25C7   ');

    doc.setFont('times', 'normal');
    doc.setFontSize(isVeryDense ? 9 : 9.5);
    doc.setTextColor(30, 30, 30);
    doc.text(contactText, pageWidth / 2, y, { align: 'center' });
    y += isVeryDense ? 5.5 : 6.5;
  }

  // Helper to draw clean section header with underline strictly below text baseline
  const drawSectionHeader = (title: string) => {
    y += headerSectionGap;
    doc.setFont('times', 'bold');
    doc.setFontSize(headerFontSize);
    doc.setTextColor(0, 0, 0);
    doc.text(title, marginX, y);

    const lineY = y + 1.8; // Exactly 1.8mm below text baseline (never cuts across letters)
    doc.setLineWidth(0.35);
    doc.setDrawColor(0, 0, 0);
    doc.line(marginX, lineY, pageWidth - marginX, lineY);

    y = lineY + 3.8; // Content starts cleanly below underline
  };

  // Helper to draw bullet point with crisp filled dot
  const drawBullet = (text: string) => {
    doc.setFont('times', 'normal');
    doc.setFontSize(bodyFontSize);
    doc.setTextColor(0, 0, 0);

    // Draw solid bullet dot
    doc.setFillColor(30, 30, 30);
    doc.circle(marginX + 2.2, y - 0.9, 0.5, 'F');

    const lines = doc.splitTextToSize(text, contentWidth - 6);
    doc.text(lines, marginX + 5.5, y);
    y += lines.length * lineHeight + bulletGap;
  };

  // 3. OBJECTIVE
  if (structured.objective) {
    drawSectionHeader('OBJECTIVE');
    doc.setFont('times', 'normal');
    doc.setFontSize(bodyFontSize);
    const objLines = doc.splitTextToSize(structured.objective, contentWidth);
    doc.text(objLines, marginX, y);
    y += objLines.length * lineHeight;
  }

  // 4. EDUCATION
  if (structured.education.length > 0) {
    drawSectionHeader('EDUCATION');
    structured.education.forEach((edu) => {
      doc.setFont('times', 'bold');
      doc.setFontSize(bodyFontSize + 0.5);
      doc.text(edu.institution, marginX, y);

      if (edu.date) {
        doc.setFont('times', 'normal');
        doc.setFontSize(bodyFontSize);
        doc.text(edu.date, pageWidth - marginX, y, { align: 'right' });
      }
      y += lineHeight;

      if (edu.details) {
        doc.setFont('times', 'italic');
        doc.setFontSize(bodyFontSize - 0.5);
        doc.text(edu.details, marginX, y);
        y += lineHeight;
      }
      y += itemGap * 0.5;
    });
  }

  // 5. SKILLS (Two-column layout)
  if (structured.skills.length > 0) {
    drawSectionHeader('SKILLS');
    const catColWidth = 54;
    const itemsWidth = contentWidth - catColWidth;

    structured.skills.forEach((sk) => {
      doc.setFont('times', 'bold');
      doc.setFontSize(bodyFontSize);
      doc.text(`${sk.category}:`, marginX, y);

      doc.setFont('times', 'normal');
      doc.setFontSize(bodyFontSize);
      const itemLines = doc.splitTextToSize(sk.items, itemsWidth);
      doc.text(itemLines, marginX + catColWidth, y);
      y += Math.max(1, itemLines.length) * lineHeight + 0.6;
    });
  }

  // 6. EXPERIENCE
  if (structured.experience.length > 0) {
    drawSectionHeader('EXPERIENCE');
    structured.experience.forEach((exp) => {
      doc.setFont('times', 'bold');
      doc.setFontSize(bodyFontSize + 0.5);
      doc.text(exp.role, marginX, y);

      if (exp.date) {
        doc.setFont('times', 'normal');
        doc.setFontSize(bodyFontSize);
        doc.text(exp.date, pageWidth - marginX, y, { align: 'right' });
      }
      y += lineHeight;

      if (exp.company || exp.location) {
        doc.setFont('times', 'italic');
        doc.setFontSize(bodyFontSize);
        doc.text(exp.company, marginX, y);
        if (exp.location) {
          doc.text(exp.location, pageWidth - marginX, y, { align: 'right' });
        }
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
      doc.setFont('times', 'bold');
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

  // Direct download clean PDF
  const cleanFilename = safeName.replace(/[^a-zA-Z0-9]/g, '_') || 'Candidate';
  doc.save(`${cleanFilename}_ATS_Resume.pdf`);
}
