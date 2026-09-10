import { TrainerInfo, SkillVideoLecture, QuestionVideoSolution } from '../types';

export const defaultTrainer: TrainerInfo = {
  name: 'Er. Rohit Negi',
  role: 'Lead Technical Instructor & Systems Architect',
  organization: 'Coder Army • Ex-Uber SDE',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  experience: 'Ex-Uber SDE | GATE AIR 202 | Mentored 500k+ Engineers',
  bio: 'Senior Software Engineer, GATE Top Ranker, and founder of Coder Army. Passionate about empowering engineering students with deep foundations in DSA, systems, and interview mastery.',
  audioIntroScript:
    'Welcome to your Capacity Connect diagnostic assessment! I am Rohit Negi. Before you jump into the timed evaluation, I strongly recommend watching the revision masterclass video lecture above. It recaps memory layout, time complexity trade-offs, and critical interview traps. When you start the test, pace yourself at about 90 seconds per question. And do not worry if you make a mistake—I have recorded a dedicated step-by-step video solution for every single question waiting for you right after you submit. Let us sharpen your skills together!',
  rules: [
    'Pre-Test Revision: Watch the curated video lecture to refresh core principles and syntax.',
    'Test Duration: Timed session based on question count (typically 6-10 minutes).',
    'Marking Structure: +4 Marks for every correct answer; 0 for unanswered or incorrect (no negative penalty).',
    'Capacity Benchmarks: >= 75% Advanced Level, 50-74% Intermediate, <50% Beginner Foundation.',
    'Diagnostic Integrity: Answer independently to ensure your skill gap analysis accurately guides your roadmap.',
  ],
  tips: [
    'Analyze time & space complexity constraints before selecting an answer.',
    'Watch out for pointer dereferences (*p vs &p) and boundary index conditions.',
    'Click the Trainer Hint widget during the test if you need a conceptual refresher.',
    'Make sure to review the video solution on each question in your post-test report.',
  ],
};

