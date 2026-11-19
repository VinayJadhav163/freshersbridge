import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Briefcase, 
  ShieldCheck, 
  FileCheck, 
  IndianRupee, 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  Calculator, 
  Lightbulb,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Job } from '@/types';

interface JobFresherIntelligenceProps {
  job: Job;
  isInternship?: boolean;
}

interface InterviewBlueprint {
  domain: string;
  rounds: string[];
  sampleQuestions: string[];
  studyGuideUrl: string;
  studyGuideTitle: string;
  defaultAtsKeywords: string[];
}

// Intelligent domain classification & interview blueprints
function getInterviewBlueprint(title: string, skills: string[] = []): InterviewBlueprint {
  const t = title.toLowerCase();
  const s = skills.join(' ').toLowerCase();

  // 1. Electronics, Hardware, Embedded Systems, IoT & Robotics
  if (
    /\b(electronic|electronics|embedded|hardware|vlsi|iot|circuit|pcb|electrical|semiconductor|microcontroller|arduino|raspberry|fpga|verilog|vhdl|robotics|mechatronics|sensors?|ece|eee)\b/i.test(t) ||
    /\b(embedded|vlsi|pcb|microcontroller|verilog|vhdl|fpga|arduino|circuit design|semiconductor)\b/i.test(s)
  ) {
    return {
      domain: 'Electronics & Embedded Systems',
      rounds: [
        'Round 1: Core Fundamentals & Aptitude (Basic Electronics, Network Theory, Digital Logic & Quantitative Aptitude)',
        'Round 2: Embedded Systems & C Programming (Microcontroller Architecture 8051/ARM/ESP32, Embedded C, I2C/SPI/UART)',
        'Round 3: Circuit Design, Hardware Projects (PCB/Sensors/MATLAB/Proteus Simulation) & Managerial Fitment'
      ],
      sampleQuestions: [
        'Explain the architectural difference between a Microcontroller and a Microprocessor with typical application examples.',
        'How do serial communication protocols (UART, SPI, I2C) compare in pin count, data transfer speed, and duplexity?',
        'What is an Interrupt Service Routine (ISR)? How does interrupt-driven I/O differ from polling in embedded firmware?'
      ],
      studyGuideUrl: '/guides/electronics-embedded-systems-interview-guide-freshers',
      studyGuideTitle: 'Electronics & Embedded Systems Interview Blueprint',
      defaultAtsKeywords: [
        'Circuit Design',
        'Embedded C',
        'Microcontrollers (8051/ARM)',
        'PCB Design',
        'Digital Electronics',
        'Sensor Interfacing'
      ]
    };
  }

  // 2. Software Testing & QA Automation
  if (
    /\b(qa\b|test|testing|quality assurance|sdet|automation engineer|tester)\b/i.test(t) ||
    /\b(selenium|cypress|playwright|manual testing|automation testing|test cases?|testng|cucumber|junit|postman api)\b/i.test(s)
  ) {
    return {
      domain: 'Software Testing & QA Automation',
      rounds: [
        'Round 1: Testing Fundamentals & Analytical Aptitude (STLC/SDLC, Black Box Techniques, Logical Reasoning)',
        'Round 2: Test Case Design & Automation (Writing test scenarios, Selenium/Playwright scripts, API Testing with Postman)',
        'Round 3: Bug Life Cycle, Defect Severity vs Priority, Real-World Edge Cases & Team Fitment'
      ],
      sampleQuestions: [
        'What is the difference between Functional Testing and Non-Functional Testing, with concrete examples?',
        'How do you derive test cases using Equivalence Class Partitioning and Boundary Value Analysis (BVA)?',
        'Explain the Page Object Model (POM) pattern in Selenium and why it is essential for maintainable test automation.'
      ],
      studyGuideUrl: '/guides/software-testing-qa-automation-interview-guide-freshers',
      studyGuideTitle: 'Software Testing & QA Automation Interview Guide',
      defaultAtsKeywords: [
        'Manual Testing',
        'Selenium WebDriver',
        'Test Case Design',
        'API Testing (Postman)',
        'Bug Life Cycle (Jira)',
        'STLC / SDLC'
      ]
    };
  }

  // 3. Data Science, Data Analyst & Business Intelligence
  if (
    /\b(data analyst|business analyst|data analytics|data science|data scientist|bi analyst|power bi|tableau|data engineer|analytics)\b/i.test(t) ||
    /\b(power bi|tableau|pandas|data visualization|data cleaning|exploratory data)\b/i.test(s)
  ) {
    return {
      domain: 'Data Analytics & Business Intelligence',
      rounds: [
        'Round 1: Quantitative Aptitude & Core SQL (Joins, Aggregations, Subqueries, Window Functions)',
        'Round 2: Practical Data Challenge (Python/Pandas data wrangling, Excel modeling, or Power BI/Tableau dashboards)',
        'Round 3: Business Problem-Solving Case Study, Metric Definition & Academic Project Walkthrough'
      ],
      sampleQuestions: [
        'Write a SQL query using RANK() or DENSE_RANK() to find the 2nd highest salary per department.',
        'What is the difference between WHERE and HAVING clauses in SQL with a practical example?',
        'How do you detect, handle, or impute missing data and extreme outliers during exploratory data analysis (EDA)?'
      ],
      studyGuideUrl: '/guides/data-analyst-roadmap-fresher-jobs-salary-interview-guide-2026',
      studyGuideTitle: 'Data Analyst Career & Interview Roadmap',
      defaultAtsKeywords: [
        'SQL Queries (Joins/Window Functions)',
        'Python (Pandas/NumPy)',
        'Data Visualization',
        'Power BI / Tableau',
        'Advanced Excel',
        'Data Cleaning & EDA'
      ]
    };
  }

  // 4. Web & Frontend Development
  if (
    /\b(web|frontend|front-end|react|reactjs|angular|vue|nextjs|next\.js|ui developer|javascript developer|frontend engineer)\b/i.test(t) ||
    /\b(react|react\.js|angular|vue|next\.js|tailwind|css3|html5|typescript|javascript)\b/i.test(s)
  ) {
    return {
      domain: 'Web & Frontend Development',
      rounds: [
        'Round 1: Web Fundamentals & JavaScript Core (DOM, ES6+, Event Loop, CSS Flexbox/Grid, basic DSA)',
        'Round 2: Component Architecture & Machine Coding (Build an interactive stateful component with responsive styling)',
        'Round 3: State Management, REST API Integration, Web Performance (Core Web Vitals) & Project Architecture'
      ],
      sampleQuestions: [
        'Explain how the React Virtual DOM diffing and reconciliation algorithm optimizes UI rendering.',
        'What is the difference between useEffect, useMemo, and useCallback hooks, and how do they prevent unnecessary re-renders?',
        'How does JavaScript handle asynchronous code via the Event Loop, Microtask Queue, and Call Stack?'
      ],
      studyGuideUrl: '/guides/full-stack-web-development-roadmap-college-students',
      studyGuideTitle: 'Full-Stack & Web Dev Roadmap for Freshers',
      defaultAtsKeywords: [
        'React.js / Next.js',
        'JavaScript (ES6+)',
        'HTML5 & CSS3',
        'Tailwind CSS',
        'REST API Integration',
        'Git & GitHub'
      ]
    };
  }

  // 5. Backend Engineering & Systems
  if (
    /\b(backend|back-end|java developer|python developer|spring boot|django|fastapi|node\.?js|golang|microservices?|api developer)\b/i.test(t) ||
    /\b(spring boot|django|fastapi|node\.js|express|rest apis?|postgresql|mongodb|redis)\b/i.test(s)
  ) {
    const isPython = t.includes('python') || s.includes('python');
    return {
      domain: 'Backend Engineering & Distributed Systems',
      rounds: [
        'Round 1: Online Technical Assessment (Data Structures & Algorithms, Language Core MCQs, Problem Solving)',
        'Round 2: Backend Machine Coding (Designing a REST API with DB schema, authentication, validation & error handling)',
        'Round 3: Database Indexing, Caching (Redis), System Design Fundamentals & Project Architecture Walkthrough'
      ],
      sampleQuestions: [
        'Explain the difference between synchronous and asynchronous I/O and how multi-threading works in your primary language.',
        'What are ACID properties in relational databases and how does indexing improve SQL query latency?',
        'Explain JWT authentication workflow and how you secure sensitive REST API endpoints against CSRF/XSS.'
      ],
      studyGuideUrl: isPython
        ? '/guides/top-50-python-interview-questions-coding-freshers'
        : '/guides/top-50-java-interview-questions-answers-freshers-2026',
      studyGuideTitle: isPython
        ? 'Top 50 Python Interview Coding Challenges'
        : 'Core Java & Backend Technical Masterclass',
      defaultAtsKeywords: [
        'RESTful API Development',
        'Database Design (SQL/NoSQL)',
        'Object-Oriented Design',
        'Server Architecture',
        'Git & CI/CD',
        'API Security & Auth'
      ]
    };
  }

  // 6. DevOps & Cloud Infrastructure
  if (
    /\b(devops|cloud|aws|azure|gcp|docker|kubernetes|ci\/cd|linux|sre|sysadmin|system administrator)\b/i.test(t) ||
    /\b(docker|kubernetes|aws|azure|terraform|jenkins|github actions|linux bash)\b/i.test(s)
  ) {
    return {
      domain: 'DevOps & Cloud Infrastructure',
      rounds: [
        'Round 1: Linux Fundamentals, Shell Scripting, Networking (TCP/IP, DNS, Subnets) & Aptitude',
        'Round 2: Containerization & CI/CD Pipelines (Dockerfiles, GitHub Actions/Jenkins, Cloud provisioning)',
        'Round 3: Infrastructure Troubleshooting, Security Best Practices, and Monitoring (Prometheus/Grafana)'
      ],
      sampleQuestions: [
        'Explain the architectural difference between a Docker container and a Virtual Machine (VM).',
        'How does DNS resolution work from entering a URL in the browser to reaching the origin server?',
        'Explain the essential stages of a CI/CD pipeline and how zero-downtime rolling updates work.'
      ],
      studyGuideUrl: '/guides/ats-friendly-resume-guide-tech-freshers-with-examples',
      studyGuideTitle: 'Cloud & DevOps Resume & Placement Guide',
      defaultAtsKeywords: [
        'Linux / Bash Scripting',
        'Docker & Containers',
        'CI/CD Pipelines (GitHub Actions)',
        'AWS / Cloud Basics',
        'Networking (TCP/IP, DNS)',
        'Git Version Control'
      ]
    };
  }

  // 7. Mobile App Development
  if (
    /\b(android|ios|flutter|react native|mobile developer|swift|kotlin)\b/i.test(t) ||
    /\b(flutter|react native|android sdk|swift|kotlin|xcode)\b/i.test(s)
  ) {
    return {
      domain: 'Mobile Application Development',
      rounds: [
        'Round 1: Mobile UI & OOPs/Language Assessment (Kotlin/Java/Dart/Swift basics, App Lifecycle)',
        'Round 2: Machine Coding (Implement a responsive list UI with pagination, offline caching, and REST API fetch)',
        'Round 3: Architecture Patterns (MVVM/Bloc), Memory Leaks, Permissions & Store Deployment'
      ],
      sampleQuestions: [
        'Explain the Activity and Fragment lifecycle in Android or View Controller lifecycle in iOS.',
        'How do you handle background operations and network calls without freezing the UI thread?',
        'What is the difference between stateful and stateless widgets/components and how do you manage state?'
      ],
      studyGuideUrl: '/guides/full-stack-web-development-roadmap-college-students',
      studyGuideTitle: 'Mobile & App Development Roadmap for Freshers',
      defaultAtsKeywords: [
        'Android SDK / Flutter',
        'State Management',
        'REST API Integration',
        'Mobile UI Design',
        'Git Version Control',
        'Store Deployment'
      ]
    };
  }

  // 8. Business Development, Sales & Operations
  if (
    /\b(marketing|sales|business development|bde|content|social media|hr|human resources|operations|recruiter|account management)\b/i.test(t)
  ) {
    return {
      domain: 'Business Development & Operations',
      rounds: [
        'Round 1: Communication, Aptitude & Domain Knowledge Assessment',
        'Round 2: Practical Case Study (Lead Generation strategy, Campaign planning, or Pitch simulation)',
        'Round 3: Behavioral Fitment, Negotiation, Target Handling & Culture Alignment'
      ],
      sampleQuestions: [
        'How do you qualify an inbound lead versus outbound cold prospecting?',
        'Describe a successful campaign or academic initiative where you drove user engagement or conversions.',
        'How do you handle client objections regarding pricing or competitor alternatives?'
      ],
      studyGuideUrl: '/guides/hr-interview-questions-answers-for-freshers-with-best-responses',
      studyGuideTitle: 'HR & Behavioral Interview Preparation Guide',
      defaultAtsKeywords: [
        'Client Communication',
        'Lead Generation',
        'Market Research',
        'CRM Tools',
        'B2B Sales Outreach',
        'Negotiation Skills'
      ]
    };
  }

  // 9. Default: Software Engineering & Core CS
  return {
    domain: 'Software Engineering & Core CS',
    rounds: [
      'Round 1: Online Technical Assessment (Quantitative Aptitude, Logical Reasoning, 2 Coding Problems)',
      'Round 2: Technical Interview (Data Structures, OOPs concepts, DBMS queries, OS basics)',
      'Round 3: System Design Fundamentals, Academic Project deep-dive, and HR Fitment'
    ],
    sampleQuestions: [
      'Explain the four fundamental pillars of Object-Oriented Programming (OOPs) with practical examples.',
      'What is the time and space complexity of QuickSort vs MergeSort, and when would you choose each?',
      'Explain ACID properties in Database Management Systems and why they matter.'
    ],
    studyGuideUrl: '/guides/top-50-java-interview-questions-answers-freshers-2026',
    studyGuideTitle: 'Core CS & Technical Interview Masterclass',
    defaultAtsKeywords: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (OOP)',
      'Database Management (SQL)',
      'Problem Solving',
      'Operating Systems Basics',
      'Git & GitHub'
    ]
  };
}

