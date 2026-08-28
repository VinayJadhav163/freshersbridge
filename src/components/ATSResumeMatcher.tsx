'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Briefcase, 
  RefreshCw, 
  Layers, 
  Target,
  ArrowRight
} from 'lucide-react';

const COMMON_TECH_KEYWORDS = [
  'javascript', 'typescript', 'react', 'next.js', 'node.js', 'python', 'java', 'c++', 'c#',
  'sql', 'postgresql', 'mongodb', 'mysql', 'git', 'github', 'docker', 'aws', 'rest api',
  'html5', 'css3', 'tailwind css', 'data structures', 'algorithms', 'oops', 'dbms',
  'operating systems', 'machine learning', 'ci/cd', 'agile', 'linux', 'unit testing'
];

const SAMPLE_RESUME = `
RAHUL SHARMA
Email: rahul.sharma@example.com | Phone: +91-9876543210 | Bangalore, India
LinkedIn: linkedin.com/in/rahul-sharma-dev | GitHub: github.com/rahul-sharma-dev

EDUCATION
B.E. in Computer Science and Engineering | 2022 - 2026 | CGPA: 8.6/10.0
ABC Institute of Technology, Bangalore

TECHNICAL SKILLS
- Languages: Java, Python, JavaScript, TypeScript, SQL
- Frontend: React.js, Next.js, HTML5, CSS3, Tailwind CSS
- Backend & DB: Node.js, Express, PostgreSQL, MongoDB, RESTful APIs
- Developer Tools: Git, GitHub, Postman, Docker, Vercel

PROJECTS
1. FreshersBridge - Job Search & Application Portal
- Developed a full-stack job board using Next.js, TypeScript, and Supabase for 1,000+ active freshers.
- Implemented real-time search, filters, and background web scrapers in Python, reducing data ingestion latency by 40%.
- Integrated responsive UI with Tailwind CSS and dark mode support.

2. Real-Time Collaborative Whiteboard
- Built an interactive whiteboard using React and WebSockets for simultaneous multi-user sketching.
- Handled state synchronization with Redis and deployed on Vercel.
`;

const SAMPLE_JOB_DESCRIPTION = `
We are looking for an Associate Software Engineer (Full Stack) to join our engineering team.
Requirements:
- Bachelor's degree in Computer Science, IT, or related engineering discipline (2025/2026 batch).
- Strong foundation in Data Structures, Algorithms, and OOPs concepts.
- Proficiency in JavaScript, React.js, Node.js, and RESTful APIs.
- Experience with PostgreSQL, MySQL, or MongoDB database querying.
- Familiarity with Git, GitHub, Docker, and AWS cloud basics.
- Excellent communication and problem-solving mindset.
`;