// Curated video lectures for all assessment skills
export const skillVideoLectures: Record<string, SkillVideoLecture> = {
  'skill-cpp': {
    id: 'lec-cpp',
    skillId: 'skill-cpp',
    title: 'C++ Complete Crash Revision & Memory Model Masterclass',
    instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
    durationMinutes: 28,
    videoUrl: 'https://www.youtube.com/embed/EAR7De6G3mM',
    summary:
      'A high-density revision lecture covering stack vs heap memory allocation, raw pointers vs references, pure virtual functions, and C++11 move semantics.',
    topicsCovered: [
      'Pointers, References & Dereferencing Nuances',
      'Virtual Destructors & Abstract Base Classes',
      'C++11 Rvalue References and std::move()',
      'Common Memory Leaks and Segfault Prevention',
    ],
    keyCheatSheetNotes: [
      '*p accesses the value stored at address p; &x gets the memory address of x.',
      'A class with >= 1 pure virtual function (= 0) is an Abstract Class and cannot be instantiated directly.',
      'Base class destructors MUST be declared virtual if instances are deleted via base pointer.',
      'std::move() is an unconditional cast to rvalue reference—it transfers ownership without deep copying.',
    ],
  },
  'skill-dsa': {
    id: 'lec-dsa',
    skillId: 'skill-dsa',
    title: 'DSA Core Interview Patterns: Arrays, Big-O & Graph Traversal',
    instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
    durationMinutes: 35,
    videoUrl: 'https://www.youtube.com/embed/5_5oE5lgrhw',
    summary:
      'Master the essential algorithmic frameworks: Asymptotic analysis, Kadane’s algorithm, two pointers, sliding window, and graph BFS traversal.',
    topicsCovered: [
      'Big-O Asymptotic Upper Bounds & QuickSort Pitfalls',
      'Kadane’s Maximum Subarray Sum Algorithm in O(N)',
      'Queue-based Breadth First Search (BFS) Traversal',
      'Amortized O(1) Dynamic Array Doubling Analysis',
    ],
    keyCheatSheetNotes: [
      'QuickSort worst-case degenerates to O(N^2) if pivot is chosen naively on sorted inputs.',
      'Kadane’s Algorithm maintains max_ending_here and max_so_far in a single linear pass O(N).',
      'Breadth First Search (BFS) uses a FIFO Queue; Depth First Search (DFS) uses a LIFO Stack or recursion.',
      'Dynamic array push_back has amortized O(1) complexity because geometric doubling happens rarely.',
    ],
  },
  'skill-dbms': {
    id: 'lec-dbms',
    skillId: 'skill-dbms',
    title: 'DBMS & SQL Foundations: Normalization, ACID & Isolation Levels',
    instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
    durationMinutes: 26,
    videoUrl: 'https://www.youtube.com/embed/HXV3zeRR3h4',
    summary:
      'Deep dive into relational modeling, Boyce-Codd Normal Form (BCNF), transaction isolation levels, and SQL query optimization.',
    topicsCovered: [
      'SQL DISTINCT & Aggregation Internals',
      'Functional Dependencies & BCNF Superkey Rules',
      'Transaction Isolation: Dirty Reads vs Non-Repeatable vs Phantoms',
      'B-Tree Indexing and Query Performance',
    ],
    keyCheatSheetNotes: [
      'SELECT DISTINCT eliminates duplicate row tuples across selected fields.',
      'In BCNF, for every non-trivial functional dependency X -> Y, X must be a superkey.',
      'Repeatable Read prevents dirty and non-repeatable reads, but ANSI SQL allows Phantom Reads unless Serializable is used.',
      'Indexes speed up WHERE/JOIN queries but add overhead to INSERT/UPDATE operations.',
    ],
  },
  'skill-oop': {
    id: 'lec-oop',
    skillId: 'skill-oop',
    title: 'Object-Oriented Programming & SOLID Principles Masterclass',
    instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
    durationMinutes: 24,
    videoUrl: 'https://www.youtube.com/embed/bSrm9RXwBaI',
    summary:
      'Understand the 4 core pillars of OOP and practical architectural patterns using the SOLID principles for scalable codebases.',
    topicsCovered: [
      'Encapsulation vs Data Hiding with Getters/Setters',
      'Composition ("has-a") vs Inheritance ("is-a")',
      'Dependency Inversion & Open-Closed Principles',
      'Polymorphism: Compile-Time vs Runtime Dispatch',
    ],
    keyCheatSheetNotes: [
      'Encapsulation bundles data with methods and restricts direct access to internal state.',
      'Favor Composition over Inheritance: "has-a" allows flexible swaps at runtime without fragile hierarchy.',
      'Dependency Inversion Principle: High-level modules should depend on abstractions (interfaces), not concretions.',
    ],
  },
  'skill-problemsolving': {
    id: 'lec-problemsolving',
    skillId: 'skill-problemsolving',
    title: 'Analytical Problem Solving & Mathematical Reductions',
    instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
    durationMinutes: 20,
    videoUrl: 'https://www.youtube.com/embed/8v_4734mx98',
    summary:
      'Strategic heuristics for solving algorithmic puzzles, invariant maintenance, and O(1) space tricks.',
    topicsCovered: [
      'State-space reduction (Water Jug Riddle)',
      'Mathematical Sum N*(N+1)/2 vs XOR Missing Number',
      'Two-pointer invariant maintenance',
      'Recognizing optimal substructure in puzzles',
    ],
    keyCheatSheetNotes: [
      'The 3L and 5L jug problem to reach 4L requires 6 precise fill/pour steps based on GCD properties.',
      'Missing number in 1..N can be found in O(N) time and O(1) space via N*(N+1)/2 - sum(arr).',
      'XOR accumulator (a ^ b ^ b = a) prevents integer overflow when calculating missing elements.',
    ],
  },
  'skill-git': {
    id: 'lec-git',
    skillId: 'skill-git',
    title: 'Git & GitHub Deep Dive: Staging, Rebase & Collaboration',
    instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
    durationMinutes: 22,
    videoUrl: 'https://www.youtube.com/embed/apGV9Kg7ics',
    summary:
      'Understand Git plumbing: Blobs, Trees, Commits, the 3-tree architecture, and safe branch management.',
    topicsCovered: [
      'Working Directory vs Staging Area (Index) vs HEAD',
      'git merge vs git rebase interactive',
      'Resolving merge conflicts like a senior engineer',
      'Branch protection rules & PR workflows',
    ],
    keyCheatSheetNotes: [
      'The staging area (Index) is an intermediate holding zone before commits.',
      'git rebase creates a linear history by replaying commits on top of target branch.',
      'git cherry-pick applies specific commits without merging full branches.',
    ],
  },
  'skill-python': {
    id: 'lec-python',
    skillId: 'skill-python',
    title: 'Python Essentials: Comprehensions, Generators & Internals',
    instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
    durationMinutes: 25,
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
    summary:
      'Write idiomatic Pythonic code, understand list/dict comprehensions, iterator protocols, and memory profiling.',
    topicsCovered: [
      'List Comprehension filtering and mapping syntax',
      'Generator expressions vs in-memory lists',
      'Python GIL (Global Interpreter Lock) overview',
      'Mutable vs Immutable type references',
    ],
    keyCheatSheetNotes: [
      '[i * 2 for i in range(4) if i % 2 == 0] evaluates even indices 0, 2 to [0, 4].',
      'Lists, dicts, and sets are mutable; tuples, strings, and ints are immutable.',
      'Use generators (yield) when streaming large datasets to keep memory O(1).',
    ],
  },
  'skill-javascript': {
    id: 'lec-javascript',
    skillId: 'skill-javascript',
    title: 'JavaScript Event Loop, Microtasks & Asynchronous Mastery',
    instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
    durationMinutes: 28,
    videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ',
    summary:
      'Understand the browser event loop, call stack execution, Microtask Queue (Promises), and Macrotask Queue (setTimeout).',
    topicsCovered: [
      'Call Stack execution ordering',
      'Microtasks (Promises, queueMicrotask) priority',
      'Macrotasks (setTimeout, setInterval, I/O)',
      'Async/Await desugaring to Promise chains',
    ],
    keyCheatSheetNotes: [
      'Synchronous code runs first to completion.',
      'Microtask queue drains completely before the next macrotask is executed.',
      'Order: console.log(1) -> setTimeout(2, 0) -> Promise.then(3) -> console.log(4) prints 1, 4, 3, 2.',
    ],
  },
};

