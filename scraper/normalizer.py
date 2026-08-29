"""
FreshersBridge Data Normalizer & Classifier
Maps raw job data from scrapers into standardized FreshersBridge schema.
Ensures accurate locations, rich job descriptions, and deep skills extraction.
"""
import re
from typing import Dict, List, Any

# Category slug mapping based on title/description keywords
CATEGORY_MAPPING = {
    'web-development': [
        'frontend', 'front-end', 'front end', 'junior frontend', 'react', 'next.js', 'angular', 'vue', 'html', 'css', 
        'web developer', 'junior web developer', 'web development', 'full stack', 'fullstack', 'junior full stack',
        'node.js', 'javascript', 'typescript', 'ui/ux', 'ui developer', 'junior ui', 'mern', 'mean', 'tailwind', 
        'bootstrap', 'php developer', 'laravel', 'wordpress developer', 'web application developer'
    ],
    'software-development': [
        'software engineer', 'junior software engineer', 'software developer', 'junior software developer', 
        'software development intern', 'software engineer trainee', 'sde', 'associate software engineer', 
        'graduate software engineer', 'application developer', 'junior application', 'backend developer', 
        'junior backend', 'java developer', 'junior java', 'python developer', 'junior python', 'c++', 
        'junior c++', 'c#', 'junior c#', '.net', 'asp.net', 'golang', 'rust', 'api developer', 'mobile developer', 
        'android developer', 'junior android', 'ios developer', 'junior ios', 'flutter developer', 'junior flutter', 
        'react native', 'game developer', 'junior game'
    ],
    'data-analytics': [
        'data analyst', 'junior data analyst', 'business intelligence analyst', 'bi analyst', 'business analyst', 
        'data visualization', 'tableau developer', 'power bi', 'reporting analyst', 'mis analyst', 'data quality', 
        'data scientist', 'junior data scientist', 'data scientist trainee', 'data science intern', 
        'machine learning', 'junior machine learning', 'ml intern', 'ai engineer', 'junior ai', 'ai prompt', 
        'ai/ml analyst', 'analytics associate', 'data analytics associate', 'research data analyst', 'nlp', 'llm'
    ],
    'devops-cloud': [
        'cloud support', 'cloud operations', 'devops', 'junior devops', 'devops trainee', 'devops intern', 
        'cloud engineer', 'junior cloud engineer', 'cloud administrator', 'junior cloud administrator', 
        'systems administrator', 'linux system administrator', 'linux administrator', 'infrastructure support', 
        'site reliability', 'sre', 'platform support', 'cloud security', 'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'ci/cd'
    ],
    'qa-testing': [
        'qa manual tester', 'manual tester', 'manual test engineer', 'test engineer', 'junior test engineer', 
        'qa engineer', 'qa engineer trainee', 'software tester', 'quality analyst', 'qa analyst', 'test analyst', 
        'automation qa', 'automation test engineer', 'junior automation', 'selenium tester', 'selenium automation', 
        'playwright tester', 'playwright automation', 'qa automation intern', 'software testing intern', 
        'mobile app tester', 'game tester', 'api tester', 'performance testing', 'test automation engineer'
    ],
    'database-administration': [
        'database administrator', 'junior database administrator', 'dba', 'database operations', 'database support', 
        'database analyst', 'sql developer', 'junior sql developer', 'sql support', 'database developer', 
        'junior database developer', 'database engineer', 'mysql developer', 'postgresql developer', 
        'oracle database', 'oracle dba', 'database support engineer', 'database operations analyst', 'mongodb'
    ]
}

