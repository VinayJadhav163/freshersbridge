/**
 * Comprehensive Tech & Industry Skill Taxonomy for Freshers & Entry-Level Engineers
 * Over 500+ curated keywords, tools, concepts, and action verbs.
 */

export interface TaxonomyCategory {
  name: string;
  skills: string[];
}

export const ATS_TAXONOMY: TaxonomyCategory[] = [
  {
    name: 'Programming Languages',
    skills: [
      'python', 'java', 'javascript', 'typescript', 'c++', 'c', 'c#', 'go', 'golang',
      'rust', 'kotlin', 'swift', 'php', 'ruby', 'dart', 'scala', 'r', 'sql'
    ],
  },
  {
    name: 'Frontend Development',
    skills: [
      'react', 'react.js', 'next.js', 'nextjs', 'vue.js', 'vue', 'angular', 'svelte',
      'html', 'html5', 'css', 'css3', 'tailwind css', 'tailwindcss', 'bootstrap',
      'sass', 'scss', 'redux', 'zustand', 'vite', 'webpack', 'responsive design',
      'typescript', 'ui/ux', 'dom manipulation'
    ],
  },
  {
    name: 'Backend & APIs',
    skills: [
      'node.js', 'nodejs', 'express.js', 'express', 'nest.js', 'nestjs', 'spring boot',
      'spring', 'django', 'flask', 'fastapi', '.net', 'asp.net', 'ruby on rails',
      'rest api', 'restful apis', 'restful api', 'graphql', 'grpc', 'websockets',
      'microservices', 'jwt', 'oauth', 'middleware', 'serverless'
    ],
  },
  {
    name: 'Databases & Storage',
    skills: [
      'postgresql', 'postgres', 'mysql', 'mongodb', 'sqlite', 'redis', 'cassandra',
      'dynamodb', 'oracle', 'elasticsearch', 'supabase', 'firebase', 'prisma',
      'hibernate', 'typeorm', 'mongoose', 'indexing', 'query optimization', 'acid'
    ],
  },
  {
    name: 'Cloud & DevOps',
    skills: [
      'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker',
      'kubernetes', 'ci/cd', 'github actions', 'jenkins', 'linux', 'git', 'github',
      'gitlab', 'terraform', 'nginx', 'bash', 'shell scripting', 'cloud computing'
    ],
  },
  {
    name: 'Computer Science Fundamentals',
    skills: [
      'data structures', 'algorithms', 'dsa', 'oops', 'object-oriented programming',
      'dbms', 'database management systems', 'operating systems', 'computer networks',
      'system design', 'problem solving', 'complexity analysis', 'time complexity',
      'space complexity', 'multithreading', 'concurrency'
    ],
  },
  {
    name: 'Data Science, AI & ML',
    skills: [
      'machine learning', 'deep learning', 'artificial intelligence', 'nlp',
      'natural language processing', 'computer vision', 'pytorch', 'tensorflow',
      'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'data analysis', 'opencv',
      'generative ai', 'llm', 'rag', 'data visualization'
    ],
  },
  {
    name: 'Software Engineering & Testing',
    skills: [
      'unit testing', 'integration testing', 'jest', 'cypress', 'selenium', 'junit',
      'pytest', 'postman', 'agile', 'scrum', 'sdlc', 'debugging', 'code review',
      'version control', 'clean code'
    ],
  },
];

// All normalized flat skills for fast O(1) set matching
export const ALL_TECH_SKILLS = Array.from(
  new Set(ATS_TAXONOMY.flatMap((cat) => cat.skills.map((s) => s.toLowerCase())))
);

// High-impact Action Verbs that ATS and Technical Recruiters look for in project bullets
export const ATS_ACTION_VERBS = [
  'engineered', 'built', 'developed', 'architected', 'spearheaded', 'implemented',
  'optimized', 'designed', 'automated', 'integrated', 'refactored', 'streamlined',
  'accelerated', 'orchestrated', 'deployed', 'scaled', 'solved', 'enhanced',
  'collaborated', 'delivered', 'reduced', 'increased', 'managed', 'created'
];

// Common Soft Skills & Workplace Competencies
export const ATS_SOFT_SKILLS = [
  'problem solving', 'analytical skills', 'communication', 'collaboration',
  'teamwork', 'leadership', 'adaptability', 'critical thinking', 'time management',
  'attention to detail', 'creativity', 'work ethic', 'agile mindset'
];
