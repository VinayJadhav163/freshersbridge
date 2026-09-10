import {
  ALL_TECH_SKILLS,
  ATS_ACTION_VERBS,
  ATS_SOFT_SKILLS,
  CANONICAL_SKILLS,
  matchSkillInText,
} from './atsTaxonomy';

export interface ATSAnalysisResult {
  overallScore: number;
  scoreTier: 'Excellent' | 'Good' | 'Needs Work' | 'Low Match';
  scoreColor: string;
  wordCount: number;
  wordCountStatus: 'Optimal (1 Page)' | 'Too Short' | 'Too Long (Multi-page)';

  // Skills Breakdown
  targetSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchedSoftSkills: string[];
  missingSoftSkills: string[];

  // Section Audits
  sections: {
    name: string;
    found: boolean;
    importance: 'Critical' | 'Recommended';
    feedback: string;
  }[];

  // Contact Info Detected
  contactInfo: {
    email: boolean;
    phone: boolean;
    linkedin: boolean;
    github: boolean;
  };

  // Metric Density (Google XYZ Formula)
  metricsCount: number;
  actionVerbsFound: string[];
  impactRating: 'High Impact' | 'Moderate Impact' | 'Low Impact (Passive)';

  // Concrete Actionable Recommendations
  actionableFeedback: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    suggestedExample?: string;
  }[];
}