# Master Skill Dictionary with exact Regex pattern and Standard Display Name
SKILL_PATTERNS = [
    # Programming Languages
    (r'\bpython\b', 'Python'),
    (r'\bjava\b(?!script)', 'Java'),
    (r'\bjavascript\b|\bjs\b', 'JavaScript'),
    (r'\btypescript\b|\bts\b', 'TypeScript'),
    (r'\bc\+\+\b', 'C++'),
    (r'\bc#\b|\bc\s*sharp\b', 'C#'),
    (r'\b(golang|go\s+language)\b', 'Go (Golang)'),
    (r'\brust\b', 'Rust'),
    (r'\bphp\b', 'PHP'),
    (r'\bruby\b', 'Ruby'),
    (r'\bkotlin\b', 'Kotlin'),
    (r'\bswift\b', 'Swift'),
    (r'\bdart\b', 'Dart'),
    (r'\bscala\b', 'Scala'),
    (r'\br\s+programming\b|\br\s+language\b', 'R'),
    (r'\b(shell\s*scripting|bash|powershell)\b', 'Shell Scripting'),
    
    # Frontend & Web Technologies
    (r'\breact(\.js)?\b', 'React'),
    (r'\bnext(\.js)?\b', 'Next.js'),
    (r'\bangular(\.js)?\b', 'Angular'),
    (r'\bvue(\.js)?\b', 'Vue.js'),
    (r'\bsvelte\b', 'Svelte'),
    (r'\bhtml5?\b', 'HTML5'),
    (r'\bcss3?\b', 'CSS3'),
    (r'\btailwind(\s*css)?\b', 'Tailwind CSS'),
    (r'\bbootstrap\b', 'Bootstrap'),
    (r'\bredux\b', 'Redux'),
    (r'\bsass\b|\bscss\b', 'Sass/SCSS'),
    (r'\bjquery\b', 'jQuery'),
    (r'\bui\s*/\s*ux\b|\bweb\s*design\b', 'UI/UX Design'),
    (r'\bfrontend\b|\bfront\s*end\b', 'Frontend Development'),
    (r'\bfull\s*stack\b|\bfullstack\b', 'Full Stack Development'),
    (r'\bbackend\b|\bback\s*end\b', 'Backend Development'),
    
    # Backend Frameworks & APIs
    (r'\bnode(\.js)?\b', 'Node.js'),
    (r'\bexpress(\.js)?\b', 'Express.js'),
    (r'\bdjango\b', 'Django'),
    (r'\bflask\b', 'Flask'),
    (r'\bfastapi\b', 'FastAPI'),
    (r'\bspring\s*boot\b|\bspring\s*framework\b', 'Spring Boot'),
    (r'\bhibernate\b', 'Hibernate'),
    (r'\b(\.net|\.net\s*core|asp\.net)\b', '.NET Core'),
    (r'\blaravel\b', 'Laravel'),
    (r'\bruby\s*on\s*rails\b|\brails\b', 'Ruby on Rails'),
    (r'\bnest(\.js)?\b', 'NestJS'),
    (r'\brest(ful)?\s*api[s]?\b|\brest\s*api[s]?\b', 'REST APIs'),
    (r'\bgraphql\b', 'GraphQL'),
    (r'\bmicroservices\b', 'Microservices'),
    (r'\bgrpc\b', 'gRPC'),
    
    # Databases & Caching
    (r'\bsql\b', 'SQL'),
    (r'\bmysql\b', 'MySQL'),
    (r'\bpostgresql\b|\bpostgres\b', 'PostgreSQL'),
    (r'\bmongodb\b|\bmongo\b', 'MongoDB'),
    (r'\boracle\s*(db|database)?\b', 'Oracle DB'),
    (r'\bsql\s*server\b|\bmssql\b', 'SQL Server'),
    (r'\bsqlite\b', 'SQLite'),
    (r'\bredis\b', 'Redis'),
    (r'\bcassandra\b', 'Cassandra'),
    (r'\bdynamodb\b', 'DynamoDB'),
    (r'\belasticsearch\b', 'Elasticsearch'),
    (r'\bfirebase\b', 'Firebase'),
    (r'\bsupabase\b', 'Supabase'),
    
    # Cloud & DevOps
    (r'\baws\b|\bamazon\s*web\s*services\b', 'AWS'),
    (r'\bazure\b|\bmicrosoft\s*azure\b', 'Azure'),
    (r'\bgcp\b|\bgoogle\s*cloud(\s*platform)?\b', 'GCP'),
    (r'\bdocker\b', 'Docker'),
    (r'\bkubernetes\b|\bk8s\b', 'Kubernetes'),
    (r'\bci\s*/\s*cd\b|\bci-cd\b|\bcontinuous\s*integration\b', 'CI/CD'),
    (r'\bjenkins\b', 'Jenkins'),
    (r'\bterraform\b', 'Terraform'),
    (r'\bansible\b', 'Ansible'),
    (r'\blinux\b|\bunix\b|\bubuntu\b', 'Linux'),
    (r'\bdevops\b', 'DevOps'),
    (r'\bgit\b|\bgithub\b|\bgitlab\b', 'Git / GitHub'),
    
    # AI / Machine Learning & Data Analytics
    (r'\bmachine\s*learning\b|\bml\b', 'Machine Learning'),
    (r'\bdeep\s*learning\b|\bdl\b', 'Deep Learning'),
    (r'\b(artificial\s*intelligence|\bai\b|genai|generative\s*ai|llm|llms)\b', 'Artificial Intelligence (AI)'),
    (r'\bnlp\b|\bnatural\s*language\s*processing\b', 'NLP'),
    (r'\bcomputer\s*vision\b|\bcv\b', 'Computer Vision'),
    (r'\bpytorch\b', 'PyTorch'),
    (r'\btensorflow\b', 'TensorFlow'),
    (r'\bscikit-learn\b|\bsklearn\b', 'Scikit-Learn'),
    (r'\bpandas\b', 'Pandas'),
    (r'\bnumpy\b', 'NumPy'),
    (r'\bdata\s*science\b|\bdata\s*scientist\b', 'Data Science'),
    (r'\bdata\s*analytics\b|\bdata\s*analyst\b', 'Data Analytics'),
    (r'\bdata\s*engineering\b|\betl\b', 'Data Engineering'),
    (r'\bpower\s*bi\b', 'Power BI'),
    (r'\btableau\b', 'Tableau'),
    (r'\bexcel\b|\badvanced\s*excel\b', 'MS Excel'),
    (r'\blangchain\b|\bllamaindex\b', 'LangChain / LLM Tools'),
    
    # QA & Software Testing
    (r'\bselenium\b', 'Selenium'),
    (r'\bcypress\b', 'Cypress'),
    (r'\bplaywright\b', 'Playwright'),
    (r'\bjunit\b|\bpytest\b|\btestng\b', 'Unit Testing'),
    (r'\bpostman\b|\bapi\s*testing\b', 'Postman / API Testing'),
    (r'\bmanual\s*testing\b', 'Manual Testing'),
    (r'\bautomation\s*testing\b|\bqa\s*automation\b', 'Automation Testing'),
    (r'\bqa\b|\bquality\s*assurance\b|\bsoftware\s*testing\b', 'Software Testing'),
    (r'\bjira\b', 'JIRA'),
    
    # Mobile App Development
    (r'\bandroid\b', 'Android Development'),
    (r'\bios\b', 'iOS Development'),
    (r'\breact\s*native\b', 'React Native'),
    (r'\bflutter\b', 'Flutter'),
    
    # Specialized Domains
    (r'\bsalesforce\b|\bapex\b', 'Salesforce'),
    (r'\bsap\b', 'SAP'),
    (r'\bcybersecurity\b|\binformation\s*security\b', 'Cybersecurity'),
    (r'\bembedded\s*systems\b|\biot\b', 'Embedded Systems / IoT'),
    (r'\b(wi-fi|wifi|wireless|802\.11|wlan|802\.1x)\b', 'Wireless / Wi-Fi Technologies'),
    (r'\b(signal\s*processing|dsp|digital\s*signal\s*processing)\b', 'Digital Signal Processing (DSP)'),
    # IT Support, Operations & Networking
    (r'\b(technical\s*support|tech\s*support|desktop\s*support|it\s*support)\b', 'Technical Support'),
    (r'\b(troubleshooting|issue\s*resolution|defect\s*resolution)\b', 'Troubleshooting'),
    (r'\b(servicenow|remedy|zendesk)\b', 'ServiceNow / Helpdesk'),
    (r'\b(firewall|vpn|dns|dhcp|routing|ip\s*address|lan/wan)\b', 'Network Configuration & Security'),
    (r'\b(nas|ftp|storage|backup)\b', 'Storage & Systems (NAS/FTP)'),
    (r'\b(mis\s*reporting|reporting|documentation)\b', 'MIS Reporting & Documentation'),
    (r'\b(vendor\s*management|sourcing|procurement)\b', 'Vendor Management'),
    (r'\b(project\s*coordination|project\s*management)\b', 'Project Coordination'),
    (r'\b(networking|tcp/ip|routing|switching)\b', 'Computer Networks'),
    
    # Core Fundamentals & Methodologies
    (r'\b(data\s*structures|algorithms|dsa)\b', 'Data Structures & Algorithms (DSA)'),
    (r'\b(object\s*oriented|oops?)\b', 'OOP Concepts'),
    (r'\bsystem\s*design\b', 'System Design'),
    (r'\bagile\b|\bscrum\b', 'Agile / Scrum'),
    (r'\bproblem\s*solving\b', 'Problem Solving')
]

