/**
 * Comprehensive Tech & Industry Skill Taxonomy for Freshers & Entry-Level Engineers
 * Includes Canonical Skill definitions, Alias mappings (e.g. GenAI <-> Generative AI),
 * and domain coverage across Software Engineering, Data Analytics, Data Engineering,
 * Cloud, AI/ML, and Core CS Fundamentals.
 */

export interface TaxonomyCategory {
  name: string;
  skills: string[];
}

export interface CanonicalSkill {
  id: string;
  label: string;
  aliases: string[];
}

/**
 * High-precision Canonical Skill definitions with synonyms and abbreviation aliases.
 * This guarantees that variant expressions (e.g., 'GenAI' vs 'Generative AI', 'Power BI' vs 'PowerBI')
 * are correctly linked and evaluated.
 */
export const CANONICAL_SKILLS: CanonicalSkill[] = [
  // --- Data Analytics, BI & Visualization ---
  {
    id: 'tableau',
    label: 'Tableau',
    aliases: ['tableau', 'tableau desktop', 'tableau server', 'tableau public', 'tableau dashboard', 'tableau dashboards'],
  },
  {
    id: 'power_bi',
    label: 'Power BI',
    aliases: ['power bi', 'powerbi', 'power-bi', 'dax', 'power query'],
  },
  {
    id: 'data_analysis',
    label: 'Data Analysis',
    aliases: ['data analysis', 'data analytics', 'data analyst', 'analyzing datasets', 'analyze datasets', 'analyze large datasets', 'analyzing large datasets'],
  },
  {
    id: 'data_visualization',
    label: 'Data Visualization',
    aliases: ['data visualization', 'data visualisations', 'dashboard development', 'dashboarding', 'visualizations', 'dashboards'],
  },
  {
    id: 'calculated_fields',
    label: 'Calculated Fields',
    aliases: ['calculated fields', 'calculated field', 'complex calculations', 'table calculations', 'calculations', 'custom metrics'],
  },
  {
    id: 'reporting',
    label: 'Reporting & Dashboards',
    aliases: ['reporting', 'data reporting', 'bi reporting', 'dashboard reporting', 'reports'],
  },
  {
    id: 'excel',
    label: 'Excel',
    aliases: ['excel', 'advanced excel', 'microsoft excel', 'ms excel', 'vlookup', 'pivot tables', 'xlookup'],
  },
  {
    id: 'business_intelligence',
    label: 'Business Intelligence',
    aliases: ['business intelligence', 'bi', 'bi tools', 'looker', 'metabase', 'superset'],
  },

  // --- Data Engineering, Warehousing & ETL ---
  {
    id: 'etl',
    label: 'ETL / ELT',
    aliases: ['etl', 'elt', 'etl/elt', 'etl processes', 'etl process', 'etl pipeline', 'etl-style', 'extract transform load'],
  },
  {
    id: 'data_transformation',
    label: 'Data Transformation',
    aliases: ['data transformation', 'transforming data', 'data cleaning and transformation', 'data cleaning', 'transformations'],
  },
  {
    id: 'data_preparation',
    label: 'Data Preparation',
    aliases: ['data preparation', 'data prep', 'preparation', 'preparing data', 'data wrangling'],
  },
  {
    id: 'data_validation',
    label: 'Data Validation',
    aliases: ['data validation', 'validating data', 'data quality', 'data integrity', 'data checks'],
  },
  {
    id: 'data_modeling',
    label: 'Data Modeling',
    aliases: ['data modeling', 'data modelling', 'data models', 'data model', 'dimensional modeling', 'star schema', 'snowflake schema', 'er diagram', 'er modeling'],
  },
  {
    id: 'data_warehousing',
    label: 'Data Warehousing',
    aliases: ['data warehousing', 'data warehouse', 'data warehouses', 'dwh', 'edw', 'lakehouse', 'data lake'],
  },
  {
    id: 'dbt',
    label: 'DBT',
    aliases: ['dbt', 'data build tool'],
  },
  {
    id: 'relational_databases',
    label: 'Relational Databases',
    aliases: ['relational databases', 'relational database', 'rdbms', 'relational data models', 'relational data'],
  },
  {
    id: 'sql_joins',
    label: 'SQL Joins',
    aliases: ['joins', 'sql joins', 'inner join', 'outer join', 'left join', 'right join', 'table joins'],
  },
  {
    id: 'large_datasets',
    label: 'Large Datasets',
    aliases: ['large datasets', 'large dataset', 'massive datasets', 'high volume data', 'big data', 'high-volume datasets'],
  },
  {
    id: 'data_pipelines',
    label: 'Data Pipelines',
    aliases: ['data pipeline', 'data pipelines', 'pipeline development', 'pipeline architecture'],
  },
  {
    id: 'snowflake',
    label: 'Snowflake',
    aliases: ['snowflake', 'snowflake data warehouse'],
  },
  {
    id: 'databricks',
    label: 'Databricks',
    aliases: ['databricks', 'delta lake'],
  },
  {
    id: 'apache_spark',
    label: 'Apache Spark',
    aliases: ['spark', 'apache spark', 'pyspark'],
  },
  {
    id: 'airflow',
    label: 'Apache Airflow',
    aliases: ['airflow', 'apache airflow'],
  },
  {
    id: 'kafka',
    label: 'Apache Kafka',
    aliases: ['kafka', 'apache kafka'],
  },

  // --- Generative AI, LLMs & Machine Learning ---
  {
    id: 'generative_ai',
    label: 'Generative AI',
    aliases: [
      'generative ai', 'genai', 'gen ai', 'gen-ai',
      'generative artificial intelligence', 'genai/llm', 'gen-ai/llm',
      'generative-ai', 'ai-driven', 'ai driven'
    ],
  },
  {
    id: 'llm',
    label: 'LLM (Large Language Models)',
    aliases: [
      'llm', 'llms', 'large language model', 'large language models',
      'llm integrations', 'llm integration', 'genai/llm'
    ],
  },
  {
    id: 'rag',
    label: 'RAG',
    aliases: ['rag', 'retrieval-augmented generation', 'retrieval augmented generation'],
  },
  {
    id: 'prompt_engineering',
    label: 'Prompt Engineering',
    aliases: ['prompt engineering', 'prompt optimization', 'prompt design'],
  },
  {
    id: 'langchain',
    label: 'LangChain',
    aliases: ['langchain', 'langgraph', 'llamaindex'],
  },
  {
    id: 'machine_learning',
    label: 'Machine Learning',
    aliases: ['machine learning', 'ml', 'scikit-learn', 'supervised learning', 'unsupervised learning'],
  },
  {
    id: 'deep_learning',
    label: 'Deep Learning',
    aliases: ['deep learning', 'neural networks', 'dl', 'pytorch', 'tensorflow', 'keras'],
  },
  {
    id: 'nlp',
    label: 'NLP',
    aliases: ['nlp', 'natural language processing', 'text processing', 'hugging face'],
  },
  {
    id: 'computer_vision',
    label: 'Computer Vision',
    aliases: ['computer vision', 'cv', 'opencv', 'image processing'],
  },
  {
    id: 'pandas_numpy',
    label: 'Pandas & NumPy',
    aliases: ['pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn'],
  },

  // --- Programming Languages ---
  {
    id: 'python',
    label: 'Python',
    aliases: ['python', 'python3', 'python development'],
  },
  {
    id: 'sql',
    label: 'SQL',
    aliases: ['sql', 'complex sql', 'sql queries', 'mysql', 'postgresql', 'postgres', 't-sql', 'pl/sql', 'sqlite', 'structured query language'],
  },
  {
    id: 'java',
    label: 'Java',
    aliases: ['java', 'core java', 'java 8', 'java 11', 'java 17', 'java 21'],
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    aliases: ['javascript', 'js', 'es6', 'ecmascript'],
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    aliases: ['typescript', 'ts'],
  },
  {
    id: 'cpp',
    label: 'C++',
    aliases: ['c++', 'cpp'],
  },
  {
    id: 'csharp',
    label: 'C#',
    aliases: ['c#', 'csharp', '.net', 'dotnet'],
  },
  {
    id: 'golang',
    label: 'Go (Golang)',
    aliases: ['golang', 'go language'],
  },
  {
    id: 'rust',
    label: 'Rust',
    aliases: ['rust'],
  },

  // --- Software Engineering & Operations ---
  {
    id: 'performance_optimization',
    label: 'Performance Optimization',
    aliases: [
      'performance optimization', 'performance tuning', 'performance troubleshooting',
      'query optimization', 'optimizing performance', 'speed optimization', 'tuning'
    ],
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting',
    aliases: ['troubleshooting', 'troubleshoot', 'root cause analysis', 'debugging', 'issue resolution'],
  },
  {
    id: 'data_structures',
    label: 'Data Structures & Algorithms',
    aliases: ['data structures', 'algorithms', 'dsa', 'data structures and algorithms', 'data structures & algorithms'],
  },
  {
    id: 'oops',
    label: 'OOPs (Object Oriented Programming)',
    aliases: ['oops', 'oop', 'object-oriented programming', 'object oriented programming'],
  },
  {
    id: 'dbms',
    label: 'DBMS',
    aliases: ['dbms', 'database management systems', 'database management'],
  },
  {
    id: 'system_design',
    label: 'System Design',
    aliases: ['system design', 'high level design', 'low level design', 'hld', 'lld'],
  },

  // --- Web & Cloud Frameworks ---
  {
    id: 'react',
    label: 'React',
    aliases: ['react', 'react.js', 'reactjs'],
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    aliases: ['next.js', 'nextjs', 'next'],
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    aliases: ['node.js', 'nodejs', 'node'],
  },
  {
    id: 'express',
    label: 'Express.js',
    aliases: ['express.js', 'express'],
  },
  {
    id: 'spring_boot',
    label: 'Spring Boot',
    aliases: ['spring boot', 'spring framework', 'spring'],
  },
  {
    id: 'rest_api',
    label: 'RESTful APIs',
    aliases: ['rest api', 'rest apis', 'restful api', 'restful apis', 'api development', 'api integration'],
  },
  {
    id: 'docker',
    label: 'Docker',
    aliases: ['docker', 'containerization', 'containers', 'dockerfile'],
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    aliases: ['kubernetes', 'k8s'],
  },
  {
    id: 'cicd',
    label: 'CI/CD Pipelines',
    aliases: ['ci/cd', 'ci cd', 'cicd', 'continuous integration', 'continuous delivery', 'github actions', 'jenkins'],
  },
  {
    id: 'git',
    label: 'Git & Version Control',
    aliases: ['git', 'github', 'version control', 'gitlab'],
  },
  {
    id: 'aws',
    label: 'AWS',
    aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
  },
  {
    id: 'azure',
    label: 'Azure',
    aliases: ['azure', 'microsoft azure'],
  },
  {
    id: 'gcp',
    label: 'Google Cloud (GCP)',
    aliases: ['gcp', 'google cloud', 'google cloud platform', 'bigquery'],
  },
];

