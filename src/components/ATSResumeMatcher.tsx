'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  Layers, 
  Target, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  Building2, 
  ChevronDown, 
  Award, 
  BarChart3,
  FileCheck,
  TrendingUp,
  Wand2,
  Download,
  Printer,
  CheckSquare,
  Mail,
  Code2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { extractTextFromFile } from '@/lib/pdfTextExtractor';
import { analyzeResumeATS, ATSAnalysisResult } from '@/lib/atsMatchEngine';
import { ThinkingOrb } from '@/components/ui/thinking-orbs';

export interface TailoredResumeResult {
  hard_requirements: string[];
  nice_to_have: string[];
  core_responsibilities: string[];
  gap_summary: string[];
  adjacent_matches: string[];
  change_log: string[];
  tailored_resume: string;
  cover_letter?: string;
  latex_resume?: string;
  critic_review?: {
    score: number;
    verdict: string;
    notes: string[];
    hallucination_check: boolean;
  };
}

// Quick-Fill Sample Target JDs for Top Fresher Drives
const SAMPLE_JOB_PRESETS = [
  {
    label: 'TCS NQT 2026 - Ninja & Digital Role',
    company: 'Tata Consultancy Services',
    jd: `Role: Assistant System Engineer / Digital Trainee (2025/2026 Batch)
Requirements:
- B.E./B.Tech/MCA/M.Sc in Computer Science, IT, or related fields.
- Strong knowledge of Data Structures, Algorithms, OOPs, and DBMS.
- Proficiency in Java, Python, C++, or C#.
- Familiarity with SQL databases, HTML, CSS, JavaScript, and Git.
- Basic understanding of Operating Systems, Computer Networks, and Cloud fundamentals.
- Strong problem solving, analytical thinking, and effective communication skills.`,
  },
  {
    label: 'Accenture - Associate Software Engineer (ASE)',
    company: 'Accenture',
    jd: `Role: Associate Software Engineer (ASE)
Key Qualifications:
- Degree in Engineering, Computer Science, or equivalent.
- Hands-on coding in Java, Python, JavaScript, or C#.
- Experience building web applications with React, Node.js, and RESTful APIs.
- Understanding of relational databases (PostgreSQL, MySQL) and query optimization.
- Familiarity with Cloud platforms (AWS or Azure), CI/CD pipelines, and Docker basics.
- Excellent collaboration, agile mindset, and debugging capabilities.`,
  },
  {
    label: 'Full-Stack Developer (React + Node.js)',
    company: 'Tech Startup / Product Team',
    jd: `Position: Junior Full Stack Developer
Requirements:
- Proficiency in React.js, Next.js, TypeScript, and Tailwind CSS.
- Backend proficiency with Node.js, Express.js, and REST APIs.
- Hands-on experience with PostgreSQL, MongoDB, Prisma, or Redis.
- Knowledge of Git, GitHub Actions, Docker, and deployment on Vercel or AWS.
- Demonstrated projects with quantifiable user impact and clean code architecture.`,
  },
  {
    label: 'Infosys - Specialist Programmer (SP)',
    company: 'Infosys',
    jd: `Role: Specialist Programmer (High-Package Coding Track)
Key Requirements:
- Deep expertise in Advanced Data Structures, Algorithms, and Dynamic Programming.
- High proficiency in Java, Python, or C++.
- Experience in System Design, Microservices, Spring Boot, or Django.
- Database query tuning in PostgreSQL or MySQL.
- Competitive programming rank (LeetCode, CodeChef, Codeforces) is a strong plus.`,
  },
];

