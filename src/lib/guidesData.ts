export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Company Patterns' | 'Technical Prep' | 'Career Roadmaps' | 'HR & Soft Skills';
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  tableOfContents: { id: string; title: string }[];
  content: string; // Markdown or rich HTML formatted content
  directAnswerSummary?: string; // 40-60 word authoritative answer for AEO / Google AI Overviews & Perplexity
  faqs?: { question: string; answer: string }[];
}

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: '1',
    slug: 'tcs-nqt-2026-complete-syllabus-exam-pattern-preparation-guide',
    title: 'TCS NQT 2026: Complete Syllabus, Exam Pattern & Preparation Blueprint',
    subtitle: 'A step-by-step master guide to cracking TCS Ninja (3.36 LPA) and TCS Digital (7 LPA / 9 LPA) hiring drives for freshers.',
    description: 'Master the TCS National Qualifier Test (NQT) with section-by-section breakdown of Cognitive Skills, Advanced Quantitative Aptitude, Technical MCQ, and Coding rounds.',
    category: 'Company Patterns',
    readTime: '12 min read',
    publishedAt: '2026-08-20',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['TCS NQT', 'Off-Campus', 'Aptitude', 'Coding', 'Freshers 2026'],
    tableOfContents: [
      { id: 'overview', title: '1. Overview of TCS NQT Hiring Tracks' },
      { id: 'exam-pattern', title: '2. Detailed Exam Pattern (Foundation vs Advanced)' },
      { id: 'syllabus-breakdown', title: '3. Section-Wise Syllabus Breakdown' },
      { id: 'coding-section', title: '4. Coding Section: Top Expected Problem Patterns' },
      { id: 'preparation-strategy', title: '5. 30-Day Preparation Roadmap & Free Resources' },
      { id: 'interview-rounds', title: '6. Technical & HR Interview Process' },
    ],
    content: `
### 1. Overview of TCS NQT Hiring Tracks
Tata Consultancy Services (TCS) conducts the National Qualifier Test (NQT) as its flagship assessment to hire engineering and non-engineering graduates across India. Based on your cumulative percentile in the test, candidates are bifurcated into three prestigious hiring cadres:

1. **TCS Ninja Cadre**: 3.36 LPA for B.E./B.Tech and 3.53 LPA for M.E./M.Tech.
2. **TCS Digital Cadre**: 7.0 LPA to 7.3 LPA. Candidates qualifying the Advanced Section with outstanding coding scores receive direct Digital interview calls.
3. **TCS Prime Cadre**: 9.0 LPA to 11.5 LPA for top percentiles solving complex algorithms and full-stack challenges.

---

### 2. Detailed Exam Pattern (Foundation vs Advanced)
The TCS NQT assessment is conducted on the TCS iON platform. It consists of two mandatory stages executed back-to-back:

| Section | No. of Questions | Allocated Time | Target Cutoff Score |
| :--- | :---: | :---: | :---: |
| **Part A: Foundation Section** | | | |
| Numerical Ability | 20 Questions | 25 Mins | 75%+ |
| Verbal Ability | 25 Questions | 25 Mins | 70%+ |
| Reasoning Ability | 20 Questions | 25 Mins | 75%+ |
| **Part B: Advanced Section (For Digital/Prime)** | | | |
| Advanced Quantitative & Reasoning | 15 Questions | 25 Mins | 80%+ |
| Advanced Coding (2 Problems) | 2 Questions | 90 Mins | 1.5+ test cases passed |
| **Total Assessment** | **82 Questions** | **190 Minutes** | **High Percentile** |

> **Crucial Rule:** The TCS iON interface uses an adaptive timer. You cannot navigate between sections once the timer for a section expires.

---

### 3. Section-Wise Syllabus Breakdown

#### Numerical Ability (Foundational & Advanced)
- **High-Weightage Topics:** Time and Work, Percentages & Profit/Loss, Speed-Time-Distance (Boats & Streams), Permutation & Combination, Probability, Number Systems (Divisibility rules and Remainders), and Mixtures & Alligations.
- **Formulas to Memorize:** Compound Interest half-yearly/quarterly formulas, Work-equivalence formulas ($M_1 D_1 H_1 = M_2 D_2 H_2$), and Relative Speed principles.

#### Reasoning Ability
- **Key Concepts:** Syllogisms (3-statement Venn diagrams), Blood Relations (Coded representations), Direction Sense with pythagorean triplets, Seating Arrangements (Linear and Circular with facing inwards/outwards), and Data Sufficiency.

#### Verbal Ability
- **Key Focus:** Reading Comprehension passages (Tone and Inferences), Sentence Completion, Error Spotting (Subject-Verb agreement, Parallelism), Para Jumbles, and Preposition corrections.

---

### 4. Coding Section: Top Expected Problem Patterns
The coding round allows languages: **C, C++, Java, and Python**. To qualify for the Digital track, you must pass 100% of public and hidden test cases for at least one question and 50%+ for the second question.

#### Top 5 Recurring TCS NQT Coding Problem Archetypes:
1. **Array Manipulation & Two Pointers:** Finding subarray with given sum, Trapping Rain Water, Segregating zeros and ones in $O(N)$ time.
2. **String Transformations & Palindromes:** Longest substring without repeating characters, Anagram detection without extra space.
3. **Number Theory:** Finding whether a number is an Armstrong, Neon, or Strong number; Prime Factorization in $O(\\sqrt{N})$.
4. **Matrix Operations:** Spiral traversal of an $N \\times M$ matrix, Rotating matrix 90 degrees clockwise without extra buffer.
5. **Dynamic Programming Basics:** Coin Change problem, 0/1 Knapsack, Maximum Subarray Sum (Kadane's Algorithm).

\`\`\`python
# Example: Kadane's Algorithm - Maximum Subarray Sum (Frequent TCS NQT Question)
def max_subarray_sum(nums):
    max_so_far = nums[0]
    current_max = nums[0]
    
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        max_so_far = max(max_so_far, current_max)
        
    return max_so_far

# Test with TCS benchmark cases
print(max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4])) # Output: 6
\`\`\`

---

### 5. 30-Day Preparation Roadmap

- **Week 1 (Aptitude Mastery):** Focus exclusively on Foundation Numerical & Reasoning topics. Practice 40 questions daily from IndiaBIX or R.S. Aggarwal.
- **Week 2 (Core Data Structures):** Master Strings, 1D Arrays, 2D Matrices, and HashMaps in your preferred programming language.
- **Week 3 (TCS Past Papers):** Solve last 3 years of actual TCS NQT previous slots. Time yourself strictly on the 90-minute coding segment.
- **Week 4 (Mock Tests & Speed Drilling):** Take 3 full-length 190-minute mock tests. Analyze errors and practice time allocation strategy.

---

### 6. Technical & HR Interview Process
Candidates clearing the written test are invited to a 3-panel interview (Technical, Managerial, and HR):
- **Technical Round (30-45 mins):** OOPs pillars with real-world examples, SQL Joins vs Subqueries, Major/Minor academic project architecture, and live dry-run of basic coding algorithms.
- **Managerial Round (15 mins):** Situational questions, handling team conflicts during hackathons or college projects, and willingness to learn emerging technologies (Cloud, GenAI).
- **HR Round (15 mins):** Document verification, willingness to relocate anywhere in India, shift flexibility, and background checks.
    `,
  },
  {
    id: '2',
    slug: 'accenture-recruitment-process-syllabus-coding-questions-freshers',
    title: 'Accenture Recruitment Process 2026: Exam Pattern, Syllabus & Solved Coding Questions',
    subtitle: 'Everything you need to crack the Associate Software Engineer (4.5 LPA) and Advanced ASE (6.5 LPA) roles with real exam patterns.',
    description: 'Complete Accenture recruitment 2026 blueprint: Cognitive & Technical assessment syllabus, test pattern, solved coding questions, communication tips, and technical interview questions for freshers.',
    category: 'Company Patterns',
    readTime: '11 min read',
    publishedAt: '2026-08-21',
    updatedAt: '2026-09-13',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Accenture', 'ASE', 'Off-Campus', 'Coding Round', 'Aptitude', 'Accenture Exam Pattern', 'Accenture Technical Questions 2026', 'Packaged App Development Associate'],
    tableOfContents: [
      { id: 'hiring-tracks', title: '1. Accenture Hiring Roles & Packages' },
      { id: 'selection-process', title: '2. Four-Stage Selection Process' },
      { id: 'cognitive-technical-syllabus', title: '3. Cognitive & Technical Assessment Syllabus' },
      { id: 'coding-questions', title: '4. Coding Round: Patterns & Solution Snippets' },
      { id: 'communication-round', title: '5. Communication Assessment Tips' },
      { id: 'interview-prep', title: '6. Technical Interview Questions' },
    ],
    content: `
### 1. Accenture Hiring Roles & Packages
Accenture hires fresh graduates predominantly for two high-demand engineering designations:

- **Associate Software Engineer (ASE):** ₹4.50 LPA (Fixed + Variable component).
- **Advanced Associate Software Engineer (AASE):** ₹6.50 LPA (Assigned to candidates scoring above the 90th percentile in the technical coding and cognitive rounds).

---

### 2. Four-Stage Selection Process
- **Stage 1: Cognitive & Technical Assessment (90 Mins / 90 Qs)** — Elimination Round covering English, Critical Reasoning, Abstract logic, MS Office applications, and Pseudocode.
- **Stage 2: Coding Assessment (45 Mins / 2 Questions)** — Practical coding test unlocked immediately upon clearing Stage 1 cutoff percentiles.
- **Stage 3: Communication Assessment (20 Mins)** — Automated AI-driven voice and listening fluency assessment via Pearson Versant.
- **Stage 4: Technical & HR Virtual Interview (25–30 Mins)** — Final video interview on Microsoft Teams evaluating project architecture, core CS fundamentals, and shift/location flexibility.

---

### 3. Cognitive & Technical Assessment Syllabus

#### Cognitive Assessment (50 Questions / 50 Mins)
- **Critical Reasoning and Problem Solving (18 Qs):** Statements & Assumptions, Venn Diagrams, Flowcharts, Syllogisms.
- **Abstract Reasoning (15 Qs):** Visual sequences, Pattern completions, Folding paper cubes.
- **English Ability (17 Qs):** Sentence correction, Vocabulary, Active-Passive voice, Reading Comprehension.

#### Technical Assessment (40 Questions / 40 Mins)
- **Common Application & MS Office (12 Qs):** MS Word shortcuts, MS Excel formulas (\`VLOOKUP\`, \`CONCATENATE\`, \`SUMIF\`), Cloud basics.
- **Pseudocode & Algorithms (18 Qs):** Bitwise operations (\`^\`, \`&\`, \`|\`, \`<<\`), Recursive function call traces, Loop condition termination.
- **Fundamentals of Networking & Security (10 Qs):** OSI layers, TCP vs UDP, Firewalls, Encryption basics, IP addressing classes.

---

### 4. Coding Round: Patterns & Solution Snippets
Accenture tests practical logic rather than extremely deep dynamic programming. The most common problems involve:
- **Bitwise XOR and Bit Masking**
- **String Character Replacements (e.g. replacing 'a' with 'b')**
- **Divisibility filtering in integer arrays**

\`\`\`cpp
// Example: Accenture Classic - Difference of Sum
// Calculate difference between sum of numbers divisible by m and numbers not divisible by m in range 1 to n.
#include <iostream>
using namespace std;

int differenceOfSum(int n, int m) {
    int sumDivisible = 0;
    int sumNotDivisible = 0;
    
    for (int i = 1; i <= n; i++) {
        if (i % m == 0) {
            sumDivisible += i;
        } else {
            sumNotDivisible += i;
        }
    }
    return sumNotDivisible - sumDivisible;
}

int main() {
    cout << differenceOfSum(30, 6) << endl; // Output: 285
    return 0;
}
\`\`\`

---

### 5. Communication Assessment Tips
The Communication Round is conducted using Pearson Versant or Aspiring Minds AI. It checks:
- **Pronunciation and Fluency:** Speak clearly into a good pair of wired earphones (avoid Bluetooth lag).
- **Sentence Mastery & Story Retelling:** Listen to a 30-second audio clip and recount the facts without hesitation or filler words like "umm" and "like".
- **Tone & Pace:** Maintain a steady, confident rhythm without speaking too fast.

---

### 6. Technical Interview Questions & Preparation Tips
The Accenture Technical + HR Interview (25–35 minutes) is conducted virtually on Microsoft Teams. The interviewers evaluate both fundamental coding understanding and real-world project experience.

#### Top Technical Topics & Questions:
1. **Academic Project Architecture:** Be prepared to explain the database schema, frontend-to-backend API flow, and what exact problems your project solves.
2. **Core OOPs Concepts:** "Explain the difference between Abstract Class and Interface with a practical example."
3. **Database & SQL:** "What is the difference between Primary Key and Unique Key? Write a query to fetch duplicate records."
4. **Data Structures:** "How does a Stack differ from a Queue? What is the time complexity of searching in a Binary Search Tree vs an Array?"
5. **Software Engineering & Cloud Awareness:** Basics of Agile methodology, Git version control commands (\`git pull\`, \`git merge\`, \`git rebase\`), and cloud service models (IaaS vs PaaS vs SaaS).

#### Model Behavioral & Situational Questions:
- "Tell me about a challenging bug you encountered in your project and how you resolved it."
- "If assigned to a project involving an unfamiliar technology stack, how would you approach learning it within a 2-week deadline?"
- "Are you comfortable working in rotational shifts and open to relocation across Accenture India delivery centers?"
    `,
  },
  {
    id: '3',
    slug: 'top-50-java-interview-questions-answers-freshers-2026',
    title: 'Core Java Technical Interview Masterclass: High-Frequency Questions & Answers (2026 Batch)',
    subtitle: 'From OOPs Principles and Memory Management to Collections, Multithreading, and Java 8 Streams.',
    description: 'The ultimate Core Java technical interview preparation guide covering fundamental concepts, code snippets, trick questions, and real interview scenarios.',
    category: 'Technical Prep',
    readTime: '15 min read',
    publishedAt: '2026-08-19',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Java', 'Core Java', 'OOPs', 'Collections', 'Interview Prep'],
    tableOfContents: [
      { id: 'oops-foundations', title: '1. OOPs Concepts & Real-World Examples' },
      { id: 'memory-management', title: '2. Java Memory Model (Heap vs Stack, Garbage Collection)' },
      { id: 'strings-immutability', title: '3. String, StringBuilder & StringBuffer Deep Dive' },
      { id: 'collections-framework', title: '4. Collections Framework (List, Set, Map, HashMap Internals)' },
      { id: 'exception-handling', title: '5. Exception Handling & Best Practices' },
      { id: 'java-8-features', title: '6. Java 8 Streams & Lambda Expressions' },
    ],
    content: `
### 1. OOPs Concepts & Real-World Examples

#### Q1: What is Encapsulation and how is it implemented?
**Answer:** Encapsulation is the mechanism of wrapping data (variables) and code acting on the data (methods) together as a single unit. It protects an object's internal state from unintended modification.
- **Implementation:** Declare class variables as \`private\` and provide \`public\` getter and setter methods with validation logic.

#### Q2: What is the difference between Method Overloading and Method Overriding?
| Feature | Method Overloading (Compile-Time) | Method Overriding (Run-Time) |
| :--- | :--- | :--- |
| **Location** | Occurs within the **same class** | Occurs between **Superclass and Subclass** |
| **Method Signature** | Must have **different parameters** (count or type) | Must have the **exact same parameters** |
| **Return Type** | Can be different | Must be same or covariant |
| **\`private\` / \`static\`** | Can overload private/static methods | Cannot override private or static methods |

---

### 2. Java Memory Model (Heap vs Stack)

#### Q3: How does JVM allocate memory between Stack and Heap?
- **Stack Memory:** Used for static memory allocation and the execution of threads. It contains primitive values specific to a method and references to objects in the Heap. Memory allocation follows LIFO (Last-In-First-Out) order and is very fast.
- **Heap Memory:** Used for dynamic memory allocation for Java Objects and JRE classes at runtime. Heap is shared across all running threads and is cleaned up by the Garbage Collector.

\`\`\`java
public class MemoryDemo {
    public static void main(String[] args) {
        int localVal = 100; // Stored in Stack frame
        String greeting = new String("Hello"); // 'greeting' reference in Stack, String object in Heap
    }
}
\`\`\`

---

### 3. Strings & Immutability

#### Q4: Why is \`String\` immutable in Java?
1. **String Constant Pool (SCP):** Multiple references can point to the exact same String literal in the pool, saving immense RAM.
2. **Security:** Strings are widely used to store sensitive information (Database URLs, Passwords, Network sockets). If mutable, an unauthorized thread could alter the connection string.
3. **Thread Safety:** Because the state cannot change, Strings are automatically thread-safe without explicit synchronization.
4. **HashCode Caching:** The hashcode is computed once and cached, making Strings ideal keys for \`HashMap\`.

---

### 4. Collections Framework & HashMap Internals

#### Q5: How does \`HashMap\` work internally in Java?
\`HashMap\` works on the principle of **Hashing**. It stores key-value pairs in an array of \`Node<K,V>\` buckets.
1. When you call \`map.put(key, value)\`, JVM computes \`key.hashCode()\`.
2. The index is calculated as \`index = hash & (n - 1)\` where \`n\` is the bucket array length (default 16).
3. If two different keys map to the same bucket index (Hash Collision):
   - In Java 7: Stored as a singly Linked List ($O(N)$ lookup).
   - In Java 8+: If the bucket size exceeds 8 elements, the LinkedList transforms into a **Balanced Red-Black Tree** ($O(\\log N)$ lookup).

---

### 5. Exception Handling & Best Practices

#### Q6: What is the difference between Checked and Unchecked Exceptions?
- **Checked Exceptions (Compile-Time):** Exceptions that extend \`java.lang.Exception\` (excluding \`RuntimeException\`). The compiler forces you to handle them using \`try-catch\` or declare them with \`throws\` (\`IOException\`, \`SQLException\`, \`ClassNotFoundException\`).
- **Unchecked Exceptions (Runtime):** Exceptions that extend \`java.lang.RuntimeException\`. They occur due to logical bugs or improper API usage and do not require mandatory compile-time handling (\`NullPointerException\`, \`ArrayIndexOutOfBoundsException\`, \`ArithmeticException\`).

#### Q7: What is Try-With-Resources and why is it preferred?
Introduced in Java 7, Try-With-Resources automatically closes any resource that implements \`java.lang.AutoCloseable\` (such as Database connections, File streams, and Sockets) once the try block completes, preventing resource leaks.

\`\`\`java
// Try-with-resources auto-closes BufferedReader
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class ResourceDemo {
    public static void readFile(String path) {
        try (BufferedReader br = new BufferedReader(new FileReader(path))) {
            System.out.println(br.readLine());
        } catch (IOException e) {
            System.err.println("Failed reading file: " + e.getMessage());
        }
    }
}
\`\`\`

---

### 6. Java 8 Streams & Lambda Expressions

#### Q8: What are Lambda Expressions and Functional Interfaces?
A Functional Interface is an interface with **exactly one abstract method** (e.g. \`Runnable\`, \`Callable\`, \`Predicate<T>\`, \`Function<T,R>\`, \`Consumer<T>\`). It is annotated with \`@FunctionalInterface\`.
Lambda expressions provide a clear and concise syntax to implement functional interfaces without writing anonymous inner classes.

#### Q9: How to filter, transform, and aggregate data using Java 8 Streams?

\`\`\`java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamsMasterclass {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // 1. Filter even numbers and compute their squares
        List<Integer> evenSquares = numbers.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .collect(Collectors.toList());
            
        System.out.println("Even Squares: " + evenSquares); // [4, 16, 36, 64, 100]

        // 2. Reduce to compute sum
        int totalSum = numbers.stream()
            .reduce(0, Integer::sum);
            
        System.out.println("Total Sum: " + totalSum); // 55
    }
}
\`\`\`
    `,
  },
  {
    id: '4',
    slug: 'top-50-python-interview-questions-coding-freshers',
    title: 'Python Technical Interview & Coding Masterclass for Freshers',
    subtitle: 'Master data structures, list comprehensions, decorators, generators, and OOPs in Python.',
    description: 'Essential Python interview questions asked by product startups and service-based IT companies during fresher campus and off-campus placements.',
    category: 'Technical Prep',
    readTime: '13 min read',
    publishedAt: '2026-08-22',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Python', 'Data Structures', 'Coding Interview', 'Backend', 'AI/ML'],
    tableOfContents: [
      { id: 'python-basics', title: '1. Python Fundamentals (Mutable vs Immutable, Memory)' },
      { id: 'list-dict-tuples', title: '2. Lists, Tuples, Sets & Dictionaries Compared' },
      { id: 'decorators-generators', title: '3. Decorators & Generators Explained with Code' },
      { id: 'args-kwargs', title: '4. *args, **kwargs and Scope Resolution (LEGB)' },
      { id: 'top-coding-problems', title: '5. Top 5 Python Coding Interview Challenges' },
    ],
    content: `
### 1. Python Fundamentals

#### Q1: What is the difference between Mutable and Immutable objects in Python?
- **Mutable:** Objects whose state or contents can be modified in-place after creation without changing their memory ID (\`list\`, \`dict\`, \`set\`, \`bytearray\`).
- **Immutable:** Objects whose state cannot be changed once allocated. Modifying them creates a new object in memory (\`int\`, \`float\`, \`string\`, \`tuple\`, \`frozenset\`).

#### Q2: What is the Python GIL (Global Interpreter Lock)?
**Answer:** The GIL is a mutex (or lock) that allows only one native thread to execute Python bytecode at a time in CPython. This ensures thread safety in memory management. For CPU-bound tasks, developers use the \`multiprocessing\` module instead of \`threading\` to leverage multiple CPU cores.

---

### 2. Lists vs Tuples vs Sets vs Dictionaries

| Data Structure | Ordered | Mutable | Duplicates Allowed | Indexable |
| :--- | :---: | :---: | :---: | :---: |
| **List \`[]\`** | Yes | Yes | Yes | Yes |
| **Tuple \`()\`** | Yes | No | Yes | Yes |
| **Set \`{}\`** | No | Yes | No | No |
| **Dict \`{k: v}\`** | Yes (3.7+) | Yes | Keys: No, Values: Yes | Key-based |

---

### 3. Decorators and Generators

#### Q3: What is a Decorator and where is it used?
A decorator is a design pattern in Python that allows you to add new functionality to an existing function or method without modifying its structure.

\`\`\`python
import time

def timing_decorator(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"Executed {func.__name__} in {end_time - start_time:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def calculate_squares(n):
    return [i**2 for i in range(n)]

calculate_squares(1000000)
\`\`\`

#### Q4: What is the difference between \`return\` and \`yield\`?
- \`return\` terminates the function and returns a single value back to the caller.
- \`yield\` turns the function into a **Generator**. It pauses function execution, saves its state, and yields an item one at a time on-demand, saving immense memory when handling huge datasets.

---

### 4. *args, **kwargs and Scope Resolution (LEGB)

#### Q5: What is the purpose of \`*args\` and \`**kwargs\`?
- \`*args\` allows you to pass a variable number of non-keyword positional arguments to a function as a **tuple**.
- \`**kwargs\` allows you to pass a variable number of keyword arguments to a function as a **dictionary**.

#### Q6: How does Python resolve variable scope (LEGB Rule)?
Python searches for variable names in the following exact sequence:
1. **L (Local):** Defined inside the current function.
2. **E (Enclosing):** Defined in the outer enclosing scope of nested functions.
3. **G (Global):** Defined at the top level of the module/script.
4. **B (Built-in):** Reserved built-in names (\`len\`, \`range\`, \`print\`, \`open\`).

---

### 5. Top 5 Python Coding Interview Challenges

#### Q7: Write a function to check if two strings are Anagrams:

\`\`\`python
def is_anagram(s1: str, s2: str) -> bool:
    clean_s1 = s1.replace(" ", "").lower()
    clean_s2 = s2.replace(" ", "").lower()
    
    if len(clean_s1) != len(clean_s2):
        return False
        
    char_count = {}
    for char in clean_s1:
        char_count[char] = char_count.get(char, 0) + 1
        
    for char in clean_s2:
        if char not in char_count or char_count[char] == 0:
            return False
        char_count[char] -= 1
        
    return True

print(is_anagram("listen", "silent")) # True
print(is_anagram("triangle", "integral")) # True
\`\`\`
    `,
  },
  {
    id: '5',
    slug: 'ats-friendly-resume-guide-tech-freshers-with-examples',
    title: 'How to Write an ATS-Friendly Resume for Freshers with Zero Experience (With Examples)',
    subtitle: 'The ultimate guide to formatting, keyword optimization, and project framing to pass Applicant Tracking Systems.',
    description: 'Learn the exact resume structure, typography, action verbs, and project descriptions that help college freshers get shortlisted for top tech companies.',
    category: 'Career Roadmaps',
    readTime: '10 min read',
    publishedAt: '2026-08-23',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Resume Tips', 'ATS Score', 'Freshers', 'Off-Campus Jobs', 'Career Guide'],
    tableOfContents: [
      { id: 'how-ats-works', title: '1. How ATS (Applicant Tracking Systems) Work' },
      { id: 'resume-formatting-rules', title: '2. 6 Non-Negotiable ATS Formatting Rules' },
      { id: 'project-bullet-points', title: '3. The Google XYZ Formula for High-Impact Projects' },
      { id: 'technical-skills-section', title: '4. Technical Skills Section Architecture' },
      { id: 'action-verbs', title: '5. High-Impact Action Verbs & Keywords' },
      { id: 'free-template-checklist', title: '6. Free Checklist Before You Send Your Resume' },
    ],
    content: `
### 1. How ATS (Applicant Tracking Systems) Work
Over 90% of Fortune 500 companies and tech recruitment platforms (Workday, Taleo, Greenhouse, Lever) use Applicant Tracking Systems (ATS) to filter resumes before a human recruiter ever sees them.

The ATS bot parses your document, strips away styling, extracts text into structured fields (Name, Contact, Education, Skills, Work Experience), and compares your keywords against the Job Description (JD). If your match score is below 70%, your resume is automatically archived.

---

### 2. 6 Non-Negotiable ATS Formatting Rules

1. **Use Single-Column Layouts:** Two-column or split-pane templates often confuse ATS parsers, mixing text from the left column with the right column.
2. **Avoid Graphics, Icons, & Tables:** Do not use skill progress bars (e.g. "Python 80%"), tables, or headshot photos.
3. **Stick to Clean Standard Fonts:** Use Arial, Calibri, Inter, or Roboto in 10–11pt for body and 14–16pt for section headings.
4. **Save in Standard PDF Format:** Unless the application specifically demands a \`.docx\` Word document, export as standard PDF.
5. **Exact Standard Headings:** Always name your sections clearly: **Education**, **Technical Skills**, **Projects**, **Experience / Internships**, **Certifications**.
6. **Keep it Strictly to 1 Page:** As a fresher with 0–1 years of experience, two-page resumes are viewed negatively by recruiters.

---

### 3. The Google XYZ Formula for High-Impact Projects

When writing project bullet points, avoid passive sentences like:
- ❌ **Bad:** *"Worked on an e-commerce website using React and Node.js."*

Instead, use Google's famous **XYZ Formula**:
> **Formula:** *"Accomplished [X] as measured by [Y], by doing [Z]"*

- ✅ **Great:** *"Developed a full-stack e-commerce web app using React, Node.js, and PostgreSQL, reducing checkout page latency by 35% through Redis caching and JWT authentication."*
- ✅ **Great:** *"Engineered an automated price-tracking bot in Python that monitored 5,000+ items daily, alerting 200+ users via Telegram bot webhook."*

---

### 4. Technical Skills Section Architecture

Organize your skills into distinct, searchable sub-categories rather than a single comma-separated paragraph:

- **Languages:** Java, Python, JavaScript (ES6+), C++, SQL.
- **Frontend & Web:** React.js, Next.js, HTML5, CSS3, Tailwind CSS.
- **Backend & Database:** Node.js, Express, PostgreSQL, MongoDB, RESTful APIs.
- **Developer Tools & Cloud:** Git, GitHub, Docker, Postman, Vercel, Supabase.
- **Core Competencies:** Data Structures & Algorithms, OOPs, DBMS, Operating Systems, Computer Networks.

---

### 5. High-Impact Action Verbs & Keywords
Begin every single bullet point under Projects and Internships with a strong action verb:
- **Development:** *Architected, Engineered, Implemented, Designed, Refactored.*
- **Optimization:** *Streamlined, Accelerated, Reduced, Optimized, Automated.*
- **Leadership:** *Spearheaded, Mentored, Orchestrated, Coordinated.*

---

### 6. Free Checklist Before You Send Your Resume
- [x] Contact info has professional email, phone, GitHub profile, and LinkedIn URL.
- [x] Every project has a live demo link or verifiable GitHub repository link.
- [x] File is saved with a clean naming convention: \`FirstName_LastName_Resume_2026.pdf\`.
- [x] Scanned with our [FreshersBridge ATS Resume Scanner](/career-tools) for 80%+ match rate.
    `,
  },
  {
    id: '6',
    slug: 'cognizant-genc-vs-genc-elevate-vs-genc-next-syllabus-guide',
    title: 'Cognizant GenC vs GenC Elevate vs GenC Next: Syllabus, Salary & Preparation',
    subtitle: 'A breakdown of Cognizant hiring tracks, skill assessment rounds, and coding patterns.',
    description: 'Learn the differences between Cognizant GenC (4 LPA), GenC Elevate (4.5 LPA), and GenC Next (6.75 LPA) hiring streams and how to prepare.',
    category: 'Company Patterns',
    readTime: '10 min read',
    publishedAt: '2026-08-24',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Cognizant', 'GenC', 'Off-Campus', 'Syllabus', 'Campus Hiring'],
    tableOfContents: [
      { id: 'genc-tiers', title: '1. Cognizant Hiring Tiers & Package Comparison' },
      { id: 'assessment-structure', title: '2. Assessment Structure & Platform Details' },
      { id: 'syllabus-by-tier', title: '3. Syllabus for GenC vs GenC Next' },
      { id: 'interview-tips', title: '4. Technical Interview Strategies' },
    ],
    content: `
### 1. Cognizant Hiring Tiers & Package Comparison
Cognizant offers three primary hiring streams for college freshers:

1. **Cognizant GenC:** ₹4.00 LPA. Focuses on foundational aptitude, communication, and basic coding awareness.
2. **Cognizant GenC Elevate:** ₹4.25 – ₹4.75 LPA. Requires solid understanding of full-stack web technologies or cloud fundamentals and intermediate coding.
3. **Cognizant GenC Next:** ₹6.75 – ₹7.25 LPA. Demands advanced problem-solving, data structures, algorithm optimization, and complex full-stack/AI capabilities.

---

### 2. Assessment Structure & Platform Details
- **GenC Aptitude & Communication:** Quantitative aptitude (25 Qs), Analytical reasoning (25 Qs), and Verbal ability (20 Qs) conducted on Superset or AMCAT.
- **Skill-Based Coding (For GenC Elevate & Next):** 2 Coding problems covering String manipulation, HashMaps, Sliding Window, and Graph traversals.

---

### 3. Syllabus for GenC vs GenC Next
- **Foundational Aptitude:** Number properties, Time & Distance, Profit/Loss, Data Interpretation charts, Deductive reasoning.
- **GenC Next Technical Track:** Dynamic programming, Bit manipulation, REST API design, OOPs principles, SQL complex subqueries.

---

### 4. Technical Interview Strategies
- Walk through your GitHub projects step-by-step using architecture diagrams.
- Explain trade-offs between different data structures (e.g. Array vs LinkedList, HashMap vs TreeMap).
- Be thorough with fundamentals of database normalization (1NF, 2NF, 3NF, BCNF).
    `,
  },
  {
    id: '7',
    slug: 'sql-interview-questions-queries-freshers-data-software-roles',
    title: 'SQL Interview Queries & Practical Database Masterclass for Freshers',
    subtitle: 'From Inner/Outer Joins and Subqueries to Window Functions, Duplicates, and Query Optimization.',
    description: 'Master high-frequency SQL interview queries asked in tech interviews for Software Engineers, Data Analysts, and Backend Developers.',
    category: 'Technical Prep',
    readTime: '12 min read',
    publishedAt: '2026-08-22',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['SQL', 'Database', 'PostgreSQL', 'Data Analytics', 'Backend'],
    tableOfContents: [
      { id: 'nth-highest-salary', title: '1. Finding the N-th Highest Salary (Top Interview Query)' },
      { id: 'duplicate-records', title: '2. Finding & Removing Duplicate Records' },
      { id: 'sql-joins-hierarchy', title: '3. SQL Joins & Employee-Manager Hierarchy (Self Join)' },
      { id: 'window-functions', title: '4. Essential Window Functions (ROW_NUMBER, RANK, DENSE_RANK)' },
      { id: 'indexing-transactions', title: '5. ACID Properties and Indexing Optimization' },
    ],
    content: `
### 1. Finding the N-th Highest Salary
This is the single most frequently asked query in fresher database interviews.

\`\`\`sql
-- Approach 1: Using DENSE_RANK() Window Function (Best Industry Standard)
WITH RankedEmployees AS (
    SELECT 
        emp_id, 
        emp_name, 
        salary,
        DENSE_RANK() OVER (ORDER BY salary DESC) as rank_num
    FROM employees
)
SELECT emp_id, emp_name, salary
FROM RankedEmployees
WHERE rank_num = 2; -- 2nd Highest Salary

-- Approach 2: Using LIMIT & OFFSET (PostgreSQL / MySQL)
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1; -- 2nd highest (OFFSET = N - 1)
\`\`\`

---

### 2. Finding & Removing Duplicate Records

\`\`\`sql
-- Query 1: Find duplicate emails and their frequency
SELECT email, COUNT(*) as occurrence_count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Query 2: Delete duplicate records while keeping the smallest ID
DELETE FROM users
WHERE id NOT IN (
    SELECT MIN(id)
    FROM users
    GROUP BY email
);
\`\`\`

---

### 3. SQL Joins & Employee-Manager Hierarchy (Self Join)

\`\`\`sql
-- Self Join to find Employee Name along with their Manager Name
SELECT 
    e.emp_name AS Employee,
    COALESCE(m.emp_name, 'Top Executive / CEO') AS Manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;
\`\`\`

#### Visual Summary of SQL Joins:
- **INNER JOIN:** Returns records that have matching values in both tables.
- **LEFT (OUTER) JOIN:** Returns all records from the left table, and the matched records from the right table.
- **RIGHT (OUTER) JOIN:** Returns all records from the right table, and matched records from the left table.
- **FULL OUTER JOIN:** Returns all records when there is a match in either left or right table.

---

### 4. Essential Window Functions (ROW_NUMBER, RANK, DENSE_RANK)

\`\`\`sql
-- Find the Highest Paid Employee in EACH Department
WITH DepartmentRanks AS (
    SELECT 
        emp_id,
        emp_name,
        department_id,
        salary,
        DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as dept_rank
    FROM employees
)
SELECT emp_id, emp_name, department_id, salary
FROM DepartmentRanks
WHERE dept_rank = 1;
\`\`\`

- **\`ROW_NUMBER()\`:** Assigns a unique sequential integer to each row within a partition without duplicates (1, 2, 3, 4).
- **\`RANK()\`:** Assigns rank with gaps on tied values (1, 2, 2, 4).
- **\`DENSE_RANK()\`:** Assigns rank without gaps on tied values (1, 2, 2, 3).

---

### 5. ACID Properties and Indexing Optimization
- **Atomicity:** All operations in a database transaction succeed or all rollback.
- **Consistency:** Database transitions from one valid state to another valid state.
- **Isolation:** Concurrent transactions execute without dirty reads or race conditions.
- **Durability:** Committed data is safely written to disk and survives system crashes.

\`\`\`sql
-- Creating B-Tree Index for faster query lookups
CREATE INDEX idx_users_email ON users(email);
\`\`\`
    `,
  },
  {
    id: '8',
    slug: 'full-stack-web-development-roadmap-college-students',
    title: '6-Month Full-Stack Web Development Roadmap for College Students',
    subtitle: 'From HTML/CSS and JavaScript to Next.js, Node.js, PostgreSQL, and Cloud Deployment.',
    description: 'A structured, month-by-month learning blueprint designed to take college students from zero programming to building production-ready web apps.',
    category: 'Career Roadmaps',
    readTime: '14 min read',
    publishedAt: '2026-08-18',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Full Stack', 'Web Development', 'Roadmap', 'React', 'Node.js'],
    tableOfContents: [
      { id: 'month-1-frontend-basics', title: '1. Month 1: HTML5, Modern CSS & Responsive UI' },
      { id: 'month-2-javascript-mastery', title: '2. Month 2: Deep JavaScript (ES6+, Async/Await, DOM)' },
      { id: 'month-3-react-ecosystem', title: '3. Month 3: React.js, Hooks & State Management' },
      { id: 'month-4-backend-database', title: '4. Month 4: Node.js, Express & PostgreSQL / Supabase' },
      { id: 'month-5-fullstack-frameworks', title: '5. Month 5: Next.js, Tailwind CSS & REST APIs' },
      { id: 'month-6-portfolio-deployment', title: '6. Month 6: Capstone Projects, CI/CD & Deployment' },
    ],
    content: `
### 1. Month 1: HTML5, Modern CSS & Responsive UI
- **Semantic HTML Structure:** Master semantic tags: \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, and \`<footer>\`.
- **Modern Layouts:** CSS Flexbox (align-items, justify-content, flex-wrap) and CSS Grid (grid-template-columns, gap, auto-fit).
- **Responsive Web Design:** Mobile-first approach using CSS media queries and modern viewport units.
- **Milestone Project:** Build 2 responsive landing pages from scratch with zero framework dependencies.

---

### 2. Month 2: Deep JavaScript (ES6+, Async/Await, DOM)
- **Core Engine:** Primitive vs Reference data types, Execution Context, Call Stack, and Scopes (Block, Function, Lexical).
- **ES6+ Modern Syntax:** Destructuring, Rest/Spread operators, Arrow functions, and Array utilities (\`.map()\`, \`.filter()\`, \`.reduce()\`, \`.some()\`).
- **Asynchronous JavaScript:** The JavaScript Event Loop, Callback Queue, Promises, and \`async/await\` error handling with \`try/catch\`.
- **Milestone Project:** Build an interactive dynamic Quiz App consuming a public REST API.

---

### 3. Month 3: React.js, Hooks & State Management
- **Declarative UI:** JSX syntax, Component architecture, Props drilling, and unidirectional data flow.
- **Core React Hooks:** \`useState\` for local state, \`useEffect\` for side effects and data fetching, \`useMemo\` and \`useCallback\` for performance optimization, and \`useRef\` for DOM references.
- **Global State:** State management using React Context API and custom reusable hooks.
- **Milestone Project:** Build an interactive Movie Search & Bookmark application with local storage persistence.

---

### 4. Month 4: Node.js, Express & PostgreSQL / Supabase
- **Backend Architecture:** REST API conventions (GET, POST, PUT, DELETE, PATCH), Express routing, and middleware pipelines.
- **Database Engineering:** Relational schema design, Primary & Foreign Keys, 1-to-N relationships, and SQL queries in PostgreSQL.
- **Authentication & Security:** Password hashing using \`bcrypt\`, User session authentication with JWT (JSON Web Tokens), and CORS protection.
- **Milestone Project:** Build a secure User Authentication and Task Management REST API with PostgreSQL database storage.

---

### 5. Month 5: Next.js, Tailwind CSS & REST APIs
- **Full-Stack Frameworks:** Next.js App Router, React Server Components (RSC) vs Client Components (\`'use client'\`).
- **Data Fetching:** Server-Side Rendering (SSR), Static Site Generation (SSG), and Server Actions.
- **Styling:** Rapid modern UI development with utility-first Tailwind CSS.
- **SEO & Performance:** Meta tags, OpenGraph images, and Google Structured Data JSON-LD schemas.

---

### 6. Month 6: Capstone Projects, CI/CD & Deployment
- **Capstone Build:** Develop a full-scale Job Board / SaaS platform with real database connections, search filters, and resume scanning.
- **DevOps & Cloud Deployment:** Automated deployment on Vercel, Supabase Cloud Database, and GitHub Actions CI/CD workflows.
- **Proof of Work:** Create concise video demonstrations and publish well-documented \`README.md\` repositories on GitHub.
    `,
  },
  {
    id: '9',
    slug: 'hr-interview-questions-answers-for-freshers-with-best-responses',
    title: 'HR Round Interview Masterclass: High-Frequency Questions & Model Answers for Freshers',
    subtitle: 'Master behavioral questions, the 90-second self-introduction, weaknesses strategy, salary discussions, and questions to ask the recruiter.',
    description: 'Learn how to answer "Tell me about yourself", "What are your strengths and weaknesses", and behavioral scenario questions to clear final HR rounds.',
    category: 'HR & Soft Skills',
    readTime: '11 min read',
    publishedAt: '2026-08-23',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['HR Interview', 'Soft Skills', 'Behavioral', 'Freshers', 'Placement Prep'],
    tableOfContents: [
      { id: 'tell-me-about-yourself', title: '1. Tell Me About Yourself (The 90-Second Formula)' },
      { id: 'strengths-weaknesses', title: '2. Strengths and Weaknesses Strategy' },
      { id: 'why-our-company', title: '3. Why Do You Want to Join Our Company?' },
      { id: 'handling-failures', title: '4. Tell Me About a Time You Faced a Challenge' },
      { id: 'asking-hr-questions', title: '5. Smart Questions to Ask the HR at the End' },
    ],
    content: `
### 1. Tell Me About Yourself (The 90-Second Formula)
Avoid reciting your high school marks or repeating line-by-line what is already written on your resume. Use the structured **Present-Past-Future Framework**:

- **Phase 1: Present (0–30s)** — Introduce your degree, engineering branch, and current technical core focus:
> *"I am a final-year Computer Science graduate with a primary focus on full-stack web engineering, API design, and scalable database architecture."*

- **Phase 2: Past (30–60s)** — Highlight your standout project, hackathon win, or internship milestone:
> *"During my engineering, I built a real-time collaborative code editor with Next.js and WebSockets, which was recognized among top 10 projects at our college hackathon."*

- **Phase 3: Future (60–90s)** — Connect why your skills align directly with this company:
> *"I am eager to contribute my problem-solving skills, learn industry-standard distributed systems practices, and add immediate value to your engineering team."*

---

### 2. Strengths and Weaknesses Strategy
The key is to state a **genuine technical or process weakness** and immediately explain the **active steps you are taking to overcome it**.

#### High-Impact Model Answer:
> *"In the past, I sometimes hesitated to ask for help when stuck on a bug, spending hours debugging alone. I realized this slowed down team velocity during group projects. Now, I follow a strict 30-minute rule: I research deeply for 30 minutes, and if still blocked, I seek guidance from a mentor or teammate."*

---

### 3. Why Do You Want to Join Our Company?
- Research the company's recent engineering blogs, client projects, or product initiatives.
- Express excitement about their engineering culture, mentorship programs, and growth opportunities.

#### Model Answer:
> *"I have followed your engineering team's recent transition to cloud-native microservices architecture. Given my strong foundation in full-stack web systems and relational databases, I want to learn from seasoned engineers while contributing directly to scalable customer-facing applications."*

---

### 4. Tell Me About a Time You Faced a Challenge
Use the **STAR Framework (Situation, Task, Action, Result)**:

- **Situation:** Our primary database crashed 3 days before our final-year project submission.
- **Task:** I took direct ownership of database recovery, schema migration, and uptime stabilization.
- **Action:** I restructured our database queries, established automated backups on Supabase, and wrote migration scripts in Node.js.
- **Result:** We restored 100% of data and successfully completed our live evaluation demo with zero errors.

#### Full Model STAR Response:
> *"During our final year group project, our primary database instance failed 3 days before final submission. I took immediate ownership of database recovery, migrated our schema to Supabase with automated daily snapshots, and refactored our queries. We restored 100% of our dataset in under 4 hours and successfully delivered our live evaluation demo with zero downtime."*

---

### 5. Smart Questions to Ask the HR at the End
1. "What training programs or structured learning tracks are provided for new graduate engineering hires?"
2. "What does a typical sprint and day-to-day workflow look like for a junior software engineer in this division?"
3. "What are the key performance milestones expected during the initial 90 days of onboarding?"
    `,
  },
  {
    id: '10',
    slug: 'off-campus-placement-drive-strategy-for-tier-3-college-students',
    title: 'Off-Campus Placement Strategy for Tier-3 College Graduates in 2026',
    subtitle: 'A proven step-by-step blueprint to land 6+ LPA tech roles without on-campus company visits.',
    description: 'Learn cold outreach on LinkedIn, GitHub proof of work, referral networking, and career portal strategies to land tech jobs from non-IIT/NIT colleges.',
    category: 'Career Roadmaps',
    readTime: '13 min read',
    publishedAt: '2026-08-24',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Off-Campus', 'Tier-3 Colleges', 'LinkedIn Referrals', 'Career Blueprint', 'Job Hunt'],
    tableOfContents: [
      { id: 'mindset-shift', title: '1. The Tier-3 Reality & The Proof-of-Work Mindset' },
      { id: 'linkedin-networking', title: '2. How to Ask for Employee Referrals on LinkedIn' },
      { id: 'github-portfolio', title: '3. Building a GitHub Portfolio that Impresses Recruiters' },
      { id: 'off-campus-timing', title: '4. Off-Campus Drive Calendar & Timing' },
      { id: 'daily-routine', title: '5. Daily Job Search Routine for Unplaced Freshers' },
    ],
    content: `
### 1. The Tier-3 Reality & The Proof-of-Work Mindset
Students from Tier-3 engineering colleges cannot rely on mass campus visits. To compete with Tier-1/Tier-2 peers, your **Proof of Work** (GitHub repositories, live deployed projects, technical articles, and open-source contributions) must speak louder than your college brand.

---

### 2. How to Ask for Employee Referrals on LinkedIn
Never message senior engineers with "Sir please refer me" or send your raw resume with no context.

#### The High-Converting Referral Script:
> **Subject:** Quick question regarding [Job ID] / [Role Name] at [Company]
> 
> "Hi [Name], I noticed you work on the Engineering team at [Company]. I recently came across the [Role Title] opening (Job ID: 12345) and noticed that my experience with React, Node.js, and PostgreSQL aligns closely with the requirements.
> 
> I have built and deployed a production app with 500+ active users. If you have a few minutes, would you be open to reviewing my profile for a referral? Resume attached for your convenience.
> 
> Thank you for your time and guidance!"

---

### 3. Building a GitHub Portfolio that Impresses Recruiters
- Avoid generic tutorial clones (like basic to-do apps).
- Build full-stack apps with user authentication, real database connections, error boundaries, and unit tests.
- Write exceptional \`README.md\` documentation with architecture diagrams, live demo URLs, and setup instructions.

---

### 4. Off-Campus Drive Calendar & Timing
- **August – October:** National qualifier tests (TCS NQT, Cognizant GenC, Infosys InfyTQ).
- **November – January:** Product startups and mid-size IT firms hiring for winter/spring internships.
- **February – May:** Off-campus immediate joiner drives for 2026 graduating batch.

---

### 5. Daily Job Search Routine for Unplaced Freshers
- **Morning (9 AM – 12 PM):** Solve 2 LeetCode / HackerRank coding problems and revise 1 Core CS subject.
- **Afternoon (1 PM – 4 PM):** Build and improve your primary capstone project.
- **Evening (5 PM – 7 PM):** Apply to 10 verified fresh job drives on [FreshersBridge](/jobs) and send 5 personalized LinkedIn referral requests.
    `,
  },
  {
    id: '11',
    slug: 'wipro-elite-nth-2026-syllabus-exam-pattern-coding-preparation',
    title: 'Wipro Elite NTH 2026: Complete Exam Pattern, Syllabus & Coding Blueprint',
    subtitle: 'Everything freshers need to crack Wipro Elite Project Engineer (₹3.5 LPA) and Turbo (₹6.5 LPA) off-campus hiring drives.',
    description: 'A detailed breakdown of Wipro National Talent Hunt (NTH) test pattern, including Quantitative Aptitude, Logical Reasoning, Verbal, Essay Writing rules, and Coding problem patterns.',
    category: 'Company Patterns',
    readTime: '11 min read',
    publishedAt: '2026-08-25',
    updatedAt: '2026-09-02',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Wipro', 'Wipro NTH', 'Off-Campus', 'Aptitude', 'Freshers 2026'],
    tableOfContents: [
      { id: 'eligibility', title: '1. Wipro Elite Eligibility & Criteria' },
      { id: 'exam-pattern', title: '2. 3-Stage Assessment Pattern' },
      { id: 'essay-writing', title: '3. Written Communication (Essay) Secrets' },
      { id: 'coding-section', title: '4. Coding Section: Top Tested Topics' },
      { id: 'interview-prep', title: '5. Technical & HR Interview Questions' },
    ],
    content: `
### 1. Wipro Elite Eligibility & Criteria
Wipro’s National Talent Hunt (NTH) hires engineering graduates for the **Project Engineer** role with a starting package of ₹3.5 LPA (with an upgrade opportunity to Turbo at ₹6.5 LPA upon high performance).

* **Qualification:** B.E. / B.Tech / 5-Year Integrated M.Tech.
* **Eligible Branches:** All engineering streams (Circuit & Non-Circuit).
* **Cutoff:** Minimum 60% or 6.0 CGPA in 10th, 12th, and Degree without active backlogs.
* **Maximum Gap:** Up to 3 years permitted between 10th and Graduation.

---

### 2. 3-Stage Assessment Pattern
The online assessment is hosted on the AMCAT / CoCubes platform and spans **128 minutes**:

1. **Aptitude Section (48 mins):** Logical Reasoning, Quantitative Ability, and Verbal English.
2. **Written Communication (20 mins):** Automated essay writing evaluated by AI on grammar, structure, and vocabulary.
3. **Online Programming (60 mins):** 2 coding questions covering Arrays, Strings, Searching, and Sorting in C++, Java, or Python.

---

### 3. Written Communication (Essay) Secrets
* Maintain an essay length between **200 and 350 words**.
* Do not use conversational slang, contractions (use *do not* instead of *don't*), or repetitive points.
* Follow the 3-paragraph structure: Introduction $\rightarrow$ Key Supporting Arguments $\rightarrow$ Balanced Conclusion.

---

### 4. Coding Section: Top Tested Topics
The Wipro programming round allocates **60 minutes for 2 coding questions**. The platform supports C, C++, Java, and Python.

1. **Question 1 (Easy):** Basic array or string operations such as counting vowels, checking prime numbers, matrix transposition, or finding the second maximum number in an array.
2. **Question 2 (Medium):** Involves hashing, string manipulation, or two-pointer logic such as checking anagrams, removing duplicate elements in $O(n)$ time, or merging sorted arrays.

\`\`\`python
# Classic Wipro Pattern: Finding element with highest frequency
def most_frequent_element(arr):
    freq = {}
    max_count = 0
    res = arr[0]
    for num in arr:
        freq[num] = freq.get(num, 0) + 1
        if freq[num] > max_count:
            max_count = freq[num]
            res = num
    return res
\`\`\`

---

### 5. Technical & HR Interview Questions
Candidates clearing the online assessment advance to the combined Technical + HR interview:
* **Core CS & OOP:** Explain the four pillars of Object-Oriented Programming with real-world examples. What is the difference between Method Overloading and Method Overriding?
* **DBMS & SQL:** Write an SQL query to fetch the 2nd highest salary from an Employee table. Explain Primary Key vs Unique Key.
* **Project Discussion:** Be prepared to draw your college major project architecture on screen and justify your tech stack choices.
* **HR Essentials:** Are you willing to relocate to any Wipro development center in India? Are you comfortable working in rotating shift patterns?
    `,
  },
  {
    id: '12',
    slug: 'infosys-sp-dse-2026-recruitment-process-syllabus-coding-guide',
    title: 'Infosys SP & DSE Package, Roles & Exam Pattern 2026: Complete Hiring Guide',
    subtitle: 'How freshers can crack the ₹9.5 LPA Specialist Programmer (SP) and ₹6.25 LPA Digital Specialist Engineer (DSE) roles with syllabus & coding questions.',
    description: 'Complete breakdown of Infosys SP & DSE package, roles, syllabus, HackWithInfy coding problems, and technical interview questions for 2026 freshers.',
    category: 'Company Patterns',
    readTime: '13 min read',
    publishedAt: '2026-08-28',
    updatedAt: '2026-09-13',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Infosys', 'Specialist Programmer', 'DSE', 'Coding', 'Freshers 2026', 'Infosys SP DSE Package', 'Digital Specialist Engineer (DSE)', 'Infosys SP and DSE Role Package'],
    tableOfContents: [
      { id: 'roles-overview', title: '1. Infosys SP and DSE Package, Roles & Salary Differences' },
      { id: 'exam-structure', title: '2. HackWithInfy & SP Exam Structure' },
      { id: 'coding-problems', title: '3. Advanced Algorithmic Patterns' },
      { id: 'interview-prep', title: '4. System Design & Technical Interview' },
    ],
    content: `
### 1. Infosys SP and DSE Package, Roles & Salary Differences
Infosys offers three distinct tiers of entry-level engineering roles through off-campus drives and HackWithInfy:

* **Systems Engineer (SE):** ₹3.60 LPA – Core software maintenance and baseline technology enablement.
* **Digital Specialist Engineer (DSE):** ₹6.25 LPA – Full-stack engineering, microservices, and cloud architectures.
* **Specialist Programmer (SP):** ₹9.50 LPA – Elite competitive programming and distributed systems engineering.

#### Detailed Infosys SP and DSE Package Breakdown:
| Role Designation | Total CTC | In-Hand Monthly (Approx) | Probation Period | Target Tech Stack |
| :--- | :---: | :---: | :---: | :--- |
| **Systems Engineer (SE)** | ₹3.60 LPA | ₹24,000 – ₹26,000 | 6 Months (Mysore Training) | Java, Testing, Maintenance |
| **Digital Specialist Engineer (DSE)** | ₹6.25 LPA | ₹44,000 – ₹47,000 | 3 Months | Full Stack, Cloud, Microservices |
| **Specialist Programmer (SP)** | ₹9.50 LPA | ₹68,000 – ₹72,000 | Direct Project | AI/ML, Distributed Systems, Comp Algo |

---

### 2. HackWithInfy & SP Exam Structure
The assessment consists of **3 intense algorithmic problems** with a duration of 3 hours:
* **Question 1 (Easy-Medium):** Greedy algorithms, Two-Pointer technique, or HashMaps.
* **Question 2 (Medium-Hard):** Tree / Graph Traversals (BFS, DFS, Dijkstra) or Dynamic Programming on subsequences.
* **Question 3 (Hard):** Advanced Dynamic Programming (Bitmask / Trees), Segment Trees, or Game Theory.

To secure an interview for SP (₹9.5 LPA), candidates typically need to solve at least **2 full questions with 100% test cases passing**.

---

### 3. Advanced Algorithmic Patterns
For the Specialist Programmer and DSE tracks, simple brute force solutions will result in **Time Limit Exceeded (TLE)** errors due to constraints up to $N = 10^5$. Focus on:
1. **Dynamic Programming:** 0/1 Knapsack variations, Longest Increasing Subsequence (LIS in $O(n \log n)$), and Matrix Chain Multiplication.
2. **Graph Algorithms:** Shortest path algorithms (Dijkstra, Bellman-Ford), Disjoint Set Union (DSU / Kruskal's for Minimum Spanning Trees).
3. **Prefix Sums & Sliding Window:** Subarray sum equals $K$, longest substring with unique characters.

\`\`\`java
// Typical Infosys DSE problem: Subarray Sum Equals K (O(n) with HashMap)
import java.util.HashMap;

public class Solution {
    public int subarraySum(int[] nums, int k) {
        int count = 0, sum = 0;
        HashMap<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);
        for (int num : nums) {
            sum += num;
            if (map.containsKey(sum - k)) {
                count += map.get(sum - k);
            }
            map.put(sum, map.getOrDefault(sum, 0) + 1);
        }
        return count;
    }
}
\`\`\`

---

### 4. System Design & Technical Interview
The interview for DSE and SP cadres is significantly more rigorous than the standard Systems Engineer round:
* **Live Coding on Editor:** The interviewer will give you an unsolved algorithmic challenge and ask you to explain your thought process while coding in real time.
* **System Design Fundamentals:** Basic high-level architecture questions such as designing a URL Shortener (TinyURL) or an in-memory Key-Value cache.
* **Database & Concurrency:** Explain indexing structures (B-Trees), ACID transactions, thread safety, and REST API idempotency.
    `,
  },
  {
    id: '13',
    slug: 'cognizant-genc-elevate-2026-exam-pattern-interview-blueprint',
    title: 'Cognizant GenC & GenC Elevate 2026: Complete Recruitment Pattern, Pseudocode & Interview Blueprint',
    subtitle: 'Master the Cognizant GenC (₹4.0 LPA), GenC Elevate (₹4.5 - ₹5.0 LPA), and GenC Next (₹6.75 - ₹9.0 LPA) hiring drives with real pseudocode problems, test pattern, and technical interview answers.',
    description: 'Complete guide for Cognizant freshers hiring (2024, 2025, 2026 batch). Detailed breakdown of Superset online test stages, 8 high-frequency pseudocode questions with step-by-step solutions, and technical interview questions.',
    category: 'Company Patterns',
    readTime: '14 min read',
    publishedAt: '2026-08-30',
    updatedAt: '2026-09-14',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Cognizant', 'GenC', 'GenC Elevate', 'GenC Next', 'Pseudocode', 'Freshers 2026', 'Campus Recruitment'],
    directAnswerSummary: 'Cognizant hires engineering freshers across three cadres: GenC (₹4.0 LPA, foundational aptitude & pseudocode), GenC Elevate (₹4.50–₹5.00 LPA, intermediate web/cloud coding), and GenC Next (₹6.75–₹9.00 LPA, advanced DSA). Eligible candidates require a minimum 60% throughout academics with up to 1 year education gap.',
    faqs: [
      {
        question: 'What is the salary difference between Cognizant GenC and GenC Elevate?',
        answer: 'Cognizant GenC offers ₹4.00 LPA focusing on foundational programming, while GenC Elevate offers ₹4.50 to ₹5.00 LPA for candidates proficient in full-stack web technologies or cloud fundamentals.'
      },
      {
        question: 'What is the eligibility criteria for Cognizant freshers hiring?',
        answer: 'B.E./B.Tech/M.E./M.Tech/MCA/M.Sc graduates from 2024, 2025, and 2026 batches with a minimum of 60% or 6.0 CGPA across 10th, 12th, and degree, with zero active backlogs.'
      },
      {
        question: 'Is there negative marking in Cognizant online test?',
        answer: 'No, there is no negative marking in the Cognizant aptitude and pseudocode assessment conducted on Superset/AMCAT.'
      },
      {
        question: 'Which round eliminates the most candidates in Cognizant GenC?',
        answer: 'The Pseudocode round (30 questions, 30 minutes) has the highest elimination rate, testing bitwise operators, recursion call stacks, and nested loops.'
      }
    ],
    tableOfContents: [
      { id: 'genc-cadres', title: '1. Cognizant Hiring Cadres: GenC vs Elevate vs Next' },
      { id: 'eligibility-criteria', title: '2. Eligibility Criteria for Freshers (Batches 2024, 2025, 2026)' },
      { id: 'exam-pattern', title: '3. Detailed Online Assessment Pattern & Mark Distribution' },
      { id: 'pseudocode-breakdown', title: '4. High-Frequency Pseudocode Questions with Step-by-Step Solutions' },
      { id: 'technical-interview', title: '5. Technical Interview Questions (OOP, DBMS & Web)' },
      { id: 'hr-interview-tips', title: '6. HR Interview Questions & Model Answers' },
      { id: 'how-to-apply', title: '7. How to Apply via Superset & Official Careers Portal' },
    ],
    content: `
### 1. Cognizant Hiring Cadres: GenC vs Elevate vs Next
Cognizant Technology Solutions recruits thousands of engineering and MCA freshers every year across three distinct salary and skill tiers. Understanding which track aligns with your preparation level is key to maximizing your chances:

| Hiring Cadre | Annual Package (CTC) | Focus Area | Technical Assessment Difficulty |
| :--- | :---: | :--- | :---: |
| **Cognizant GenC** | **₹4.00 LPA** | Foundational programming, problem-solving, and communication | Basic (Aptitude + Pseudocode) |
| **Cognizant GenC Elevate** | **₹4.50 – ₹5.00 LPA** | Full-Stack Web development, Cloud basics, or Python/Java development | Intermediate (Aptitude + Skill Coding) |
| **Cognizant GenC Next** | **₹6.75 – ₹9.00 LPA** | Advanced Data Structures, Algorithms, System Design & Generative AI | High (Hard DSA & Dynamic Programming) |

> **Key Takeaway:** Even if you apply initially for GenC, candidates who perform in the top 10th percentile in the skill assessment rounds are frequently upgraded by Cognizant talent acquisition to GenC Elevate and GenC Next interview rounds.

---

### 2. Eligibility Criteria for Freshers (Batches 2024, 2025, 2026)
To participate in Cognizant on-campus or national off-campus hiring drives, candidates must fulfill the following mandatory criteria:

- **Degrees Allowed:** B.E. / B.Tech / M.E. / M.Tech / MCA / M.Sc (Computer Science / Information Technology / Software Engineering).
- **Academic Cutoff:** Minimum **60% or 6.0 CGPA** throughout 10th Standard, 12th / Diploma, and Graduation/Post-Graduation.
- **Active Backlogs:** Zero active backlogs or standing arrears at the time of appearing for the selection process.
- **Education Gap:** Maximum of **12 months (1 year)** overall education gap allowed between completion of 12th/Diploma and commencement of engineering degree.
- **Nationality & Work Authorization:** Indian nationals with valid Government photo identification (Aadhaar Card, PAN Card, and Passport).

---

### 3. Detailed Online Assessment Pattern & Mark Distribution
Cognizant conducts its first-round filtration primarily on the **Superset** or **Aon CoCubes / AMCAT** assessment platforms. The test is strictly proctored via webcam and microphone.

| Section Name | Total Questions | Allocated Time | Sectional Elimination? |
| :--- | :---: | :---: | :---: |
| **Quantitative Ability** | 25 Questions | 25 Minutes | Yes |
| **Analytical / Logical Reasoning** | 25 Questions | 25 Minutes | Yes |
| **English Verbal Comprehension** | 20 Questions | 20 Minutes | Yes |
| **Pseudocode & Technical MCQ** | 30 Questions | 30 Minutes | **Critical Gatekeeper** |
| **Skill-Based Coding (For Elevate/Next)** | 2 Questions | 45 Minutes | Evaluated for higher package |
| **Total Test Duration** | **102 Questions** | **120 – 145 Minutes** | **Cumulative Ranking** |

> **Pro-Tip:** There is **NO negative marking** in the Cognizant aptitude and pseudocode test. Never leave any question unattempted—manage your pace at roughly 1 minute per question.

---

### 4. High-Frequency Pseudocode Questions with Step-by-Step Solutions
The **Pseudocode round** is where more than 60% of candidates get eliminated. Questions are written in standard pseudocode syntax simulating C/C++ execution. Here are the top recurring archetypes:

#### Problem 1: Bitwise XOR and Variable Swapping
\`\`\`text
Integer a, b, c
Set a = 14, b = 25
a = a ^ b
b = a ^ b
a = a ^ b
c = a + b
Print c
\`\`\`
**Solution & Explanation:**
- \`a ^ b\` followed by the three XOR operations is the classic XOR swap algorithm without a temporary variable.
- After line 5, \`a\` becomes \`25\` and \`b\` becomes \`14\`.
- \`c = 25 + 14 = 39\`.
- **Output:** \`39\`

#### Problem 2: Recursive Function Call Tree
\`\`\`text
Function solve(Integer n)
    If (n <= 1)
        Return 1
    End If
    Return solve(n - 1) + solve(n - 2) + 2
End Function
\`\`\`
*Find the output of \`solve(4)\`.*

**Step-by-Step Call Trace:**
- Base cases: \`solve(1) = 1\`, \`solve(0) = 1\`
- \`solve(2) = solve(1) + solve(0) + 2 = 1 + 1 + 2 = 4\`
- \`solve(3) = solve(2) + solve(1) + 2 = 4 + 1 + 2 = 7\`
- \`solve(4) = solve(3) + solve(2) + 2 = 7 + 4 + 2 = 13\`
- **Output:** \`13\`

#### Problem 3: Modulo and Integer Division in Loops
\`\`\`text
Integer x = 452, sum = 0
While (x > 0)
    sum = sum + (x % 10)
    x = x / 10
End While
Print sum
\`\`\`
**Explanation:**
- Iteration 1: \`x % 10 = 2\`, \`sum = 2\`, \`x = 45\`
- Iteration 2: \`x % 10 = 5\`, \`sum = 7\`, \`x = 4\`
- Iteration 3: \`x % 10 = 4\`, \`sum = 11\`, \`x = 0\`
- Loop terminates when \`x = 0\`.
- **Output:** \`11\` (Sum of digits of 452)

#### Problem 4: Nested Loops with Break Condition
\`\`\`text
Integer count = 0
For each i from 1 to 4
    For each j from 1 to 4
        If (i == j)
            Jump out of loop (break)
        End If
        count = count + 1
    End For
End For
Print count
\`\`\`
**Explanation:**
- \`i = 1\`: \`j = 1\` (i == j, breaks immediately) -> count = 0
- \`i = 2\`: \`j = 1\` (count=1), \`j = 2\` (breaks) -> count = 1
- \`i = 3\`: \`j = 1\` (count=2), \`j = 2\` (count=3), \`j = 3\` (breaks) -> count = 3
- \`i = 4\`: \`j = 1\` (count=4), \`j = 2\` (count=5), \`j = 3\` (count=6), \`j = 4\` (breaks) -> count = 6
- **Output:** \`6\`

---

### 5. Technical Interview Questions (OOP, DBMS & Web)
Candidates clearing the online assessment advance to a 35 to 45-minute technical interview. Focus on the core pillars of computer science:

#### 1. Object-Oriented Programming (OOP) in Practice:
- **Interview Question:** *"Explain Polymorphism with a real-life software engineering example."*
- **Model Answer:** Polymorphism enables a single interface to represent different underlying forms. For example, in an e-commerce checkout system, a \`PaymentMethod\` base class defines a method \`processPayment(amount)\`. Subclasses like \`CreditCardPayment\`, \`UPIPayment\`, and \`NetBankingPayment\` implement their unique verification and gateway protocols. The checkout orchestrator simply invokes \`payment.processPayment(amount)\` without knowing the specific concrete class at compile time (Runtime Polymorphism).

#### 2. Relational Databases & SQL:
- **Difference between WHERE and HAVING:** \`WHERE\` filters records *before* aggregation occurs, whereas \`HAVING\` filters the aggregated grouped records created by the \`GROUP BY\` clause.
- **Top SQL Query:** Find employees earning more than the average salary of their respective department:
\`\`\`sql
SELECT e1.name, e1.salary, e1.department_id
FROM employees e1
WHERE e1.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.department_id = e1.department_id
);
\`\`\`

#### 3. Web Fundamentals & Data Structures:
- Be ready to explain the differences between **Stack** (LIFO, used in function call stacks and undo operations) and **Queue** (FIFO, used in CPU process scheduling and message brokers).
- Explain **Primary Key vs Unique Key**: A table can only have one Primary Key (which cannot accept NULL values), while it can have multiple Unique Keys (which permit a single NULL in standard SQL databases).

---

### 6. HR Interview Questions & Model Answers
The HR interview verifies your cultural fit, adaptability, and long-term commitment.

#### Q1: "Are you willing to relocate to any Cognizant office across India and work in rotational shifts?"
- **Recommended Response:** *"Yes, absolutely. As a fresher, my primary objective is to gain maximum technical exposure and contribute to live client projects. Cognizant has world-class delivery centers in Chennai, Bengaluru, Pune, Hyderabad, and Kolkata, and I am fully flexible with location and working hours."*

#### Q2: "Why Cognizant over other IT firms like TCS or Infosys?"
- **Recommended Response:** *"Cognizant stands out for its strong emphasis on continuous learning through platforms like Cognizant Academy and its leadership in healthcare and financial digital transformation. The transparent career progression path from GenC to GenC Elevate motivates me to build a high-impact engineering career here."*

---

### 7. How to Apply via Superset & Official Careers Portal
1. **On-Campus Drives:** Register on the **Superset Platform** when Cognizant activates its campus drive link. Ensure your 10th, 12th, and degree percentages match your academic mark sheets verbatim.
2. **Off-Campus Drives:** Track the official [Cognizant Global Careers Portal](https://careers.cognizant.com/global/en) and apply directly under the *Students & Graduates* tab for roles like *Programmer Analyst Trainee (PAT)*.
3. **Resume Optimization:** Make sure your resume passes automated filters using the [FreshersBridge Free ATS Resume Scanner](/career-tools).
    `,
  },

  {
    id: '14',
    slug: 'top-50-python-interview-questions-coding-challenges-freshers-2026',
    title: 'Top 50 Python Interview Questions & Coding Challenges for Freshers 2026',
    subtitle: 'From core fundamentals and OOP to decorators, generators, and top 20 data structure coding problems in Python.',
    description: 'Prepare for your entry-level Python developer interview with 50 high-frequency questions covering data types, memory management, list comprehensions, decorators, and DSA.',
    category: 'Technical Prep',
    readTime: '15 min read',
    publishedAt: '2026-09-01',
    updatedAt: '2026-09-03',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Python', 'Interview Questions', 'Coding', 'Freshers 2026', 'OOP'],
    tableOfContents: [
      { id: 'core-basics', title: '1. Python Core: Mutable vs Immutable & Memory' },
      { id: 'advanced-features', title: '2. Decorators, Generators & Comprehensions' },
      { id: 'oops-in-python', title: '3. OOP in Python: Inheritance, Dunder Methods & Polymorphism' },
      { id: 'coding-challenges', title: '4. Top 10 Python Coding Problems for Freshers' },
    ],
    content: `
### 1. Python Core: Mutable vs Immutable, Memory & Data Structures
**Q1. What is the difference between mutable and immutable data types in Python?**
* **Mutable:** Objects whose values can be altered in place without creating a new object in memory (e.g. \`list\`, \`dict\`, \`set\`, \`bytearray\`).
* **Immutable:** Objects whose state cannot be changed once created (e.g. \`int\`, \`float\`, \`str\`, \`tuple\`, \`frozenset\`, \`bytes\`). Any modification creates an entirely new object in memory with a distinct \`id()\`.

**Q2. How is memory managed in Python?**
Python uses a private heap containing all objects and data structures. The runtime handles memory allocation through:
1. **Reference Counting:** Every object tracks how many references point to it. When the count hits zero, the memory is deallocated immediately.
2. **Cyclic Garbage Collector (gc module):** Periodically detects and clears cyclical references (e.g., object A referencing B and B referencing A).

**Q3. What is the difference between \`is\` and \`==\` in Python?**
* \`==\` checks for **value equality** (whether two objects contain the same data).
* \`is\` checks for **identity** (whether two variables point to the exact same memory address in RAM).

**Q4. What is the difference between a Shallow Copy and a Deep Copy?**
* **Shallow Copy (\`copy.copy\`):** Copies the outer object but inserts references to the child objects within the original. Changes to nested objects affect both.
* **Deep Copy (\`copy.deepcopy\`):** Recursively clones both the outer object and all nested child objects independently.

**Q5. Why are dictionaries so fast in Python?**
Python dictionaries are implemented as hash tables with sparse array indexing. Looking up, inserting, or deleting keys has an average time complexity of $O(1)$.

**Q6. What is the difference between \`list.append()\` and \`list.extend()\`?**
* \`append(x)\` adds \`x\` as a single element to the end of the list.
* \`extend(iterable)\` iterates over the given iterable and appends each element individually.

**Q7. What is \`*args\` and \`**kwargs\` in Python function definitions?**
* \`*args\` allows a function to accept any number of positional arguments as a \`tuple\`.
* \`**kwargs\` allows a function to accept any number of keyword (named) arguments as a \`dict\`.

**Q8. What is the Global Interpreter Lock (GIL)?**
The GIL is a mutex lock in CPython that ensures only one native OS thread executes Python bytecode at any given moment. For CPU-bound operations, developers use multiprocessing instead of multithreading to leverage multiple CPU cores.

**Q9. What are Lambda functions and when should they be used?**
Lambda functions are small, anonymous single-line functions created using the \`lambda\` keyword (e.g. \`square = lambda x: x ** 2\`). They are most useful as transient arguments inside \`map()\`, \`filter()\`, or \`sorted(key=...)\`.

**Q10. What is the difference between \`break\`, \`continue\`, and \`pass\`?**
* \`break\`: Immediately terminates the nearest enclosing loop.
* \`continue\`: Skips the rest of the current iteration and jumps to the next loop iteration.
* \`pass\`: A null statement used as a syntactic placeholder where code is required but no action is needed.

**Q11. What is the difference between \`range()\` and \`enumerate()\`?**
\`range(n)\` produces a sequence of numbers from 0 to $n-1$, while \`enumerate(iterable)\` yields a tuple of \`(index, value)\` on each iteration.

**Q12. What are Python docstrings and how do you access them?**
A docstring is a string literal placed as the first statement in a function, class, or module. It is accessible at runtime via the \`__doc__\` attribute or \`help()\`.

---

### 2. Decorators, Generators, Iterators & Comprehensions
**Q13. What is a Generator in Python and why is it memory efficient?**
A generator is a function that produces a sequence of values on the fly using the \`yield\` keyword instead of \`return\`. Unlike lists that store all elements in RAM simultaneously, generators compute items one at a time (*lazy evaluation*).

\`\`\`python
def fibonacci_gen(limit):
    a, b = 0, 1
    while a < limit:
        yield a
        a, b = b, a + b
\`\`\`

**Q14. What is a Decorator in Python and how do you write one?**
A decorator is a callable that takes another function as input, extends or modifies its behavior without modifying its source code, and returns the modified function.

\`\`\`python
import time

def timing_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.time() - start:.4f}s")
        return result
    return wrapper

@timing_decorator
def calculate_squares(n):
    return [x**2 for x in range(n)]
\`\`\`

**Q15. What is the difference between an Iterable and an Iterator?**
* **Iterable:** Any object capable of returning its members one at a time (implements \`__iter__()\`, e.g. \`list\`, \`str\`, \`tuple\`).
* **Iterator:** The stateful object that performs the actual traversal by implementing \`__next__()\`. When no elements remain, it raises \`StopIteration\`.

**Q16. What are List, Dict, and Set Comprehensions?**
Syntactic shortcuts to transform iterables into new collections:
* **List:** \`[x * 2 for x in nums if x % 2 == 0]\`
* **Dict:** \`{word: len(word) for word in words}\`
* **Set:** \`{x % 10 for x in nums}\`

**Q17. What does the \`zip()\` built-in function do?**
\`zip(*iterables)\` pairs corresponding elements from multiple iterables into tuples until the shortest iterable is exhausted.

**Q18. What is the purpose of \`any()\` and \`all()\`?**
* \`all(iterable)\`: Returns \`True\` if all elements evaluate to true (truthy).
* \`any(iterable)\`: Returns \`True\` if at least one element evaluates to true.

**Q19. How do \`map()\` and \`filter()\` work?**
* \`map(func, iterable)\`: Applies \`func\` to every item in \`iterable\` and returns an iterator.
* \`filter(func, iterable)\`: Returns an iterator yielding only items for which \`func(item)\` returns \`True\`.

**Q20. What is the purpose of the \`itertools\` module?**
The \`itertools\` standard library module provides memory-efficient looping tools such as \`count()\`, \`cycle()\`, \`chain()\`, \`combinations()\`, and \`permutations()\`.

**Q21. How do you handle exceptions in Python?**
Using a \`try ... except ... else ... finally\` construct:
* \`try\`: Code that may raise an error.
* \`except ExceptionType as e\`: Handles specific errors.
* \`else\`: Executes only if no exception occurred.
* \`finally\`: Executes unconditionally (ideal for releasing resources/closing files).

**Q22. What is a Context Manager and the \`with\` statement?**
Context managers guarantee cleanup of resources (like files or database connections) by implementing \`__enter__()\` and \`__exit__()\`.
\`\`\`python
with open("data.txt", "r") as f:
    content = f.read()
# File is guaranteed to close automatically even if exceptions occur
\`\`\`

**Q23. What is \`functools.lru_cache\`?**
A decorator in the \`functools\` module that memoizes the results of expensive function calls with a Least Recently Used (LRU) caching eviction policy.

**Q24. How do you serialize Python objects to JSON?**
Using the built-in \`json\` module:
* \`json.dumps(obj)\`: Converts Python object to JSON string.
* \`json.loads(str)\`: Parses JSON string to Python dictionary/list.

---

### 3. OOP in Python: Inheritance, Dunder Methods & Polymorphism
**Q25. What are the four core pillars of Object-Oriented Programming in Python?**
1. **Encapsulation:** Bundling data and methods that operate on that data inside classes, restricting direct external access via private attributes (\`_protected\`, \`__private\`).
2. **Abstraction:** Hiding complex implementation details and showing only necessary interfaces using the \`abc\` (Abstract Base Class) module.
3. **Inheritance:** Enabling a child class to inherit fields and methods from a parent class.
4. **Polymorphism:** Allowing different classes to define the same interface or method name with custom implementation.

**Q26. What are Dunder (Magic) Methods in Python?**
Dunder (double-underscore) methods allow custom classes to hook into Python syntax and built-in operators:
* \`__init__(self)\`: Constructor initializing instance state.
* \`__str__(self)\`: User-friendly string representation for \`print()\`.
* \`__repr__(self)\`: Unambiguous developer representation.
* \`__len__(self)\`: Invoked by \`len(obj)\`.
* \`__getitem__(self, key)\`: Enables index access like \`obj[key]\`.
* \`__eq__(self, other)\`: Overloads the \`==\` comparison operator.

**Q27. What is the difference between Instance, Class, and Static Methods?**
* **Instance Method:** Takes \`self\` as the first parameter; can inspect and modify instance state as well as class state.
* **Class Method (\`@classmethod\`):** Takes \`cls\` as the first parameter; can inspect and modify class-level attributes shared across all instances.
* **Static Method (\`@staticmethod\`):** Takes neither \`self\` nor \`cls\`; acts as an isolated utility function logically namespaced inside the class.

**Q28. What is Method Resolution Order (MRO)?**
MRO is the order in which Python searches for an attribute or method in a hierarchy of classes, especially under multiple inheritance. Python uses the **C3 Linearization algorithm**, and the order can be inspected via \`ClassName.mro()\` or \`ClassName.__mro__\`.

**Q29. How does \`super()\` work in multiple inheritance?**
\`super()\` returns a proxy object that delegates method calls to the next parent class according to the class's MRO, preventing duplicate initialization in diamond-shaped inheritance hierarchies.

**Q30. What is Duck Typing?**
A programming philosophy where an object's suitability is determined by the presence of certain methods and properties, rather than its explicit class type (*"If it walks like a duck and quacks like a duck, it's a duck"*).

**Q31. How do you create an Abstract Class in Python?**
By subclassing \`ABC\` from the \`abc\` module and annotating abstract methods with \`@abstractmethod\`:
\`\`\`python
from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        pass
\`\`\`

**Q32. What is the \`@property\` decorator?**
It allows getter, setter, and deleter methods to be accessed like ordinary attributes while enforcing validation:
\`\`\`python
class Employee:
    def __init__(self, salary):
        self._salary = salary

    @property
    def salary(self):
        return self._salary

    @salary.setter
    def salary(self, value):
        if value < 0:
            raise ValueError("Salary cannot be negative")
        self._salary = value
\`\`\`

**Q33. What is the difference between \`__new__\` and \`__init__\`?**
* \`__new__(cls)\`: The static method that actually creates and allocates the instance object in memory.
* \`__init__(self)\`: The instance method that initializes the attributes of the newly created object.

**Q34. How do you implement a Singleton Pattern in Python?**
By overriding \`__new__\` to return the existing instance:
\`\`\`python
class Singleton:
    _instance = None
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance
\`\`\`

**Q35. What is monkey patching in Python?**
Monkey patching is dynamically modifying or extending a module, class, or function at runtime without altering the original source code.

**Q36. What are Dataclasses in Python 3.7+?**
Annotated classes using \`@dataclass\` that automatically generate boilerplate methods such as \`__init__\`, \`__repr__\`, and \`__eq__\`.

---

### 4. Top 14 Python Coding Problems for Freshers
**Q37. Reverse a String without slicing.**
\`\`\`python
def reverse_string(s: str) -> str:
    res = []
    for i in range(len(s) - 1, -1, -1):
        res.append(s[i])
    return "".join(res)
\`\`\`

**Q38. Check if a String is a Palindrome.**
\`\`\`python
def is_palindrome(s: str) -> bool:
    clean = "".join(c.lower() for c in s if c.isalnum())
    return clean == clean[::-1]
\`\`\`

**Q39. Find the First Non-Repeating Character in a String.**
\`\`\`python
from collections import Counter

def first_unique_char(s: str) -> str:
    counts = Counter(s)
    for char in s:
        if counts[char] == 1:
            return char
    return ""
\`\`\`

**Q40. Two Sum Problem ($O(n)$ Solution).**
\`\`\`python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
\`\`\`

**Q41. Check if Two Strings are Anagrams.**
\`\`\`python
def is_anagram(s1: str, s2: str) -> bool:
    return sorted(s1.lower()) == sorted(s2.lower())
\`\`\`

**Q42. Find the Second Largest Element in a List ($O(n)$).**
\`\`\`python
def second_largest(arr: list[int]) -> int | None:
    first = second = float('-inf')
    for num in arr:
        if num > first:
            second, first = first, num
        elif num > second and num != first:
            second = num
    return second if second != float('-inf') else None
\`\`\`

**Q43. Flatten a Deeply Nested List (Recursive).**
\`\`\`python
def flatten(nested: list) -> list:
    flat = []
    for item in nested:
        if isinstance(item, list):
            flat.extend(flatten(item))
        else:
            flat.append(item)
    return flat
\`\`\`

**Q44. Remove Duplicates from a List while Preserving Order.**
\`\`\`python
def remove_duplicates_ordered(arr: list) -> list:
    return list(dict.fromkeys(arr))
\`\`\`

**Q45. Count the Frequency of Each Word in a Sentence.**
\`\`\`python
def word_frequencies(text: str) -> dict[str, int]:
    words = text.lower().split()
    return {w: words.count(w) for w in set(words)}
\`\`\`

**Q46. Find the Missing Number in an Array of $1$ to $N$.**
\`\`\`python
def find_missing_number(arr: list[int], n: int) -> int:
    expected_sum = n * (n + 1) // 2
    return expected_sum - sum(arr)
\`\`\`

**Q47. Check if a Number is Prime.**
\`\`\`python
def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True
\`\`\`

**Q48. Merge Two Sorted Lists into One Sorted List.**
\`\`\`python
def merge_sorted_lists(l1: list[int], l2: list[int]) -> list[int]:
    res = []
    i = j = 0
    while i < len(l1) and j < len(l2):
        if l1[i] < l2[j]:
            res.append(l1[i])
            i += 1
        else:
            res.append(l2[j])
            j += 1
    res.extend(l1[i:])
    res.extend(l2[j:])
    return res
\`\`\`

**Q49. Check for Balanced Parentheses.**
\`\`\`python
def is_valid_parentheses(s: str) -> bool:
    stack = []
    brackets = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in brackets.values():
            stack.append(char)
        elif char in brackets:
            if not stack or stack.pop() != brackets[char]:
                return False
    return len(stack) == 0
\`\`\`

**Q50. Find the Maximum Subarray Sum (Kadane's Algorithm - $O(n)$).**
\`\`\`python
def max_subarray_sum(nums: list[int]) -> int:
    max_so_far = current_max = nums[0]
    for num in nums[1:]:
        current_max = max(num, current_max + num)
        max_so_far = max(max_so_far, current_max)
    return max_so_far
\`\`\`
    `,
  },
  {
    id: '15',
    slug: 'data-analyst-roadmap-fresher-jobs-salary-interview-guide-2026',
    title: 'Data Analyst Roadmap 2026: Skills, Projects, Interview Questions & Jobs for Freshers',
    subtitle: 'A complete 90-day step-by-step blueprint to land high-paying fresher Data Analyst jobs (₹4.5 - ₹9 LPA) with SQL, Python, Power BI, and portfolio projects.',
    description: 'Master the 2026 Data Analyst roadmap for freshers. Learn essential skills (SQL, Excel, Python, Power BI/Tableau), top 15 interview questions with SQL queries, portfolio project blueprints, and off-campus application strategies.',
    category: 'Career Roadmaps',
    readTime: '16 min read',
    publishedAt: '2026-09-14',
    updatedAt: '2026-09-14',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Data Analyst', 'SQL', 'Power BI', 'Python', 'Excel', 'Roadmap', 'Freshers 2026'],
    directAnswerSummary: 'A Data Analyst transforms raw corporate metrics into actionable business strategies using Excel, SQL, Power BI/Tableau, and Python. Entry-level fresher salaries in India range from ₹4.5 LPA in IT services to ₹9+ LPA in analytics firms and product startups, with SQL window functions and dashboard portfolios being the #1 hiring criteria.',
    faqs: [
      {
        question: 'What is the average fresher salary for a Data Analyst in India?',
        answer: 'Entry-level Data Analyst freshers in India earn between ₹4.0 LPA and ₹5.5 LPA at IT consultancies, ₹6.0 to ₹8.5 LPA at pure-play analytics firms (like Fractal and Mu Sigma), and ₹7.0 to ₹11.0 LPA at product companies.'
      },
      {
        question: 'Do I need Python to get a fresher Data Analyst job?',
        answer: 'Advanced SQL and Power BI/Tableau are the primary mandatory requirements for entry-level analyst roles. Python (Pandas/NumPy) gives you a strong competitive edge for exploratory data analysis and product tech companies.'
      },
      {
        question: 'Which projects should a fresher put on a Data Analyst resume?',
        answer: 'Avoid generic datasets like Titanic or Iris. Instead, build real-world business projects: E-Commerce Cohort Retention Dashboards, Quick-Commerce Delivery SLA Trackers, or Financial Loan Default Risk EDA.'
      },
      {
        question: 'What are the most asked SQL questions in Data Analyst interviews?',
        answer: 'Top recurring topics include DENSE_RANK() for Nth highest salary, rolling 7-day average revenue using window frames, removing duplicate records with ROW_NUMBER(), and WHERE vs HAVING distinctions.'
      }
    ],
    tableOfContents: [
      { id: 'role-overview', title: '1. What Does an Entry-Level Data Analyst Do in 2026?' },
      { id: 'salary-landscape', title: '2. Fresher Salary Landscape in India (₹4.5 to ₹9 LPA)' },
      { id: '90-day-roadmap', title: '3. The 90-Day Structured Learning Roadmap' },
      { id: 'portfolio-projects', title: '4. 3 Portfolio Projects That Actually Impress Recruiters' },
      { id: 'interview-questions', title: '5. Top 15 Technical Interview Questions & Real SQL Queries' },
      { id: 'job-application-strategy', title: '6. Off-Campus Application Strategy & Outreach Templates' },
    ],
    content: `
### 1. What Does an Entry-Level Data Analyst Do in 2026?
A **Data Analyst** bridges the gap between raw corporate data and executive business decision-making. Unlike a Data Scientist who builds complex machine learning predictive algorithms, a Data Analyst answers crucial business questions:
- *Why did user drop-off increase by 14% on the checkout page last week?*
- *Which marketing channel has the highest Customer Lifetime Value (LTV) relative to Customer Acquisition Cost (CAC)?*
- *How can delivery logistics routes be optimized to reduce grocery delivery times under 15 minutes?*

#### Clarifying the Roles:
- **Data Analyst:** Focuses on SQL querying, data cleaning, statistical analysis, and interactive dashboarding (Excel, SQL, Power BI/Tableau, Python/Pandas).
- **Business Analyst:** Focuses on requirement gathering, business workflow documentation, stakeholder management, and functional specifications.
- **Data Engineer:** Builds distributed pipelines, data warehouses, ETL processes, and database infrastructure (Spark, Airflow, Snowflake, AWS).
- **Data Scientist:** Focuses on statistical modeling, deep learning, NLP, and machine learning models (Scikit-Learn, PyTorch, TensorFlow).

---

### 2. Fresher Salary Landscape in India (₹4.5 to ₹9 LPA)
Demand for data-literate freshers has skyrocketed across Indian tech hubs (Bengaluru, Hyderabad, Pune, Gurgaon, and Chennai):

| Company Tier | Typical CTC (Freshers) | Example Recruiters | Primary Interview Focus |
| :--- | :---: | :--- | :--- |
| **IT Services & Tech Consulting** | **₹4.0 – ₹5.5 LPA** | TCS Analytics, Accenture, Cognizant, Wipro, Capgemini | Advanced Excel, SQL Joins, Basic Aptitude |
| **Pure-Play Analytics Firms** | **₹6.0 – ₹8.5 LPA** | Fractal Analytics, Mu Sigma, Tiger Analytics, LatentView | Case Studies, SQL Window Functions, Guesstimates |
| **Product Tech & Quick-Commerce** | **₹7.0 – ₹11.0 LPA** | Swiggy, Zomato, Zepto, Flipkart, Meesho, Razorpay | Python EDA, Complex SQL, Metric Definitions, A/B Testing |

---

### 3. The 90-Day Structured Learning Roadmap
Follow this month-by-month framework if you are starting from zero or transitioning from engineering/commerce backgrounds:

#### Month 1: Advanced Excel & SQL Mastery
- **Weeks 1–2 (Advanced Excel):** Master \`XLOOKUP\`, \`INDEX/MATCH\`, Pivot Tables, Calculated Fields, and conditional formatting. Learn **Power Query** to automate repetitive data cleaning and CSV merging.
- **Weeks 3–4 (SQL Fundamentals to Advanced):**
  - DDL & DML operations.
  - Multi-table \`INNER JOIN\`, \`LEFT JOIN\`, and \`FULL OUTER JOIN\`.
  - Grouping data with \`GROUP BY\` and filtering aggregates with \`HAVING\`.
  - **Window Functions (Mandatory):** \`ROW_NUMBER()\`, \`RANK()\`, \`DENSE_RANK()\`, \`LEAD()\`, \`LAG()\`, and running totals using \`SUM() OVER()\`.
  - Common Table Expressions (\`WITH cte AS (...)\`) to write readable modular SQL.

#### Month 2: Business Intelligence Dashboarding (Power BI or Tableau)
- **Weeks 5–6 (Data Modeling & Star Schema):** Understand Fact tables vs Dimension tables, One-to-Many relationships, and active/inactive relationships.
- **Weeks 7–8 (DAX & Interactive Dashboards):**
  - Essential DAX formulas: \`CALCULATE()\`, \`FILTER()\`, \`SUMX()\`, \`DATEDIFF()\`, and Time Intelligence (\`TOTALYTD\`, \`SAMEPERIODLASTYEAR\`).
  - Design user-centric dashboards following visual hierarchy (KPI cards on top, trends in the middle, granular breakdown tables at the bottom).

#### Month 3: Python for Exploratory Data Analysis (EDA) & Portfolio Building
- **Weeks 9–10 (Pandas & NumPy):** Handling missing values (\`fillna()\`, \`dropna()\`), filtering with boolean indexing, grouping with \`groupby().agg()\`, and reshaping with \`melt()\` and \`pivot_table()\`.
- **Weeks 11–12 (Data Storytelling & Case Studies):** Plotting with Seaborn and Matplotlib. Building 2 end-to-end projects with documented business takeaways published on GitHub.

---

### 4. 3 Portfolio Projects That Actually Impress Recruiters
Generic projects like *Titanic Survival Prediction* or *Iris Flower Classification* get rejected instantly. Build business-centric projects with verifiable business impact:

#### Project 1: E-Commerce Retention & Cohort Churn Dashboard
- **The Problem:** Analyze monthly customer cohorts to identify when customers stop repurchasing.
- **Tools:** PostgreSQL + Power BI.
- **Key Metric Delivered:** Heatmap showing MoM (Month-over-Month) retention drop-off and identification that customers who apply a coupon on their second purchase have 40% higher 12-month LTV.

#### Project 2: Blinkit / Zepto Delivery Fleet SLA Performance Analyzer
- **The Problem:** Optimize order dispatch times and identify bottlenecks across warehouse dark stores.
- **Tools:** Python (Pandas) + Tableau.
- **Key Insight:** Identified that order picking delays in 3 specific pin codes accounted for 72% of delivery SLA breaches during peak dinner hours (8 PM – 10 PM).

#### Project 3: Financial Loan Default Risk & Credit Scoring EDA
- **The Problem:** Clean and explore 50,000+ real-world loan application records to discover leading indicators of customer defaults.
- **Tools:** Python (Seaborn, Pandas, Scipy).
- **Key Insight:** Borrowers with credit utilization > 65% and less than 2 years of employment history were 4.8x more likely to default on unsecured personal loans.

---

### 5. Top 15 Technical Interview Questions & Real SQL Queries

#### Q1: How do you find the Second Highest Salary from an Employee table without using LIMIT/TOP?
\`\`\`sql
WITH RankedSalaries AS (
    SELECT 
        name, 
        salary, 
        DENSE_RANK() OVER (ORDER BY salary DESC) as salary_rank
    FROM employees
)
SELECT name, salary
FROM RankedSalaries
WHERE salary_rank = 2;
\`\`\`
> **Why DENSE_RANK()?** Unlike \`RANK()\`, which creates gaps when duplicate salaries exist (1, 2, 2, 4), \`DENSE_RANK()\` produces contiguous ranks (1, 2, 2, 3), guaranteeing you find the true second-highest tier.

#### Q2: Calculate the 7-day Rolling Average Revenue for each day.
\`\`\`sql
SELECT 
    order_date,
    daily_revenue,
    AVG(daily_revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) as rolling_7d_avg
FROM daily_sales_summary;
\`\`\`

#### Q3: Identify duplicate email addresses in a Users table and keep only the oldest record.
\`\`\`sql
DELETE FROM users
WHERE id IN (
    SELECT id
    FROM (
        SELECT 
            id,
            ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC) as row_num
        FROM users
    ) t
    WHERE t.row_num > 1
);
\`\`\`

#### Q4: What is the difference between WHERE and HAVING clauses?
- \`WHERE\` filters raw rows **before** any aggregation happens. It cannot contain aggregate functions like \`SUM()\` or \`COUNT()\`.
- \`HAVING\` filters the aggregated results **after** the \`GROUP BY\` operation executes.

#### Q5: Explain the difference between INNER JOIN, LEFT JOIN, and CROSS JOIN.
- **INNER JOIN:** Returns only matching records from both tables.
- **LEFT JOIN:** Returns all records from the left table, plus matched records from the right table (unmatched fields populate as NULL).
- **CROSS JOIN:** Produces a Cartesian product, pairing every row of table A with every row of table B.

---

### 6. Off-Campus Application Strategy & Outreach Templates

1. **GitHub Repository as a Live Portfolio:**
   - Every project repository must include: a clean \`README.md\`, clear problem statement, interactive screenshots or dashboard PDF, and step-by-step SQL scripts.
2. **Optimized Resume:** Format your resume using the [FreshersBridge ATS Resume Scanner](/career-tools). Highlight quantitative achievements: *"Optimized inventory queries reducing dashboard load time by 35%."*
3. **Targeted Cold Outreach Template on LinkedIn:**
\`\`\`text
Subject: Aspirant Data Analyst | Impressed by [Company Name]'s Data Engineering & Analytics

Hi [Hiring Manager / Team Lead Name],

I came across your work on scaling [Company's] analytics infrastructure and was really inspired. 

As a 2026 graduate passionate about business intelligence, I recently built an end-to-end E-Commerce Cohort Retention Dashboard using PostgreSQL and Power BI that uncovered a 22% improvement in MoM customer repurchase rates. 

Here is my interactive GitHub walkthrough: [Your GitHub Project Link]

I would love to contribute to entry-level analytics openings at [Company Name]. I would be grateful for 5 minutes of your guidance or a referral. 

Best regards,
[Your Name] | [Your Portfolio Link] | [Your Phone Number]
\`\`\`
    `,
  },
];

export function getGuideBySlug(slug: string): GuideArticle | undefined {
  return GUIDE_ARTICLES.find((g) => g.slug === slug);
}

export function getRelatedGuides(currentSlug: string, category: string, limit = 3): GuideArticle[] {
  return GUIDE_ARTICLES.filter((g) => g.slug !== currentSlug)
    .sort((a, b) => (a.category === category ? -1 : 1))
    .slice(0, limit);
}
