/**
 * FAANGPath / Jake's Resume standard ATS format parser and HTML generator.
 * Produces pixel-perfect LaTeX-style resumes with classic serif typography,
 * 0.4-inch margins, horizontal section rules, and right-aligned dates.
 */

export interface StructuredResume {
  name: string;
  contactLines: string[];
  objective?: string;
  education: {
    institution: string;
    details?: string;
    date?: string;
  }[];
  skills: {
    category: string;
    items: string;
  }[];
  experience: {
    role: string;
    company: string;
    date?: string;
    location?: string;
    bullets: string[];
  }[];
  projects: {
    title: string;
    bullets: string[];
  }[];
  certifications?: string[];
  extraSections?: {
    title: string;
    bullets: string[];
  }[];
}

export function parseResumeToStructured(rawText: string): StructuredResume {
  const lines = rawText.split('\n').map((l) => l.trim());
  const structured: StructuredResume = {
    name: 'CANDIDATE NAME',
    contactLines: [],
    education: [],
    skills: [],
    experience: [],
    projects: [],
  };

  if (lines.length === 0) return structured;

  // First non-empty line is candidate name
  const firstNonEmptyIdx = lines.findIndex((l) => Boolean(l));
  if (firstNonEmptyIdx !== -1) {
    structured.name = lines[firstNonEmptyIdx];
  }

  // Next 1-2 lines usually contain contact info
  const contactCandidates = lines.slice(firstNonEmptyIdx + 1, firstNonEmptyIdx + 4);
  for (const cLine of contactCandidates) {
    if (/@|\+91|\d{3}[-.]?\d{3}|linkedin|github|chha|road|street|nagar/i.test(cLine)) {
      structured.contactLines.push(cLine);
    }
  }

  // Section regexes
  const sectionHeaders: { title: string; key: string; regex: RegExp }[] = [
    { title: 'OBJECTIVE', key: 'objective', regex: /^(OBJECTIVE|SUMMARY|PROFESSIONAL SUMMARY)\b/i },
    { title: 'EDUCATION', key: 'education', regex: /^(EDUCATION|ACADEMIC BACKGROUND)\b/i },
    { title: 'SKILLS', key: 'skills', regex: /^(SKILLS|CORE SKILLS|TECHNICAL SKILLS|SKILLS & TOOLS)\b/i },
    { title: 'EXPERIENCE', key: 'experience', regex: /^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY|INTERNSHIP)\b/i },
    { title: 'PROJECTS', key: 'projects', regex: /^(PROJECTS|KEY PROJECTS|ACADEMIC PROJECTS)\b/i },
    { title: 'CERTIFICATIONS & ACHIEVEMENTS', key: 'certifications', regex: /^(CERTIFICATIONS|ACHIEVEMENTS|CERTIFICATES)\b/i },
  ];

  type SectionState = 'none' | 'objective' | 'education' | 'skills' | 'experience' | 'projects' | 'certifications';
  let currentSection: SectionState = 'none';
  const sectionContent: Record<SectionState, string[]> = {
    none: [],
    objective: [],
    education: [],
    skills: [],
    experience: [],
    projects: [],
    certifications: [],
  };

  for (let i = firstNonEmptyIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Check if this line is a section header
    const matched = sectionHeaders.find((sh) => sh.regex.test(line));
    if (matched) {
      currentSection = matched.key as SectionState;
      continue;
    }

    if (currentSection !== 'none') {
      sectionContent[currentSection].push(line);
    }
  }

  // Parse Objective
  if (sectionContent.objective.length > 0) {
    structured.objective = sectionContent.objective.join(' ');
  }

  // Parse Education
  let currentEdu: { institution: string; details?: string; date?: string } | null = null;
  for (const l of sectionContent.education) {
    if (/bachelor|master|b\.tech|b\.e|bcs|bca|degree|college|university|school/i.test(l)) {
      if (currentEdu) structured.education.push(currentEdu);
      
      // Extract date if on same line (e.g. "Bachelor of Computer Science | VSS College | Sep 2022 – Jun 2025")
      const parts = l.split('|').map((p) => p.trim());
      let date = '';
      let institution = l;

      if (parts.length >= 3) {
        institution = `${parts[0]} — ${parts[1]}`;
        date = parts[2];
      } else if (parts.length === 2) {
        if (/\d{4}/.test(parts[1])) {
          institution = parts[0];
          date = parts[1];
        } else {
          institution = `${parts[0]} — ${parts[1]}`;
        }
      }

      currentEdu = { institution, date };
    } else if (currentEdu) {
      currentEdu.details = currentEdu.details ? `${currentEdu.details} | ${l}` : l;
    }
  }
  if (currentEdu) structured.education.push(currentEdu);

  // Parse Skills
  for (const l of sectionContent.skills) {
    const clean = l.replace(/^[•\-\*]\s*/, '');
    const colonIdx = clean.indexOf(':');
    if (colonIdx !== -1) {
      const category = clean.substring(0, colonIdx).trim();
      const items = clean.substring(colonIdx + 1).trim();
      structured.skills.push({ category, items });
    } else {
      structured.skills.push({ category: 'Core Skills', items: clean });
    }
  }

  // Parse Experience
  let currentExp: { role: string; company: string; date?: string; location?: string; bullets: string[] } | null = null;
  for (const l of sectionContent.experience) {
    if (l.startsWith('•') || l.startsWith('-') || l.startsWith('*')) {
      if (currentExp) {
        currentExp.bullets.push(l.replace(/^[•\-\*]\s*/, ''));
      }
    } else if (l.includes('|')) {
      if (currentExp) structured.experience.push(currentExp);
      const parts = l.split('|').map((p) => p.trim());
      currentExp = {
        role: parts[0] || 'Software Engineer',
        company: parts[1] || 'Company',
        date: parts[2] || '',
        location: parts[3] || '',
        bullets: [],
      };
    } else if (currentExp && currentExp.bullets.length === 0) {
      currentExp.company = `${currentExp.company} — ${l}`;
    }
  }
  if (currentExp) structured.experience.push(currentExp);

  // Parse Projects
  let currentProj: { title: string; bullets: string[] } | null = null;
  for (const l of sectionContent.projects) {
    if (l.startsWith('•') || l.startsWith('-') || l.startsWith('*')) {
      if (currentProj) {
        currentProj.bullets.push(l.replace(/^[•\-\*]\s*/, ''));
      }
    } else {
      if (currentProj) structured.projects.push(currentProj);
      currentProj = {
        title: l.replace(/^[•\-\*]\s*/, ''),
        bullets: [],
      };
    }
  }
  if (currentProj) structured.projects.push(currentProj);

  // Parse Certifications
  if (sectionContent.certifications.length > 0) {
    structured.certifications = sectionContent.certifications.map((c) => c.replace(/^[•\-\*]\s*/, ''));
  }

  return structured;
}