const SAMPLE_RESUME_TEXT = `RAHUL SHARMA
Email: rahul.sharma.dev@gmail.com | Phone: +91-9876543210 | Bangalore, India
LinkedIn: linkedin.com/in/rahul-sharma-dev | GitHub: github.com/rahul-sharma-dev

EDUCATION
B.Tech in Computer Science and Engineering | 2022 - 2026 | CGPA: 8.7/10.0
ABC Institute of Technology, Bangalore

TECHNICAL SKILLS
- Programming Languages: Java, Python, JavaScript, TypeScript, SQL
- Frontend: React.js, Next.js, HTML5, CSS3, Tailwind CSS, Redux
- Backend & APIs: Node.js, Express.js, RESTful APIs, Microservices
- Databases: PostgreSQL, MongoDB, Redis, MySQL
- Developer Tools & Cloud: Git, GitHub, Docker, AWS (S3, EC2), Postman
- Core CS: Data Structures & Algorithms (DSA), OOPs, DBMS, Operating Systems

PROJECTS
1. FreshersBridge - Off-Campus Tech Job Portal
- Engineered full-stack job search portal using Next.js, TypeScript, and Supabase for 2,500+ active student users.
- Implemented real-time indexing and search filtering, improving query latency by 45% (reduced from 280ms to 150ms).
- Built automated background scrapers in Python, processing 100+ verified tech drives daily.

2. Collaborative Real-Time Whiteboard
- Developed interactive canvas drawing platform using React and WebSockets for 10+ simultaneous users per room.
- Handled distributed state synchronization with Redis pub/sub, achieving <50ms sync latency.

EXPERIENCE / INTERNSHIPS
Software Engineering Intern | TechNova Labs (June 2025 - August 2025)
- Developed responsive UI components in React and integrated 8+ backend REST API endpoints.
- Optimized PostgreSQL database queries, reducing average page load time by 30%.`;