export const ATS_TAXONOMY: TaxonomyCategory[] = [
  {
    name: 'Programming Languages',
    skills: [
      'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'golang',
      'rust', 'kotlin', 'swift', 'php', 'ruby', 'dart', 'scala', 'r', 'sql', 'pl/sql', 't-sql'
    ],
  },
  {
    name: 'Data Analytics & Business Intelligence',
    skills: [
      'tableau', 'power bi', 'excel', 'advanced excel', 'looker', 'metabase',
      'data visualization', 'dashboard development', 'calculated fields',
      'business intelligence', 'reporting', 'dax', 'data analysis', 'large datasets'
    ],
  },
  {
    name: 'Data Engineering, ETL & Storage',
    skills: [
      'etl', 'elt', 'dbt', 'data warehousing', 'data modeling', 'data transformation',
      'data preparation', 'data validation', 'relational databases', 'joins',
      'sql queries', 'data pipeline', 'data pipelines', 'snowflake', 'databricks',
      'bigquery', 'redshift', 'apache spark', 'spark', 'pyspark', 'hadoop', 'airflow', 'kafka'
    ],
  },
  {
    name: 'Generative AI, LLMs & AI/ML',
    skills: [
      'generative ai', 'genai', 'llm', 'large language models', 'rag',
      'prompt engineering', 'langchain', 'llamaindex', 'machine learning',
      'deep learning', 'artificial intelligence', 'nlp', 'computer vision',
      'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'matplotlib'
    ],
  },
  {
    name: 'Frontend Development',
    skills: [
      'react', 'react.js', 'next.js', 'nextjs', 'vue.js', 'vue', 'angular', 'svelte',
      'html', 'html5', 'css', 'css3', 'tailwind css', 'tailwindcss', 'bootstrap',
      'sass', 'scss', 'redux', 'zustand', 'vite', 'webpack', 'responsive design',
      'ui/ux', 'dom manipulation'
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
    name: 'Computer Science Fundamentals & Engineering',
    skills: [
      'data structures', 'algorithms', 'dsa', 'oops', 'object-oriented programming',
      'dbms', 'database management systems', 'operating systems', 'computer networks',
      'system design', 'problem solving', 'complexity analysis', 'time complexity',
      'space complexity', 'multithreading', 'concurrency', 'troubleshooting',
      'performance optimization', 'unit testing', 'agile', 'debugging'
    ],
  },
];

// All normalized flat skills for fast lookup
export const ALL_TECH_SKILLS = Array.from(
  new Set([
    ...ATS_TAXONOMY.flatMap((cat) => cat.skills.map((s) => s.toLowerCase())),
    ...CANONICAL_SKILLS.flatMap((cs) => cs.aliases.map((a) => a.toLowerCase())),
    ...CANONICAL_SKILLS.map((cs) => cs.label.toLowerCase()),
  ])
);

// High-impact Action Verbs
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

/**
 * Robust skill matcher that accounts for word boundaries and punctuation boundaries (like /, -, (, ))
 * e.g., 'GenAI/LLM-driven' accurately matches 'genai' and 'llm'
 */
export function matchSkillInText(text: string, aliases: string[]): boolean {
  for (const alias of aliases) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
    if (regex.test(text)) {
      return true;
    }
  }
  return false;
}