// Clean and sanitize skills so raw job titles or junk words do not appear as ATS keyword pills
function sanitizeAtsKeywords(skills: string[] = [], jobTitle: string, defaultKeywords: string[]): string[] {
  const titleLower = jobTitle.toLowerCase().trim();
  const cleaned: string[] = [];

  const junkTokens = [
    'internship',
    'trainee',
    'hiring',
    'opening',
    'vacancy',
    'full time',
    'part time',
    'fresher',
    'freshers',
    'engineer',
    'engineering',
    'developer',
    'specialist',
  ];

  for (const raw of skills) {
    if (!raw) continue;
    // Split by comma or slash if grouped into a single string
    const parts = raw.split(/[,/]/).map((p) => p.trim()).filter(Boolean);
    for (const part of parts) {
      const pLower = part.toLowerCase();
      // Skip if exactly matches the job title
      if (pLower === titleLower) continue;
      // Skip if too short
      if (part.length < 2 || /^\d+$/.test(part)) continue;
      // Skip if it contains "internship", "hiring", etc. while matching title words
      if (
        titleLower.includes(pLower) &&
        junkTokens.some((token) => pLower.includes(token))
      ) {
        continue;
      }
      // Skip pure junk titles
      if (pLower.endsWith('internship') || pLower.endsWith('job') || pLower.startsWith('hiring')) {
        continue;
      }

      if (!cleaned.some((existing) => existing.toLowerCase() === pLower)) {
        cleaned.push(part);
      }
    }
  }

  // Backfill up to 6 high-value skills from domain defaults
  for (const kw of defaultKeywords) {
    if (cleaned.length >= 6) break;
    if (!cleaned.some((existing) => existing.toLowerCase() === kw.toLowerCase())) {
      cleaned.push(kw);
    }
  }

  return cleaned.slice(0, 6);
}

