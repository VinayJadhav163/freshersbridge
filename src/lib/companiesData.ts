export interface CompanyProfile {
  slug: string;
  name: string;
  shortName: string;
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
        package: '₹3.36 LPA (UG) / ₹3.53 LPA (PG)',
        description: 'Entry-level engineering track focusing on software maintenance, testing, and full-stack development.',
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
    ],
    relatedGuideSlug: 'tcs-nqt-2026-complete-syllabus-exam-pattern-preparation-guide',
  },
  {
    slug: 'infosys',
    name: 'Infosys Limited',
    shortName: 'Infosys',
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
    ],
    relatedGuideSlug: 'infosys-sp-dse-2026-recruitment-process-syllabus-coding-guide',
  },
  {
    slug: 'accenture',
    name: 'Accenture',
    shortName: 'Accenture',
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
    ],
    relatedGuideSlug: 'accenture-recruitment-process-syllabus-coding-questions-freshers',
  },
  {
    slug: 'wipro',
    name: 'Wipro Limited',
    shortName: 'Wipro',
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
        package: 'Stipend + M.Tech sponsorship from BITS Pilani',
        description: 'Exclusive 4-year higher education and employment program for BCA and B.Sc graduates.',
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
    ],
    relatedGuideSlug: 'wipro-elite-nth-2026-syllabus-exam-pattern-coding-preparation',
  },
  {
    slug: 'cognizant',
    name: 'Cognizant Technology Solutions',
    shortName: 'Cognizant',
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
    ],
    relatedGuideSlug: 'cognizant-genc-elevate-2026-exam-pattern-interview-blueprint',
  },
  {
    slug: 'capgemini',
    name: 'Capgemini',
    shortName: 'Capgemini',
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
    ],
  },
];

export function getCompanyBySlug(slug: string): CompanyProfile | undefined {
  return COMPANIES_DATA.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllCompanySlugs(): string[] {
  return COMPANIES_DATA.map((c) => c.slug);
}
