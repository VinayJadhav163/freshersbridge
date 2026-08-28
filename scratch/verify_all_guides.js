const http = require('http');

const guides = [
  {
    slug: 'tcs-nqt-2026-complete-syllabus-exam-pattern-preparation-guide',
    tocIds: ['overview', 'exam-pattern', 'syllabus-breakdown', 'coding-section', 'preparation-strategy', 'interview-rounds']
  },
  {
    slug: 'accenture-recruitment-process-syllabus-coding-questions-freshers',
    tocIds: ['hiring-tracks', 'selection-process', 'cognitive-technical-syllabus', 'coding-questions', 'communication-round', 'interview-prep']
  },
  {
    slug: 'top-50-java-interview-questions-answers-freshers-2026',
    tocIds: ['oops-foundations', 'memory-management', 'strings-immutability', 'collections-framework', 'exception-handling', 'java-8-features']
  },
  {
    slug: 'top-50-python-interview-questions-coding-freshers',
    tocIds: ['python-basics', 'list-dict-tuples', 'decorators-generators', 'args-kwargs', 'top-coding-problems']
  },
  {
    slug: 'ats-friendly-resume-guide-tech-freshers-with-examples',
    tocIds: ['how-ats-works', 'resume-formatting-rules', 'project-bullet-points', 'technical-skills-section', 'action-verbs', 'free-template-checklist']
  },
  {
    slug: 'cognizant-genc-vs-genc-elevate-vs-genc-next-syllabus-guide',
    tocIds: ['genc-tiers', 'assessment-structure', 'syllabus-by-tier', 'interview-tips']
  },
  {
    slug: 'sql-interview-questions-queries-freshers-data-software-roles',
    tocIds: ['nth-highest-salary', 'duplicate-records', 'sql-joins-hierarchy', 'window-functions', 'indexing-transactions']
  },
  {
    slug: 'full-stack-web-development-roadmap-college-students',
    tocIds: ['month-1-frontend-basics', 'month-2-javascript-mastery', 'month-3-react-ecosystem', 'month-4-backend-database', 'month-5-fullstack-frameworks', 'month-6-portfolio-deployment']
  },
  {
    slug: 'hr-interview-questions-answers-for-freshers-with-best-responses',
    tocIds: ['tell-me-about-yourself', 'strengths-weaknesses', 'why-our-company', 'handling-failures', 'asking-hr-questions']
  },
  {
    slug: 'off-campus-placement-drive-strategy-for-tier-3-college-students',
    tocIds: ['mindset-shift', 'linkedin-networking', 'github-portfolio', 'off-campus-timing', 'daily-routine']
  }
];

async function run() {
  console.log('--- Verifying All 10 Guide Pages & TOC Anchors ---');
  let allPass = true;

  for (const g of guides) {
    await new Promise((resolve) => {
      http.get('http://localhost:3000/guides/' + g.slug, (res) => {
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => {
          const missingIds = g.tocIds.filter(id => !body.includes('id="' + id + '"'));
          if (res.statusCode === 200 && missingIds.length === 0) {
            console.log(`[PASS] ${g.slug.slice(0, 45)}... (Status: ${res.statusCode}, TOC Anchors: ${g.tocIds.length}/${g.tocIds.length})`);
          } else {
            console.error(`[FAIL] ${g.slug} Status: ${res.statusCode}, Missing IDs:`, missingIds);
            allPass = false;
          }
          resolve();
        });
      }).on('error', (e) => {
        console.error(`[ERR] ${g.slug}:`, e.message);
        allPass = false;
        resolve();
      });
    });
  }

  console.log('--------------------------------------------------');
  console.log(allPass ? '>>> ALL 10 GUIDES & TOC ANCHORS VERIFIED 100% <<<' : '>>> SOME FAILURES DETECTED <<<');
}

run();