// Default fallback video lecture for any newly configured skill
export const getDefaultVideoLecture = (skillId: string, skillName: string): SkillVideoLecture => {
  return (
    skillVideoLectures[skillId] || {
      id: `lec-${skillId}`,
      skillId,
      title: `${skillName} Diagnostic Crash Course & Revision`,
      instructor: 'Er. Rohit Negi (Ex-Uber, Coder Army)',
      durationMinutes: 20,
      videoUrl: 'https://www.youtube.com/embed/5_5oE5lgrhw',
      summary: `Comprehensive core concepts revision for ${skillName}, structured to reinforce interview competencies and algorithmic best practices.`,
      topicsCovered: [
        `Core Principles & Foundations of ${skillName}`,
        'Algorithmic Patterns and Common Trap Scenarios',
        'Time & Space Complexity Benchmarks',
        'Industry Best Practices for Tier-1 Product Companies',
      ],
      keyCheatSheetNotes: [
        'Read instructions and question constraints thoroughly before submitting.',
        'Eliminate definitely incorrect options first to maximize accuracy.',
        'Watch the per-question video solutions in your evaluation breakdown.',
      ],
    }
  );
};

// Detailed video solutions for each individual question
export const questionVideoSolutions: Record<string, QuestionVideoSolution> = {
  'aq-cpp-1': {
    questionId: 'aq-cpp-1',
    videoUrl: 'https://www.youtube.com/embed/EAR7De6G3mM?start=240',
    title: 'Video Solution: Pointer Dereferencing & Memory Mutation in C++',
    duration: '4:15 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Dereferencing a pointer using *p accesses the actual memory cell of variable a. Assigning *p = 25 modifies a in-place.',
    timeComplexity: 'O(1) Memory Access',
    spaceComplexity: 'O(1) Auxiliary Space',
    codeWalkthrough: `1. int a = 10; allocates 4 bytes on stack with value 10.
2. int* p = &a; stores the memory address of 'a' in pointer 'p'.
3. *p = 25; dereferences address in 'p' and writes 25 directly into 'a'.
4. std::cout << a; outputs 25.`,
    timestamps: [
      { time: '0:00', label: 'Problem Statement & Memory Setup' },
      { time: '1:05', label: 'Visualizing Stack Frames & Addresses' },
      { time: '2:30', label: 'The Dereference Operator (*p) In Action' },
      { time: '3:40', label: 'Why Options A (10) and C (Address) are Wrong' },
    ],
  },
  'aq-cpp-2': {
    questionId: 'aq-cpp-2',
    videoUrl: 'https://www.youtube.com/embed/EAR7De6G3mM?start=720',
    title: 'Video Solution: Pure Virtual Functions & Abstract Classes',
    duration: '5:10 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Any class with at least one pure virtual function (virtual void fn() = 0;) is an Abstract Class and cannot be directly instantiated.',
    timeComplexity: 'O(1) VTable Dispatch',
    spaceComplexity: 'O(1) VPtr per instance',
    codeWalkthrough: `1. 'virtual void run() = 0;' denotes a pure virtual function with no default implementation.
2. The C++ compiler marks the class as abstract.
3. Any attempt like 'Base b;' causes compilation error: cannot declare variable of abstract type.
4. Derived classes must override all pure virtual functions to become concrete.`,
    timestamps: [
      { time: '0:00', label: 'Virtual Functions vs Pure Virtual Functions' },
      { time: '1:20', label: 'Compiler Mechanics: The VTable and NULL slot' },
      { time: '3:05', label: 'Designing Clean Interfaces with Abstract Classes' },
      { time: '4:20', label: 'Common Interview Pitfalls' },
    ],
  },
  'aq-cpp-3': {
    questionId: 'aq-cpp-3',
    videoUrl: 'https://www.youtube.com/embed/EAR7De6G3mM?start=1250',
    title: 'Video Solution: C++11 Move Semantics & std::move()',
    duration: '6:05 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'std::move does not actually move any memory bytes; it casts an lvalue into an rvalue reference, enabling move constructors to steal resources.',
    timeComplexity: 'O(1) Pointer Swap vs O(N) Deep Copy',
    spaceComplexity: 'O(1) Extra Space',
    codeWalkthrough: `1. std::move(x) is an unconditional static_cast<T&&>(x).
2. It turns an lvalue into an expiring rvalue reference.
3. The move constructor / move assignment operator is selected instead of copy constructor.
4. Internal buffer pointers are swapped in O(1) instead of reallocating and copying in O(N).`,
    timestamps: [
      { time: '0:00', label: 'Lvalues vs Rvalues Fundamentals' },
      { time: '1:45', label: 'The Cost of Deep Copying' },
      { time: '3:30', label: 'What std::move Actually Compiles Into' },
      { time: '5:15', label: 'Safety Guidelines: State of Moved-From Objects' },
    ],
  },
  'aq-dsa-1': {
    questionId: 'aq-dsa-1',
    videoUrl: 'https://www.youtube.com/embed/5_5oE5lgrhw?start=310',
    title: 'Video Solution: QuickSort Worst-Case Time Complexity Analysis',
    duration: '4:45 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'When pivot is picked naively on an already sorted array, partitions divide into 0 and N-1 elements, yielding recurrence T(N) = T(N-1) + O(N) = O(N^2).',
    timeComplexity: 'Worst-case O(N^2), Average O(N log N)',
    spaceComplexity: 'Worst-case O(N) recursion stack',
    codeWalkthrough: `1. In standard QuickSort with first element as pivot on [1, 2, 3, 4, 5]:
2. Pivot 1 partitions into [] and [2, 3, 4, 5].
3. Next step pivot 2 partitions into [] and [3, 4, 5].
4. N recursive calls with N, N-1, N-2 work sum up to N*(N+1)/2 = O(N^2).
5. Fix: Use randomized pivot or Median-of-Three.`,
    timestamps: [
      { time: '0:00', label: 'Partitioning Intuition' },
      { time: '1:10', label: 'Tracing the Degenerate Case on Sorted Array' },
      { time: '2:50', label: 'Recurrence Relation Derivation' },
      { time: '3:55', label: 'Industry Fixes: Randomization & Dual-Pivot' },
    ],
  },
  'aq-dsa-2': {
    questionId: 'aq-dsa-2',
    videoUrl: 'https://www.youtube.com/embed/5_5oE5lgrhw?start=850',
    title: 'Video Solution: Kadane’s Maximum Subarray Sum Algorithm',
    duration: '5:20 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Kadane’s algorithm operates on the greedy principle: at each index, decide whether to extend the previous subarray or start fresh from current number.',
    timeComplexity: 'O(N) Single Linear Pass',
    spaceComplexity: 'O(1) Auxiliary Space',
    codeWalkthrough: `1. Initialize current_max = arr[0], max_so_far = arr[0].
2. For i from 1 to N-1:
   current_max = max(arr[i], current_max + arr[i]);
   max_so_far = max(max_so_far, current_max);
3. If current_max drops negative, starting fresh at next positive number is strictly better.
4. Returns max_so_far in O(N) time and O(1) space.`,
    timestamps: [
      { time: '0:00', label: 'Brute Force O(N^2) vs Kadane O(N)' },
      { time: '1:30', label: 'The Greedy Invariant Explained' },
      { time: '3:15', label: 'Step-by-Step Array Trace' },
      { time: '4:30', label: 'Handling All-Negative Arrays' },
    ],
  },
  'aq-dsa-3': {
    questionId: 'aq-dsa-3',
    videoUrl: 'https://www.youtube.com/embed/5_5oE5lgrhw?start=1420',
    title: 'Video Solution: Breadth First Search (BFS) Queue Architecture',
    duration: '4:50 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'FIFO Queue preserves level-by-level distance ordering. Vertices at distance K are always popped before vertices at distance K+1.',
    timeComplexity: 'O(V + E) for Adjacency List',
    spaceComplexity: 'O(V) for Queue and Visited Set',
    codeWalkthrough: `1. BFS explores neighbors radially in concentric circles.
2. FIFO (First In First Out) property guarantees shortest path in unweighted graphs.
3. A Stack would produce Depth First Search (DFS), Min-Heap produces Dijkstra’s.`,
    timestamps: [
      { time: '0:00', label: 'Level-Order Traversal Intuition' },
      { time: '1:15', label: 'Why Queue Guarantees Shortest Path' },
      { time: '2:40', label: 'Queue vs Stack vs PriorityQueue' },
      { time: '3:50', label: 'Complexity Breakdown O(V + E)' },
    ],
  },
  'aq-dsa-4': {
    questionId: 'aq-dsa-4',
    videoUrl: 'https://www.youtube.com/embed/5_5oE5lgrhw?start=1950',
    title: 'Video Solution: Amortized Complexity of Dynamic Array Doubling',
    duration: '5:40 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Although resizing takes O(N) copy operations, doubling capacity means copies occur at intervals 1, 2, 4, 8... Total copies for N pushes is <= 2N, giving amortized O(1).',
    timeComplexity: 'Amortized O(1) Push, Worst-case O(N)',
    spaceComplexity: 'O(N) Dynamic Buffer',
    codeWalkthrough: `1. Geometric expansion 1 + 2 + 4 + 8 + ... + N = 2N - 1 total elements copied.
2. (2N - 1) copies distributed over N operations = 2 copies per insertion on average.
3. Therefore, amortized time is bounded by constant O(1).`,
    timestamps: [
      { time: '0:00', label: 'What is Amortized Analysis?' },
      { time: '1:40', label: 'The Geometric Series Math' },
      { time: '3:20', label: 'Accounting / Banker’s Method' },
      { time: '4:50', label: 'Why Adding Fixed +K Fails and Yields O(N^2)' },
    ],
  },
  'aq-dbms-1': {
    questionId: 'aq-dbms-1',
    videoUrl: 'https://www.youtube.com/embed/HXV3zeRR3h4?start=180',
    title: 'Video Solution: SQL SELECT DISTINCT Filtering Mechanism',
    duration: '3:50 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'SELECT DISTINCT removes duplicate tuples from the output projection by sorting or hashing the selected columns in the execution engine.',
    timeComplexity: 'O(N log N) via Sort or O(N) via Hash Aggregation',
    spaceComplexity: 'O(N) Hash Table in Buffer Pool',
    codeWalkthrough: `1. 'SELECT DISTINCT column_name FROM table;' filters duplicate values.
2. 'UNIQUE' is a constraint, not a projection clause.
3. 'GROUP ROW' is invalid SQL syntax.`,
    timestamps: [
      { time: '0:00', label: 'Query Syntax & Keyword Roles' },
      { time: '1:10', label: 'Engine Execution: Hash vs Sort Distinct' },
      { time: '2:30', label: 'NULL Handling in DISTINCT' },
    ],
  },
  'aq-dbms-2': {
    questionId: 'aq-dbms-2',
    videoUrl: 'https://www.youtube.com/embed/HXV3zeRR3h4?start=620',
    title: 'Video Solution: Boyce-Codd Normal Form (BCNF) Superkey Rule',
    duration: '5:30 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'BCNF eliminates all redundancy based on functional dependencies: for every non-trivial X -> Y, X MUST be a superkey.',
    timeComplexity: 'O(1) Verification per Dependency',
    spaceComplexity: 'O(1) Schema Metadata',
    codeWalkthrough: `1. 3NF allows Y to be a prime attribute even if X is not a superkey.
2. BCNF tightens this: X must strictly be a superkey, eliminating anomaly where a prime attribute depends on non-superkey.
3. Hence: X is a superkey is the necessary and sufficient condition.`,
    timestamps: [
      { time: '0:00', label: '1NF, 2NF, 3NF Recap' },
      { time: '1:40', label: 'The 3NF Loophole Explained' },
      { time: '3:10', label: 'The Strict BCNF Condition' },
      { time: '4:40', label: 'Decomposition Example' },
    ],
  },
  'aq-dbms-3': {
    questionId: 'aq-dbms-3',
    videoUrl: 'https://www.youtube.com/embed/HXV3zeRR3h4?start=1120',
    title: 'Video Solution: Transaction Isolation Levels & Phantom Reads',
    duration: '5:15 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Repeatable Read locks rows that are read, preventing dirty and non-repeatable reads. However, predicate range scans can still see newly inserted rows (phantoms).',
    timeComplexity: 'O(1) MVCC Snapshot Lookup',
    spaceComplexity: 'O(N) Undo Logs in InnoDB',
    codeWalkthrough: `1. Read Uncommitted: Allows Dirty Reads.
2. Read Committed: Prevents Dirty Reads, allows Non-Repeatable Reads.
3. Repeatable Read: Prevents Non-Repeatable Reads, standard allows Phantom Reads (InnoDB uses Next-Key Locks to mitigate).
4. Serializable: Prevents all anomalies including Phantoms.`,
    timestamps: [
      { time: '0:00', label: 'The 3 Concurrency Phenomena' },
      { time: '1:30', label: 'Dirty Read vs Non-Repeatable Read' },
      { time: '3:00', label: 'What Exactly is a Phantom Read?' },
      { time: '4:20', label: 'Summary Table of 4 Isolation Levels' },
    ],
  },
  'aq-oop-1': {
    questionId: 'aq-oop-1',
    videoUrl: 'https://www.youtube.com/embed/bSrm9RXwBaI?start=210',
    title: 'Video Solution: Encapsulation & Information Hiding',
    duration: '4:20 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Encapsulation bundles data and methods into a single unit while restricting direct external access to prevent illegal state mutations.',
    timeComplexity: 'O(1) Accessor Inlining',
    spaceComplexity: 'O(1) Object Layout',
    codeWalkthrough: `1. Bundling state (fields) and behavior (methods) into a class.
2. Making fields private and exposing public getters/setters enforces invariants.
3. Option A (Polymorphism) is multiple forms of methods; Option B (Inheritance) is code reuse.`,
    timestamps: [
      { time: '0:00', label: 'Definition of Encapsulation' },
      { time: '1:20', label: 'Encapsulation vs Abstraction Difference' },
      { time: '2:50', label: 'Practical Class Design in Java & C++' },
    ],
  },
  'aq-oop-2': {
    questionId: 'aq-oop-2',
    videoUrl: 'https://www.youtube.com/embed/bSrm9RXwBaI?start=680',
    title: 'Video Solution: Composition vs Inheritance ("has-a" vs "is-a")',
    duration: '4:45 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Composition ("has-a") models relationships where one object contains references to another. It provides loose coupling and higher architectural flexibility than inheritance.',
    timeComplexity: 'O(1) Reference Access',
    spaceComplexity: 'O(1) Pointer Field',
    codeWalkthrough: `1. "is-a" relationship = Inheritance (e.g. Dog is-a Animal).
2. "has-a" relationship = Composition / Aggregation (e.g. Car has-a Engine).
3. Composition allows swapping the internal component at runtime without altering class hierarchies.`,
    timestamps: [
      { time: '0:00', label: '"is-a" vs "has-a" Mental Model' },
      { time: '1:30', label: 'The Fragile Base Class Problem' },
      { time: '3:10', label: 'Composition in Modern Systems Architecture' },
    ],
  },
  'aq-prob-1': {
    questionId: 'aq-prob-1',
    videoUrl: 'https://www.youtube.com/embed/8v_4734mx98?start=150',
    title: 'Video Solution: 3L and 5L Water Jug Riddle to Measure 4L',
    duration: '5:00 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Step-by-step state transition using Diophantine equations: exactly 6 operational steps are required.',
    timeComplexity: 'O(1) Constant Sequence',
    spaceComplexity: 'O(1) State Memory',
    codeWalkthrough: `Step 1: Fill 5L jug to top -> (0, 5)
Step 2: Pour 5L into 3L jug until 3L is full -> (3, 2) [2L remains in 5L jug]
Step 3: Empty 3L jug -> (0, 2)
Step 4: Pour 2L from 5L jug into 3L jug -> (2, 0)
Step 5: Fill 5L jug to top -> (2, 5)
Step 6: Pour from 5L into 3L jug until full (needs 1L) -> (3, 4)
Result: Exactly 4 Liters left in the 5L jug! Total 6 steps.`,
    timestamps: [
      { time: '0:00', label: 'Puzzle Formulation & Constraints' },
      { time: '1:15', label: 'Tracing Steps 1 through 3' },
      { time: '2:45', label: 'Tracing Steps 4 through 6' },
      { time: '4:10', label: 'Mathematical GCD Proof (Bézout Identity)' },
    ],
  },
  'aq-prob-2': {
    questionId: 'aq-prob-2',
    videoUrl: 'https://www.youtube.com/embed/8v_4734mx98?start=620',
    title: 'Video Solution: Finding Missing Number in O(N) Time and O(1) Space',
    duration: '4:30 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Compare expected sum N*(N+1)/2 against actual array sum in a single pass, or use XOR accumulator to avoid 64-bit integer overflow.',
    timeComplexity: 'O(N) Single Linear Scan',
    spaceComplexity: 'O(1) Constant Auxiliary Space',
    codeWalkthrough: `Method 1 (Sum):
Expected = N * (N + 1) / 2
Actual = sum(arr)
Missing = Expected - Actual.

Method 2 (XOR):
xorAll = 1 ^ 2 ^ ... ^ N
xorArr = arr[0] ^ arr[1] ^ ...
Missing = xorAll ^ xorArr.
Both take O(N) time and O(1) auxiliary space.`,
    timestamps: [
      { time: '0:00', label: 'Problem Analysis & Constraint Checklist' },
      { time: '1:10', label: 'The Gauss Sum Formula Method' },
      { time: '2:30', label: 'The XOR Trick (Handling Integer Overflow)' },
      { time: '3:50', label: 'Why Sorting O(N log N) is Suboptimal' },
    ],
  },
  'aq-git-1': {
    questionId: 'aq-git-1',
    videoUrl: 'https://www.youtube.com/embed/apGV9Kg7ics?start=210',
    title: 'Video Solution: Git Staging Area (Index) Explained',
    duration: '4:10 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'The staging area (index) is an intermediate staging buffer between your active working directory and committed repository history.',
    timeComplexity: 'O(1) SHA-1 Hash Generation',
    spaceComplexity: 'O(Files) Index Metadata',
    codeWalkthrough: `1. Working Directory: where you edit files on filesystem.
2. Staging Area (Index): prepared with 'git add', creates blob objects in .git/objects.
3. Repository (HEAD): created with 'git commit', locking the index tree into an immutable commit object.`,
    timestamps: [
      { time: '0:00', label: 'The Three Trees of Git' },
      { time: '1:20', label: 'Why Git Has a Staging Area (Unlike SVN)' },
      { time: '2:40', label: 'Atomic Commits and Selective Staging' },
    ],
  },
  'aq-py-1': {
    questionId: 'aq-py-1',
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw?start=340',
    title: 'Video Solution: Python List Comprehensions & Conditional Filtering',
    duration: '3:45 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'List comprehension [expr for var in iterable if cond] filters values where cond is True, then evaluates expr.',
    timeComplexity: 'O(N) Iteration',
    spaceComplexity: 'O(K) where K is number of matched elements',
    codeWalkthrough: `1. range(4) generates values 0, 1, 2, 3.
2. Condition 'if i % 2 == 0' checks for even numbers:
   - 0 % 2 == 0 -> True (keep)
   - 1 % 2 == 0 -> False (drop)
   - 2 % 2 == 0 -> True (keep)
   - 3 % 2 == 0 -> False (drop)
3. Expression 'i * 2' is applied to kept elements:
   - 0 * 2 = 0
   - 2 * 2 = 4
4. Result list: [0, 4].`,
    timestamps: [
      { time: '0:00', label: 'Syntax Structure of Comprehensions' },
      { time: '1:05', label: 'Step-by-Step Filter Evaluation' },
      { time: '2:20', label: 'Common Traps & Why [0, 2, 4] is Wrong' },
    ],
  },
  'aq-js-1': {
    questionId: 'aq-js-1',
    videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ?start=420',
    title: 'Video Solution: JavaScript Event Loop, Microtasks & Timers',
    duration: '5:30 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway:
      'Synchronous code executes first, then the microtask queue (Promise callbacks) is completely drained, and finally macrotasks (setTimeout) execute.',
    timeComplexity: 'O(1) Queue Operations',
    spaceComplexity: 'O(1) Task Descriptors',
    codeWalkthrough: `1. console.log(1); executes immediately -> Prints 1.
2. setTimeout(..., 0); registers callback into Macrotask Queue.
3. Promise.resolve().then(...); registers callback into Microtask Queue.
4. console.log(4); executes immediately -> Prints 4.
5. Synchronous stack is now empty!
6. Drain Microtask Queue: Promise callback runs -> Prints 3.
7. Microtask Queue empty, now execute next Macrotask: setTimeout runs -> Prints 2.
Final Output Order: 1, 4, 3, 2.`,
    timestamps: [
      { time: '0:00', label: 'Call Stack vs Web APIs vs Queues' },
      { time: '1:30', label: 'Tracing Synchronous Execution (1, 4)' },
      { time: '2:50', label: 'Microtasks (Promises) vs Macrotasks (Timers)' },
      { time: '4:20', label: 'Execution Order Summary (1, 4, 3, 2)' },
    ],
  },
};

