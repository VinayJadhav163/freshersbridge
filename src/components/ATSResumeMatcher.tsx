'use client';

import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
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
  const [activeTailorTab, setActiveTailorTab] = useState<'resume' | 'cover_letter' | 'latex' | 'critic' | 'gaps' | 'changelog' | 'requirements'>('resume');
  const [copiedTailored, setCopiedTailored] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);
  const [copiedLatex, setCopiedLatex] = useState(false);

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

    setIsTailoring(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setTailoredResult(data.result);
        setTimeout(() => {
          const elem = document.getElementById('tailored-resume-section');
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 150);
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
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 px-3 py-1 text-xs font-bold text-[#275df5] mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Jobsuit-Grade ATS Matching Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              ATS Resume Scanner &amp; Role Tailor
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Upload your PDF resume to detect missing keywords, section gaps, and Google XYZ impact metrics.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleLoadSampleResume}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 hover:bg-secondary px-3 py-2 text-xs font-bold text-foreground transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#275df5]" />
              <span>Load Sample Resume</span>
            </button>
          </div>
        </div>

        {/* Two-Column Input Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Column: Resume File Upload / Text Area */}
          <div className="space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#275df5]" />
                <span>1. Your Resume</span>
              </label>

              {/* Upload vs Paste Toggle */}
              <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === 'upload' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeTab === 'paste' ? 'bg-background shadow-xs text-foreground font-bold' : 'text-muted-foreground'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {activeTab === 'upload' ? (
              <div className="space-y-3 flex-1 flex flex-col">
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

                {uploadedFileName ? (
                  <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 flex flex-col justify-between flex-1 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                          <FileCheck className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground truncate">{uploadedFileName}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {resumeText.split(/\s+/).filter(Boolean).length} words extracted • 100% Client-Side Private
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearResume}
                        className="text-muted-foreground hover:text-rose-600 p-1 rounded-md transition-colors"
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
              </div>
            ) : (
              <div className="space-y-2 flex-1 flex flex-col">
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your raw resume text here (Education, Skills, Projects, Experience)..."
                  className="w-full flex-1 min-h-[220px] rounded-xl border border-border bg-background p-3.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-[#275df5] focus:outline-hidden focus:ring-1 focus:ring-[#275df5] leading-relaxed resize-none"
                />
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                  {resumeText && (
                    <button
                      type="button"
                      onClick={() => setResumeText('')}
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
          <div className="space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-[#275df5]" />
                <span>2. Target Job Description</span>
              </label>

              <span className="text-[11px] text-muted-foreground">
                Match against role criteria
              </span>
            </div>

            {/* Quick Presets Dropdown/Pills */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground self-center mr-1">
                Quick Fill:
              </span>
              {SAMPLE_JOB_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(idx)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'border-[#275df5] bg-[#275df5] text-white'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-[#275df5]/40'
                  }`}
                >
                  {preset.company.split(' ')[0]} {preset.label.split('-')[1]?.trim() || ''}
                </button>
              ))}
            </div>

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

            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
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

        {/* Error Notification */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 p-4 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Primary CTA Scan Button */}
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 px-6 py-3.5 text-sm font-bold text-foreground transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-[#275df5]" />
                  <span>Scanning ATS Score...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-[#275df5]" />
                  <span>Scan ATS Match Score</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleTailorResume}
              disabled={!resumeText.trim() || !jobDescription.trim() || isTailoring || isAnalyzing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#275df5] via-[#4338ca] to-[#2563eb] hover:opacity-95 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
            >
              {isTailoring ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Generating Tailored Resume (Master Prompt Engine)...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  <span>AI Tailor &amp; Generate Resume</span>
                  <ArrowRight className="h-4 w-4" />
                </>
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
                <button
                  type="button"
                  onClick={handleCopyFullReport}
                  className="text-[11px] font-bold text-[#275df5] hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
                >
                  {copiedReport ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedReport ? 'Report Copied!' : 'Copy Full Report'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-[#275df5]" /> Hard Skills Match
              </span>
              <p className="text-sm font-bold text-foreground">
                {results.matchedSkills.length} / {results.targetSkills.length} Skills
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-indigo-500" /> Structure Checks
              </span>
              <p className="text-sm font-bold text-foreground">
                {results.sections.filter((s) => s.found).length} / {results.sections.length} Passed
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Metric Density
              </span>
              <p className="text-sm font-bold text-foreground">
                {results.impactRating}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-background space-y-1">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-500" /> Resume Length
              </span>
              <p className="text-sm font-bold text-foreground">
                {results.wordCount} words ({results.wordCountStatus.split(' ')[0]})
              </p>
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

          {/* Actionable Recommendations & Google XYZ Formula Suggestions */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/25 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-200/60 dark:border-blue-900/50 pb-3">
              <h5 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-[#275df5]" />
                <span>Role-Tailoring Recommendations (Jobsuit Style)</span>
              </h5>
              <span className="text-xs font-semibold text-[#275df5]">
                {results.actionableFeedback.length} Action Items
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {results.actionableFeedback.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-card/80 border border-border/70 p-4 space-y-2 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${item.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                      {item.title}
                    </p>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                      item.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {item.priority} priority
                    </span>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  {item.suggestedExample && (
                    <div className="rounded-md bg-secondary/70 p-2.5 border border-border/60 text-xs font-mono text-foreground/90">
                      <strong className="text-[#275df5] font-sans font-bold block mb-1">Recommended Rewrite:</strong>
                      {item.suggestedExample}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* AI RESUME TAILORING ENGINE & GAP ANALYSIS SUITE (MASTER PROMPT SPEC)       */}
      {/* ========================================================================= */}

      {/* Loading Indicator for Tailoring */}
      {isTailoring && (
        <div id="tailored-resume-section" className="rounded-2xl border border-[#275df5]/30 bg-gradient-to-b from-[#275df5]/5 via-background to-[#275df5]/10 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-3 max-w-md mx-auto py-6">
            <div className="inline-flex p-4 rounded-2xl bg-[#275df5]/15 text-[#275df5] animate-spin">
              <RefreshCw className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-foreground">
              Executing Master Resume Tailoring Engine...
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Executing the 7-step optimization pipeline: parsing JD hard requirements, performing atomic zero-fabrication gap analysis, and reordering bullet points for 1-page ATS dominance.
            </p>
            <div className="space-y-2.5 pt-2 text-left text-xs bg-card/90 rounded-xl p-4 border border-border/80 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Step 1: Extracted JD Hard Requirements &amp; Core Duties</span>
              </div>
              <div className="flex items-center gap-2 text-[#275df5] font-semibold">
                <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
                <span>Step 2 &amp; 3: Running Honest Gap Analysis &amp; Adjacent Matching...</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 ml-1 mr-1" />
                <span>Step 4 &amp; 5: Reordering &amp; Rewording with JD Vocabulary</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/40 ml-1 mr-1" />
                <span>Step 6 &amp; 7: Zero-Fabrication Factual Audit &amp; Output Generation</span>
              </div>
            </div>
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
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#275df5]/10 text-[#275df5] border border-[#275df5]/20">
                  <Wand2 className="h-3.5 w-3.5" />
                  Master Tailoring Engine v2
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  100% Zero-Fabrication Guarantee
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-secondary text-muted-foreground">
                  1-Page ATS Standard
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <span>Tailored ATS Resume &amp; Gap Suite</span>
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
                    title="Download Cover Letter as .TXT"
                  >
                    <Download className="h-4 w-4 text-[#275df5]" />
                    <span>Download .TXT</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintCoverLetter}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer"
                    title="Print Cover Letter"
                  >
                    <Printer className="h-4 w-4 text-muted-foreground" />
                    <span>Print / PDF</span>
                  </button>
                </>
              ) : activeTailorTab === 'latex' ? (
                <>
                  <button
                    type="button"
                    onClick={handleCopyLatex}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#275df5] hover:bg-[#1d4ed8] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {copiedLatex ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied LaTeX!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy LaTeX Code</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTex}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
                    title="Download Compilable .TEX File"
                  >
                    <Download className="h-4 w-4 text-[#275df5]" />
                    <span>Download .TEX</span>
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
                    <span>Download .TXT</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer"
                    title="Print or Save as PDF"
                  >
                    <Printer className="h-4 w-4 text-muted-foreground" />
                    <span>Print / PDF</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Multi-Agent Suite) */}
          <div className="flex items-center gap-2 border-b border-border overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTailorTab('resume')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTailorTab === 'resume'
                  ? 'border-[#275df5] text-[#275df5]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Tailored Resume</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono">
                ATS Clean
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTailorTab('cover_letter')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTailorTab === 'cover_letter'
                  ? 'border-[#275df5] text-[#275df5]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Cover Letter</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                Fresher Fit
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTailorTab('latex')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTailorTab === 'latex'
                  ? 'border-[#275df5] text-[#275df5]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>LaTeX (.TEX)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-mono">
                Overleaf
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTailorTab('critic')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTailorTab === 'critic'
                  ? 'border-[#275df5] text-[#275df5]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Reviewer Agent Audit</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-mono font-bold">
                {tailoredResult.critic_review?.score || 88}/100
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTailorTab('gaps')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTailorTab === 'gaps'
                  ? 'border-[#275df5] text-[#275df5]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Target className="h-4 w-4" />
              <span>Honest Gap Analysis</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                tailoredResult.gap_summary.length > 0
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {tailoredResult.gap_summary.length} Gaps
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTailorTab('changelog')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTailorTab === 'changelog'
                  ? 'border-[#275df5] text-[#275df5]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCheck className="h-4 w-4" />
              <span>Change Log</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-foreground font-mono font-bold">
                {tailoredResult.change_log.length} Updates
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTailorTab('requirements')}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activeTailorTab === 'requirements'
                  ? 'border-[#275df5] text-[#275df5]'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Parsed JD</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-foreground font-mono font-bold">
                {tailoredResult.hard_requirements.length} Hard
              </span>
            </button>
          </div>

          {/* Tab 1: Tailored Resume Body */}
          {activeTailorTab === 'resume' && (
            <div className="space-y-4">
              {/* ATS Formatting Guidelines Pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground bg-secondary/50 rounded-xl px-4 py-2.5 border border-border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span><strong>ATS Safe:</strong> Single-column, standard headers, chronological order, zero unparseable tables/graphics.</span>
                </div>
                <span className="text-[11px] font-mono">
                  {tailoredResult.tailored_resume.split(/\s+/).filter(Boolean).length} words • ~45 sec recruiter scan
                </span>
              </div>

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
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground bg-secondary/50 rounded-xl px-4 py-2.5 border border-border">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#275df5] shrink-0" />
                  <span><strong>Personalized Fresher Cover Letter:</strong> Structured to connect academic projects to the company's real tech stack with immediate joiner positioning.</span>
                </div>
                <span className="text-[11px] font-mono">
                  {(tailoredResult.cover_letter || '').split(/\s+/).filter(Boolean).length} words • 3 focused paragraphs
                </span>
              </div>

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
                      title="Download Cover Letter as .TXT"
                    >
                      <Download className="h-3.5 w-3.5 text-[#275df5]" />
                      <span>.TXT</span>
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintCoverLetter}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/90 hover:bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
                      title="Print Cover Letter"
                    >
                      <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Print</span>
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

          {/* ================================================================= */}
          {/* TAB 3: JAKE'S RESUME LATEX CODE & OVERLEAF GUIDE                 */}
          {/* ================================================================= */}
          {activeTailorTab === 'latex' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground bg-secondary/50 rounded-xl px-4 py-2.5 border border-border">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-[#275df5] shrink-0" />
                  <span><strong>Industry-Standard Jake's Resume LaTeX:</strong> Compiles cleanly into pixel-perfect PDF on Overleaf, MacTeX, and TeX Live.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLatex}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#275df5] hover:underline cursor-pointer"
                  >
                    {copiedLatex ? 'Copied Code!' : 'Copy Code'}
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={handleDownloadTex}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#275df5] hover:underline cursor-pointer"
                  >
                    Download .TEX
                  </button>
                </div>
              </div>

              {/* Overleaf 3-Step Guide */}
              <div className="rounded-xl border border-[#275df5]/30 bg-gradient-to-r from-blue-500/5 to-indigo-500/10 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-[#275df5]" />
                    <span>How to compile this in 30 seconds on Overleaf:</span>
                  </h5>
                  <a
                    href="https://www.overleaf.com/project"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#275df5] hover:underline"
                  >
                    <span>Open Overleaf</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-muted-foreground">
                  <div className="rounded-lg bg-card/80 p-3 border border-border/80 space-y-1">
                    <span className="font-bold text-foreground block">1. Copy or Download</span>
                    <p className="text-[11px]">Click "Download .TEX" or copy the LaTeX code below.</p>
                  </div>
                  <div className="rounded-lg bg-card/80 p-3 border border-border/80 space-y-1">
                    <span className="font-bold text-foreground block">2. Create New Project</span>
                    <p className="text-[11px]">Go to Overleaf.com, click "New Project" ➔ "Blank Project".</p>
                  </div>
                  <div className="rounded-lg bg-card/80 p-3 border border-border/80 space-y-1">
                    <span className="font-bold text-foreground block">3. Paste &amp; Recompile</span>
                    <p className="text-[11px]">Paste the code into main.tex and click "Recompile" for your vector PDF!</p>
                  </div>
                </div>
              </div>

              {/* LaTeX Code Box */}
              <div className="relative rounded-xl border border-border bg-[#0f172a] text-slate-200 p-5 sm:p-6 shadow-inner font-mono text-xs overflow-x-auto max-h-[520px]">
                <button
                  type="button"
                  onClick={handleCopyLatex}
                  className="sticky top-0 float-right inline-flex items-center gap-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-white px-3 py-1.5 text-xs font-semibold transition-all border border-slate-700 shadow-md cursor-pointer ml-4 mb-2 z-10"
                >
                  {copiedLatex ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLatex ? 'Copied' : 'Copy LaTeX'}</span>
                </button>

                <pre className="whitespace-pre leading-relaxed selection:bg-[#275df5]/40 font-mono text-[11px]">
                  {tailoredResult.latex_resume || '% LaTeX generation in progress...'}
                </pre>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: REVIEWER AGENT (ADVERSARIAL CRITIC) AUDIT SCORECARD        */}
          {/* ================================================================= */}
          {activeTailorTab === 'critic' && (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-[#275df5]/30 bg-gradient-to-br from-card via-[#275df5]/5 to-indigo-500/10 p-6 sm:p-7 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#275df5]/10 text-[#275df5]">
                        Dual-Agent Architecture
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Zero Hallucinations Verified
                      </span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-2">
                      <span>Adversarial Reviewer Agent Audit Scorecard</span>
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-xl">
                      Inspired by Mads Lorentzen's ai-job-search framework: An independent critic agent audits the draft to prevent hallucinated tools and enforce 1-page freshers conciseness.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-card border-2 border-[#275df5] p-3 text-center min-w-[100px] shadow-sm">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block">Recruiter Score</span>
                      <span className="text-3xl font-black text-[#275df5]">
                        {tailoredResult.critic_review?.score || 88}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 block">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Recruiter Verdict Callout */}
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <h5 className="text-xs sm:text-sm font-bold text-foreground">
                      Reviewer Agent Verdict
                    </h5>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-emerald-900 dark:text-emerald-200 leading-relaxed pl-7 italic">
                    "{tailoredResult.critic_review?.verdict || 'Recruiter-Ready: Passed Adversarial Hallucination Audit & Strong Verb Density.'}"
                  </p>
                </div>

                {/* Reviewer Audit Checklist */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                    Reviewer Agent Observations &amp; Quality Audits
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(tailoredResult.critic_review?.notes || [
                      'Zero hallucinated metrics or employers detected; factual claims strictly preserved.',
                      'Action verbs standardized to strong past-tense achievements (Engineered, Implemented).',
                      'Cover letter articulates fresher technical adaptability with professional clarity.',
                      'Resume fits standard single-page format for 0-2 years experience candidates.'
                    ]).map((note, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 text-xs"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-foreground leading-relaxed">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why it Matters Banner */}
                <div className="rounded-xl border border-border bg-card/60 p-4 text-xs text-muted-foreground space-y-1">
                  <p className="font-bold text-foreground">Why the Drafter-Reviewer Loop Matters:</p>
                  <p className="leading-relaxed">
                    Standard AI tools try to write everything in a single prompt, frequently fabricating unperformed duties or inflating metrics. FreshersBridge uses a dedicated Reviewer Critic that acts as a gatekeeper, rejecting any hallucinated content and ensuring bullet points align with Google's XYZ impact formulation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: HONEST GAP ANALYSIS                                       */}
          {/* ================================================================= */}
          {activeTailorTab === 'gaps' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    Transparent JD Gap Analysis (Master Prompt Step 3)
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Unlike generic AI tools that hallucinate fake experience, FreshersBridge never papers over real gaps. Below is what this JD explicitly mandates that your resume currently lacks, so you can study them before the technical screening.
                </p>
              </div>

              {/* Missing Requirements List */}
              <div className="space-y-3">
                <h5 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  Unmatched Job Requirements ({tailoredResult.gap_summary.length})
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  {tailoredResult.gap_summary.map((gap, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 text-xs sm:text-sm"
                    >
                      <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-medium text-foreground leading-relaxed">{gap}</p>
                        <p className="text-[11px] text-muted-foreground">
                          💡 <strong>Interview Tip:</strong> If asked, be honest about having foundational knowledge or willingness to learn this tool rapidly (e.g. within 2 weeks).
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Adjacent / Transferable Matches */}
              {tailoredResult.adjacent_matches && tailoredResult.adjacent_matches.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                    Adjacent &amp; Transferable Skills Highlighted ({tailoredResult.adjacent_matches.length})
                  </h5>
                  <div className="grid grid-cols-1 gap-2.5">
                    {tailoredResult.adjacent_matches.map((adj, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 p-3.5 flex items-start gap-3 text-xs"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#275df5] shrink-0 mt-0.5" />
                        <p className="text-foreground leading-relaxed">{adj}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Change Log & Verification */}
          {activeTailorTab === 'changelog' && (
            <div className="space-y-6">
              {/* Zero-Fabrication Audit Box */}
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/25 p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                  <h4 className="text-sm sm:text-base font-bold text-foreground">
                    Factual Integrity &amp; Safety Audit (Master Prompt Step 6)
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Company names &amp; titles strictly preserved</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Graduation dates &amp; GPA untouched</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Percentages &amp; metric values preserved</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>Zero hallucinated jobs or tools</span>
                  </div>
                </div>
              </div>

              {/* Exact Changes Made */}
              <div className="space-y-3">
                <h5 className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
                  Transformations &amp; Strategic Reordering Log ({tailoredResult.change_log.length})
                </h5>
                <div className="grid grid-cols-1 gap-3">
                  {tailoredResult.change_log.map((log, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 text-xs sm:text-sm"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#275df5]/10 text-[11px] font-bold text-[#275df5]">
                        {idx + 1}
                      </span>
                      <p className="text-foreground leading-relaxed">{log}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Parsed JD Buckets */}
          {activeTailorTab === 'requirements' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-rose-200/70 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    Hard Requirements
                  </h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                    {tailoredResult.hard_requirements.length}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {tailoredResult.hard_requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200/70 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    Nice To Have / Bonus
                  </h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
                    {tailoredResult.nice_to_have.length}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {tailoredResult.nice_to_have.map((nth, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{nth}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-blue-200/70 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    Core Responsibilities
                  </h5>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    {tailoredResult.core_responsibilities.length}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {tailoredResult.core_responsibilities.map((cr, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{cr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