// Calculate rough monthly in-hand take-home salary from annual CTC
function computeInHandSalary(salaryStr?: string | null): { inHandMonthly: string; note: string } | null {
  if (!salaryStr) return null;
  const s = salaryStr.toLowerCase();

  // If already monthly (e.g. "₹25,000 / month")
  if (s.includes('/ month') || s.includes('/month') || s.includes('stipend')) {
    const numMatch = s.match(/([0-9,]+)/);
    if (numMatch) {
      return {
        inHandMonthly: `₹${numMatch[1]} / month`,
        note: 'Direct monthly stipend credited without standard EPF deductions.'
      };
    }
  }

  // If annual LPA (e.g. "₹4.5 LPA" or "4 - 6 LPA")
  const lpaMatch = s.match(/([0-9.]+)\s*(?:-|to)?\s*([0-9.]*)\s*lpa/i);
  if (lpaMatch) {
    const minLpa = parseFloat(lpaMatch[1]);
    const maxLpa = lpaMatch[2] ? parseFloat(lpaMatch[2]) : minLpa;
    const avgLpa = (minLpa + maxLpa) / 2;

    // Approximate in-hand calculation under Indian New Tax Regime:
    // Annual CTC minus ~12% PF & professional tax. Up to 7 LPA is zero income tax.
    const monthlyGross = (avgLpa * 100000) / 12;
    const monthlyNet = Math.round(monthlyGross * 0.88); // Deducting ~12% EPF & PT

    const formattedMonthly = `₹${monthlyNet.toLocaleString('en-IN')}`;
    return {
      inHandMonthly: `~${formattedMonthly} / month`,
      note: `Estimated take-home for ${salaryStr} after standard EPF and statutory deductions.`
    };
  }

  return null;
}