// Fallback generator for questions without specific hardcoded video solution
export const getQuestionVideoSolution = (
  questionId: string,
  questionTitle: string,
  skillName: string
): QuestionVideoSolution => {
  if (questionVideoSolutions[questionId]) {
    return questionVideoSolutions[questionId];
  }

  return {
    questionId,
    videoUrl: 'https://www.youtube.com/embed/5_5oE5lgrhw',
    title: `Video Solution & Detailed Breakdown: ${questionTitle.slice(0, 50)}...`,
    duration: '4:30 min',
    instructor: 'Er. Rohit Negi',
    keyTakeaway: `Master the foundational theorem and edge-case invariants applicable to this ${skillName} interview problem.`,
    timeComplexity: 'Optimal Algorithmic Benchmark',
    spaceComplexity: 'Minimal Auxiliary Memory',
    codeWalkthrough: `1. Parse constraints and identify edge cases (null inputs, single elements, boundary values).
2. Eliminate incorrect options by testing boundary invariants.
3. Deduce the logically sound, optimal solution verified by ${skillName} standards.`,
    timestamps: [
      { time: '0:00', label: 'Problem Clarification & Input Boundaries' },
      { time: '1:15', label: 'Logical Invariants & Core Principle' },
      { time: '2:45', label: 'Code Walkthrough & Option Elimination' },
      { time: '3:50', label: 'Time & Space Complexity Summary' },
    ],
  };
};