# Indian Tech City Standard Mapping
CITY_MAP = {
    'bangalore': 'Bangalore, Karnataka, India',
    'bengaluru': 'Bangalore, Karnataka, India',
    'hyderabad': 'Hyderabad, Telangana, India',
    'secunderabad': 'Hyderabad, Telangana, India',
    'pune': 'Pune, Maharashtra, India',
    'khed': 'Pune, Maharashtra, India',
    'ranjangaon': 'Pune, Maharashtra, India',
    'jejuri': 'Pune, Maharashtra, India',
    'hinjewadi': 'Pune, Maharashtra, India',
    'mumbai': 'Mumbai, Maharashtra, India',
    'navi mumbai': 'Navi Mumbai, Maharashtra, India',
    'thane': 'Thane, Maharashtra, India',
    'gurugram': 'Gurugram, Haryana, India',
    'gurgaon': 'Gurugram, Haryana, India',
    'noida': 'Noida, Uttar Pradesh, India',
    'greater noida': 'Greater Noida, Uttar Pradesh, India',
    'delhi': 'Delhi NCR, India',
    'new delhi': 'Delhi NCR, India',
    'chennai': 'Chennai, Tamil Nadu, India',
    'kolkata': 'Kolkata, West Bengal, India',
    'ahmedabad': 'Ahmedabad, Gujarat, India',
    'gandhinagar': 'Gandhinagar, Gujarat, India',
    'kochi': 'Kochi, Kerala, India',
    'cochin': 'Kochi, Kerala, India',
    'trivandrum': 'Thiruvananthapuram, Kerala, India',
    'thiruvananthapuram': 'Thiruvananthapuram, Kerala, India',
    'indore': 'Indore, Madhya Pradesh, India',
    'jaipur': 'Jaipur, Rajasthan, India',
    'chandigarh': 'Chandigarh, India',
    'coimbatore': 'Coimbatore, Tamil Nadu, India',
    'bhubaneswar': 'Bhubaneswar, Odisha, India',
    'nagpur': 'Nagpur, Maharashtra, India'
}

# State Code & Name Mapping
STATE_MAP = {
    'ka': 'Bangalore, Karnataka, India',
    'karnataka': 'Bangalore, Karnataka, India',
    'mh': 'Mumbai / Pune, Maharashtra, India',
    'maharashtra': 'Maharashtra, India',
    'ts': 'Hyderabad, Telangana, India',
    'tg': 'Hyderabad, Telangana, India',
    'telangana': 'Hyderabad, Telangana, India',
    'tn': 'Chennai, Tamil Nadu, India',
    'tamil nadu': 'Chennai, Tamil Nadu, India',
    'dl': 'Delhi NCR, India',
    'delhi': 'Delhi NCR, India',
    'new delhi': 'Delhi NCR, India',
    'hr': 'Gurugram, Haryana, India',
    'haryana': 'Gurugram, Haryana, India',
    'up': 'Noida, Uttar Pradesh, India',
    'uttar pradesh': 'Noida, Uttar Pradesh, India',
    'wb': 'Kolkata, West Bengal, India',
    'west bengal': 'Kolkata, West Bengal, India',
    'gj': 'Ahmedabad, Gujarat, India',
    'gujarat': 'Ahmedabad, Gujarat, India',
    'kl': 'Kochi, Kerala, India',
    'kerala': 'Kochi, Kerala, India',
    'ap': 'Andhra Pradesh, India',
    'andhra pradesh': 'Andhra Pradesh, India',
    'mp': 'Indore, Madhya Pradesh, India',
    'madhya pradesh': 'Indore, Madhya Pradesh, India',
    'rj': 'Jaipur, Rajasthan, India',
    'rajasthan': 'Jaipur, Rajasthan, India',
    'pb': 'Chandigarh / Punjab, India',
    'punjab': 'Chandigarh / Punjab, India',
    'ch': 'Chandigarh, India',
    'ga': 'Goa, India'
}

def classify_category(title: str, description: str = "") -> str:
    """Classifies job into one of the standard FreshersBridge categories."""
    title_lower = title.lower()
    for cat_slug, keywords in CATEGORY_MAPPING.items():
        if any(kw in title_lower for kw in keywords):
            return cat_slug
            
    text = (title + " " + description).lower()
    for cat_slug, keywords in CATEGORY_MAPPING.items():
        if any(kw in text for kw in keywords):
            return cat_slug
            
    return 'software-development'

