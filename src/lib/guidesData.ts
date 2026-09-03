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
    title: 'Accenture Recruitment Process 2026: Cognitive, Technical & Coding Questions',
    subtitle: 'Everything you need to crack the Associate Software Engineer (4.5 LPA) and Advanced ASE (6.5 LPA) roles.',
    description: 'Detailed walkthrough of Accenture recruitment rounds, including Cognitive Assessment, Technical MCQ, Coding Round, and Communication Assessment.',
    category: 'Company Patterns',
    readTime: '11 min read',
    publishedAt: '2026-08-21',
    updatedAt: '2026-08-25',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Accenture', 'ASE', 'Off-Campus', 'Coding Round', 'Aptitude'],
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
    `,
  },
  {
    id: '12',
    slug: 'infosys-sp-dse-2026-recruitment-process-syllabus-coding-guide',
    title: 'Infosys SP & DSE 2026: Specialist Programmer & DSE Hiring Guide',
    subtitle: 'How freshers can crack the ₹9.5 LPA Specialist Programmer (SP) and ₹6.25 LPA Digital Specialist Engineer (DSE) roles.',
    description: 'Complete guide for cracking Infosys high-package hiring through HackWithInfy and online assessments, with syllabus, algorithmic coding patterns, and interview strategies.',
    category: 'Company Patterns',
    readTime: '13 min read',
    publishedAt: '2026-08-28',
    updatedAt: '2026-09-02',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Infosys', 'Specialist Programmer', 'DSE', 'Coding', 'Freshers 2026'],
    tableOfContents: [
      { id: 'roles-overview', title: '1. SE vs DSE vs SP Packages & Differences' },
      { id: 'exam-structure', title: '2. HackWithInfy & SP Exam Structure' },
      { id: 'coding-problems', title: '3. Advanced Algorithmic Patterns' },
      { id: 'interview-prep', title: '4. System Design & Technical Interview' },
    ],
    content: `
### 1. SE vs DSE vs SP Packages & Differences
Infosys offers three distinct tiers of entry-level engineering roles:
* **Systems Engineer (SE):** ₹3.6 LPA – Core software maintenance and baseline technology enablement.
* **Digital Specialist Engineer (DSE):** ₹6.25 LPA – Full-stack engineering, microservices, and cloud architectures.
* **Specialist Programmer (SP):** ₹9.5 LPA – Elite competitive programming and systems engineering.

---

### 2. HackWithInfy & SP Exam Structure
The assessment consists of **3 intense algorithmic problems** with a duration of 3 hours:
* **Question 1 (Easy-Medium):** Greedy algorithms, Two-Pointer technique, or HashMaps.
* **Question 2 (Medium-Hard):** Tree / Graph Traversals (BFS, DFS, Dijkstra) or Dynamic Programming on subsequences.
* **Question 3 (Hard):** Advanced Dynamic Programming (Bitmask / Trees), Segment Trees, or Game Theory.

To secure an interview for SP (₹9.5 LPA), candidates typically need to solve at least **2 full questions with 100% test cases passing**.
    `,
  },
  {
    id: '13',
    slug: 'cognizant-genc-elevate-2026-exam-pattern-interview-blueprint',
    title: 'Cognizant GenC & GenC Elevate 2026: Complete Selection Blueprint',
    subtitle: 'Master the Cognizant aptitude, pseudocode, and technical interview stages for 2026 graduates.',
    description: 'Learn how to clear Cognizant GenC (₹4.0 LPA) and GenC Elevate (₹5.0 LPA) recruitment with section-by-section breakdown, pseudocode problem sets, and interview prep.',
    category: 'Company Patterns',
    readTime: '10 min read',
    publishedAt: '2026-08-30',
    updatedAt: '2026-09-02',
    author: {
      name: 'FreshersBridge Career Team',
      role: 'Career Tech Lead at FreshersBridge',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    tags: ['Cognizant', 'GenC', 'GenC Elevate', 'Freshers 2026', 'Interview'],
    tableOfContents: [
      { id: 'genc-cadres', title: '1. GenC vs GenC Elevate vs GenC Next' },
      { id: 'assessment-rounds', title: '2. Online Test Stages & Mark Distribution' },
      { id: 'pseudocode-tips', title: '3. Cracking the Pseudocode Round' },
      { id: 'interview-tips', title: '4. Technical & HR Interview Questions' },
    ],
    content: `
### 1. GenC vs GenC Elevate vs GenC Next
Cognizant recruits through three progressive bands:
1. **GenC (₹4.0 LPA):** Evaluates general problem solving, analytical ability, and foundational programming.
2. **GenC Elevate (₹4.5 - ₹5.0 LPA):** Targets students with strong hands-on skills in web development, Java/Python, and cloud basics.
3. **GenC Next (₹6.75 - ₹9.0 LPA):** Advanced full-stack and competitive coding profile.

---

### 2. Online Test Stages & Mark Distribution
* **Numerical Ability (25 questions, 25 mins):** Profit & loss, percentages, ratios, permutations, and time-speed-distance.
* **Analytical Reasoning (25 questions, 25 mins):** Coding-decoding, blood relations, seating arrangement, syllogisms.
* **English Comprehension (20 questions, 20 mins):** Reading comprehension, sentence correction, and contextual vocabulary.
* **Pseudocode & Technical MCQ:** 30 questions on nested loops, recursion tree outputs, and bitwise operators.
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
### 1. Python Core: Mutable vs Immutable & Memory
**Q1. What is the difference between mutable and immutable data types in Python?**
* **Mutable:** Objects whose values can be altered in place without creating a new object in memory (e.g. \`list\`, \`dict\`, \`set\`).
* **Immutable:** Objects whose state cannot be changed once created (e.g. \`int\`, \`float\`, \`str\`, \`tuple\`, \`frozenset\`). Modifying an immutable type creates an entirely new object with a distinct \`id()\`.

---

### 2. Decorators, Generators & Comprehensions
**Q2. What is a Generator in Python and why is it memory efficient?**
A generator is a function that produces a sequence of values on the fly using the \`yield\` keyword instead of \`return\`. Unlike lists that store all elements in RAM simultaneously, generators compute items one at a time (*lazy evaluation*).

\`\`\`python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
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