// Conceptual hints from the trainer available during active quiz
export const questionTrainerHints: Record<string, string> = {
  'aq-cpp-1':
    'Trainer Hint: Focus on the difference between the memory address (p) and the dereferenced value (*p). Does assigning to *p change a?',
  'aq-cpp-2':
    'Trainer Hint: Remember the "= 0" syntax in C++. What does this tell the compiler about whether someone can create an instance of this class?',
  'aq-cpp-3':
    'Trainer Hint: Does std::move physically copy bytes across RAM, or is it simply a cast that converts an lvalue into an rvalue reference to trigger move constructors?',
  'aq-dsa-1':
    'Trainer Hint: If you pick the first element as pivot on an already sorted array [1, 2, 3, 4, 5], how many elements end up on the left side vs the right side?',
  'aq-dsa-2':
    'Trainer Hint: This famous algorithm keeps running track of the current subarray sum and resets whenever it drops below zero. Named after a mathematician starting with K.',
  'aq-dsa-3':
    'Trainer Hint: BFS visits vertices in order of their level/distance from the starting node. Which data structure follows First-In, First-Out (FIFO)?',
  'aq-dsa-4':
    'Trainer Hint: When a vector doubles (size 1 -> 2 -> 4 -> 8 -> 16), how often does the expensive O(N) copy happen? What is the total cost divided by N?',
  'aq-dbms-1':
    'Trainer Hint: You want to eliminate identical tuples in the returned result set. Think of the SQL keyword placed immediately after SELECT.',
  'aq-dbms-2':
    'Trainer Hint: BCNF is stricter than 3NF. In 3NF, the right side can be prime. In BCNF, what must the left side (determinant) strictly be?',
  'aq-dbms-3':
    'Trainer Hint: Repeatable Read locks the records that already exist. But what happens if another transaction inserts a NEW row that fits the search query?',
  'aq-oop-1':
    'Trainer Hint: Think of a capsule (like a medicine capsule) wrapping data and medicine together. Which pillar of OOP does this describe?',
  'aq-oop-2':
    'Trainer Hint: If a Car has an Engine, that is "has-a". In OOP, what do we call assembling objects inside other objects?',
  'aq-prob-1':
    'Trainer Hint: Work through the states: Fill 5L -> Pour into 3L (2L left) -> Empty 3L -> Transfer 2L -> Fill 5L -> Top up 3L. How many liters stay in the 5L jug?',
  'aq-prob-2':
    'Trainer Hint: What is the mathematical sum of the first N natural numbers? If you know the expected total, how can you find the missing one without sorting?',
  'aq-git-1':
    'Trainer Hint: When you run "git add", where do the files go before you actually run "git commit"?',
  'aq-py-1':
    'Trainer Hint: Trace the range(4) which produces [0, 1, 2, 3]. Only keep the numbers where i % 2 == 0, then multiply each kept number by 2.',
  'aq-js-1':
    'Trainer Hint: Synchronous code always runs before any asynchronous queues. Between Promise (.then) and setTimeout, which queue has VIP priority?',
};