def extract_skills(title: str, description: str = "", raw_keywords: list = None) -> str:
    """Extracts high-precision technical skills from title, JD, and source keywords."""
    combined_text = f"{title} {description}".lower()
    skills = []
    
    # Include raw keywords from portal if provided
    if raw_keywords and isinstance(raw_keywords, list):
        for kw in raw_keywords:
            if isinstance(kw, str) and len(kw.strip()) > 1:
                clean_kw = kw.strip()
                if clean_kw not in skills:
                    skills.append(clean_kw)
                    
    # Match against regex patterns
    for pattern, display_name in SKILL_PATTERNS:
        if re.search(pattern, combined_text, re.IGNORECASE):
            if display_name not in skills:
                skills.append(display_name)
                
    # Contextual role-based skill enhancement
    title_lower = title.lower()
    if 'full stack' in title_lower or 'fullstack' in title_lower:
        for s in ['Full Stack Development', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git / GitHub']:
            if s not in skills: skills.append(s)
    elif 'frontend' in title_lower or 'front end' in title_lower or 'web dev' in title_lower:
        for s in ['Frontend Development', 'JavaScript', 'HTML5', 'CSS3', 'React']:
            if s not in skills: skills.append(s)
    elif 'backend' in title_lower or 'back end' in title_lower:
        for s in ['Backend Development', 'REST APIs', 'SQL', 'Data Structures & Algorithms (DSA)']:
            if s not in skills: skills.append(s)
    elif 'data analyst' in title_lower or 'analytics' in title_lower:
        for s in ['Data Analytics', 'SQL', 'Python', 'MS Excel', 'Power BI']:
            if s not in skills: skills.append(s)
    elif 'data scientist' in title_lower or 'machine learning' in title_lower or 'ai intern' in title_lower or 'ai developer' in title_lower:
        for s in ['Python', 'Machine Learning', 'Artificial Intelligence (AI)', 'Pandas', 'NumPy']:
            if s not in skills: skills.append(s)
    elif 'qa' in title_lower or 'test' in title_lower or 'tester' in title_lower:
        for s in ['Software Testing', 'Manual Testing', 'Automation Testing', 'Selenium', 'Postman / API Testing']:
            if s not in skills: skills.append(s)
    elif 'devops' in title_lower or 'cloud' in title_lower:
        for s in ['DevOps', 'AWS', 'Docker', 'Linux', 'CI/CD']:
            if s not in skills: skills.append(s)
    elif 'salesforce' in title_lower:
        for s in ['Salesforce', 'CRM', 'Apex']:
            if s not in skills: skills.append(s)
    elif 'intern' in title_lower or 'trainee' in title_lower or 'graduate' in title_lower:
        for s in ['Problem Solving', 'Data Structures & Algorithms (DSA)', 'Git / GitHub']:
            if s not in skills: skills.append(s)

    if not skills:
        skills = ['Problem Solving', 'Data Structures & Algorithms (DSA)', 'Computer Networks', 'OOP Concepts']
        
    # Deduplicate preserving order
    seen = set()
    deduped = []
    for s in skills:
        clean = s.strip()
        if clean.lower() not in seen:
            seen.add(clean.lower())
            deduped.append(clean)
            
    return ", ".join(deduped[:8])

def sanitize_text(text: str, is_company: bool = False) -> str:
    """Cleans up encoding artifacts, mojibake (e.g. Â®, â€™), and corrupt characters."""
    if not text:
        return ""
        
    t = str(text)
    
    # 1. Repair common UTF-8 / Latin-1 Mojibake artifacts
    mojibake_replacements = [
        ('Â®', '®'),
        ('Â©', '©'),
        ('â„¢', '™'),
        ('â€™', "'"),
        ('â€˜', "'"),
        ('â€œ', '"'),
        ('â€\x9d', '"'),
        ('â€', '"'),
        ('â€“', '-'),
        ('â€”', '-'),
        ('â‚¹', '₹'),
        ('Â₹', '₹'),
        ('Â', '')
    ]
    for bad, good in mojibake_replacements:
        t = t.replace(bad, good)
        
    # 2. For company names, strip trailing and inline legal marks (®, ™, ©, etc.)
    if is_company:
        t = re.sub(r'[\s®™©]+$', '', t)
        t = re.sub(r'[\s\(\[\{]?(?:®|™|©|\(R\)|\(TM\))[\)\]\}]?', '', t)
        
    # 3. Clean broken question mark artifacts like "?IAM?Engineer" or unicode replacements
    t = t.replace('\ufffd', ' ').replace('\u200b', '')
    t = re.sub(r'^\?+|\?+$', '', t)
    t = re.sub(r'\?([A-Za-z0-9])\?', r' \1 ', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t


def clean_job_url(url: str) -> str:
    """Cleans up corrupted or duplicated URLs (e.g. Shine duplicate job IDs)."""
    if not url:
        return 'https://freshersbridge.in'
    u = str(url).strip()
    # Fix duplicate job IDs like /19440831/19440831 -> /19440831
    u = re.sub(r'/(\d{6,})/\1(?:/|$)', r'/\1/', u).rstrip('/')
    return u

def format_clean_salary(raw_match_or_text: str, is_intern: bool = False) -> str:
    """Cleans, standardizes and converts raw salary/stipend string to high-quality display text."""
    if not raw_match_or_text:
        return ""
    
    text = str(raw_match_or_text).strip()
    if text.lower() in ['none', 'null', 'nan', '', '0', '0.0', 'not disclosed', 'competitive']:
        return ""
    
    # Remove leading labels
    text = re.sub(r'^(?:Pay|Stipend|Salary|Compensation|CTC)\s*[:\-]?\s*', '', text, flags=re.IGNORECASE).strip()
    text = re.sub(r'^Base is\s*', '', text, flags=re.IGNORECASE).strip()
    
    # 1. Check for LPA / Lakhs pattern: e.g. "3.5 - 6 LPA", "4 to 7.5 Lakhs"
    lpa_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:-|to|–)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakhs|lacs|lac|lakh)', text, re.IGNORECASE)
    if lpa_match:
        min_v = float(lpa_match.group(1))
        max_v = float(lpa_match.group(2))
        return f"₹{min_v:.1f} - {max_v:.1f} LPA".replace('.0', '')
        
    single_lpa = re.search(r'(\d+(?:\.\d+)?)\s*(?:lpa|lakhs|lacs|lac|lakh)', text, re.IGNORECASE)
    if single_lpa:
        val = float(single_lpa.group(1))
        # Reject bogus high LPA for interns (e.g. 34 LPA)
        if is_intern and val > 20:
            return ""
        if val <= 70:
            return f"₹{val:.1f} LPA".replace('.0', '')
        
    # 2. Check for K notation e.g., "10K - 20K / month", "25k"
    k_range = re.search(r'(?:(?:₹|INR|Rs\.?)\s*)?(\d+(?:\.\d+)?)\s*k\s*(?:-|to|–|& can increase up to)\s*(?:(?:₹|INR|Rs\.?)\s*)?(\d+(?:\.\d+)?)\s*k', text, re.IGNORECASE)
    if k_range:
        min_k = int(float(k_range.group(1)) * 1000)
        max_k = int(float(k_range.group(2)) * 1000)
        return f"₹{min_k:,} - ₹{max_k:,} / month"
        
    single_k = re.search(r'(?:(?:₹|INR|Rs\.?)\s*)?(\d+(?:\.\d+)?)\s*k(?:\s*(?:per|\/)\s*(?:month|mo))?', text, re.IGNORECASE)
    if single_k and float(single_k.group(1)) <= 100:
        val = int(float(single_k.group(1)) * 1000)
        return f"₹{val:,} / month"

    # 3. Detect space-separated thousands e.g. "INR 4 000 5 000 month"
    space_stipend = re.search(r'(?:(?:INR|Rs\.?|₹|Stipend)\s*)?(\d+\s+\d{3})\s*(?:-|to|–|\s+)?\s*(\d+\s+\d{3})?\s*(?:per|\/|a)?\s*(?:month|mo)?', text, re.IGNORECASE)
    if space_stipend and ('month' in text.lower() or 'stipend' in text.lower() or 'inr' in text.lower()):
        try:
            v1 = int(space_stipend.group(1).replace(' ', ''))
            v2 = int(space_stipend.group(2).replace(' ', '')) if space_stipend.group(2) else None
            if v2 and 500 <= v1 <= 150000 and 500 <= v2 <= 150000:
                return f"₹{v1:,} - ₹{v2:,} / month"
            elif 500 <= v1 <= 150000:
                return f"₹{v1:,} / month"
        except Exception:
            pass

    # 4. Detect per year / per annum amounts like ₹340,000.00 - ₹360,000.00 per year or ₹120,000.00 per year
    yearly_match = re.search(r'(?:₹|INR|Rs\.?)\s*([\d,]+(?:\.\d+)?)\s*(?:-|to|–)\s*(?:(?:₹|INR|Rs\.?)\s*)?([\d,]+(?:\.\d+)?)\s*(?:per|\/|a)\s*(?:year|annum|yr)', text, re.IGNORECASE)
    if yearly_match:
        try:
            min_y = float(yearly_match.group(1).replace(',', ''))
            max_y = float(yearly_match.group(2).replace(',', ''))
            min_lpa = min_y / 100000.0
            max_lpa = max_y / 100000.0
            return f"₹{min_lpa:.1f} - {max_lpa:.1f} LPA".replace('.0', '')
        except Exception:
            pass

    single_yearly = re.search(r'(?:₹|INR|Rs\.?)\s*([\d,]+(?:\.\d+)?)\s*(?:per|\/|a)\s*(?:year|annum|yr)', text, re.IGNORECASE)
    if single_yearly:
        try:
            y_val = float(single_yearly.group(1).replace(',', ''))
            lpa = y_val / 100000.0
            return f"₹{lpa:.1f} LPA".replace('.0', '')
        except Exception:
            pass

    # 5. Detect per month amounts like ₹10,000.00 - ₹20,000.00 per month or ₹10,000/mo
    monthly_range = re.search(r'(?:(?:₹|INR|Rs\.?)\s*)?([\d,]+(?:\.\d+)?)\s*(?:-|to|–|& can increase up to)\s*(?:(?:₹|INR|Rs\.?)\s*)?([\d,]+(?:\.\d+)?)\s*(?:\/-)?\s*(?:(?:per|\/|a)\s*(?:month|mo|pm|p\.m\.)|\/mo|\/month)?', text, re.IGNORECASE)
    if monthly_range:
        try:
            min_m = int(float(monthly_range.group(1).replace(',', '')))
            max_m = int(float(monthly_range.group(2).replace(',', '')))
            if 1000 <= min_m <= 150000 and 1000 <= max_m <= 150000:
                return f"₹{min_m:,} - ₹{max_m:,} / month"
            elif min_m >= 150000 and not is_intern:
                min_lpa = min_m / 100000.0
                max_lpa = max_m / 100000.0
                return f"₹{min_lpa:.1f} - {max_lpa:.1f} LPA".replace('.0', '')
        except Exception:
            pass

    single_monthly = re.search(r'(?:(?:₹|INR|Rs\.?)\s*)?([\d,]+(?:\.\d+)?)\s*(?:\/-)?\s*(?:(?:per|\/|a)\s*(?:month|mo|pm|p\.m\.)|\/mo|\/month)', text, re.IGNORECASE)
    if single_monthly:
        try:
            val = int(float(single_monthly.group(1).replace(',', '')))
            if 1000 <= val <= 150000:
                return f"₹{val:,} / month"
        except Exception:
            pass

    # If it's already a clean string containing ₹ or LPA or $/year
    if any(k in text for k in ['₹', 'LPA', 'lpa', '/ month', '/mo', 'per year', 'per month', '$']):
        return text.strip()

    return ""