export default function ATSResumeMatcher() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    detectedSections: { name: string; found: boolean }[];
    wordCount: number;
    recommendations: string[];
  } | null>(null);

  const loadSample = () => {
    setResumeText(SAMPLE_RESUME.trim());
    setJobDescription(SAMPLE_JOB_DESCRIPTION.trim());
  };

  const handleAnalyze = () => {
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const lowerResume = resumeText.toLowerCase();
      const lowerJD = jobDescription.toLowerCase();

      // 1. Extract Target Keywords from JD or fallback to common tech keywords
      let targetKeywords = COMMON_TECH_KEYWORDS.filter(k => lowerJD.includes(k));
      if (targetKeywords.length < 5) {
        // Fallback default skills if JD is short
        targetKeywords = ['java', 'python', 'javascript', 'react', 'sql', 'git', 'oops', 'data structures', 'rest api', 'postgresql'];
      }

      // 2. Identify Matched vs Missing
      const matched = targetKeywords.filter(k => lowerResume.includes(k));
      const missing = targetKeywords.filter(k => !lowerResume.includes(k));

      // 3. Detect standard sections
      const sections = [
        { name: 'Contact Info (Email/Phone)', found: /@|\+91|\d{10}/.test(lowerResume) },
        { name: 'Education Section', found: /education|degree|b\.?e|b\.?tech|mca|bca|college|university/.test(lowerResume) },
        { name: 'Technical Skills Section', found: /skills|technologies|proficiencies|languages/.test(lowerResume) },
        { name: 'Projects Section', found: /projects|academic projects|built|developed/.test(lowerResume) },
        { name: 'Work Experience / Internships', found: /experience|internship|trainee|work history/.test(lowerResume) },
      ];

      // 4. Calculate Score
      const keywordScore = (matched.length / Math.max(targetKeywords.length, 1)) * 60;
      const sectionScore = (sections.filter(s => s.found).length / sections.length) * 30;
      const lengthBonus = lowerResume.split(/\s+/).length >= 150 && lowerResume.split(/\s+/).length <= 600 ? 10 : 5;
      const totalScore = Math.min(Math.round(keywordScore + sectionScore + lengthBonus), 100);

      // 5. Actionable Recommendations
      const recs: string[] = [];
      if (missing.length > 0) {
        recs.push(`Add missing high-demand technical keywords: ${missing.slice(0, 4).join(', ')}.`);
      }
      if (!sections.find(s => s.name.includes('Experience'))?.found) {
        recs.push('Add an "Internships & Open Source" section to demonstrate practical experience.');
      }
      if (!/(\d+%\s*|\d+x\s*|\b\d+\s*users\b|\b\d+\s*ms\b)/i.test(resumeText)) {
        recs.push('Quantify project achievements with metrics (e.g., "improved speed by 35%", "used by 200+ students").');
      }
      if (lowerResume.split(/\s+/).length < 200) {
        recs.push('Resume is relatively short. Expand project bullet points using the Google XYZ formula.');
      } else {
        recs.push('Great single-page word count! Ensure project bullet points start with strong action verbs (Engineered, Built, Implemented).');
      }

      setResults({
        score: totalScore,
        matchedKeywords: matched,
        missingKeywords: missing,
        detectedSections: sections,
        wordCount: lowerResume.split(/\s+/).filter(Boolean).length,
        recommendations: recs,
      });

      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* Input Form Box */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span>Instant ATS Resume Scanner & Matcher</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Paste your resume and target job description to check your ATS compatibility score (100% Client-Side & Private).
            </p>
          </div>

          <button
            type="button"
            onClick={loadSample}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:bg-secondary/80 transition-colors shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
            <span>Load Sample Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Text Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Your Resume Text (Paste Text or Copy-Paste from PDF)</span>
              <span className="text-muted-foreground font-normal">
                {resumeText.split(/\s+/).filter(Boolean).length} words
              </span>
            </label>
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your raw resume text here (Education, Skills, Projects, Experience)..."
              className="w-full h-64 sm:h-72 rounded-xl border border-border bg-background p-4 text-xs sm:text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 leading-relaxed resize-none overflow-y-auto"
            />
          </div>

          {/* Job Description Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>Target Job Description (JD) / Skills</span>
              <span className="text-muted-foreground font-normal">Optional for custom role matching</span>
            </label>
            <textarea
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description or company requirements (e.g. TCS Ninja, Accenture ASE, Frontend Developer)..."
              className="w-full h-64 sm:h-72 rounded-xl border border-border bg-background p-4 text-xs sm:text-sm font-mono text-foreground placeholder:text-muted-foreground focus:border-indigo-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 leading-relaxed resize-none overflow-y-auto"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!resumeText.trim() || isAnalyzing}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Scanning Resume against ATS Filters...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze ATS Match Score</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Dashboard */}
      {results && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-border pb-6">
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-foreground">ATS Compatibility Report</h4>
              <p className="text-xs text-muted-foreground">
                Evaluation based on keyword frequency, standard section detection, and format parsing.
              </p>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Overall Match</p>
                <p className="text-3xl font-black text-foreground">{results.score}%</p>
              </div>
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-sm ${
                results.score >= 80 ? 'bg-emerald-600' : results.score >= 60 ? 'bg-amber-500' : 'bg-rose-600'
              }`}>
                {results.score >= 80 ? 'A+' : results.score >= 60 ? 'B' : 'C'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matched Keywords */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Matched Keywords
                </span>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-emerald-700 dark:text-emerald-300">
                  {results.matchedKeywords.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {results.matchedKeywords.map((k) => (
                  <span key={k} className="rounded-md bg-emerald-50 dark:bg-emerald-950/80 px-2 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60">
                    ✓ {k}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Missing Keywords
                </span>
                <span className="rounded-full bg-amber-50 dark:bg-amber-950 px-2 py-0.5 text-amber-700 dark:text-amber-300">
                  {results.missingKeywords.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {results.missingKeywords.length > 0 ? (
                  results.missingKeywords.map((k) => (
                    <span key={k} className="rounded-md bg-amber-50 dark:bg-amber-950/80 px-2 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60">
                      + {k}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">All target core keywords present!</p>
                )}
              </div>
            </div>

            {/* Detected Sections */}
            <div className="rounded-xl border border-border bg-background p-4 space-y-3">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-indigo-600" /> Structure Checks
              </p>
              <div className="space-y-1.5 text-xs">
                {results.detectedSections.map((sec) => (
                  <div key={sec.name} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{sec.name}</span>
                    {sec.found ? (
                      <span className="font-bold text-emerald-600">Found</span>
                    ) : (
                      <span className="font-bold text-rose-600">Missing</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Recommendations Box */}
          <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 p-5 space-y-3">
            <h5 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Recommended Fixes to Boost ATS Pass Rate:</span>
            </h5>
            <ul className="space-y-2 text-xs sm:text-sm text-foreground/90 font-medium pl-1">
              {results.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