export function analyzeResumeATS(resumeText: string, jobDescriptionText: string): ATSAnalysisResult {
  const cleanResume = resumeText.trim();
  const lowerResume = cleanResume.toLowerCase();
  const lowerJD = jobDescriptionText.toLowerCase();

  // 1. Extract Target Keywords from JD with Canonical Aliases
  // A. Check canonical skills (Tableau, SQL, ETL, DBT, Generative AI, LLM, etc.)
  const targetSkillObjects: { label: string; aliases: string[] }[] = [];
  const matchedCanonicalIds = new Set<string>();

  for (const cs of CANONICAL_SKILLS) {
    if (matchSkillInText(lowerJD, cs.aliases)) {
      targetSkillObjects.push({ label: cs.label, aliases: cs.aliases });
      matchedCanonicalIds.add(cs.id);
    }
  }

  // B. Also scan for additional tech skills from taxonomy that aren't already represented
  for (const skill of ALL_TECH_SKILLS) {
    if (skill.length < 3) continue; // Skip single/double character noise
    // Skip if already covered by an alias in targetSkillObjects
    const alreadyCovered = targetSkillObjects.some((t) =>
      t.aliases.some((a) => a.toLowerCase() === skill.toLowerCase())
    );
    if (!alreadyCovered && matchSkillInText(lowerJD, [skill])) {
      const formattedLabel = skill
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      targetSkillObjects.push({ label: formattedLabel, aliases: [skill] });
    }
  }

  // Fallback if JD is empty or too short (< 4 skills identified)
  if (targetSkillObjects.length < 4) {
    const fallbackCommon = [
      'Data Structures & Algorithms',
      'OOPs (Object Oriented Programming)',
      'Python',
      'Java',
      'SQL',
      'Git & Version Control',
      'RESTful APIs',
      'Problem Solving',
    ];
    for (const fb of fallbackCommon) {
      if (!targetSkillObjects.some((t) => t.label.toLowerCase() === fb.toLowerCase())) {
        const matchingCanonical = CANONICAL_SKILLS.find(
          (c) => c.label.toLowerCase() === fb.toLowerCase()
        );
        targetSkillObjects.push({
          label: fb,
          aliases: matchingCanonical ? matchingCanonical.aliases : [fb.toLowerCase()],
        });
      }
    }
  }

  // 2. Compute Matched vs Missing Hard Skills using Intelligent Synonyms / Aliases
  // E.g. If target skill is 'Generative AI', resume containing 'GenAI' or 'gen-ai' will MATCH!
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const target of targetSkillObjects) {
    if (matchSkillInText(lowerResume, target.aliases)) {
      matchedSkills.push(target.label);
    } else {
      missingSkills.push(target.label);
    }
  }

  const targetSkills = targetSkillObjects.map((t) => t.label);

  // 3. Compute Soft Skills
  const targetSoftSkills = ATS_SOFT_SKILLS.filter((s) => lowerJD.includes(s));
  const effectiveSoftSkills =
    targetSoftSkills.length >= 2 ? targetSoftSkills : ATS_SOFT_SKILLS.slice(0, 5);
  const matchedSoftSkills = effectiveSoftSkills.filter((s) => lowerResume.includes(s));
  const missingSoftSkills = effectiveSoftSkills.filter((s) => !matchedSoftSkills.includes(s));

  // 4. Contact Information Audit
  const contactInfo = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(cleanResume),
    phone: /(\+91[\s-]?)?[6-9]\d{9}|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(cleanResume),
    linkedin: /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(cleanResume),
    github: /github\.com\/[a-zA-Z0-9_-]+/i.test(cleanResume),
  };

  // 5. Standard ATS Sections Audit
  const sections = [
    {
      name: 'Contact Header (Email & Phone)',
      found: contactInfo.email && contactInfo.phone,
      importance: 'Critical' as const,
      feedback:
        contactInfo.email && contactInfo.phone
          ? 'Valid contact details detected at the top.'
          : 'Missing professional email or phone number in header.',
    },
    {
      name: 'Technical Skills Section',
      found:
        /\b(technical skills|skills|technologies|proficiencies|languages & tools)\b/i.test(
          lowerResume
        ),
      importance: 'Critical' as const,
      feedback: 'Dedicated skills section makes it easy for ATS parsers to index your stack.',
    },
    {
      name: 'Projects Section',
      found: /\b(projects|academic projects|key projects|personal projects)\b/i.test(lowerResume),
      importance: 'Critical' as const,
      feedback: 'Crucial for freshers without years of corporate experience.',
    },
    {
      name: 'Education & Degree Section',
      found: /\b(education|b\.?e|b\.?tech|bca|mca|b\.?sc|university|college|cgpa|gpa)\b/i.test(
        lowerResume
      ),
      importance: 'Critical' as const,
      feedback: 'Recruiters check your graduation year, degree, and eligibility cutoff.',
    },
    {
      name: 'Work History / Internships',
      found: /\b(experience|work experience|internship|trainee|apprentice)\b/i.test(lowerResume),
      importance: 'Recommended' as const,
      feedback: 'Internships and freelance projects provide immediate competitive advantage.',
    },
    {
      name: 'Social Profiles (LinkedIn & GitHub)',
      found: contactInfo.linkedin || contactInfo.github,
      importance: 'Recommended' as const,
      feedback: 'Links to your GitHub repositories or LinkedIn profile boost credibility.',
    },
  ];

  // 6. Action Verbs & Quantified Metrics (Google XYZ formula)
  const actionVerbsFound = ATS_ACTION_VERBS.filter((verb) => {
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${verb}([^a-zA-Z0-9]|$)`, 'i');
    return regex.test(lowerResume);
  });

  const metricMatches =
    cleanResume.match(
      /(\d+%\s*|\d+x\s*|\b\d+\s*(users|clients|students|requests|stars|ms|seconds|minutes|downloads|records)\b|\b(reduced|improved|increased|accelerated|scaled)\b[^\n.]{0,30}\d+)/gi
    ) || [];
  const metricsCount = metricMatches.length;

  let impactRating: 'High Impact' | 'Moderate Impact' | 'Low Impact (Passive)' =
    'Low Impact (Passive)';
  if (metricsCount >= 4) {
    impactRating = 'High Impact';
  } else if (metricsCount >= 2) {
    impactRating = 'Moderate Impact';
  }

  // 7. Word Count & Formatting Health
  const words = cleanResume.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  let wordCountStatus: 'Optimal (1 Page)' | 'Too Short' | 'Too Long (Multi-page)' =
    'Optimal (1 Page)';
  if (wordCount < 250) {
    wordCountStatus = 'Too Short';
  } else if (wordCount > 750) {
    wordCountStatus = 'Too Long (Multi-page)';
  }

  // 8. Overall ATS Score Calculation (100 Point Breakdown)
  // - Hard Skills Match: 40 points
  // - Section Completeness: 25 points
  // - Metric & Quantified Impact: 15 points
  // - Action Verbs & Soft Skills: 10 points
  // - ATS Formatting & Length: 10 points
  const skillRatio = targetSkills.length > 0 ? matchedSkills.length / targetSkills.length : 0;
  const hardSkillPoints = Math.round(skillRatio * 40);

  // Critical core sections (Contact, Technical Skills, Projects, Education) determine the 25 section points.
  // Social profiles (LinkedIn & GitHub) and work history are recommended bonuses and do NOT penalize ATS score if absent.
  const criticalSections = sections.filter((s) => s.importance === 'Critical');
  const passedCritical = criticalSections.filter((s) => s.found).length;
  const sectionPoints = Math.round((passedCritical / criticalSections.length) * 25);

  const metricPoints = Math.min(metricsCount * 3.5, 15);
  const verbPoints =
    Math.min(actionVerbsFound.length * 1.5, 6) + (matchedSoftSkills.length >= 2 ? 4 : 2);
  const lengthPoints = wordCountStatus === 'Optimal (1 Page)' ? 10 : 5;

  const totalScore = Math.min(
    Math.max(
      Math.round(hardSkillPoints + sectionPoints + metricPoints + verbPoints + lengthPoints),
      10
    ),
    100
  );

  let scoreTier: 'Excellent' | 'Good' | 'Needs Work' | 'Low Match' = 'Low Match';
  let scoreColor = 'text-rose-500';
  if (totalScore >= 80) {
    scoreTier = 'Excellent';
    scoreColor = 'text-emerald-500';
  } else if (totalScore >= 65) {
    scoreTier = 'Good';
    scoreColor = 'text-blue-500';
  } else if (totalScore >= 50) {
    scoreTier = 'Needs Work';
    scoreColor = 'text-amber-500';
  }

  // 9. Generate Actionable Recommendations
  const actionableFeedback: ATSAnalysisResult['actionableFeedback'] = [];

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 4);
    actionableFeedback.push({
      title: `Inject Missing Keywords (${topMissing.length} high priority)`,
      description: `The job description strongly targets: ${topMissing.join(
        ', '
      )}. Include these naturally inside your "Technical Skills" or relevant project descriptions.`,
      priority: 'high',
      suggestedExample: `Example for Skills section: "${topMissing.join(', ')}"`,
    });
  }

  if (metricsCount < 3) {
    actionableFeedback.push({
      title: 'Quantify Your Bullet Points (Google XYZ Formula)',
      description:
        'Your project bullet points appear mostly descriptive. Quantify results with metrics (e.g. % performance increase, user counts, latency reduction).',
      priority: 'high',
      suggestedExample:
        'Formula: "Accomplished [X] as measured by [Y] by doing [Z]" -> e.g. "Optimized SQL query performance by 40%, reducing API response time from 350ms to 120ms for 1,000+ test records."',
    });
  }

  if (!contactInfo.github || !contactInfo.linkedin) {
    actionableFeedback.push({
      title: 'Recommended to add Profiles (LinkedIn & GitHub)',
      description:
        'Proof of work adds credibility. While omitting social profiles does not lower your ATS score, adding GitHub and LinkedIn links helps recruiters verify your work quickly.',
      priority: 'low',
      suggestedExample:
        'Add in header: "GitHub: github.com/yourhandle | LinkedIn: linkedin.com/in/yourhandle"',
    });
  }

  if (actionVerbsFound.length < 4) {
    actionableFeedback.push({
      title: 'Begin Bullets with Strong Power Action Verbs',
      description:
        'Avoid passive phrasing like "Responsible for" or "Worked on". Start every project bullet with a decisive engineering action verb.',
      priority: 'medium',
      suggestedExample:
        'Replace "Worked on React app" with "Engineered responsive full-stack platform with React and Next.js..."',
    });
  }

  if (wordCountStatus === 'Too Short') {
    actionableFeedback.push({
      title: 'Expand Project Explanations',
      description:
        'Your resume is under 250 words. Add details regarding architecture, APIs, databases, and problem-solving trade-offs for your main projects.',
      priority: 'medium',
    });
  }

  return {
    overallScore: totalScore,
    scoreTier,
    scoreColor,
    wordCount,
    wordCountStatus,
    targetSkills,
    matchedSkills,
    missingSkills,
    matchedSoftSkills,
    missingSoftSkills,
    sections,
    contactInfo,
    metricsCount,
    actionVerbsFound,
    impactRating,
    actionableFeedback,
  };
}