/**
 * Generates an Overleaf / FAANGPath LaTeX-identical HTML printable document
 */
export function generateFaangPathResumeHtml(resumeText: string): string {
  const structured = parseResumeToStructured(resumeText);

  // Format contact line with LaTeX-style diamond separators
  let contactHtml = '';
  if (structured.contactLines.length > 0) {
    const rawContact = structured.contactLines.join(' | ');
    const parts = rawContact.split('|').map((p) => p.trim()).filter(Boolean);

    const formattedParts = parts.map((part) => {
      if (part.includes('@')) {
        return `<a href="mailto:${part}" style="color: #0044cc; text-decoration: none;">${part}</a>`;
      }
      if (/linkedin\.com/i.test(part)) {
        const url = part.startsWith('http') ? part : `https://${part}`;
        return `<a href="${url}" target="_blank" style="color: #0044cc; text-decoration: none;">${part}</a>`;
      }
      if (/github\.com/i.test(part)) {
        const url = part.startsWith('http') ? part : `https://${part}`;
        return `<a href="${url}" target="_blank" style="color: #0044cc; text-decoration: none;">${part}</a>`;
      }
      return `<span>${part}</span>`;
    });

    // Group into 2 centered lines if long
    if (formattedParts.length > 3) {
      const line1 = formattedParts.slice(0, 2).join(' <span style="font-size: 8pt; color: #555;">&#9671;</span> ');
      const line2 = formattedParts.slice(2).join(' <span style="font-size: 8pt; color: #555;">&#9671;</span> ');
      contactHtml = `
        <div style="font-size: 9.5pt; color: #333; margin-top: 3px;">${line1}</div>
        <div style="font-size: 9.5pt; color: #333; margin-top: 2px;">${line2}</div>
      `;
    } else {
      contactHtml = `
        <div style="font-size: 9.5pt; color: #333; margin-top: 3px;">
          ${formattedParts.join(' <span style="font-size: 8pt; color: #555;">&#9671;</span> ')}
        </div>
      `;
    }
  }

  // Objective HTML
  let objectiveHtml = '';
  if (structured.objective) {
    objectiveHtml = `
      <div class="resume-section">
        <div class="section-title">OBJECTIVE</div>
        <div class="section-hr"></div>
        <div class="section-content" style="text-align: justify;">
          ${structured.objective}
        </div>
      </div>
    `;
  }

  // Education HTML
  let educationHtml = '';
  if (structured.education.length > 0) {
    const items = structured.education
      .map(
        (edu) => `
        <div style="margin-bottom: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 10pt;">${edu.institution}</strong>
            ${edu.date ? `<span style="font-size: 9.5pt;">${edu.date}</span>` : ''}
          </div>
          ${edu.details ? `<div style="font-size: 9pt; color: #222; margin-top: 1px;">${edu.details}</div>` : ''}
        </div>
      `
      )
      .join('');

    educationHtml = `
      <div class="resume-section">
        <div class="section-title">EDUCATION</div>
        <div class="section-hr"></div>
        <div class="section-content">
          ${items}
        </div>
      </div>
    `;
  }

  // Skills HTML (FAANGPath 2-column table style)
  let skillsHtml = '';
  if (structured.skills.length > 0) {
    const rows = structured.skills
      .map(
        (sk) => `
        <tr style="vertical-align: top;">
          <td style="width: 170px; font-weight: bold; padding: 1.5px 0; font-size: 9.5pt; white-space: nowrap;">${sk.category}:</td>
          <td style="padding: 1.5px 0 1.5px 12px; font-size: 9.5pt;">${sk.items}</td>
        </tr>
      `
      )
      .join('');

    skillsHtml = `
      <div class="resume-section">
        <div class="section-title">SKILLS</div>
        <div class="section-hr"></div>
        <div class="section-content">
          <table style="width: 100%; border-collapse: collapse;">
            ${rows}
          </table>
        </div>
      </div>
    `;
  }

  // Experience HTML
  let experienceHtml = '';
  if (structured.experience.length > 0) {
    const expItems = structured.experience
      .map(
        (exp) => `
        <div style="margin-bottom: 7px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 10pt;">${exp.role}</strong>
            ${exp.date ? `<span style="font-size: 9.5pt;">${exp.date}</span>` : ''}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; font-style: italic; font-size: 9.5pt; margin-top: 0.5px;">
            <span>${exp.company}</span>
            ${exp.location ? `<span>${exp.location}</span>` : ''}
          </div>
          ${
            exp.bullets.length > 0
              ? `
            <ul class="bullet-list">
              ${exp.bullets.map((b) => `<li>${b}</li>`).join('')}
            </ul>
          `
              : ''
          }
        </div>
      `
      )
      .join('');

    experienceHtml = `
      <div class="resume-section">
        <div class="section-title">EXPERIENCE</div>
        <div class="section-hr"></div>
        <div class="section-content">
          ${expItems}
        </div>
      </div>
    `;
  }

  // Projects HTML
  let projectsHtml = '';
  if (structured.projects.length > 0) {
    const projItems = structured.projects
      .map(
        (proj) => `
        <div style="margin-bottom: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <strong style="font-size: 10pt;">${proj.title}</strong>
          </div>
          ${
            proj.bullets.length > 0
              ? `
            <ul class="bullet-list">
              ${proj.bullets.map((b) => `<li>${b}</li>`).join('')}
            </ul>
          `
              : ''
          }
        </div>
      `
      )
      .join('');

    projectsHtml = `
      <div class="resume-section">
        <div class="section-title">PROJECTS</div>
        <div class="section-hr"></div>
        <div class="section-content">
          ${projItems}
        </div>
      </div>
    `;
  }

  // Certifications HTML
  let certsHtml = '';
  if (structured.certifications && structured.certifications.length > 0) {
    certsHtml = `
      <div class="resume-section">
        <div class="section-title">CERTIFICATIONS & ACHIEVEMENTS</div>
        <div class="section-hr"></div>
        <div class="section-content">
          <ul class="bullet-list">
            ${structured.certifications.map((c) => `<li>${c}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${structured.name.toUpperCase()} - Resume</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0mm; /* Removes browser default headers (date/time, URL) and footers (page numbers) */
    }
    * {
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }
    body {
      font-family: 'Times New Roman', Times, 'Computer Modern', Georgia, serif;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 14mm 16mm;
      width: 210mm;
      min-height: 297mm;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.4;
    }
    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
        padding: 12mm 15mm;
        margin: 0 auto;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
    }
    .resume-header {
      text-align: center;
      margin-bottom: 16px;
    }
    .candidate-name {
      font-size: 22pt;
      font-weight: bold;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 0;
      line-height: 1.15;
    }
    .resume-section {
      margin-top: 14px;
      margin-bottom: 6px;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-bottom: 3px;
      color: #000;
    }
    .section-hr {
      border-bottom: 1.5px solid #000;
      margin-bottom: 7px;
    }
    .section-content {
      font-size: 10.5pt;
    }
    .bullet-list {
      margin: 4px 0 6px 18px;
      padding: 0;
      list-style-type: disc;
    }
    .bullet-list li {
      margin-bottom: 4px;
      font-size: 10pt;
      line-height: 1.42;
      text-align: justify;
    }
  </style>
</head>
<body>
  <div class="resume-header">
    <h1 class="candidate-name">${structured.name.toUpperCase()}</h1>
    ${contactHtml}
  </div>

  ${objectiveHtml}
  ${educationHtml}
  ${skillsHtml}
  ${experienceHtml}
  ${projectsHtml}
  ${certsHtml}

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;
}
