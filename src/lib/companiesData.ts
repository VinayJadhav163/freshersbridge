export interface CompanyProfile {
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  category: string;
  headquarters: string;
  website: string;
  careersUrl: string;
  salaryRange: string;
  eligibility: string;
  eligibleBatches: string[];
  hiringTracks: {
    title: string;
    package: string;
    description: string;
  }[];
  selectionProcess: string[];
  overview: string;
  frequentlyAsked: {
    question: string;
    answer: string;
  }[];
  relatedGuideSlug?: string;
}

export const COMPANIES_DATA: CompanyProfile[] = [
  {
    slug: 'tcs',
    name: 'Tata Consultancy Services',
    shortName: 'TCS',
    logo: '/companies/tcs.png',
    category: 'IT Services & Consulting',
    headquarters: 'Mumbai, Maharashtra',
    website: 'https://www.tcs.com',
    careersUrl: 'https://www.tcs.com/careers/india',
    salaryRange: '₹3.36 LPA - ₹9.0 LPA',
    eligibility: 'B.E / B.Tech / M.E / M.Tech / MCA / M.Sc (60% or 6.0 CGPA throughout 10th, 12th, and Degree)',
    eligibleBatches: ['2024', '2025', '2026'],
    hiringTracks: [
      {
        title: 'TCS Ninja',
        package: '₹3.36 - ₹3.53 LPA',
        description: 'Entry-level engineering track (₹3.36 LPA for B.E/B.Tech, ₹3.53 LPA for M.E/M.Tech/MCA) focusing on software maintenance, testing, and full-stack development.',
      },
      {
        title: 'TCS Digital',
        package: '₹7.0 LPA - ₹7.3 LPA',
        description: 'Elite track for high scorers in advanced coding focusing on AI/ML, Cloud, IoT, and NextGen tech.',
      },
      {
        title: 'TCS Prime',
        package: '₹9.0 LPA - ₹11.5 LPA',
        description: 'Premium software development track reserved for exceptional competitive programmers.',
      },
    ],
    selectionProcess: [
      'TCS NQT Online Cognitive Test (Numerical, Verbal, Reasoning)',
      'Advanced Quantitative Aptitude & Coding Round',
      'Technical Interview (Data Structures, OOP, Project Discussion)',
      'Managerial & HR Round',
    ],
    overview:
      'Tata Consultancy Services (TCS) is India’s largest IT multinational and the biggest recruiter of engineering freshers. Through the annual TCS National Qualifier Test (NQT) and off-campus drives, TCS hires thousands of college graduates annually across Ninja, Digital, and Prime engineering bands.',
    frequentlyAsked: [
      {
        question: 'Is TCS NQT score valid for other companies?',
        answer: 'Yes! Your TCS NQT score card is recognized by hundreds of corporate partners on the TCS iON portal in addition to TCS hiring.',
      },
      {
        question: 'Can non-CS students apply for TCS Digital?',
        answer: 'Yes, students from any engineering stream (Circuit and Non-Circuit) can qualify for TCS Digital by clearing the advanced coding round.',
      },
      {
        question: 'What is the maximum allowed academic gap for TCS?',
        answer: 'TCS typically permits up to 24 months (2 years) of overall education gap with valid justification.',
      },
      {
        question: 'Does TCS have a service agreement or bond for freshers?',
        answer: 'TCS requires candidates joining the Ninja and Digital streams to sign a 1-year service agreement (bond) of ₹50,000 applicable from the date of joining.',
      },
      {
        question: 'Can a candidate upgrade from TCS Ninja to TCS Digital after joining?',
        answer: 'Yes! TCS holds internal qualification tests like Elevate Wings 1 and digital competency assessments twice a year, enabling Ninja engineers to double their package to Digital/Prime within 12-18 months.',
      },
    ],
    relatedGuideSlug: 'tcs-nqt-2026-complete-syllabus-exam-pattern-preparation-guide',
  },
  {
    slug: 'infosys',
    name: 'Infosys Limited',
    shortName: 'Infosys',
    logo: '/companies/infosys.png',
    category: 'IT Services & Digital Transformation',
    headquarters: 'Bengaluru, Karnataka',
    website: 'https://www.infosys.com',
    careersUrl: 'https://www.infosys.com/careers',
    salaryRange: '₹3.6 LPA - ₹9.5 LPA',
    eligibility: 'B.E / B.Tech / M.E / M.Tech / MCA / M.Sc (Minimum 65% or 6.5 CGPA in graduation)',
    eligibleBatches: ['2024', '2025', '2026'],
    hiringTracks: [
      {
        title: 'Systems Engineer (SE)',
        package: '₹3.6 LPA',
        description: 'Foundation software development and IT infrastructure services across global client engagements.',
      },
      {
        title: 'Digital Specialist Engineer (DSE)',
        package: '₹6.25 LPA',
        description: 'Focused on Cloud Architecture, Microservices, React/Angular, and modern DevOps pipelines.',
      },
      {
        title: 'Specialist Programmer (SP)',
        package: '₹9.5 LPA',
        description: 'Power programmer role requiring advanced algorithmic problem solving and dynamic programming skills.',
      },
    ],
    selectionProcess: [
      'Infosys Online Test (Reasoning, Mathematical, Verbal, Pseudocode, Puzzle Solving)',
      'Infosys HackWithInfy / SP Coding Assessment (for higher bands)',
      'Technical Interview (Core CS, DBMS, SQL, Projects)',
      'HR Interview',
    ],
    overview:
      'Infosys is a global leader in next-generation digital services and consulting. Its fresher recruitment program is famous for the Mysore Training Campus—the largest corporate university in the world. Freshers are hired through campus drives, InfyTQ, and HackWithInfy hackathons.',
    frequentlyAsked: [
      {
        question: 'How can freshers crack the ₹9.5 LPA Specialist Programmer role at Infosys?',
        answer: 'By participating in HackWithInfy or clearing the Advanced Coding assessment with strong mastery in Trees, Graphs, and Dynamic Programming.',
      },
      {
        question: 'Does Infosys require previous work experience for Systems Engineer?',
        answer: 'No, Systems Engineer is strictly an entry-level role designed for final-year college students and recent graduates.',
      },
      {
        question: 'What is the passing criteria for Mysore campus training?',
        answer: 'Trainees must score a minimum of 65% across Generic and Stream-specific assessments. You get two re-attempts if you fail a module.',
      },
      {
        question: 'What is the bond and service agreement duration at Infosys?',
        answer: 'Infosys typically mandates a 1-year service agreement from the date of joining with a nominal recovery clause if broken during probation.',
      },
    ],
    relatedGuideSlug: 'infosys-sp-dse-2026-recruitment-process-syllabus-coding-guide',
  },
  {
    slug: 'accenture',
    name: 'Accenture',
    shortName: 'Accenture',
    logo: '/companies/accenture.png',
    category: 'Professional Services & Consulting',
    headquarters: 'Dublin, Ireland (Global) / Bengaluru (India)',
    website: 'https://www.accenture.com',
    careersUrl: 'https://www.accenture.com/in-en/careers',
    salaryRange: '₹4.5 LPA - ₹11.0 LPA',
    eligibility: 'All Engineering Streams, MCA, M.Sc (Computer Science / IT) with 65% or 6.5 CGPA',
    eligibleBatches: ['2024', '2025', '2026'],
    hiringTracks: [
      {
        title: 'Associate Software Engineer (ASE)',
        package: '₹4.5 LPA',
        description: 'Primary fresher role involving enterprise application development, cloud platforms, and support.',
      },
      {
        title: 'Advanced Associate Software Engineer (AASE)',
        package: '₹6.5 LPA',
        description: 'High-performance engineering track with direct involvement in generative AI and cloud architectures.',
      },
      {
        title: 'System and Application Services Associate',
        package: '₹3.4 LPA - ₹4.0 LPA',
        description: 'Open to B.Sc, BCA, and non-engineering graduates for technology operational services.',
      },
    ],
    selectionProcess: [
      'Cognitive and Technical Assessment (60 questions on English, Critical Thinking, Abstract Reasoning, Pseudo-code, Networking & Cloud)',
      'Coding Assessment (2 coding challenges in C, C++, Java, or Python)',
      'Communication Assessment (Automated AI speaking, listening, and reading test)',
      'Virtual Technical & HR Interview',
    ],
    overview:
      'Accenture is one of the world’s leading technology consultancy firms. In India, Accenture hires tens of thousands of engineering freshers annually for its ASE and AASE roles through nationwide off-campus drives and on-campus recruitments.',
    frequentlyAsked: [
      {
        question: 'Is the Accenture Communication Assessment an elimination round?',
        answer: 'Yes! The communication round tests pronunciation, fluency, and comprehension, and is mandatory to advance to the interview stage.',
      },
      {
        question: 'Can 2024 and 2025 passouts apply for Accenture off-campus drives?',
        answer: 'Yes, Accenture regularly launches national off-campus hiring drives for recent batch graduates.',
      },
      {
        question: 'How is a candidate selected for AASE (₹6.5 LPA) instead of ASE (₹4.5 LPA)?',
        answer: 'Candidates who score exceptionally high in the cognitive assessment and solve both coding questions with optimal time complexity are shortlisted for the AASE track.',
      },
      {
        question: 'Does Accenture allow changing job locations after selection?',
        answer: 'Job location preference is taken during onboarding, but initial allocation depends on project demand across major hubs like Bengaluru, Hyderabad, Pune, Gurgaon, and Chennai.',
      },
    ],
    relatedGuideSlug: 'accenture-recruitment-process-syllabus-coding-questions-freshers',
  },
  {
    slug: 'wipro',
    name: 'Wipro Limited',
    shortName: 'Wipro',
    logo: '/companies/wipro.png',
    category: 'Information Technology & Consulting',
    headquarters: 'Bengaluru, Karnataka',
    website: 'https://www.wipro.com',
    careersUrl: 'https://careers.wipro.com',
    salaryRange: '₹3.5 LPA - ₹6.5 LPA',
    eligibility: 'B.E / B.Tech / 5-Year Integrated-M.Tech with 60% or 6.0 CGPA throughout 10th, 12th, and Degree',
    eligibleBatches: ['2024', '2025', '2026'],
    hiringTracks: [
      {
        title: 'Wipro Elite (Project Engineer)',
        package: '₹3.5 LPA',
        description: 'Flagship engineering onboarding track hired through National Talent Hunt (NTH).',
      },
      {
        title: 'Wipro Turbo',
        package: '₹6.5 LPA',
        description: 'Upgraded role offered to top performers in Elite training with strong programming and problem-solving skills.',
      },
      {
        title: 'Wipro WILP (Work Integrated Learning Program)',
        package: 'M.Tech + Stipend',
        description: 'Exclusive 4-year higher education and employment program for BCA and B.Sc graduates with employer-sponsored M.Tech from BITS Pilani.',
      },
    ],
    selectionProcess: [
      'Online Aptitude Test (Logical Reasoning, Quantitative Ability, Verbal English)',
      'Written Communication Test (Essay Writing evaluated by automated NLP)',
      'Online Coding Test (2 programming problems)',
      'Combined Technical & HR Interview',
    ],
    overview:
      'Wipro Limited is a top-tier Indian multinational corporation that provides information technology, consulting, and business process services. Through its Elite National Talent Hunt (NTH), Wipro provides equal opportunities to engineering talent across Tier 1, 2, and 3 colleges in India.',
    frequentlyAsked: [
      {
        question: 'What is the Wipro Essay Writing assessment?',
        answer: 'Candidates must write a 200-400 word essay on a current social or technical topic within 20 minutes, evaluated on grammar, coherence, and spelling.',
      },
      {
        question: 'Can BCA students apply for Wipro?',
        answer: 'Yes! BCA and B.Sc students can apply for the Wipro WILP program which includes an employer-sponsored M.Tech degree from BITS Pilani.',
      },
      {
        question: 'What is the service agreement duration at Wipro for Elite freshers?',
        answer: 'Wipro Project Engineers have a 12-month service agreement of ₹75,000 applicable upon starting full-time onboarding.',
      },
      {
        question: 'Which programming languages are supported in the Wipro coding assessment?',
        answer: 'Candidates can write code in Java, Python, C++, or C. Python and Java are the most popular choices among candidates.',
      },
    ],
    relatedGuideSlug: 'wipro-elite-nth-2026-syllabus-exam-pattern-coding-preparation',
  },
  {
    slug: 'cognizant',
    name: 'Cognizant Technology Solutions',
    shortName: 'Cognizant',
    logo: '/companies/cognizant.png',
    category: 'IT Services & Digital Engineering',
    headquarters: 'Teaneck, New Jersey (Global) / Chennai (India)',
    website: 'https://www.cognizant.com',
    careersUrl: 'https://careers.cognizant.com/global/en',
    salaryRange: '₹4.0 LPA - ₹9.0 LPA',
    eligibility: 'B.E / B.Tech / M.E / M.Tech / MCA (60% or 6.0 CGPA minimum)',
    eligibleBatches: ['2024', '2025', '2026'],
    hiringTracks: [
      {
        title: 'GenC',
        package: '₹4.0 LPA',
        description: 'Foundational entry-level engineering role involving core software programming and digital technology enablement.',
      },
      {
        title: 'GenC Elevate',
        package: '₹4.5 LPA - ₹5.0 LPA',
        description: 'Targeted for students demonstrating strong proficiency in full-stack web technologies or cloud services.',
      },
      {
        title: 'GenC Next',
        package: '₹6.75 LPA - ₹9.0 LPA',
        description: 'Elite engineering track for candidates with exceptional competitive programming, AI, and algorithmic skills.',
      },
    ],
    selectionProcess: [
      'Cognizant Skill Assessment (Aptitude, Analytical Thinking, English Comprehension)',
      'Technical / Coding Assessment (Pseudocode, Algorithm optimization)',
      'Technical Interview (Data structures, OOPS, DBMS, Mini projects)',
      'HR Discussion',
    ],
    overview:
      'Cognizant is one of the world’s leading professional services companies, transforming clients’ business, operating, and technology models for the digital era. Its GenC hiring ecosystem offers structured career progression paths from associate developer to tech lead.',
    frequentlyAsked: [
      {
        question: 'What is the difference between Cognizant GenC and GenC Next?',
        answer: 'GenC focuses on fundamental programming at 4.0 LPA, while GenC Next tests advanced data structures and algorithms offering packages up to 9.0 LPA.',
      },
      {
        question: 'What is covered in the Cognizant technical interview?',
        answer: 'The interviewer tests OOP concepts (Inheritance, Polymorphism), basic SQL queries (JOINs, Group By), data structure fundamentals (Arrays, Linked Lists), and questions about your academic final-year project.',
      },
      {
        question: 'Can candidates from non-IT branches apply for Cognizant GenC?',
        answer: 'Yes, graduates from Mechanical, Civil, Electrical, and other non-CS engineering branches are eligible provided they have basic coding proficiency and meet the minimum CGPA criterion.',
      },
      {
        question: 'Does Cognizant offer internships before full-time joining?',
        answer: 'Yes, Cognizant regularly rolls out paid 3 to 6-month pre-onboarding internships with stipends ranging from ₹12,000 to ₹18,000/month for selected college freshers.',
      },
    ],
    relatedGuideSlug: 'cognizant-genc-elevate-2026-exam-pattern-interview-blueprint',
  },
  {
    slug: 'capgemini',
    name: 'Capgemini',
    shortName: 'Capgemini',
    logo: '/companies/capgemini.svg',
    category: 'IT Consulting & Engineering Services',
    headquarters: 'Paris, France / Mumbai (India HQ)',
    website: 'https://www.capgemini.com',
    careersUrl: 'https://www.capgemini.com/in-en/careers',
    salaryRange: '₹4.25 LPA - ₹7.5 LPA',
    eligibility: 'B.E / B.Tech / MCA / M.Sc (50% or 55%+ aggregate)',
    eligibleBatches: ['2024', '2025', '2026'],
    hiringTracks: [
      {
        title: 'Analyst (Software Engineer)',
        package: '₹4.25 LPA',
        description: 'Core software design, application development, and client delivery.',
      },
      {
        title: 'Senior Analyst',
        package: '₹7.5 LPA',
        description: 'Higher engineering cadre for students excelling in the advanced coding and algorithmic challenge.',
      },
    ],
    selectionProcess: [
      'Technical Assessment (Pseudocode & Data Structures)',
      'English Communication Test',
      'Game-Based Aptitude Assessment (4 interactive cognitive mini-games)',
      'Coding Round',
      'Technical & HR Interview',
    ],
    overview:
      'Capgemini is a global leader in partnering with companies to transform and manage their business through technology. Freshers love Capgemini for its unique game-based aptitude evaluations and rapid digital skilling programs.',
    frequentlyAsked: [
      {
        question: 'What is Capgemini Game-Based Aptitude?',
        answer: 'Capgemini tests memory, inductive reasoning, motion challenge, and grid challenge through 4 gamified modules instead of traditional math MCQs.',
      },
      {
        question: 'How do I prepare for the Capgemini Pseudocode round?',
        answer: 'Focus on recursion tracing, bitwise operations (AND, OR, XOR), loop invariants, and operator precedence in C/C++ pseudo-syntax.',
      },
      {
        question: 'What is the passing score for the Capgemini online assessment?',
        answer: 'Each section (Pseudocode, English, Game Aptitude, Coding) has sectional cutoffs (typically around 65-70%). Clearing all sections without negative marking is required.',
      },
      {
        question: 'What is the package difference between Analyst and Senior Analyst at Capgemini?',
        answer: 'Analysts receive ₹4.25 LPA, while candidates who clear the secondary advanced coding round receive Senior Analyst offers at ₹7.5 LPA.',
      },
    ],
  },
];