export default function JobFresherIntelligence({ job, isInternship }: JobFresherIntelligenceProps) {
  const blueprint = getInterviewBlueprint(job.title, job.skills || []);
  const salaryInsight = computeInHandSalary(job.salary);

  // Derive clean, domain-accurate ATS keywords without raw job title repetition
  const atsSkills = sanitizeAtsKeywords(job.skills || [], job.title, blueprint.defaultAtsKeywords);

  return (
    <section className="rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-b from-indigo-50/50 via-card to-card p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-100 dark:border-indigo-900/40 pb-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Briefcase className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <span>Candidate Preparation Blueprint</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight break-words">
            How to Crack the {job.title} Role at {job.company}
          </h2>
        </div>

        <Link
          href="/career-tools"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
        >
          <Calculator className="h-4 w-4 shrink-0" />
          <span className="whitespace-nowrap">Launch Career Toolkit</span>
        </Link>
      </div>

      {/* Grid: ATS Keyword Matcher & Expected Hiring Rounds */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: ATS Resume Keyword Optimization */}
        <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-start gap-2.5 text-foreground">
            <FileCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground leading-snug">
                Target ATS Resume Keywords
              </h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                Core Competencies &amp; Skills
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Applicant Tracking Systems (ATS) score your application against these core competencies. Ensure they are highlighted in your resume:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {atsSkills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
              >
                <Check className="h-3 w-3 text-emerald-600" />
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Want to score your resume?</span>
            <Link
              href="/career-tools"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Test ATS Score</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: Typical Selection & Interview Rounds */}
        <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 space-y-3 shadow-2xs">
          <div className="flex items-start gap-2.5 text-foreground">
            <BookOpen className="h-4.5 w-4.5 text-[#275df5] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground leading-snug">
                Expected Hiring Rounds
              </h3>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                {blueprint.domain}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Standard selection pattern for entry-level candidates applying for this profile:
          </p>

          <ul className="space-y-2.5 text-xs text-foreground/90 font-medium">
            {blueprint.rounds.map((round, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px] mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{round}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Preparation resource:</span>
            <Link
              href={blueprint.studyGuideUrl}
              className="text-[#275df5] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>{blueprint.studyGuideTitle}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* Top 3 Technical Interview Questions Likely to be Asked */}
      <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-5 space-y-3 shadow-2xs">
        <div className="flex items-start gap-2.5 text-foreground">
          <HelpCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-foreground leading-snug">
              Top Technical Interview Questions for this Role
            </h3>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
              Domain-Specific Conceptual &amp; Practical Questions
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Prepare these essential conceptual and problem-solving questions before your technical discussion:
        </p>

        <div className="space-y-2 pt-1">
          {blueprint.sampleQuestions.map((q, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 p-2.5 text-xs text-foreground/90 font-medium border border-border/40"
            >
              <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">Q{idx + 1}:</span>
              <span className="leading-relaxed">{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Salary In-Hand Take-Home Breakdown (if salary exists) */}
      {salaryInsight && (
        <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <IndianRupee className="h-3.5 w-3.5" />
              <span>Estimated In-Hand Monthly Take-Home</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-foreground">
                {salaryInsight.inHandMonthly}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                (CTC: {job.salary})
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {salaryInsight.note}
            </p>
          </div>

          <Link
            href="/career-tools"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/60 px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 transition-all shadow-2xs self-start sm:self-auto shrink-0"
          >
            <span>Customize In-Hand CTC</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Verification & Anti-Scam Notice */}
      <div className="rounded-xl bg-slate-100/80 dark:bg-slate-900/50 border border-border/60 p-3.5 flex items-start gap-3 text-xs text-muted-foreground">
        <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-foreground">Official Direct Application:</strong> FreshersBridge directs you to the verified official portal of {job.company}. We enforce a zero-tolerance policy against fake recruiters. Never pay money for any job interview, test, or offer letter.
        </div>
      </div>

    </section>
  );
}