export default function ATSResumeMatcher() {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | ''>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedMissing, setCopiedMissing] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [results, setResults] = useState<ATSAnalysisResult | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailoredResult, setTailoredResult] = useState<TailoredResumeResult | null>(null);
  const [tailoredInputSnapshot, setTailoredInputSnapshot] = useState<{ resumeText: string; jobDescription: string } | null>(null);
  const [activeTailorTab, setActiveTailorTab] = useState<'resume' | 'cover_letter' | 'latex' | 'critic' | 'gaps' | 'changelog' | 'requirements'>('resume');
  const [copiedTailored, setCopiedTailored] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);

  const hasInputChangedSinceTailoring = Boolean(
    tailoredResult &&
    tailoredInputSnapshot &&
    (resumeText.trim() !== tailoredInputSnapshot.resumeText.trim() ||
     jobDescription.trim() !== tailoredInputSnapshot.jobDescription.trim())
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler (PDF, TXT, DOCX)
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setErrorMessage(null);
    setIsExtracting(true);
    setUploadedFileName(file.name);

    try {
      const extracted = await extractTextFromFile(file);
      if (!extracted || extracted.trim().length < 50) {
        throw new Error('Extracted text seems too short or unreadable. If this is a scanned PDF image, please paste your text.');
      }
      setResumeText(extracted);
      setActiveTab('upload');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Could not parse the uploaded file. Please paste your resume text directly.');
      setUploadedFileName(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setJobDescription(SAMPLE_JOB_PRESETS[idx].jd);
  };

  const handleLoadSampleResume = () => {
    setResumeText(SAMPLE_RESUME_TEXT.trim());
    setUploadedFileName('rahul-sharma-sample-resume.pdf');
    setActiveTab('upload');
    if (!jobDescription.trim()) {
      handleSelectPreset(0);
    }
  };

  const handleClearResume = () => {
    setResumeText('');
    setUploadedFileName(null);
    setResults(null);
    setTailoredResult(null);
    setTailoredInputSnapshot(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    // Short simulated delay for smooth UI transition
    setTimeout(() => {
      try {
        const analysis = analyzeResumeATS(resumeText, jobDescription);
        setResults(analysis);

        // Record scan event in analytics
        fetch('/api/analytics/ats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'scan' }),
        }).catch(() => {});

        // Smooth scroll down to results on mobile
        setTimeout(() => {
          const resultsElem = document.getElementById('ats-results-dashboard');
          if (resultsElem) {
            resultsElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } catch (err: any) {
        console.error('Analysis error:', err);
        setErrorMessage('Failed to complete ATS analysis. Please check your resume text and try again.');
      } finally {
        setIsAnalyzing(false);
      }
    }, 400);
  };

  const handleTailorResume = async () => {
    if (!resumeText.trim()) {
      setErrorMessage('Please upload or paste your resume first.');
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMessage('Please provide a target job description or select a quick-fill drive to tailor your resume against.');
      return;
    }

    // If already tailored for this exact same Resume and JD, don't re-tailor again
    if (tailoredResult && !hasInputChangedSinceTailoring) {
      const elem = document.getElementById('tailored-resume-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    setIsTailoring(true);
    setErrorMessage(null);

    // Immediately smooth scroll down to the generating card section
    setTimeout(() => {
      const elem = document.getElementById('tailored-resume-section');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);

    // Keep ATS scorecard synchronized automatically
    try {
      const analysis = analyzeResumeATS(resumeText, jobDescription);
      setResults(analysis);
    } catch (e) {
      console.warn('ATS score auto-sync warning:', e);
    }

    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setTailoredResult(data.result);
        setTailoredInputSnapshot({ resumeText, jobDescription });
        setTimeout(() => {
          const elem = document.getElementById('tailored-resume-section');
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        throw new Error(data.error || 'Failed to tailor resume.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Error generating tailored resume. Please try again.');
    } finally {
      setIsTailoring(false);
    }
  };

  const handleCopyTailoredResume = () => {
    if (!tailoredResult) return;
    navigator.clipboard.writeText(tailoredResult.tailored_resume);
    setCopiedTailored(true);
    setTimeout(() => setCopiedTailored(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!tailoredResult) return;
    const blob = new Blob([tailoredResult.tailored_resume], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailored-ats-resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!tailoredResult) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tailored ATS Resume - FreshersBridge</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.5;
              padding: 40px;
              color: #111;
              max-width: 800px;
              margin: 0 auto;
              font-size: 10.5pt;
            }
            pre {
              white-space: pre-wrap;
              font-family: inherit;
              word-wrap: break-word;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <pre>${tailoredResult.tailored_resume.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyCoverLetter = () => {
    if (!tailoredResult?.cover_letter) return;
    navigator.clipboard.writeText(tailoredResult.cover_letter);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  const handleDownloadCoverLetter = () => {
    if (!tailoredResult?.cover_letter) return;
    const blob = new Blob([tailoredResult.cover_letter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailored-cover-letter.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintCoverLetter = () => {
    if (!tailoredResult?.cover_letter) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tailored Cover Letter - FreshersBridge</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              padding: 40px;
              color: #111;
              max-width: 800px;
              margin: 0 auto;
              font-size: 11pt;
            }
            pre {
              white-space: pre-wrap;
              font-family: inherit;
              word-wrap: break-word;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <pre>${tailoredResult.cover_letter.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopyLatex = () => {
    if (!tailoredResult?.latex_resume) return;
    navigator.clipboard.writeText(tailoredResult.latex_resume);
    setCopiedLatex(true);
    setTimeout(() => setCopiedLatex(false), 2000);
  };

  const handleDownloadTex = () => {
    if (!tailoredResult?.latex_resume) return;
    const blob = new Blob([tailoredResult.latex_resume], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailored-resume.tex';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyMissingKeywords = () => {
    if (!results || results.missingSkills.length === 0) return;
    const textToCopy = results.missingSkills.join(', ');
    navigator.clipboard.writeText(textToCopy);
    setCopiedMissing(true);
    setTimeout(() => setCopiedMissing(false), 2000);
  };

  const handleCopyFullReport = () => {
    if (!results) return;
    const report = `FreshersBridge ATS Resume Evaluation Report
Overall Match Score: ${results.overallScore}% (${results.scoreTier})
Word Count: ${results.wordCount} words (${results.wordCountStatus})
Impact Rating: ${results.impactRating} (${results.metricsCount} quantified metrics detected)

Matched Technical Skills (${results.matchedSkills.length}):
${results.matchedSkills.join(', ') || 'None'}

Missing Target Skills (${results.missingSkills.length}):
${results.missingSkills.join(', ') || 'None'}

Key Recommendations:
${results.actionableFeedback.map((f, i) => `${i + 1}. ${f.title}: ${f.description}`).join('\n')}

Evaluated on FreshersBridge (https://freshersbridge.in/career-tools)`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* 1. Main Scanner Inputs Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              ATS Resume Scanner &amp; Role Tailor
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Upload your PDF resume to detect missing keywords, section gaps, and Google XYZ impact metrics.
            </p>
          </div>

        </div>

        {/* Two-Column Input Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Column: Resume File Upload / Text Area */}
          <div className="space-y-2.5 flex flex-col">
            <div className="flex items-center justify-between min-h-[36px]">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Your Resume</span>
              </label>

              {/* Upload vs Paste Toggle */}
              <div className="inline-flex items-center rounded-full border border-border bg-secondary/80 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'upload' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    activeTab === 'paste' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {activeTab === 'upload' ? (
              <div className="space-y-2 flex-1 flex flex-col">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {uploadedFileName && resumeText.trim() ? (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 flex flex-col justify-between flex-1 min-h-[220px] space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <FileCheck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{uploadedFileName}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearResume}
                        className="text-muted-foreground hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="rounded-lg bg-background/90 p-3 border border-border/60 text-xs font-mono text-muted-foreground line-clamp-3">
                      {resumeText.slice(0, 300)}...
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-[#275df5] hover:underline cursor-pointer"
                      >
                        Upload different file
                      </button>
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Ready for ATS scan
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 min-h-[220px] rounded-xl border-2 border-dashed border-border hover:border-[#275df5]/60 bg-background/50 hover:bg-blue-50/10 dark:hover:bg-blue-950/10 transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
                  >
                    {isExtracting ? (
                      <div className="space-y-3 flex flex-col items-center">
                        <RefreshCw className="h-8 w-8 text-[#275df5] animate-spin" />
                        <p className="text-xs font-bold text-foreground">Reading &amp; Parsing PDF in Browser...</p>
                        <p className="text-[11px] text-muted-foreground">Zero bytes uploaded to any server</p>
                      </div>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#275df5] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-foreground">
                          Drag &amp; drop your Resume PDF here
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          or <span className="text-[#275df5] font-semibold underline">browse file</span> from your computer
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-secondary px-2.5 py-1 rounded-full">
                          Supports PDF, DOCX, TXT (Max 5MB)
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-muted-foreground h-5">
                  <span>{resumeText.trim() ? `${resumeText.split(/\s+/).filter(Boolean).length} words parsed` : 'PDF, Word, or Text document'}</span>
                  {uploadedFileName && (
                    <button
                      type="button"
                      onClick={handleClearResume}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear file
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2 flex-1 flex flex-col">
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    if (!e.target.value.trim() && uploadedFileName) {
                      handleClearResume();
                    }
                  }}
                  placeholder="Paste your raw resume text here (Education, Skills, Projects, Experience)..."
                  className="w-full flex-1 min-h-[220px] rounded-xl border border-border bg-background p-3.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-[#275df5] focus:outline-hidden focus:ring-1 focus:ring-[#275df5] leading-relaxed resize-none"
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground h-5">
                  <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                  {resumeText && (
                    <button
                      type="button"
                      onClick={handleClearResume}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear text
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Target Job Description & Quick Presets */}
          <div className="space-y-2.5 flex flex-col">
            <div className="flex items-center justify-between min-h-[36px]">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <span>2. Target Job Description</span>
              </label>

              <span className="text-[11px] text-muted-foreground">
                Match against role criteria
              </span>
            </div>

            <div className="space-y-2 flex-1 flex flex-col">
              <textarea
                rows={8}
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value);
                  setSelectedPresetIndex('');
                }}
                placeholder="Paste the target job description or requirements here to match keywords, skills, and qualifications..."
                className="w-full flex-1 min-h-[220px] rounded-xl border border-border bg-background p-3.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-[#275df5] focus:outline-hidden focus:ring-1 focus:ring-[#275df5] leading-relaxed resize-none"
              />

              <div className="flex items-center justify-between text-[11px] text-muted-foreground h-5">
                <span>{jobDescription.split(/\s+/).filter(Boolean).length} words</span>
                {jobDescription && (
                  <button
                    type="button"
                    onClick={() => {
                      setJobDescription('');
                      setSelectedPresetIndex('');
                    }}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear JD
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 p-4 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Primary CTA Buttons: 1-Click Scan & Tailor for JD */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Privacy Guaranteed: Your resume is processed strictly client-side. Zero server storage.</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!resumeText.trim() || isAnalyzing || isTailoring}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground px-5 py-3.5 text-xs font-bold border border-border transition-all cursor-pointer shrink-0"
              title="Check ATS match score only without tailoring"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#275df5]" />
                  <span>Checking Score...</span>
                </>
              ) : (
                <span>Quick Score Check</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleTailorResume}
              disabled={!resumeText.trim() || !jobDescription.trim() || isTailoring || isAnalyzing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#275df5] via-[#4338ca] to-[#2563eb] hover:opacity-95 px-8 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
            >
              {isTailoring ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>{tailoredResult ? 'Re-tailoring Resume to JD...' : 'Scanning & Tailoring for JD...'}</span>
                </>
              ) : (
                <span>
                  {tailoredResult
                    ? hasInputChangedSinceTailoring
                      ? 'Re-tailor Resume for JD'
                      : 'View Tailored Resume'
                    : 'Scan & Tailor Resume for JD'}
                </span>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* 2. Jobsuit-Grade Results Dashboard */}
      {results && (
        <div
          id="ats-results-dashboard"
          className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in-50 duration-300"
        >
          {/* Top Score Showcase */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border pb-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold bg-secondary text-foreground">
                <span>ATS Screening Verdict</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#275df5]" />
                <span className={results.scoreColor}>{results.scoreTier} Match</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-foreground">
                Resume Compatibility Scorecard
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                Multi-dimensional evaluation covering hard skills frequency, section completeness, Google XYZ impact metrics, and ATS readability.
              </p>
            </div>

            {/* Circular Gauge / Badge */}
            <div className="flex items-center gap-4 bg-background/80 border border-border p-4 rounded-2xl shadow-2xs shrink-0">
              <div className="relative flex items-center justify-center">
                <div className={`h-20 w-20 rounded-full flex flex-col items-center justify-center font-black border-4 ${
                  results.overallScore >= 80
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/30'
                    : results.overallScore >= 65
                    ? 'border-blue-500 text-[#275df5] bg-blue-50/40 dark:bg-blue-950/30'
                    : results.overallScore >= 50
                    ? 'border-amber-500 text-amber-600 bg-amber-50/40 dark:bg-amber-950/30'
                    : 'border-rose-500 text-rose-600 bg-rose-50/40 dark:bg-rose-950/30'
                }`}>
                  <span className="text-2xl leading-none">{results.overallScore}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Match</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-foreground">
                  {results.overallScore >= 80 ? 'Strong Candidate' : results.overallScore >= 60 ? 'Competitive' : 'Needs Optimization'}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {results.matchedSkills.length} of {results.targetSkills.length} target skills found
                </p>
              </div>
            </div>
          </div>

          {/* 3 Columns: Matched Skills, Missing Skills, and Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Matched Keywords (Emerald) */}
            <div className="rounded-xl border border-border bg-background p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Matched Skills ({results.matchedSkills.length})
                </span>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  Indexed
                </span>
              </div>

              {results.matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {results.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-emerald-50 dark:bg-emerald-950/70 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                    >
                      <span>✓</span> {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-2">
                  No overlapping technical keywords identified from target job.
                </p>
              )}
            </div>

            {/* Missing Keywords (Amber/Red with Copy Action) */}
            <div className="rounded-xl border border-border bg-background p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Missing Keywords ({results.missingSkills.length})
                </span>

                {results.missingSkills.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCopyMissingKeywords}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#275df5] hover:underline cursor-pointer"
                  >
                    {copiedMissing ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedMissing ? 'Copied!' : 'Copy All'}</span>
                  </button>
                )}
              </div>

              {results.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {results.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-amber-50 dark:bg-amber-950/70 px-2 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1"
                    >
                      <span>+</span> {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 font-semibold py-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> 100% of target skills present!
                </p>
              )}
            </div>

            {/* Structural Audit Checklist */}
            <div className="rounded-xl border border-border bg-background p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-[#275df5]" /> ATS Formatting &amp; Sections
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Standard
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {results.sections.map((sec, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-muted-foreground truncate max-w-[170px]">{sec.name}</span>
                    {sec.found ? (
                      <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
                        <Check className="h-3 w-3" /> Found
                      </span>
                    ) : (
                      <span className="font-bold text-rose-600 inline-flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Missing
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* AI RESUME TAILORING ENGINE & GAP ANALYSIS SUITE (MASTER PROMPT SPEC)       */}
      {/* ========================================================================= */}

      {/* Loading Indicator for Tailoring with Animated Thinking Orb */}
      {isTailoring && (
        <div
          id="tailored-resume-section"
          className="rounded-2xl border border-border bg-card/80 p-8 sm:p-14 shadow-md backdrop-blur-sm flex flex-col items-center justify-center min-h-[260px] animate-in fade-in-50 duration-300"
        >
          <div
            className="inline-flex h-[74px] items-center gap-3.5 rounded-full pl-[9px] pr-8 border border-border bg-secondary/70 dark:bg-[#121216] shadow-sm transition-all"
            style={{
              boxShadow: "inset 0 0 0 1px rgba(120,120,120,0.1), 0 4px 20px -2px rgba(0,0,0,0.05)",
            }}
          >
            <span className="[&_canvas]:!size-14 shrink-0 flex items-center justify-center">
              <ThinkingOrb state="composing" size={64} theme="auto" />
            </span>
            <span className="whitespace-nowrap text-base sm:text-lg font-semibold text-foreground tracking-tight">
              Generating Tailored ATS Resume...
            </span>
          </div>
        </div>
      )}

      {/* Generated Tailored Resume Output */}
      {tailoredResult && !isTailoring && (
        <div id="tailored-resume-section" className="rounded-2xl border-2 border-[#275df5]/40 bg-card p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Top Decorative Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#275df5]/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border pb-6 relative z-10">
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <span>Tailored ATS Resume</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                Optimized specifically for this target job description without inventing skills or inflated metrics. Factual work history, dates, and institutions are strictly preserved.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {activeTailorTab === 'cover_letter' ? (
                <>
                  <button
                    type="button"
                    onClick={handleCopyCoverLetter}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#275df5] hover:bg-[#1d4ed8] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {copiedCoverLetter ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied Letter!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Cover Letter</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadCoverLetter}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
                    title="Download Cover Letter"
                  >
                    <Download className="h-4 w-4 text-[#275df5]" />
                    <span>Download</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCopyTailoredResume}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#275df5] hover:bg-[#1d4ed8] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {copiedTailored ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy ATS Resume</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
                    title="Download ATS-Friendly Plain Text Resume"
                  >
                    <Download className="h-4 w-4 text-[#275df5]" />
                    <span>Download</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTailorTab('resume')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTailorTab === 'resume'
                  ? 'border-[#275df5] text-[#275df5]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Tailored Resume
            </button>

            <button
              type="button"
              onClick={() => setActiveTailorTab('cover_letter')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTailorTab === 'cover_letter'
                  ? 'border-[#275df5] text-[#275df5]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Cover Letter
            </button>
          </div>

          {/* Tab 1: Tailored Resume Body */}
          {activeTailorTab === 'resume' && (
            <div className="space-y-4">
              {/* Resume Paper Container */}
              <div className="relative rounded-xl border border-border bg-background p-6 sm:p-8 shadow-inner">
                <button
                  type="button"
                  onClick={handleCopyTailoredResume}
                  className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/90 hover:bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
                >
                  {copiedTailored ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedTailored ? 'Copied' : 'Copy'}</span>
                </button>

                <pre className="font-sans text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap selection:bg-[#275df5]/20 font-normal">
                  {tailoredResult.tailored_resume}
                </pre>
              </div>

              {/* Practical Guidance */}
              <div className="rounded-xl border border-blue-200/70 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-4 text-xs text-muted-foreground flex items-start gap-3">
                <Info className="h-4 w-4 text-[#275df5] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-foreground">How to use this tailored resume:</p>
                  <p className="leading-relaxed">
                    Copy the text above into Google Docs or Microsoft Word. Set font to <strong>Calibri or Arial (10pt to 11pt)</strong> with 0.5 to 0.75-inch margins. It will cleanly format into an exact 1-page ATS-passable resume. Then export as <strong>.PDF</strong> or submit as <strong>.DOCX</strong>!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: TAILORED FRESHER COVER LETTER                             */}
          {/* ================================================================= */}
          {activeTailorTab === 'cover_letter' && (
            <div className="space-y-4">
              {/* Cover Letter Paper Card */}
              <div className="relative rounded-xl border border-border bg-background p-6 sm:p-8 shadow-inner">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 text-[#275df5]" />
                    <span>Formal Job Application Letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyCoverLetter}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/90 hover:bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
                    >
                      {copiedCoverLetter ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCoverLetter ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadCoverLetter}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/90 hover:bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
                      title="Download Cover Letter"
                    >
                      <Download className="h-3.5 w-3.5 text-[#275df5]" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                <pre className="font-sans text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap selection:bg-[#275df5]/20 font-normal">
                  {tailoredResult.cover_letter || 'Generating tailored cover letter...'}
                </pre>
              </div>

              {/* Fresher Application Guidance */}
              <div className="rounded-xl border border-blue-200/70 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-4 text-xs text-muted-foreground flex items-start gap-3">
                <Info className="h-4 w-4 text-[#275df5] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-foreground">How to send this cover letter:</p>
                  <p className="leading-relaxed">
                    When applying on company portals (TCS iON, Infosys Careers, Accenture Careers) or reaching out to recruiters on LinkedIn/Email, paste this directly into the Cover Letter / Message box. It proves you researched their tech stack rather than mass-spamming applications!
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