def scan_description_for_salary(description: str, title: str = "") -> str:
    """Scans full description and title for salary mentions with internship priority."""
    if not description:
        return ""
        
    is_intern = any(w in title.lower() for w in ['intern', 'trainee', 'stipend', 'fellowship', 'apprentice'])
    
    # If it's an internship, search explicitly for monthly stipend patterns first
    if is_intern:
        stipend_patterns = [
            r'Stipend\s*[:\-]?\s*(?:INR|Rs\.?|₹)?\s*([\d\s,]+?)\s*(?:month|mo|\/month|\/mo|per month)',
            r'(?:INR|Rs\.?|₹)\s*([\d\s,]+?)\s*(?:per|\/)\s*(?:month|mo)',
            r'(?:Pay|Stipend|Compensation)\s*[:\-]?\s*(?:Base is\s*)?(?:(?:INR|Rs\.?|₹)\s*)?[\d,]+(?:\.\d+)?\s*(?:k|K)?(?:\s*(?:-|to|–|& can increase up to)\s*(?:(?:INR|Rs\.?|₹)\s*)?[\d,]+(?:\.\d+)?\s*(?:k|K)?)?\s*(?:\/-)?(?:\s*(?:per|\/|a)\s*(?:month|mo)|\/mo|\/month)',
            r'(?:₹|INR|Rs\.)\s*[\d,]+(?:\.\d+)?\s*(?:k|K)?\s*(?:-|to|–)\s*(?:(?:₹|INR|Rs\.)\s*)?[\d,]+(?:\.\d+)?\s*(?:k|K)?\s*(?:per|\/|a)\s*(?:month|mo|pm|p\.m\.)',
            r'(?:₹|INR|Rs\.)\s*[\d,]+(?:\.\d+)?\s*(?:k|K)?\s*(?:per|\/|a)\s*(?:month|mo|pm|p\.m\.|\/mo|\/month)'
        ]
        for sp in stipend_patterns:
            m = re.search(sp, description, re.IGNORECASE)
            if m:
                cleaned = format_clean_salary(m.group(0).strip(), is_intern=True)
                if cleaned:
                    return cleaned

    explicit_patterns = [
        r'(?:Pay|Stipend|Salary|Compensation|CTC)\s*[:\-]?\s*(?:Base is\s*)?(?:(?:INR|Rs\.?|₹)\s*)?[\d,]+(?:\.\d+)?\s*(?:k|K)?(?:\s*(?:-|to|–|& can increase up to)\s*(?:(?:INR|Rs\.?|₹)\s*)?[\d,]+(?:\.\d+)?\s*(?:k|K)?)?\s*(?:\/-)?(?:\s*(?:per|\/|a)\s*(?:month|mo|year|annum|yr|hour|hr)|\s*(?:lpa|p\.a\.|p\.m\.|\/mo|\/month|\/year))?',
        r'(?:₹|INR|Rs\.)\s*[\d,]+(?:\.\d+)?\s*(?:k|K)?\s*(?:-|to|–)\s*(?:(?:₹|INR|Rs\.)\s*)?[\d,]+(?:\.\d+)?\s*(?:k|K)?\s*(?:per|\/|a)\s*(?:month|mo|year|annum|yr|pm|p\.a\.)',
        r'(?:₹|INR|Rs\.)\s*[\d,]+(?:\.\d+)?\s*(?:k|K)?\s*(?:per|\/|a)\s*(?:month|mo|year|annum|yr|pm|p\.a\.|\/mo|\/month|\/year)',
        r'\b\d+(?:\.\d+)?\s*(?:-|to|–)\s*\d+(?:\.\d+)?\s*(?:lpa|lakhs|lacs)\b',
        r'\b\d+(?:\.\d+)?\s*(?:lpa|lakhs|lacs)\b'
    ]
    
    for pat in explicit_patterns:
        for match in re.finditer(pat, description, re.IGNORECASE):
            raw = match.group(0).strip()
            # Guard against batch years like 2024 - 2025
            if any(b in raw for b in ['2023', '2024', '2025', '2026', '2027']) and not any(k in raw.lower() for k in ['year', 'per year', 'lpa', 'pa', 'p.a.']):
                continue
            cleaned = format_clean_salary(raw, is_intern=is_intern)
            if cleaned:
                return cleaned
                
    return ""

