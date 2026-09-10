import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  Skill,
  UserSkill,
  Career,
  CourseModule,
  AssessmentQuestion,
  AssessmentAttempt,
  LearningProgress,
  PracticeQuestion,
  PracticeAttempt,
  AIRecommendationData,
} from './types';

// Password hash for 'student123' and 'admin123'
const STUDENT_PASSWORD_HASH = bcrypt.hashSync('student123', 8);
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 8);

export const initialSkills: Skill[] = [
  {
    id: 'skill-cpp',
    name: 'C++',
    category: 'Programming',
    description: 'High-performance compiled language fundamental for systems, game engines, and competitive programming.',
    iconName: 'Code',
    popularIn: ['Software Development', 'System Engineering', 'Game Dev'],
  },
  {
    id: 'skill-dsa',
    name: 'Data Structures & Algorithms',
    category: 'Computer Science',
    description: 'Core arrays, linked lists, trees, graphs, sorting, searching, and algorithmic complexity.',
    iconName: 'Boxes',
    popularIn: ['Software Development', 'Technical Interviews', 'Product Companies'],
  },
  {
    id: 'skill-dbms',
    name: 'Database Management Systems (DBMS & SQL)',
    category: 'Computer Science',
    description: 'Relational data modeling, SQL querying, normalization, ACID properties, indexing, and transactions.',
    iconName: 'Database',
    popularIn: ['Backend Engineering', 'Data Analytics', 'Full-Stack'],
  },
  {
    id: 'skill-oop',
    name: 'Object-Oriented Programming (OOP)',
    category: 'Computer Science',
    description: 'Encapsulation, inheritance, polymorphism, abstraction, and software design principles (SOLID).',
    iconName: 'Cpu',
    popularIn: ['Software Architecture', 'App Development'],
  },
  {
    id: 'skill-git',
    name: 'Git & Version Control',
    category: 'Core Engineering',
    description: 'Distributed version control, branching workflows, pull requests, merge conflict resolution, and CI/CD basics.',
    iconName: 'GitBranch',
    popularIn: ['All Tech Roles', 'Open Source', 'Team Projects'],
  },
  {
    id: 'skill-problemsolving',
    name: 'Problem Solving & Logic',
    category: 'Computer Science',
    description: 'Analytical reasoning, edge-case analysis, pattern recognition, and mathematical intuition.',
    iconName: 'Brain',
    popularIn: ['Technical Coding Rounds', 'System Design'],
  },
  {
    id: 'skill-python',
    name: 'Python',
    category: 'Programming',
    description: 'Dynamic general-purpose language leading data science, machine learning, automation, and backend.',
    iconName: 'FileCode',
    popularIn: ['Data Analytics', 'AI / ML', 'Backend Dev'],
  },
  {
    id: 'skill-javascript',
    name: 'JavaScript & Web Core',
    category: 'Web Development',
    description: 'Event-driven web scripting, asynchronous JavaScript, DOM manipulation, promises, and modern ES6+.',
    iconName: 'Globe',
    popularIn: ['Frontend Engineering', 'Full Stack Development'],
  },
  {
    id: 'skill-htmlcss',
    name: 'HTML5 & Modern CSS',
    category: 'Web Development',
    description: 'Semantic markup, accessibility, responsive CSS layouts (Flexbox, Grid), and UI styling.',
    iconName: 'Layout',
    popularIn: ['Web Development', 'UI/UX Engineering'],
  },
  {
    id: 'skill-networks',
    name: 'Computer Networks',
    category: 'Computer Science',
    description: 'OSI & TCP/IP models, HTTP/HTTPS, DNS, routing, sockets, and network security foundations.',
    iconName: 'Network',
    popularIn: ['Cybersecurity', 'Cloud Engineering', 'Backend'],
  },
  {
    id: 'skill-communication',
    name: 'Technical Communication',
    category: 'Soft Skills',
    description: 'Articulating technical design, clean documentation, presenting solutions, and team collaboration.',
    iconName: 'MessageSquare',
    popularIn: ['All Tech Roles', 'Client Presentations', 'Interviews'],
  },
  {
    id: 'skill-java',
    name: 'Java',
    category: 'Programming',
    description: 'Class-based, object-oriented enterprise platform language powering Android and high-scale backends.',
    iconName: 'Coffee',
    popularIn: ['Enterprise Backend', 'Android Development'],
  },
];

export const initialCareers: Career[] = [
  {
    id: 'career-swe',
    title: 'Software Developer',
    category: 'Software Engineering',
    description: 'Designs, builds, and maintains robust software systems, desktop/mobile apps, and algorithmic pipelines.',
    averageSalaryIndia: '₹8,50,000 - ₹18,00,000 / yr',
    demandLevel: 'Very High',
    requiredSkills: [
      { skillId: 'skill-cpp', minProficiency: 'Intermediate', weight: 4 },
      { skillId: 'skill-dsa', minProficiency: 'Advanced', weight: 5 },
      { skillId: 'skill-dbms', minProficiency: 'Intermediate', weight: 4 },
      { skillId: 'skill-oop', minProficiency: 'Intermediate', weight: 4 },
      { skillId: 'skill-git', minProficiency: 'Intermediate', weight: 3 },
      { skillId: 'skill-problemsolving', minProficiency: 'Advanced', weight: 5 },
    ],
  },
  {
    id: 'career-data-analyst',
    title: 'Data Analyst',
    category: 'Data Science & BI',
    description: 'Transforms raw company datasets into actionable insights, automated SQL pipelines, and BI dashboards.',
    averageSalaryIndia: '₹6,00,000 - ₹14,00,000 / yr',
    demandLevel: 'High',
    requiredSkills: [
      { skillId: 'skill-python', minProficiency: 'Intermediate', weight: 5 },
      { skillId: 'skill-dbms', minProficiency: 'Advanced', weight: 5 },
      { skillId: 'skill-problemsolving', minProficiency: 'Intermediate', weight: 4 },
      { skillId: 'skill-communication', minProficiency: 'Intermediate', weight: 4 },
    ],
  },
  {
    id: 'career-web-dev',
    title: 'Web Developer (Full Stack)',
    category: 'Web Engineering',
    description: 'Architects and deploys interactive client interfaces and RESTful backend microservices.',
    averageSalaryIndia: '₹7,00,000 - ₹16,00,000 / yr',
    demandLevel: 'Very High',
    requiredSkills: [
      { skillId: 'skill-javascript', minProficiency: 'Advanced', weight: 5 },
      { skillId: 'skill-htmlcss', minProficiency: 'Advanced', weight: 4 },
      { skillId: 'skill-dbms', minProficiency: 'Intermediate', weight: 4 },
      { skillId: 'skill-git', minProficiency: 'Intermediate', weight: 3 },
      { skillId: 'skill-problemsolving', minProficiency: 'Intermediate', weight: 4 },
    ],
  },
  {
    id: 'career-aiml',
    title: 'AI/ML Engineer',
    category: 'Artificial Intelligence',
    description: 'Develops deep learning models, mathematical algorithms, and intelligent inference services.',
    averageSalaryIndia: '₹9,50,000 - ₹22,00,000 / yr',
    demandLevel: 'Very High',
    requiredSkills: [
      { skillId: 'skill-python', minProficiency: 'Advanced', weight: 5 },
      { skillId: 'skill-dsa', minProficiency: 'Advanced', weight: 5 },
      { skillId: 'skill-problemsolving', minProficiency: 'Advanced', weight: 5 },
      { skillId: 'skill-git', minProficiency: 'Intermediate', weight: 3 },
    ],
  },
  {
    id: 'career-cybersecurity',
    title: 'Cybersecurity Analyst',
    category: 'Information Security',
    description: 'Monitors, protects, and audits enterprise infrastructure against network intrusions and vulnerabilities.',
    averageSalaryIndia: '₹8,00,000 - ₹17,50,000 / yr',
    demandLevel: 'High',
    requiredSkills: [
      { skillId: 'skill-networks', minProficiency: 'Advanced', weight: 5 },
      { skillId: 'skill-python', minProficiency: 'Intermediate', weight: 4 },
      { skillId: 'skill-problemsolving', minProficiency: 'Intermediate', weight: 4 },
      { skillId: 'skill-communication', minProficiency: 'Intermediate', weight: 3 },
    ],
  },
];