export function getCompanyBySlug(slug: string): CompanyProfile | undefined {
  return COMPANIES_DATA.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllCompanySlugs(): string[] {
  return COMPANIES_DATA.map((c) => c.slug);
}

// Clean company name to get clean domain slug
// Color palette generator for elegant, crisp initial avatars
const AVATAR_COLOR_PALETTES = [
  'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60',
  'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/60',
  'bg-violet-50 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300 border-violet-200/80 dark:border-violet-800/60',
  'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60',
  'bg-teal-50 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300 border-teal-200/80 dark:border-teal-800/60',
  'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200/80 dark:border-cyan-800/60',
  'bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60',
  'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60',
];

export function getCompanyColor(name: string): string {
  if (!name) return AVATAR_COLOR_PALETTES[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLOR_PALETTES.length;
  return AVATAR_COLOR_PALETTES[index];
}

// Clean company name for brand matching
function getCleanCompanySlug(companyName: string): string {
  if (!companyName) return '';
  let clean = companyName.toLowerCase().trim();
  const drops = [
    'pvt', 'ltd', 'limited', 'technologies', 'technology', 'solutions',
    'services', 'inc', 'corp', 'corporation', 'llc', 'india', 'private',
    'careers', 'jobs', 'hiring', 'software'
  ];
  for (const drop of drops) {
    clean = clean.replace(new RegExp(`\\b${drop}\\b`, 'gi'), '').trim();
  }
  return clean.replace(/[^a-z0-9]/g, '');
}

// Verified official brand logos: mapped to local high-res assets or official vector CDNs
const VERIFIED_OFFICIAL_LOGOS: Record<string, string> = {
  // IT Giants & Top Campus Recruiters (Local verified assets)
  tcs: '/companies/tcs.png',
  'tata consultancy': '/companies/tcs.png',
  'tata consultancy services': '/companies/tcs.png',
  infosys: '/companies/infosys.png',
  wipro: '/companies/wipro.png',
  cognizant: '/companies/cognizant.png',
  accenture: '/companies/accenture.png',
  capgemini: '/companies/capgemini.svg',
  ibm: '/companies/ibm.svg',
  deloitte: '/companies/deloitte.svg',

  // Tech Giants & Hardware
  microsoft: '/companies/microsoft.svg',
  amazon: '/companies/amazon.svg',
  google: '/companies/google.svg',
  cisco: '/companies/cisco.svg',
  qualcomm: '/companies/qualcomm.svg',
  fujitsu: '/companies/fujitsu.svg',
  intel: '/companies/intel.svg',
  nvidia: '/companies/nvidia.svg',
  samsung: '/companies/samsung.svg',
  dell: '/companies/dell.svg',
  hp: '/companies/hp.svg',
  siemens: '/companies/siemens.svg',
  bosch: '/companies/bosch.svg',
  sap: '/companies/sap.svg',
  oracle: 'https://cdn.simpleicons.org/oracle',
  adobe: 'https://cdn.simpleicons.org/adobe',
  salesforce: 'https://cdn.simpleicons.org/salesforce',
  servicenow: 'https://cdn.simpleicons.org/servicenow',
  apple: 'https://cdn.simpleicons.org/apple',
  meta: 'https://cdn.simpleicons.org/meta',
  netflix: 'https://cdn.simpleicons.org/netflix',
  honeywell: 'https://cdn.simpleicons.org/honeywell',
  alstom: 'https://cdn.simpleicons.org/alstom',
  hcl: 'https://cdn.simpleicons.org/hcl',
  hcltech: 'https://cdn.simpleicons.org/hcl',

  // Big 4 & Advisory
  pwc: 'https://cdn.simpleicons.org/pwc',
  ey: 'https://cdn.simpleicons.org/ernstandyoung',
  kpmg: 'https://cdn.simpleicons.org/kpmg',

  // Banking & Fintech
  goldmansachs: '/companies/goldmansachs.svg',
  'goldman sachs': '/companies/goldmansachs.svg',
  barclays: '/companies/barclays.svg',
  hsbc: '/companies/hsbc.svg',
  mastercard: '/companies/mastercard.svg',
  visa: '/companies/visa.svg',
  paypal: '/companies/paypal.svg',
  stripe: '/companies/stripe.svg',
  paytm: '/companies/paytm.svg',
  phonepe: '/companies/phonepe.svg',
  razorpay: '/companies/razorpay.svg',
  zerodha: '/companies/zerodha.svg',
  citi: 'https://cdn.simpleicons.org/citi',
  ubs: 'https://cdn.simpleicons.org/ubs',

  // Unicorns & Product Leaders
  swiggy: '/companies/swiggy.svg',
  zomato: '/companies/zomato.svg',
  zoho: '/companies/zoho.svg',
  postman: '/companies/postman.svg',
  atlassian: '/companies/atlassian.svg',
  uber: '/companies/uber.svg',
  spotify: '/companies/spotify.svg',
};

// Global helper to find authentic company logo with strict zero-false-positive matching
export function getCompanyLogo(companyNameOrSlug: string): string | null {
  if (!companyNameOrSlug) return null;
  const raw = companyNameOrSlug.toLowerCase().trim();
  const clean = raw.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = clean.split(' ').filter(Boolean);
  const slug = getCleanCompanySlug(raw);

  // 1. Defined curated company profile match (exact official logo)
  const matched = COMPANIES_DATA.find(
    (c) =>
      c.slug === raw ||
      c.slug === slug ||
      c.shortName.toLowerCase() === raw ||
      c.name.toLowerCase() === raw ||
      raw.startsWith(c.shortName.toLowerCase() + ' ') ||
      raw.startsWith(c.name.toLowerCase() + ' ')
  );
  if (matched) return matched.logo;

  // 2. Strict exact match on clean company name or slug
  if (VERIFIED_OFFICIAL_LOGOS[clean]) return VERIFIED_OFFICIAL_LOGOS[clean];
  if (slug && VERIFIED_OFFICIAL_LOGOS[slug]) return VERIFIED_OFFICIAL_LOGOS[slug];

  // 3. Exact first-word brand match (e.g. "Cisco Systems", "Intel Technologies", "Honeywell India", "Siemens Healthineers")
  const firstWord = words[0];
  if (firstWord && firstWord.length >= 3 && VERIFIED_OFFICIAL_LOGOS[firstWord]) {
    return VERIFIED_OFFICIAL_LOGOS[firstWord];
  }

  // 4. Two-word brand match (e.g. "Goldman Sachs India", "Tata Consultancy Services")
  if (words.length >= 2) {
    const firstTwo = `${words[0]} ${words[1]}`;
    if (VERIFIED_OFFICIAL_LOGOS[firstTwo]) return VERIFIED_OFFICIAL_LOGOS[firstTwo];
  }

  // If not a strictly verified brand, return null so JobCard safely renders the beautiful initial badge
  return null;
}