def normalize_eligibility(description: str = "", title: str = "") -> str:
    """Extracts genuine eligibility criteria from title and description without faking batches."""
    desc = description or ""
    combined = f"{title} {desc}".lower()
    
    # 1. Detect explicit degrees with strict word boundaries
    degrees = []
    if re.search(r'\b(b\.?tech|b\.?e\b|bachelor(?:[\'\’]s)?\s+degree\s+in\s+eng|b\.?e\s*/\s*b\.?tech)\b', desc, re.I):
        degrees.append('B.E / B.Tech')
    if re.search(r'\b(m\.?tech|m\.?e\b|master(?:[\'\’]s)?\s+degree\s+in\s+eng)\b', desc, re.I):
        degrees.append('M.Tech')
    if re.search(r'\b(mca|master(?:[\'\’]s)?\s+(?:of|in)\s+computer\s+applications?)\b', desc, re.I):
        degrees.append('MCA')
    if re.search(r'\b(bca|bachelor(?:[\'\’]s)?\s+(?:of|in)\s+computer\s+applications?)\b', desc, re.I):
        degrees.append('BCA')
    if re.search(r'\b(b\.?sc|bachelor\s+of\s+science)\b', desc, re.I):
        degrees.append('B.Sc')
    if re.search(r'\b(diploma|polytechnic)\b', desc, re.I):
        degrees.append('Diploma')
        
    # Check for discipline mentions if no degree found
    if not degrees:
        if re.search(r'\b(computer\s*science|information\s*technology|software\s*engineering|cse|it)\b', desc, re.I):
            degrees.append('CS / IT / Engineering Graduate')
        elif re.search(r'\b(any\s*graduate|any\s*degree|bachelor(?:[\'\’]s)?\s*degree)\b', desc, re.I):
            degrees.append('Any Graduate / Bachelor\'s Degree')

    # 2. Detect actual batch years (only if explicitly present in posting)
    batches = []
    for y in ['2023', '2024', '2025', '2026', '2027']:
        if re.search(rf'\b(?:batch(?:\s+of)?\s*)?{y}(?:\s*batch|\s*passout|\s*graduat\w*)?\b', combined, re.I):
            if y not in batches:
                batches.append(y)
                
    # 3. Detect experience / role level
    is_intern = any(k in title.lower() for k in ['intern', 'internship', 'trainee', 'apprentice', 'fellowship'])
    exp_str = ""
    if re.search(r'\b(0\s*-\s*1\s*years?|0\s*to\s*1\s*years?|fresher|freshers|entry\s*level)\b', combined, re.I):
        exp_str = "Freshers / 0-1 Yr"
    elif re.search(r'\b(0\s*-\s*2\s*years?|0\s*to\s*2\s*years?|1\s*-\s*2\s*years?)\b', combined, re.I):
        exp_str = "0-2 Years Exp"
    elif is_intern:
        exp_str = "Internship / Students & Freshers"

    # Assemble structured eligibility
    degree_part = " / ".join(degrees) if degrees else ""
    
    if degree_part and batches:
        return f"{degree_part} ({', '.join(batches)} Batch)"
    elif degree_part and exp_str:
        return f"{degree_part} ({exp_str})"
    elif degree_part:
        return degree_part
    elif batches:
        return f"Any Tech Graduate ({', '.join(batches)} Batch)"
    elif is_intern:
        return "Enrolled Students / Fresh Graduates (All Tech Branches)"
    elif exp_str:
        return f"Bachelor's / Master's Degree ({exp_str})"
    else:
        return "B.E / B.Tech / BCA / MCA / Any Graduate"