export const initialUsers: User[] = [
  {
    id: 'user-demo-student',
    name: 'Aarav Sharma',
    email: 'demo@student.com',
    passwordHash: STUDENT_PASSWORD_HASH,
    role: 'student',
    createdAt: '2026-08-15T10:00:00.000Z',
    profile: {
      educationLevel: 'Undergraduate',
      branch: 'Computer Engineering',
      currentYearSemester: '3rd Year (Semester 5)',
      college: 'Pune Institute of Computer Technology (PICT)',
      interests: ['Competitive Programming', 'System Architecture', 'Fintech'],
      targetCareerId: 'career-swe',
      phone: '+91 98230 45678',
      bio: 'Aspiring software developer preparing for campus placements and technical hackathons. Focused on mastering core DSA and building scalable systems.',
      onboardingCompleted: true,
    },
  },
  {
    id: 'user-admin',
    name: 'Prof. Rajeshwar Kulkarni',
    email: 'admin@college.edu',
    passwordHash: ADMIN_PASSWORD_HASH,
    role: 'admin',
    createdAt: '2026-07-01T08:00:00.000Z',
    profile: {
      educationLevel: 'Doctorate (Ph.D)',
      branch: 'Computer Science & Engineering',
      currentYearSemester: 'Faculty & Placement Cell Lead',
      college: 'State Technical University',
      interests: ['Curriculum Design', 'Skill Gap Metrics', 'Industry Alignment'],
      targetCareerId: 'career-swe',
      bio: 'Head of Industry Relations & Student Placement Cell. Oversees capacity development pipelines.',
      onboardingCompleted: true,
    },
  },
  {
    id: 'user-student-2',
    name: 'Priya Patel',
    email: 'priya@student.com',
    passwordHash: STUDENT_PASSWORD_HASH,
    role: 'student',
    createdAt: '2026-08-20T09:30:00.000Z',
    profile: {
      educationLevel: 'Undergraduate',
      branch: 'Information Technology',
      currentYearSemester: '4th Year (Semester 7)',
      college: 'VJTI Mumbai',
      interests: ['Data Analytics', 'Business Intelligence', 'SQL'],
      targetCareerId: 'career-data-analyst',
      onboardingCompleted: true,
    },
  },
  {
    id: 'user-student-3',
    name: 'Rahul Verma',
    email: 'rahul@student.com',
    passwordHash: STUDENT_PASSWORD_HASH,
    role: 'student',
    createdAt: '2026-08-22T14:15:00.000Z',
    profile: {
      educationLevel: 'Undergraduate',
      branch: 'Electronics & Telecommunication',
      currentYearSemester: '3rd Year (Semester 6)',
      college: 'College of Engineering, Pune (COEP)',
      interests: ['Web Development', 'MERN Stack', 'Open Source'],
      targetCareerId: 'career-web-dev',
      onboardingCompleted: true,
    },
  },
  {
    id: 'user-student-4',
    name: 'Ananya Iyer',
    email: 'ananya@student.com',
    passwordHash: STUDENT_PASSWORD_HASH,
    role: 'student',
    createdAt: '2026-08-25T11:45:00.000Z',
    profile: {
      educationLevel: 'Postgraduate',
      branch: 'M.Tech Artificial Intelligence',
      currentYearSemester: '1st Year (Semester 2)',
      college: 'IIT Bombay',
      interests: ['Deep Learning', 'Computer Vision', 'PyTorch'],
      targetCareerId: 'career-aiml',
      onboardingCompleted: true,
    },
  },
  {
    id: 'user-student-5',
    name: 'Rohan Gupta',
    email: 'rohan@student.com',
    passwordHash: STUDENT_PASSWORD_HASH,
    role: 'student',
    createdAt: '2026-08-28T16:20:00.000Z',
    profile: {
      educationLevel: 'Undergraduate',
      branch: 'Computer Science',
      currentYearSemester: '2nd Year (Semester 4)',
      college: 'Delhi Technological University (DTU)',
      interests: ['Network Security', 'Ethical Hacking', 'Linux'],
      targetCareerId: 'career-cybersecurity',
      onboardingCompleted: true,
    },
  },
];

// Initial user skills for Aarav Sharma (Demonstrates clear skill gap against Software Developer)
export const initialUserSkills: UserSkill[] = [
  {
    id: 'us-1',
    userId: 'user-demo-student',
    skillId: 'skill-cpp',
    level: 'Intermediate',
    score: 72,
    lastAssessedAt: '2026-09-02T12:00:00.000Z',
    history: [
      { date: '2026-08-16', level: 'Beginner', score: 45, note: 'Initial diagnostic assessment' },
      { date: '2026-09-02', level: 'Intermediate', score: 72, note: 'Completed OOP in C++ & STL modules' },
    ],
  },
  {
    id: 'us-2',
    userId: 'user-demo-student',
    skillId: 'skill-dsa',
    level: 'Beginner',
    score: 42,
    lastAssessedAt: '2026-09-05T15:30:00.000Z',
    history: [
      { date: '2026-08-16', level: 'Beginner', score: 30, note: 'Initial diagnostic assessment' },
      { date: '2026-09-05', level: 'Beginner', score: 42, note: 'Completed Arrays & Time Complexity practice' },
    ],
  },
  {
    id: 'us-3',
    userId: 'user-demo-student',
    skillId: 'skill-dbms',
    level: 'Beginner',
    score: 48,
    lastAssessedAt: '2026-08-25T11:00:00.000Z',
    history: [
      { date: '2026-08-25', level: 'Beginner', score: 48, note: 'SQL basics diagnostic' },
    ],
  },
  {
    id: 'us-4',
    userId: 'user-demo-student',
    skillId: 'skill-oop',
    level: 'Intermediate',
    score: 75,
    lastAssessedAt: '2026-09-01T10:15:00.000Z',
    history: [
      { date: '2026-08-17', level: 'Beginner', score: 50, note: 'Pre-assessment' },
      { date: '2026-09-01', level: 'Intermediate', score: 75, note: 'Design principles assessment' },
    ],
  },
  {
    id: 'us-5',
    userId: 'user-demo-student',
    skillId: 'skill-git',
    level: 'Intermediate',
    score: 68,
    lastAssessedAt: '2026-08-20T17:00:00.000Z',
    history: [
      { date: '2026-08-20', level: 'Intermediate', score: 68, note: 'GitHub workflow review' },
    ],
  },
  {
    id: 'us-6',
    userId: 'user-demo-student',
    skillId: 'skill-problemsolving',
    level: 'Beginner',
    score: 45,
    lastAssessedAt: '2026-09-06T14:00:00.000Z',
    history: [
      { date: '2026-09-06', level: 'Beginner', score: 45, note: 'Logic & edge cases assessment' },
    ],
  },
];

