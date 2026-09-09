'use client';

import { parseResumeToStructured } from './resumeFormatters';

/**
 * Client-side direct PDF downloader for FAANGPath / LaTeX resume.
 * Renders an offscreen A4 container and exports directly as a .pdf file,
 * eliminating browser headers (date/time/about:blank) and page number footers.
 */
export async function downloadDirectResumePdf(resumeText: string) {
  if (typeof window === 'undefined') return;

  const structured = parseResumeToStructured(resumeText);
  const html2canvasModule = (await import('html2canvas')).default;
  const jsPDFModule = (await import('jspdf')).default;

  // Format contact items
  const contactParts = structured.contactLines.join(' | ').split('|').map((p) => p.trim()).filter(Boolean);
  const contactHtml = contactParts.map((part, idx) => {
    const sep = idx > 0 ? `<span style="color: #666; margin: 0 5px; font-weight: bold;">&#9671;</span>` : '';
    if (part.includes('@') || /linkedin\.com|github\.com/i.test(part)) {
      return `${sep}<span style="color: #0044cc;">${part}</span>`;
    }
    return `${sep}<span>${part}</span>`;
  }).join('');

  // Build A4 inner DOM structure
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.top = '-9999px';
  tempContainer.style.left = '-9999px';
  tempContainer.style.width = '794px'; // 210mm at 96 DPI
  tempContainer.style.minHeight = '1120px'; // 297mm at 96 DPI
  tempContainer.style.backgroundColor = '#ffffff';
  tempContainer.style.color = '#000000';
  tempContainer.style.padding = '38px 46px';
  tempContainer.style.fontFamily = "'Times New Roman', Times, Georgia, serif";
  tempContainer.style.boxSizing = 'border-box';
  tempContainer.style.lineHeight = '1.38';

  const objectiveHtml = structured.objective
    ? `
    <div style="margin-top: 13px;">
      <div style="font-size: 11pt; font-weight: bold; letter-spacing: 0.6px; text-transform: uppercase;">OBJECTIVE</div>
      <div style="border-bottom: 1.5px solid #000; margin-top: 2px; margin-bottom: 6px;"></div>
      <div style="font-size: 10pt; line-height: 1.45; text-align: justify;">${structured.objective}</div>
    </div>
  `
    : '';

  const educationHtml = structured.education.length > 0
    ? `
    <div style="margin-top: 14px;">
      <div style="font-size: 11pt; font-weight: bold; letter-spacing: 0.6px; text-transform: uppercase;">EDUCATION</div>
      <div style="border-bottom: 1.5px solid #000; margin-top: 2px; margin-bottom: 6px;"></div>
      ${structured.education
        .map(
          (edu) => `
        <div style="margin-bottom: 5px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 10.5pt;">${edu.institution}</strong>
            ${edu.date ? `<span style="font-size: 10pt;">${edu.date}</span>` : ''}
          </div>
          ${edu.details ? `<div style="font-size: 9.5pt; color: #222; margin-top: 1px;">${edu.details}</div>` : ''}
        </div>
      `
        )
        .join('')}
    </div>
  `
    : '';

  const skillsHtml = structured.skills.length > 0
    ? `
    <div style="margin-top: 14px;">
      <div style="font-size: 11pt; font-weight: bold; letter-spacing: 0.6px; text-transform: uppercase;">SKILLS</div>
      <div style="border-bottom: 1.5px solid #000; margin-top: 2px; margin-bottom: 6px;"></div>
      <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
        <tbody>
          ${structured.skills
            .map(
              (sk) => `
            <tr style="vertical-align: top;">
              <td style="width: 175px; font-weight: bold; padding: 2px 0; white-space: nowrap;">${sk.category}:</td>
              <td style="padding: 2px 0 2px 8px; line-height: 1.4;">${sk.items}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `
    : '';

  const experienceHtml = structured.experience.length > 0
    ? `
    <div style="margin-top: 14px;">
      <div style="font-size: 11pt; font-weight: bold; letter-spacing: 0.6px; text-transform: uppercase;">EXPERIENCE</div>
      <div style="border-bottom: 1.5px solid #000; margin-top: 2px; margin-bottom: 6px;"></div>
      ${structured.experience
        .map(
          (exp) => `
        <div style="margin-bottom: 9px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 10.5pt;">${exp.role}</strong>
            ${exp.date ? `<span style="font-size: 10pt;">${exp.date}</span>` : ''}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; font-style: italic; font-size: 10pt; margin-top: 1px;">
            <span>${exp.company}</span>
            ${exp.location ? `<span>${exp.location}</span>` : ''}
          </div>
          ${
            exp.bullets.length > 0
              ? `
            <ul style="margin: 3px 0 5px 18px; padding: 0; list-style-type: disc;">
              ${exp.bullets.map((b) => `<li style="font-size: 9.5pt; line-height: 1.42; margin-bottom: 3.5px; text-align: justify;">${b}</li>`).join('')}
            </ul>
          `
              : ''
          }
        </div>
      `
        )
        .join('')}
    </div>
  `
    : '';

  const projectsHtml = structured.projects.length > 0
    ? `
    <div style="margin-top: 14px;">
      <div style="font-size: 11pt; font-weight: bold; letter-spacing: 0.6px; text-transform: uppercase;">PROJECTS</div>
      <div style="border-bottom: 1.5px solid #000; margin-top: 2px; margin-bottom: 6px;"></div>
      ${structured.projects
        .map(
          (proj) => `
        <div style="margin-bottom: 8px;">
          <div style="font-size: 10.5pt; font-weight: bold;">${proj.title}</div>
          ${
            proj.bullets.length > 0
              ? `
            <ul style="margin: 3px 0 5px 18px; padding: 0; list-style-type: disc;">
              ${proj.bullets.map((b) => `<li style="font-size: 9.5pt; line-height: 1.42; margin-bottom: 3.5px; text-align: justify;">${b}</li>`).join('')}
            </ul>
          `
              : ''
          }
        </div>
      `
        )
        .join('')}
    </div>
  `
    : '';

  const certsHtml = structured.certifications && structured.certifications.length > 0
    ? `
    <div style="margin-top: 14px;">
      <div style="font-size: 11pt; font-weight: bold; letter-spacing: 0.6px; text-transform: uppercase;">CERTIFICATIONS & ACHIEVEMENTS</div>
      <div style="border-bottom: 1.5px solid #000; margin-top: 2px; margin-bottom: 6px;"></div>
      <ul style="margin: 3px 0 5px 18px; padding: 0; list-style-type: disc;">
        ${structured.certifications.map((c) => `<li style="font-size: 9.5pt; line-height: 1.42; margin-bottom: 3.5px;">${c}</li>`).join('')}
      </ul>
    </div>
  `
    : '';

  tempContainer.innerHTML = `
    <div style="text-align: center; margin-bottom: 14px;">
      <h1 style="font-size: 20pt; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin: 0; line-height: 1.15;">
        ${structured.name.toUpperCase()}
      </h1>
      <div style="font-size: 10pt; color: #222; margin-top: 4px;">
        ${contactHtml}
      </div>
    </div>
    ${objectiveHtml}
    ${educationHtml}
    ${skillsHtml}
    ${experienceHtml}
    ${projectsHtml}
    ${certsHtml}
  `;

  document.body.appendChild(tempContainer);

  try {
    const canvas = await html2canvasModule(tempContainer, {
      scale: 2.2, // Retina sharpness
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

    // 210mm x 297mm standard A4
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    const safeName = (structured.name || 'Candidate').trim().replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`${safeName}_ATS_Resume.pdf`);
  } finally {
    document.body.removeChild(tempContainer);
  }
}