def normalize_location(loc: str, is_remote: bool = False, query_loc: str = "") -> str:
    """Standardizes location strings for Indian cities and remote positions."""
    if not loc or str(loc).strip().lower() in ['none', 'null', 'nan', '']:
        if query_loc and 'remote' not in query_loc.lower():
            return normalize_location(query_loc, is_remote=is_remote)
        return "Remote (India)" if is_remote else "Bangalore, Karnataka, India"

    loc_str = str(loc).strip()
    loc_clean = re.sub(r'[\r\n\t]+', ' ', loc_str).strip()
    loc_lower = loc_clean.lower()
    
    if any(term in loc_lower for term in ['remote', 'work from home', 'wfh', 'anywhere']):
        return "Remote (India)"
        
    # If location is just generic "India", resolve to query location if present
    if loc_lower == 'india' and query_loc and 'remote' not in query_loc.lower():
        return normalize_location(query_loc, is_remote=is_remote)
        
    # Check for city matches
    for city_key, standard_city in CITY_MAP.items():
        if re.search(rf'\b{city_key}\b', loc_lower):
            if is_remote:
                return f"{standard_city.split(',')[0]}, India (Remote)"
            return standard_city
            
    # Check for state codes like "KA, IN", "MH, IN", "TS, IN", "KA", "MH"
    state_match = re.search(r'\b([a-z]{2})\s*,\s*in\b|\b([a-z]{2})\s*,\s*india\b', loc_lower)
    if state_match:
        st_code = (state_match.group(1) or state_match.group(2)).lower()
        if st_code in STATE_MAP:
            target = STATE_MAP[st_code]
            if query_loc:
                for ck, sc in CITY_MAP.items():
                    if ck in query_loc.lower() and ck in target.lower():
                        return sc
            return target
            
    # Check for state names
    for state_key, standard_state in STATE_MAP.items():
        if re.search(rf'\b{state_key}\b', loc_lower):
            return standard_state
            
    # Clean up redundant country references
    loc_clean = re.sub(r'\s*,\s*in\b', ', India', loc_clean, flags=re.IGNORECASE)
    loc_clean = re.sub(r'\s*,\s*india\s*,\s*india', ', India', loc_clean, flags=re.IGNORECASE)
    
    if 'india' not in loc_clean.lower() and not is_remote:
        loc_clean = f"{loc_clean}, India"
        
    if is_remote and 'remote' not in loc_clean.lower():
        loc_clean = f"{loc_clean} (Remote)"
        
    return loc_clean

CORE_JD_HEADINGS = [
    r'Responsibilities',
    r'Key Responsibilities',
    r'What You[\'’]ll Do',
    r'What You Will Do',
    r'Role Description',
    r'Role Overview',
    r'Your Impact',
    r'Role Summary',
    r'Key Objectives',
    r'Requirements',
    r'Qualifications',
    r'What We[\'’]re Looking For',
    r'Eligibility',
    r'Skills Required',
    r'Technical Skills',
    r'Must Have',
    r'Day in the Life',
    r'Primary Responsibilities'
]