export const initialCourseModules: CourseModule[] = [
  {
    id: 'mod-cpp-1',
    skillId: 'skill-cpp',
    careerId: 'career-swe',
    title: 'C++ Core Syntax & Memory Management',
    order: 1,
    level: 'Beginner',
    estimatedMinutes: 35,
    description: 'Pointers, references, memory allocation on stack vs heap, and modern C++ best practices.',
    notes: `### Memory Model in C++
In C++, program memory is organized into distinct segments:
- **Stack:** Rapid, automatic allocation for local variables and function call frames. Managed LIFO.
- **Heap:** Dynamic allocation managed explicitly by programmers using \`new\` and \`delete\` (or smart pointers in modern C++).
- **Data/BSS segment:** Holds global and static variables.
- **Code (Text) segment:** Read-only machine instructions.

#### Key Takeaway for Placements:
Always understand pointer arithmetic, pass-by-value vs pass-by-reference (\`const T&\`), and avoiding dangling pointers or memory leaks.`,
    codeExamples: [
      {
        language: 'cpp',
        title: 'Safe Pointer Usage & Pass By Reference',
        code: `#include <iostream>
#include <memory>

void modifyValue(int& ref) {
    ref += 10; // Directly modifies caller's variable without copy overhead
}

int main() {
    int x = 25;
    modifyValue(x);
    std::cout << "Value of x after reference modification: " << x << std::endl; // Output: 35

    // Modern C++: Unique pointer avoids memory leaks automatically
    std::unique_ptr<int> smartPtr = std::make_unique<int>(100);
    std::cout << "Smart pointer managed value: " << *smartPtr << std::endl;
    return 0;
}`,
        explanation: 'Shows pass-by-reference avoiding copy overhead and modern unique_ptr ensuring deterministic destructor cleanup.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-cpp-1',
        question: 'Which memory area stores local variables inside an executing function?',
        options: ['Stack', 'Heap', 'BSS segment', 'Code segment'],
        correctIndex: 0,
        explanation: 'Local variables and stack frames are automatically allocated on the Stack.',
      },
      {
        id: 'mq-cpp-2',
        question: 'What is the primary benefit of passing objects using "const std::string& str"?',
        options: [
          'It creates an editable copy in heap',
          'It avoids costly deep copying while protecting the original object from modification',
          'It forces the program to execute asynchronously',
          'It dynamically frees memory',
        ],
        correctIndex: 1,
        explanation: 'const reference prevents copy constructor calls while maintaining immutability guarantee.',
      },
    ],
  },
  {
    id: 'mod-cpp-2',
    skillId: 'skill-cpp',
    careerId: 'career-swe',
    title: 'Object-Oriented Architecture in C++',
    order: 2,
    level: 'Intermediate',
    estimatedMinutes: 45,
    description: 'Classes, virtual tables (vptr/vtable), pure virtual functions, runtime polymorphism, and destructors.',
    notes: `### Polymorphism & Virtual Functions
Polymorphism allows treating derived class objects as instances of a base class.
- **Compile-time (Static):** Function overloading and templates.
- **Runtime (Dynamic):** Virtual functions.

#### Virtual Table (vtable):
When a class declares a virtual function, the compiler builds a static table of function pointers for that class, and injects an invisible pointer (\`vptr\`) into every instance pointing to its respective vtable.`,
    codeExamples: [
      {
        language: 'cpp',
        title: 'Virtual Destructor & Abstract Interface',
        code: `#include <iostream>

class BaseDevice {
public:
    virtual void boot() = 0; // Pure virtual function -> Abstract Class
    virtual ~BaseDevice() {  // Crucial: virtual destructor prevents partial destruction
        std::cout << "BaseDevice cleaned up" << std::endl;
    }
};

class Microcontroller : public BaseDevice {
public:
    void boot() override {
        std::cout << "Microcontroller initialized via firmware." << std::endl;
    }
    ~Microcontroller() override {
        std::cout << "Microcontroller memory freed." << std::endl;
    }
};

int main() {
    BaseDevice* dev = new Microcontroller();
    dev->boot();
    delete dev; // Safely invokes derived then base destructor!
    return 0;
}`,
        explanation: 'Virtual destructor ensures memory allocated by derived class is correctly freed when deleted via base class pointer.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-cpp-3',
        question: 'What happens if a base class destructor is NOT declared virtual and an object is deleted via a base pointer?',
        options: [
          'Compiler error during compilation',
          'Derived destructor will not execute, leading to resource/memory leaks',
          'It automatically calls garbage collector',
          'Nothing, C++ automatically frees derived members',
        ],
        correctIndex: 1,
        explanation: 'Without a virtual destructor, only base destructor is called, causing undefined behavior and memory leaks.',
      },
    ],
  },
  {
    id: 'mod-dsa-1',
    skillId: 'skill-dsa',
    careerId: 'career-swe',
    title: 'DSA Fundamentals: Asymptotic Analysis & Arrays',
    order: 3,
    level: 'Beginner',
    estimatedMinutes: 40,
    description: 'Big-O notation, amortized complexity, sliding window pattern, two-pointer technique, and prefix sums.',
    notes: `### Asymptotic Complexity & Array Patterns
Mastering arrays is the starting line for product-firm technical interviews.
- **Big-O (O):** Upper bound of time/space growth rate.
- **Sliding Window:** Converts nested $O(N^2)$ brute-force into linear $O(N)$ for contiguous subarray problems.
- **Two Pointers:** Highly effective for sorted arrays (e.g. Pair Sum, Container with Most Water).`,
    codeExamples: [
      {
        language: 'cpp',
        title: 'Two Pointers Technique (Target Sum)',
        code: `#include <vector>
#include <iostream>

bool hasPairWithSum(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return true;
        if (sum < target) left++;
        else right--;
    }
    return false;
}

int main() {
    std::vector<int> sortedArr = {1, 3, 5, 8, 12, 19};
    std::cout << (hasPairWithSum(sortedArr, 13) ? "Found" : "Not Found") << std::endl;
    return 0;
}`,
        explanation: 'Linear time complexity O(N) using two pointers moving inward on a sorted vector.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-dsa-1',
        question: 'What is the time complexity of searching an element in an unsorted array of size N?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctIndex: 2,
        explanation: 'Unsorted arrays require checking each element sequentially in the worst case, giving O(N).',
      },
    ],
  },
  {
    id: 'mod-dsa-2',
    skillId: 'skill-dsa',
    careerId: 'career-swe',
    title: 'Linked Lists & Pointer Traversal',
    order: 4,
    level: 'Beginner',
    estimatedMinutes: 45,
    description: 'Singly vs doubly linked lists, reversing in-place, cycle detection (Floyd\'s Tortoise and Hare).',
    notes: `### Singly Linked Lists & In-Place Reversal
A Linked List is a linear data structure where elements are not stored at contiguous memory locations.
- **Cycle Detection:** Fast and slow pointers. If they meet, a cycle exists.
- **Reversal:** Requires 3 pointers (\`prev\`, \`curr\`, \`next\`) to manipulate links in $O(N)$ time with $O(1)$ auxiliary space.`,
    codeExamples: [
      {
        language: 'cpp',
        title: 'In-place Reversal of Singly Linked List',
        code: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev; // New head
}`,
        explanation: 'Standard 3-pointer reversal achieving O(N) time and O(1) extra space.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-dsa-2',
        question: 'How much extra auxiliary space does Floyd’s Cycle Detection algorithm require?',
        options: ['O(N)', 'O(log N)', 'O(1)', 'O(N^2)'],
        correctIndex: 2,
        explanation: 'Floyd’s algorithm uses only two pointers (slow and fast), requiring O(1) constant space.',
      },
    ],
  },
  {
    id: 'mod-dsa-3',
    skillId: 'skill-dsa',
    careerId: 'career-swe',
    title: 'Stacks, Queues & Monotonic Patterns',
    order: 5,
    level: 'Intermediate',
    estimatedMinutes: 50,
    description: 'LIFO & FIFO mechanics, Next Greater Element pattern, and Circular Deque design.',
    notes: `### Stacks and Monotonic Stacks
A stack stores items in Last-In/First-Out (LIFO) order.
- **Monotonic Stack Pattern:** Maintains elements in strictly increasing or decreasing order. Essential for solving:
  - Next Greater Element
  - Daily Temperatures
  - Largest Rectangle in Histogram`,
    codeExamples: [
      {
        language: 'cpp',
        title: 'Next Greater Element with Stack',
        code: `#include <vector>
#include <stack>

std::vector<int> nextGreaterElements(const std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> res(n, -1);
    std::stack<int> st; // stores indices
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            res[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return res;
}`,
        explanation: 'Each element is pushed and popped at most once, yielding linear O(N) complexity.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-dsa-3',
        question: 'Which data structure is naturally suited for verifying balanced parentheses like "{[()]}"?',
        options: ['Queue', 'Stack', 'Heap', 'Binary Tree'],
        correctIndex: 1,
        explanation: 'A stack stores open brackets and compares the most recent match when a closing bracket is found.',
      },
    ],
  },
  {
    id: 'mod-dsa-4',
    skillId: 'skill-dsa',
    careerId: 'career-swe',
    title: 'Binary Trees & Graph Traversals (BFS & DFS)',
    order: 6,
    level: 'Intermediate',
    estimatedMinutes: 60,
    description: 'Binary Search Trees, level order traversal, BFS with queues, DFS with recursion, and cycle detection in graphs.',
    notes: `### Trees & Graphs
- **Binary Search Tree (BST):** Left child < Root < Right child. In-order traversal gives sorted order!
- **Breadth-First Search (BFS):** Uses a queue to explore layer-by-layer; finds shortest paths in unweighted graphs.
- **Depth-First Search (DFS):** Uses recursion or a stack to explore as deep as possible before backtracking.`,
    codeExamples: [
      {
        language: 'cpp',
        title: 'Level Order Traversal (BFS) using Queue',
        code: `#include <vector>
#include <queue>

struct TreeNode {
    int val;
    TreeNode *left, *right;
};

std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    std::vector<std::vector<int>> result;
    if (!root) return result;
    std::queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int levelSize = q.size();
        std::vector<int> currentLevel;
        for (int i = 0; i < levelSize; ++i) {
            TreeNode* node = q.front();
            q.pop();
            currentLevel.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(currentLevel);
    }
    return result;
}`,
        explanation: 'Breadth-first traversal collecting node values layer by layer in O(V) time.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-dsa-4',
        question: 'Which traversal of a valid Binary Search Tree (BST) produces output in strictly ascending order?',
        options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
        correctIndex: 2,
        explanation: 'In-order traversal visits left subtree, root, then right subtree, yielding sorted order for BSTs.',
      },
    ],
  },
  {
    id: 'mod-dbms-1',
    skillId: 'skill-dbms',
    careerId: 'career-swe',
    title: 'Relational Database Architecture & SQL Joins',
    order: 7,
    level: 'Beginner',
    estimatedMinutes: 45,
    description: 'Database schemas, primary vs foreign keys, INNER/LEFT/RIGHT/FULL JOINs, GROUP BY, and aggregate queries.',
    notes: `### SQL Fundamentals & Relational Modeling
- **Primary Key:** Unique identifier for each record; cannot be NULL.
- **Foreign Key:** Enforces referential integrity by pointing to primary key in another table.
- **Joins:**
  - INNER JOIN: Matches rows where join condition is true in both tables.
  - LEFT JOIN: All rows from left table, matched with right table (NULL if no match).
  - GROUP BY: Combines rows with identical values into summary rows with aggregate functions (COUNT, SUM, AVG).`,
    codeExamples: [
      {
        language: 'sql',
        title: 'Aggregations and Multi-table Joins',
        code: `-- Find students and their count of completed learning modules
SELECT 
    u.name AS student_name,
    c.title AS career_goal,
    COUNT(lp.id) AS completed_modules
FROM users u
JOIN careers c ON u.target_career_id = c.id
LEFT JOIN learning_progress lp 
    ON u.id = lp.user_id AND lp.status = 'completed'
GROUP BY u.id, u.name, c.title
HAVING COUNT(lp.id) >= 1
ORDER BY completed_modules DESC;`,
        explanation: 'Demonstrates multi-table JOIN, grouping, aggregate counting, and HAVING filter clause.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-dbms-1',
        question: 'What is the key difference between WHERE and HAVING in SQL?',
        options: [
          'WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY',
          'HAVING can only be used with primary keys',
          'WHERE is only used for strings',
          'There is no functional difference',
        ],
        correctIndex: 0,
        explanation: 'WHERE filters individual row records before grouping, while HAVING applies conditions to grouped aggregates.',
      },
    ],
  },
  {
    id: 'mod-dbms-2',
    skillId: 'skill-dbms',
    careerId: 'career-swe',
    title: 'ACID Properties, Normalization & Indexing',
    order: 8,
    level: 'Intermediate',
    estimatedMinutes: 50,
    description: 'Atomicity, Consistency, Isolation, Durability, B-Tree indexes, 1NF to BCNF, and query optimization.',
    notes: `### ACID & High-Performance Transactions
- **Atomicity:** All-or-nothing execution of transactions.
- **Consistency:** Database transitions only from one valid state to another.
- **Isolation:** Concurrent transactions execute without cross-interference (Read Committed, Repeatable Read, Serializable).
- **Durability:** Committed data is permanently saved even during power failure.

#### Indexing (B-Tree):
Indexes speed up \`SELECT\` queries from $O(N)$ full table scans to $O(\\log N)$, at the cost of slight overhead on \`INSERT\` and \`UPDATE\` operations.`,
    codeExamples: [
      {
        language: 'sql',
        title: 'Transaction Block with Rollback Protection',
        code: `BEGIN TRANSACTION;

-- Deduct balance
UPDATE student_wallets 
SET balance = balance - 500 
WHERE student_id = 'stu_01' AND balance >= 500;

-- Credit course enrollment
INSERT INTO course_enrollments (student_id, course_id, enrolled_at)
VALUES ('stu_01', 'crs_dsa_pro', NOW());

COMMIT; -- If any statement fails, ROLLBACK is triggered automatically`,
        explanation: 'Atomic transaction block guaranteeing that either both updates succeed or neither takes effect.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-dbms-2',
        question: 'Which ACID property guarantees that once a transaction commits, its effects will survive a server crash?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctIndex: 3,
        explanation: 'Durability ensures committed data is written to non-volatile storage (WAL / transaction logs).',
      },
    ],
  },
  {
    id: 'mod-oop-1',
    skillId: 'skill-oop',
    careerId: 'career-swe',
    title: 'The 4 Pillars of OOP & SOLID Principles',
    order: 9,
    level: 'Intermediate',
    estimatedMinutes: 40,
    description: 'Encapsulation, Abstraction, Inheritance, Polymorphism, and Single Responsibility to Dependency Inversion.',
    notes: `### SOLID Principles in Clean Architecture
- **S - Single Responsibility:** A class should have only one reason to change.
- **O - Open/Closed:** Open for extension, closed for modification.
- **L - Liskov Substitution:** Derived classes must be substitutable for their base classes.
- **I - Interface Segregation:** Prefer small, client-specific interfaces over one fat interface.
- **D - Dependency Inversion:** Depend on abstractions, not concretions.`,
    codeExamples: [
      {
        language: 'typescript',
        title: 'Dependency Inversion & Open/Closed Principle',
        code: `// Interface acts as abstraction
interface NotificationChannel {
  send(recipient: string, message: string): Promise<void>;
}

class EmailService implements NotificationChannel {
  async send(recipient: string, message: string) {
    console.log(\`Sending Email to \${recipient}: \${message}\`);
  }
}

class SmsService implements NotificationChannel {
  async send(recipient: string, message: string) {
    console.log(\`Sending SMS to \${recipient}: \${message}\`);
  }
}

// StudentNotifier depends on abstraction, NOT concrete EmailService
class StudentNotifier {
  constructor(private channel: NotificationChannel) {}

  async notifyGapUpdate(studentEmail: string, gapSummary: string) {
    await this.channel.send(studentEmail, \`Skill Gap Alert: \${gapSummary}\`);
  }
}`,
        explanation: 'StudentNotifier is decoupled from the notification delivery mechanism, allowing new channels without altering existing code.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-oop-1',
        question: 'Which SOLID principle states that higher-level modules should not depend on low-level modules, but on abstractions?',
        options: ['Single Responsibility', 'Open-Closed', 'Liskov Substitution', 'Dependency Inversion'],
        correctIndex: 3,
        explanation: 'The Dependency Inversion Principle (DIP) mandates depending on abstract interfaces rather than concrete implementations.',
      },
    ],
  },
  {
    id: 'mod-git-1',
    skillId: 'skill-git',
    careerId: 'career-swe',
    title: 'Git Version Control & Collaborative Branching',
    order: 10,
    level: 'Beginner',
    estimatedMinutes: 30,
    description: 'Branching, staging, committing, git rebase vs merge, resolve conflicts, and pull request etiquette.',
    notes: `### Professional Git Workflows
- **git status & git diff:** Inspect workspace changes.
- **Feature Branch Workflow:** Never commit directly to \`main\`. Create feature branches like \`feat/assessment-timer\`.
- **Merge vs Rebase:**
  - \`git merge\` preserves historical chronological commits with a merge commit.
  - \`git rebase\` rewrites feature branch commits on top of target branch for a clean, linear history.`,
    codeExamples: [
      {
        language: 'bash',
        title: 'Standard Feature Development Commands',
        code: `# 1. Update local main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feat/skill-gap-radar

# 3. Stage and commit meaningful atomic work
git add src/components/SkillRadar.tsx
git commit -m "feat: render interactive polygon skill radar chart"

# 4. Push to remote for PR review
git push -u origin feat/skill-gap-radar`,
        explanation: 'Standard professional feature branch commands ensuring reproducible code review and safe collaboration.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-git-1',
        question: 'Which command creates and immediately switches to a new branch named "feature-login"?',
        options: ['git branch feature-login', 'git checkout -b feature-login', 'git switch -new feature-login', 'git commit -b feature-login'],
        correctIndex: 1,
        explanation: 'git checkout -b [branch-name] creates the branch and switches your HEAD to it.',
      },
    ],
  },
  {
    id: 'mod-py-1',
    skillId: 'skill-python',
    careerId: 'career-data-analyst',
    title: 'Python for Data Analysis: Pandas & NumPy',
    order: 11,
    level: 'Beginner',
    estimatedMinutes: 40,
    description: 'DataFrames, series, vectorized operations, missing data handling, and group aggregations.',
    notes: `### Python Data Stack
- **NumPy:** High performance n-dimensional array computing written in C.
- **Pandas:** Tabular data structures (\`DataFrame\` and \`Series\`) for filtering, pivoting, and transforming data.`,
    codeExamples: [
      {
        language: 'python',
        title: 'Data Cleaning and Group Aggregations in Pandas',
        code: `import pandas as pd

# Load student records
data = {
    'student': ['Aarav', 'Priya', 'Rahul', 'Ananya'],
    'skill': ['DSA', 'SQL', 'React', 'Python'],
    'score': [42, 85, 78, 92]
}
df = pd.DataFrame(data)

# Filter students needing skill development (< 70)
needs_improvement = df[df['score'] < 70]
print("Students needing capacity upgrade:")
print(needs_improvement)`,
        explanation: 'Vectorized boolean filtering in Pandas without slow explicit for-loops.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-py-1',
        question: 'What is the primary advantage of NumPy arrays over standard Python lists?',
        options: ['They can hold mixed data types', 'They use contiguous memory blocks for vectorized operations and are much faster', 'They do not require memory', 'They are purely text-based'],
        correctIndex: 1,
        explanation: 'NumPy arrays are stored in contiguous memory blocks with homogeneous types, unlocking SIMD hardware optimizations.',
      },
    ],
  },
  {
    id: 'mod-js-1',
    skillId: 'skill-javascript',
    careerId: 'career-web-dev',
    title: 'Modern JavaScript: Async/Await & Event Loop',
    order: 12,
    level: 'Intermediate',
    estimatedMinutes: 45,
    description: 'Call stack, microtask queue, macrotask queue, Promises, closures, and modern ES6+ features.',
    notes: `### Event Loop & Concurrency in JavaScript
JavaScript runs on a single-threaded event loop:
1. **Call Stack:** Executes synchronous functions.
2. **Microtask Queue:** Promise callbacks (\`.then\`, \`catch\`, \`await\`). Microtasks run BEFORE macrotasks!
3. **Macrotask Queue:** \`setTimeout\`, \`setInterval\`, I/O operations.`,
    codeExamples: [
      {
        language: 'javascript',
        title: 'Promise Concurrency with Promise.allSettled',
        code: `async function fetchStudentAnalytics(studentId) {
  try {
    const [skillsRes, progressRes] = await Promise.all([
      fetch(\`/api/skills/user?id=\${studentId}\`),
      fetch(\`/api/progress/analytics?id=\${studentId}\`)
    ]);

    const skills = await skillsRes.json();
    const progress = await progressRes.json();
    return { skills, progress };
  } catch (err) {
    console.error("Failed to load student capacity metrics", err);
    throw err;
  }
}`,
        explanation: 'Executes parallel non-blocking network requests, reducing total loading latency.',
      },
    ],
    practiceQuestions: [
      {
        id: 'mq-js-1',
        question: 'In the JavaScript event loop, which queue has higher priority after the call stack empties?',
        options: ['Macrotask Queue (setTimeout)', 'Microtask Queue (Promises)', 'Idle Queue', 'Garbage collector'],
        correctIndex: 1,
        explanation: 'All pending microtasks are drained before the next macrotask is dequeued and executed.',
      },
    ],
  },
];

export const initialAssessmentQuestions: AssessmentQuestion[] = [
  // C++ questions
  {
    id: 'aq-cpp-1',
    skillId: 'skill-cpp',
    difficulty: 'Beginner',
    question: 'What is the output of the following C++ code?\n\nint a = 10;\nint* p = &a;\n*p = 25;\nstd::cout << a;',
    codeSnippet: 'int a = 10;\nint* p = &a;\n*p = 25;\nstd::cout << a;',
    options: ['10', '25', 'Address of a', 'Compilation Error'],
    correctIndex: 1,
    explanation: 'Dereferencing the pointer *p and assigning 25 directly modifies the value stored at memory location of a.',
  },
  {
    id: 'aq-cpp-2',
    skillId: 'skill-cpp',
    difficulty: 'Intermediate',
    question: 'What happens when a C++ class has at least one pure virtual function (e.g. "virtual void run() = 0;")?',
    options: [
      'The class becomes abstract and cannot be instantiated directly',
      'The class can only be instantiated as a static variable',
      'It automatically causes a memory leak',
      'It forces all member variables to be private',
    ],
    correctIndex: 0,
    explanation: 'A class with one or more pure virtual functions is an Abstract Class and cannot be instantiated directly.',
  },
  {
    id: 'aq-cpp-3',
    skillId: 'skill-cpp',
    difficulty: 'Advanced',
    question: 'In C++11 and beyond, what is the primary purpose of std::move()?',
    options: [
      'Physically moves bytes across memory sockets',
      'Casts an lvalue to an rvalue reference to enable move semantics without deep copying',
      'Deletes the object immediately from heap',
      'Converts pointers to integer handles',
    ],
    correctIndex: 1,
    explanation: 'std::move is an unconditional static_cast to an rvalue reference, indicating the resource can be transferred rather than copied.',
  },

  // DSA questions
  {
    id: 'aq-dsa-1',
    skillId: 'skill-dsa',
    difficulty: 'Beginner',
    question: 'What is the worst-case time complexity of standard QuickSort when using a naive pivot selection on an already sorted array?',
    options: ['O(log N)', 'O(N)', 'O(N log N)', 'O(N^2)'],
    correctIndex: 3,
    explanation: 'Naive pivot selection (e.g. always first or last element) on sorted input partitions into 1 and N-1 elements, degenerating to O(N^2).',
  },
  {
    id: 'aq-dsa-2',
    skillId: 'skill-dsa',
    difficulty: 'Intermediate',
    question: 'Given an array of integers, which algorithmic pattern finds the maximum sum contiguous subarray in linear O(N) time?',
    options: ["Floyd's Algorithm", "Kadane's Algorithm", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
    correctIndex: 1,
    explanation: "Kadane's algorithm maintains a current_max and global_max in a single pass, computing maximum subarray in O(N) time.",
  },
  {
    id: 'aq-dsa-3',
    skillId: 'skill-dsa',
    difficulty: 'Intermediate',
    question: 'Which of the following data structures is typically used to implement Breadth-First Search (BFS) in a graph?',
    options: ['Stack', 'Queue', 'Min-Heap', 'Red-Black Tree'],
    correctIndex: 1,
    explanation: 'A First-In-First-Out (FIFO) queue guarantees that vertices closer to the start source are visited before deeper vertices.',
  },
  {
    id: 'aq-dsa-4',
    skillId: 'skill-dsa',
    difficulty: 'Advanced',
    question: 'What is the amortized time complexity of inserting an element into a dynamic array (std::vector or ArrayList) that doubles its capacity when full?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
    correctIndex: 0,
    explanation: 'Although individual resizing takes O(N), resizing occurs geometrically infrequently; averaged over N insertions, amortized cost is O(1).',
  },

  // DBMS questions
  {
    id: 'aq-dbms-1',
    skillId: 'skill-dbms',
    difficulty: 'Beginner',
    question: 'Which SQL clause is used to eliminate duplicate rows from the query result set?',
    options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'GROUP ROW'],
    correctIndex: 1,
    explanation: 'The SELECT DISTINCT statement is used to return only unique values.',
  },
  {
    id: 'aq-dbms-2',
    skillId: 'skill-dbms',
    difficulty: 'Intermediate',
    question: 'In database normalization, a relation is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:',
    options: [
      'Y is a candidate key',
      'X is a superkey',
      'X and Y are both foreign keys',
      'Y has no NULL values',
    ],
    correctIndex: 1,
    explanation: 'BCNF requires that the left-hand determinant X must be a superkey for every non-trivial dependency.',
  },
  {
    id: 'aq-dbms-3',
    skillId: 'skill-dbms',
    difficulty: 'Advanced',
    question: 'Which transaction isolation level prevents Dirty Reads and Non-Repeatable Reads, but may still allow Phantom Reads in ANSI SQL standard?',
    options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
    correctIndex: 2,
    explanation: 'Repeatable Read guarantees read data cannot change, but concurrent insertions matching a range query (phantoms) can still appear.',
  },

  // OOP questions
  {
    id: 'aq-oop-1',
    skillId: 'skill-oop',
    difficulty: 'Beginner',
    question: 'Restricting direct access to some of an object\'s components and bundling data with methods that operate on that data is called:',
    options: ['Polymorphism', 'Inheritance', 'Encapsulation', 'Compilation'],
    correctIndex: 2,
    explanation: 'Encapsulation shields the internal representation from external tampering by using private fields and public getters/setters.',
  },
  {
    id: 'aq-oop-2',
    skillId: 'skill-oop',
    difficulty: 'Intermediate',
    question: 'In object-oriented design, when class B "has-a" class A rather than "is-a" class A, this relationship is called:',
    options: ['Inheritance', 'Composition / Aggregation', 'Generalization', 'Casting'],
    correctIndex: 1,
    explanation: 'Composition ("has-a") models a whole-part relationship and is preferred over inheritance for flexible system architectures.',
  },

  // Problem Solving questions
  {
    id: 'aq-prob-1',
    skillId: 'skill-problemsolving',
    difficulty: 'Beginner',
    question: 'You have two water jugs: 3 liters and 5 liters, with an unlimited water supply. What is the minimum steps to measure exactly 4 liters?',
    options: ['6 steps', '4 steps', 'Impossible with these jug sizes', '10 steps'],
    correctIndex: 0,
    explanation: 'Fill 5L -> Pour into 3L (2L left in 5L jug) -> Empty 3L -> Pour 2L into 3L -> Fill 5L -> Pour into 3L until full (1L moves, leaving 4L in the 5L jug). Total 6 steps.',
  },
  {
    id: 'aq-prob-2',
    skillId: 'skill-problemsolving',
    difficulty: 'Intermediate',
    question: 'Given an unsorted array of numbers containing 1 to N with exactly one number missing, which method finds the missing number in O(N) time and O(1) extra space?',
    options: [
      'Sort the array and check gaps',
      'Compute expected sum N*(N+1)/2 and subtract array sum, or use XOR accumulator',
      'Store numbers in a hash map',
      'Nested loop comparing every pair',
    ],
    correctIndex: 1,
    explanation: 'Expected mathematical sum N*(N+1)/2 minus actual sum computes the missing integer in O(N) single-pass with O(1) memory.',
  },

  // Git questions
  {
    id: 'aq-git-1',
    skillId: 'skill-git',
    difficulty: 'Beginner',
    question: 'What is the staging area (index) in Git?',
    options: [
      'The remote GitHub server',
      'An intermediate preview zone where changes are formatted before committing to repository history',
      'A temporary trash bin',
      'The production deployment server',
    ],
    correctIndex: 1,
    explanation: 'The staging area allows selectively organizing files with "git add" before locking them into a snapshot with "git commit".',
  },

  // Python questions
  {
    id: 'aq-py-1',
    skillId: 'skill-python',
    difficulty: 'Beginner',
    question: 'What is the output of: print([i * 2 for i in range(4) if i % 2 == 0]) in Python?',
    options: ['[0, 2, 4]', '[0, 4]', '[2, 4]', '[0, 2, 4, 6]'],
    correctIndex: 1,
    explanation: 'Range(4) yields 0, 1, 2, 3. The condition filters even numbers: 0 and 2. Multiplying by 2 gives [0, 4].',
  },

  // JavaScript questions
  {
    id: 'aq-js-1',
    skillId: 'skill-javascript',
    difficulty: 'Intermediate',
    question: 'What will be printed to the console?\n\nconsole.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
    codeSnippet: 'console.log(1);\nsetTimeout(() => console.log(2), 0);\nPromise.resolve().then(() => console.log(3));\nconsole.log(4);',
    options: ['1, 4, 3, 2', '1, 2, 3, 4', '1, 4, 2, 3', '3, 1, 4, 2'],
    correctIndex: 0,
    explanation: 'Synchronous code runs first (1, 4). Microtasks execute immediately after (Promise 3). Macrotasks execute last (setTimeout 2). Result: 1, 4, 3, 2.',
  },
];

export const initialPracticeQuestions: PracticeQuestion[] = [
  {
    id: 'pq-1',
    title: 'Two Sum Problem',
    category: 'Coding',
    skillId: 'skill-dsa',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.
You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    templateCode: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    explanation: 'Using a hash map allows finding complements in single pass with O(N) time and O(N) auxiliary space.',
  },
  {
    id: 'pq-2',
    title: 'Valid Palindrome String',
    category: 'Coding',
    skillId: 'skill-dsa',
    difficulty: 'Easy',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.`,
    templateCode: `function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
    explanation: 'Two pointers moving inward check symmetric characters in linear O(N) time.',
  },
  {
    id: 'pq-3',
    title: 'Reverse Linked List',
    category: 'Coding',
    skillId: 'skill-dsa',
    difficulty: 'Medium',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list's head.`,
    templateCode: `function reverseLinkedList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev;
}`,
    explanation: 'Iterative 3-pointer reversal takes O(N) time and O(1) space.',
  },
  {
    id: 'pq-4',
    title: 'Detect Cycle in Linked List',
    category: 'MCQ',
    skillId: 'skill-dsa',
    difficulty: 'Medium',
    description: 'Which two-pointer technique determines if a linked list contains a cycle without modifying node values?',
    options: ['Binary search', "Floyd's Tortoise and Hare", 'Merge sort pointers', 'Quick select'],
    correctIndex: 1,
    explanation: 'Floyd’s algorithm uses slow (1 step) and fast (2 steps) pointers. If they ever point to identical nodes, a loop is confirmed.',
  },
  {
    id: 'pq-5',
    title: 'Train Speed and Distance Aptitude',
    category: 'Aptitude',
    skillId: 'skill-problemsolving',
    difficulty: 'Easy',
    description: 'A train 150 meters long passes a telegraph post in 10 seconds. What is the speed of the train in km/hr?',
    options: ['45 km/hr', '54 km/hr', '60 km/hr', '72 km/hr'],
    correctIndex: 1,
    explanation: 'Speed in m/s = Distance / Time = 150 / 10 = 15 m/s. Converting to km/hr = 15 * (18 / 5) = 54 km/hr.',
  },
  {
    id: 'pq-6',
    title: 'Pipes and Cisterns Logic',
    category: 'Aptitude',
    skillId: 'skill-problemsolving',
    difficulty: 'Medium',
    description: 'Pipe A can fill a tank in 6 hours, while Pipe B can empty it in 8 hours. If both pipes are opened together, in how many hours will the tank fill?',
    options: ['14 hours', '20 hours', '24 hours', '48 hours'],
    correctIndex: 2,
    explanation: 'Net rate per hour = (1/6) - (1/8) = (4 - 3)/24 = 1/24 tank per hour. Thus it requires 24 hours.',
  },
  {
    id: 'pq-7',
    title: 'SQL Second Highest Salary',
    category: 'Technical',
    skillId: 'skill-dbms',
    difficulty: 'Medium',
    description: 'How do you query the second highest distinct salary from an Employee table in SQL?',
    options: [
      'SELECT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;',
      'SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);',
      'SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1;',
      'Both B and C are valid solutions',
    ],
    correctIndex: 3,
    explanation: 'Both subquery with MAX() and DISTINCT with ORDER BY DESC LIMIT 1 OFFSET 1 correctly extract the 2nd distinct highest salary.',
  },
  {
    id: 'pq-8',
    title: 'Inheritance Memory Footprint',
    category: 'Technical',
    skillId: 'skill-oop',
    difficulty: 'Medium',
    description: 'In C++, does an empty class have a size of 0 bytes?',
    options: [
      'Yes, 0 bytes because it contains no data members',
      'No, 1 byte to guarantee distinct addresses for separate instances',
      'It causes a syntax error',
      '4 bytes due to CPU word alignment',
    ],
    correctIndex: 1,
    explanation: 'In C++, sizeof an empty class is at least 1 byte so that two different objects of the class have distinct memory addresses.',
  },
];

export const initialLearningProgress: LearningProgress[] = [
  {
    id: 'lp-1',
    userId: 'user-demo-student',
    moduleId: 'mod-cpp-1',
    status: 'completed',
    progressPercent: 100,
    lastAccessedAt: '2026-09-02T10:00:00.000Z',
    quizScore: 100,
    notes: 'Understood stack vs heap allocation and pointer referencing.',
  },
  {
    id: 'lp-2',
    userId: 'user-demo-student',
    moduleId: 'mod-cpp-2',
    status: 'completed',
    progressPercent: 100,
    lastAccessedAt: '2026-09-02T16:45:00.000Z',
    quizScore: 100,
    notes: 'Virtual destructor is necessary to prevent memory leaks when deleting through base pointer.',
  },
  {
    id: 'lp-3',
    userId: 'user-demo-student',
    moduleId: 'mod-dsa-1',
    status: 'in_progress',
    progressPercent: 65,
    lastAccessedAt: '2026-09-08T18:00:00.000Z',
    notes: 'Need more practice on sliding window contiguous subarray patterns.',
  },
  {
    id: 'lp-4',
    userId: 'user-demo-student',
    moduleId: 'mod-oop-1',
    status: 'completed',
    progressPercent: 100,
    lastAccessedAt: '2026-09-01T14:30:00.000Z',
    quizScore: 100,
  },
];

export const initialAssessmentAttempts: AssessmentAttempt[] = [
  {
    id: 'att-1',
    userId: 'user-demo-student',
    skillId: 'skill-cpp',
    score: 3,
    maxScore: 3,
    percentage: 100,
    estimatedLevel: 'Intermediate',
    previousLevel: 'Beginner',
    levelChanged: true,
    answers: { 'aq-cpp-1': 1, 'aq-cpp-2': 0, 'aq-cpp-3': 1 },
    completedAt: '2026-09-02T12:00:00.000Z',
  },
  {
    id: 'att-2',
    userId: 'user-demo-student',
    skillId: 'skill-dsa',
    score: 1,
    maxScore: 4,
    percentage: 25,
    estimatedLevel: 'Beginner',
    previousLevel: 'Beginner',
    levelChanged: false,
    answers: { 'aq-dsa-1': 3, 'aq-dsa-2': 0, 'aq-dsa-3': 0, 'aq-dsa-4': 2 },
    completedAt: '2026-09-05T15:30:00.000Z',
  },
];

export const initialPracticeAttempts: PracticeAttempt[] = [
  {
    id: 'pa-1',
    userId: 'user-demo-student',
    questionId: 'pq-1',
    status: 'solved',
    score: 100,
    submittedAt: '2026-09-06T11:00:00.000Z',
  },
  {
    id: 'pa-2',
    userId: 'user-demo-student',
    questionId: 'pq-4',
    status: 'solved',
    score: 100,
    submittedAt: '2026-09-06T11:20:00.000Z',
  },
  {
    id: 'pa-3',
    userId: 'user-demo-student',
    questionId: 'pq-5',
    status: 'solved',
    score: 100,
    submittedAt: '2026-09-07T09:15:00.000Z',
  },
];

// Persistent Database State in Memory (Optionally saves to /data/db.json)
class DatabaseStore {
  users: User[] = [...initialUsers];
  skills: Skill[] = [...initialSkills];
  careers: Career[] = [...initialCareers];
  userSkills: UserSkill[] = [...initialUserSkills];
  courseModules: CourseModule[] = [...initialCourseModules];
  assessmentQuestions: AssessmentQuestion[] = [...initialAssessmentQuestions];
  assessmentAttempts: AssessmentAttempt[] = [...initialAssessmentAttempts];
  learningProgress: LearningProgress[] = [...initialLearningProgress];
  practiceQuestions: PracticeQuestion[] = [...initialPracticeQuestions];
  practiceAttempts: PracticeAttempt[] = [...initialPracticeAttempts];

  private dbFilePath = path.join(process.cwd(), 'capacity_connect_db.json');

  constructor() {
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(this.dbFilePath)) {
        const raw = fs.readFileSync(this.dbFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users) this.users = parsed.users;
        if (parsed.skills) this.skills = parsed.skills;
        if (parsed.careers) this.careers = parsed.careers;
        if (parsed.userSkills) this.userSkills = parsed.userSkills;
        if (parsed.courseModules) this.courseModules = parsed.courseModules;
        if (parsed.assessmentQuestions) this.assessmentQuestions = parsed.assessmentQuestions;
        if (parsed.assessmentAttempts) this.assessmentAttempts = parsed.assessmentAttempts;
        if (parsed.learningProgress) this.learningProgress = parsed.learningProgress;
        if (parsed.practiceQuestions) this.practiceQuestions = parsed.practiceQuestions;
        if (parsed.practiceAttempts) this.practiceAttempts = parsed.practiceAttempts;
      }
    } catch (e) {
      console.warn('Notice: initialized database in memory');
    }
  }

  saveToDisk() {
    try {
      const data = {
        users: this.users,
        skills: this.skills,
        careers: this.careers,
        userSkills: this.userSkills,
        courseModules: this.courseModules,
        assessmentQuestions: this.assessmentQuestions,
        assessmentAttempts: this.assessmentAttempts,
        learningProgress: this.learningProgress,
        practiceQuestions: this.practiceQuestions,
        practiceAttempts: this.practiceAttempts,
      };
      fs.writeFileSync(this.dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // Ignored in read-only containers
    }
  }

  // Reset database back to clean demo state anytime requested
  resetToDemo() {
    this.users = [...initialUsers];
    this.skills = [...initialSkills];
    this.careers = [...initialCareers];
    this.userSkills = [...initialUserSkills];
    this.courseModules = [...initialCourseModules];
    this.assessmentQuestions = [...initialAssessmentQuestions];
    this.assessmentAttempts = [...initialAssessmentAttempts];
    this.learningProgress = [...initialLearningProgress];
    this.practiceQuestions = [...initialPracticeQuestions];
    this.practiceAttempts = [...initialPracticeAttempts];
    this.saveToDisk();
  }
}

export const db = new DatabaseStore();