def clean_and_extract_core_jd(raw_desc: str, company: str = "", title: str = "") -> str:
    """Strictly cleans raw JD: removes metadata headers, company marketing, EEO boilerplate, and markdown artifacts."""
    if not raw_desc:
        return ""
        
    text = str(raw_desc).strip()
    
    # 1. Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    
    # 2. Fix mojibake, escaped backslashes and single-character newline splits
    text = text.replace('\ufffd', ' ').replace('\u200b', '')
    # Auto-heal corrupted C# / F# symbols (e.g. "C\programming" -> "C# programming", "C\ developer" -> "C# developer")
    text = re.sub(r'\bC\\([a-zA-Z])', r'C# \1', text)
    text = re.sub(r'\bC\\([.,;:/ \t]|$)', r'C#\1', text)
    text = re.sub(r'\bF\\([a-zA-Z])', r'F# \1', text)
    text = re.sub(r'\bF\\([.,;:/ \t]|$)', r'F#\1', text)
    # Unescape markdown backslashes added by html2text/markdownify (e.g. \- -> -, \# -> #, \_ -> _)
    text = re.sub(r'\\([*#+\[\]().`~>!&|/\\_\-])', r'\1', text)
    
    raw_lines = text.splitlines()
    healed_lines = []
    char_buf = []
    for r_line in raw_lines:
        s_line = r_line.strip()
        if len(s_line) == 1 and s_line.isalnum():
            char_buf.append(s_line)
        else:
            if char_buf:
                healed_lines.append(''.join(char_buf))
                char_buf = []
            healed_lines.append(r_line)
    if char_buf:
        healed_lines.append(''.join(char_buf))
    text = "\n".join(healed_lines)
    
    # 3. Strip markdown headers at line start (preserve C# in text)
    text = re.sub(r'^\s*#{1,6}\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', text)
    text = re.sub(r'\*{1,3}', '', text)
    text = re.sub(r'_{2,3}([^_]+)_{2,3}', r'\1', text)
    
    # 4. Remove EEO and legal disclaimers at end
    disclaimers = [
        r'(?:Equal Opportunity Employer|EEO Statement|Accommodations? for Applicants|We are an equal opportunity|Notice to Candidates|Application Question\(s\):|Kindly review the job description).*$'
    ]
    for d in disclaimers:
        text = re.sub(d, '', text, flags=re.DOTALL | re.IGNORECASE)
        
    # 5. Check if there is an explicit core section start
    core_pattern = r'(?:\n|\A)\s*(?:(?:###|##|#)\s*)?(?:(?:\d+[\.\)]\s*)?(' + '|'.join(CORE_JD_HEADINGS) + r'))\s*[:\-]?\s*(?:\n|\r)'
    match = re.search(core_pattern, text, re.IGNORECASE)
    if match:
        text = text[match.start():].strip()
    else:
        # Strip leading company intro / about company / metadata lines
        lines = text.splitlines()
        clean_lines = []
        skip_header = True
        
        for line in lines:
            l_strip = line.strip()
            if not l_strip:
                continue
                
            if skip_header:
                if re.match(r'^(?:[🚀📍📌💼🔹•\*\-]?\s*)?(?:Job\s+)?(?:Title|Location|Company(?:\s+Description)?|About\s+.*|Employment\s+Type|Type|Duration|Timings?|Team|Reporting\s+to|Experience|Work\s+Location|Job\s+Type|Pay|Salary|Stipend|Compensation|Perks)\s*[:\-]?\s*.*$', l_strip, re.IGNORECASE):
                    continue
                if company and l_strip.lower() == company.lower():
                    continue
                if title and l_strip.lower() == title.lower():
                    continue
                if company and (l_strip.lower().startswith(f"about {company.lower()}") or l_strip.lower().startswith(f"{company.lower()} is")):
                    continue
                if l_strip.lower().startswith("about us") or l_strip.lower().startswith("who we are") or l_strip.lower().startswith("company description"):
                    continue
                if l_strip in [':', '📍', '🚀', 'Location:', 'Title:']:
                    continue
                skip_header = False
                
            clean_lines.append(l_strip)
        text = "\n".join(clean_lines)

    # 5.5 Split concatenated/squished words (e.g. from HTML stripping)
    def split_squished(match):
        w = match.group(0)
        return re.sub(r'([a-z])([A-Z])', r'\1 \2', re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1 \2', w))

    text = re.sub(r'\S{25,}', split_squished, text)

    # 6. Clean line-by-line metadata and bullets
    final_lines = []
    for l in text.splitlines():
        l = l.strip()
        if not l or l in [':', '📍', '🚀', '-']:
            continue
            
        if re.match(r'^(?:[🚀📍📌💼🔹]?\s*)?(?:Job\s+)?(?:Title|Location|Company(?:\s+Description)?|Employment\s+Type|Type|Duration|Timings?|Team|Reporting\s+to|Experience|Work\s+Location|Job\s+Type|Pay|Salary|Stipend|Compensation|Perks)\s*[:\-]\s*.*$', l, re.IGNORECASE):
            continue
            
        if re.match(r'^[\*\-\+•]\s+', l):
            final_lines.append(re.sub(r'^[\*\-\+•]\s+', '• ', l))
        elif re.match(r'^\d+[\.\)]\s+', l):
            final_lines.append(l)
        else:
            final_lines.append(l)
            
    res = "\n".join(final_lines).strip()
    
    if len(res) < 80:
        fallback_lines = []
        for l in raw_desc.splitlines():
            l = l.strip()
            l = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', l)
            l = re.sub(r'\*{1,3}', '', l)
            l = re.sub(r'#+\s*', '', l)
            if l:
                if re.match(r'^[\*\-\+•]\s+', l):
                    fallback_lines.append(re.sub(r'^[\*\-\+•]\s+', '• ', l))
                else:
                    fallback_lines.append(l)
        res = "\n".join(fallback_lines).strip()
        
    return res

def generate_structured_jd(title: str, company: str, location: str, eligibility: str, skills: str, category_name: str) -> str:
    """Generates a clean, professional JD without company fluff or raw markdown artifacts."""
    return f"""Key Responsibilities:
• Work alongside engineering and product teams to build, test, and maintain high-quality software applications.
• Develop clean, maintainable, and efficient code adhering to software engineering best practices and agile workflows.
• Participate in feature design, bug fixes, unit testing, and technical documentation.
• Continuously learn new tools, technologies, and modern development frameworks relevant to {category_name}.

Requirements & Qualifications:
• Education: {eligibility}
• Required Technical Skills: {skills}
• Mindset: Strong analytical mindset, solid foundation in programming and data structures, and excellent problem-solving abilities.
""".strip()


def normalize_job_dict(job: Dict[str, Any], query_loc: str = "") -> Dict[str, Any]:
    """Applies normalization rules to raw job dictionary."""
    title = sanitize_text(str(job.get('title') or 'Graduate Engineer Trainee / Software Engineer'))
    company = sanitize_text(str(job.get('company') or 'Leading Tech Company'), is_company=True)
    
    # Handle missing/nan/short descriptions
    raw_desc = str(job.get('description') or '').strip()
    if raw_desc.lower() in ['none', 'null', 'nan', '']:
        raw_desc = ""
        
    is_remote = bool(job.get('is_remote') or 'remote' in title.lower() or 'remote' in raw_desc.lower()[:300])
    raw_loc = str(job.get('location') or '')
    location = normalize_location(raw_loc, is_remote=is_remote, query_loc=query_loc)
    
    cat_slug = job.get('category_slug') or classify_category(title, raw_desc)
    raw_keywords = job.get('keywords') or job.get('raw_keywords') or []
    skills = job.get('skills') or extract_skills(title, raw_desc, raw_keywords=raw_keywords)
    existing_elig = str(job.get('eligibility') or '').strip()
    if not existing_elig or existing_elig == "B.E / B.Tech / MCA (2024, 2025, 2026 Batch)":
        eligibility = normalize_eligibility(raw_desc, title)
    else:
        eligibility = existing_elig
    
    # Clean and enrich description
    category_display = cat_slug.replace('-', ' ').title()
    if len(raw_desc) < 120 or raw_desc.startswith("Great opportunity for") or raw_desc.endswith("role at " + company):
        description = generate_structured_jd(title, company, location, eligibility, skills, category_display)
    else:
        description = clean_and_extract_core_jd(raw_desc, company, title)

        
    # Extract & standardize salary
    raw_salary = job.get('salary')
    cleaned_salary = format_clean_salary(raw_salary, is_intern='intern' in title.lower())
    
    if not cleaned_salary:
        # Fallback to intelligent description parsing
        cleaned_salary = scan_description_for_salary(description, title)
        
    if not cleaned_salary:
        cleaned_salary = "Not Disclosed / As per Industry Standards"
        
    raw_apply = str(job.get('apply_url') or job.get('job_url') or 'https://freshersbridge.in').strip()
    apply_url = clean_job_url(raw_apply)
    source_name = str(job.get('source_name') or 'Job Portal').strip()
    raw_source = str(job.get('source_url') or apply_url).strip()
    source_url = clean_job_url(raw_source)

    return {
        'title': title,
        'company': company,
        'location': location,
        'eligibility': eligibility,
        'skills': skills,
        'description': description,
        'apply_url': apply_url,
        'salary': str(cleaned_salary),
        'category_slug': cat_slug,
        'source_name': source_name,
        'source_url': source_url,
        'featured_job': 'false',
        'application_deadline': ''
    }


