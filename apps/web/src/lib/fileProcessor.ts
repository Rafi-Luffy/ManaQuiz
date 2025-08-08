import { Question } from '../store/examStore'
import { generateId, shuffleArray } from './utils'

// basic language detection
function detectLanguage(text: string): string {
  // chinese chars
  if (/[\u4E00-\u9FFF]/.test(text) && !/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'zh'
  // japanese chars
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja'
  // korean chars
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko'
  // arabic chars
  if (/[\u0600-\u06FF]/.test(text)) return 'ar'
  // hindi chars
  if (/[\u0900-\u097F]/.test(text)) return 'hi'
  // fallback to english
  return 'en'
}

// process files and extract questions
export async function processFiles(files: File[]): Promise<Question[]> {
  const questions: Question[] = []
  
  for (const file of files) {
    try {
      const content = await extractTextFromFile(file)
      const fileQuestions = await extractQuestionsFromContent(content, file.name)
      questions.push(...fileQuestions)
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error)
    }
  }
  
  const uniqueQuestions = removeDuplicateQuestions(questions)
  return shuffleArray(uniqueQuestions)
}

async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        
        if (file.type === 'application/pdf') {
          resolve(simulateAssignmentPDFExtraction(file.name))
        } else if (file.type.includes('word')) {
          resolve(simulateWordExtraction(content))
        } else {
          resolve(content)
        }
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    
    if (file.type === 'application/pdf' || file.type.includes('word')) {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsText(file)
    }
  })
}

function simulateAssignmentPDFExtraction(_filename: string): string {
  const sampleAssignmentContent = `
Assignment Questions:

1. What is the time complexity of binary search?
   a) O(n)
   b) O(log n)
   c) O(n²)
   d) O(1)
   Answer: b

2. Which data structure follows LIFO principle?
   a) Queue
   b) Stack
   c) Array
   d) Tree
   Answer: b

3. In object-oriented programming, what is encapsulation?
   a) Creating objects
   b) Hiding implementation details
   c) Inheriting from classes
   d) Overriding methods
   Answer: b

4. What is the purpose of a constructor in a class?
   a) To destroy objects
   b) To initialize object state
   c) To copy objects
   d) To compare objects
   Answer: b

5. Which sorting algorithm has O(n log n) average case complexity?
   a) Bubble Sort
   b) Selection Sort
   c) Quick Sort
   d) Insertion Sort
   Answer: c

6. バイナリサーチの時間計算量は何ですか？
   a) O(n)
   b) O(log n)
   c) O(n²)
   d) O(1)
   Answer: b
  `
  
  return sampleAssignmentContent
}

function simulateWordExtraction(_content: string): string {
  // word doc simulation
  return `
Sample content from Word document:

Programming concepts in multiple languages:
- English: What is object-oriented programming?
- Japanese: オブジェクト指向プログラミングとは何ですか？
- Spanish: ¿Qué es la programación orientada a objetos?
- French: Qu'est-ce que la programmation orientée objet?

This demonstrates multilingual support for various document types.
  `
}

async function extractQuestionsFromContent(content: string, filename: string): Promise<Question[]> {
  const language = detectLanguage(content)
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500))
  return parseAssignmentQuestions(content, filename, language)
}

function parseAssignmentQuestions(content: string, filename: string, _language: string = 'en'): Question[] {
  const questions: Question[] = []
  
  const questionPattern = /(\d+)\.\s*(.+?)\s*([a-d]\).+?\s*[a-d]\).+?\s*[a-d]\).+?\s*[a-d]\).+?)\s*Answer:\s*([a-d])/gis
  
  let match
  while ((match = questionPattern.exec(content)) !== null) {
    const [, , questionText, optionsText, answerLetter] = match
    
    const optionPattern = /([a-d])\)\s*(.+?)(?=|$)/gi
    const options: string[] = []
    let optionMatch
    
    while ((optionMatch = optionPattern.exec(optionsText)) !== null) {
      options.push(optionMatch[2].trim())
    }
    
    if (options.length === 4) {
      const answerIndex = answerLetter.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)
      const correctAnswer = options[answerIndex]
      
      questions.push({
        id: generateId(),
        question: questionText.trim(),
        options: options,
        correctAnswer: correctAnswer,
        difficulty: determineDifficulty(questionText),
        category: determineCategory(filename, questionText),
        explanation: `The correct answer is ${answerLetter.toUpperCase()}) ${correctAnswer}`
      })
    }
  }
  
  if (questions.length === 0) {
    return generateFallbackQuestions(filename)
  }
  
  return questions
}

function determineDifficulty(questionText: string): 'easy' | 'medium' | 'hard' {
  const lowerQuestion = questionText.toLowerCase();
  
  // Easy indicators - basic recall and definition questions
  const easyIndicators = [
    'what is', 'define', 'list', 'name', 'identify', 'state', 'mention',
    'true or false', 'fill in the blank', 'choose the correct', 'select',
    'which of the following', 'basic', 'simple', 'definition', 'which of'
  ];
  
  // Hard indicators - analysis, synthesis, evaluation
  const hardIndicators = [
    'analyze', 'evaluate', 'compare and contrast', 'justify', 'critique',
    'design', 'create', 'synthesize', 'formulate', 'construct', 'develop',
    'assess', 'argue', 'defend', 'propose', 'solve', 'derive', 'prove',
    'complex', 'advanced', 'sophisticated', 'intricate'
  ];
  
  // Medium indicators - understanding and application
  const mediumIndicators = [
    'explain', 'describe', 'discuss', 'illustrate', 'demonstrate',
    'apply', 'calculate', 'implement', 'use', 'show', 'interpret',
    'summarize', 'classify', 'categorize', 'organize', 'outline',
    'compare', 'contrast'
  ];
  
  // Count occurrences of each difficulty type
  const easyScore = easyIndicators.filter(indicator => lowerQuestion.includes(indicator)).length;
  const mediumScore = mediumIndicators.filter(indicator => lowerQuestion.includes(indicator)).length;
  const hardScore = hardIndicators.filter(indicator => lowerQuestion.includes(indicator)).length;
  
  // Additional complexity indicators
  const hasMultipleSteps = (lowerQuestion.match(/[.!?]/g) || []).length > 2;
  const hasNumbers = /\d+/.test(questionText);
  const isLongQuestion = questionText.length > 200;
  const hasFormulas = /[=+\-*/()^]/.test(questionText);
  
  // Scoring system
  let totalScore = 0;
  
  if (easyScore > 0) totalScore -= easyScore * 2;
  if (mediumScore > 0) totalScore += mediumScore;
  if (hardScore > 0) totalScore += hardScore * 2;
  
  if (hasMultipleSteps) totalScore += 1;
  if (hasNumbers || hasFormulas) totalScore += 1;
  if (isLongQuestion) totalScore += 1;
  
  // Determine difficulty based on score
  if (totalScore <= -2) return 'easy';
  if (totalScore >= 3) return 'hard';
  return 'medium';
}

function determineCategory(filename: string, questionText: string): string {
  const name = filename.toLowerCase()
  const text = questionText.toLowerCase()
  
  // Define subject categories with keywords
  const subjects = {
    'Computer Science': [
      'algorithm', 'data structure', 'programming', 'software', 'computer', 'binary',
      'loop', 'function', 'variable', 'array', 'linked list', 'tree', 'graph'
    ],
    'Mathematics': [
      'equation', 'derivative', 'integral', 'matrix', 'probability', 'statistics',
      'theorem', 'proof', 'calculus', 'algebra', 'geometry', 'trigonometry'
    ],
    'Physics': [
      'force', 'energy', 'motion', 'velocity', 'acceleration', 'momentum',
      'wave', 'particle', 'quantum', 'electromagnetic', 'thermodynamics'
    ],
    'Chemistry': [
      'molecule', 'atom', 'element', 'compound', 'reaction', 'bond',
      'periodic table', 'organic', 'inorganic', 'solution', 'acid', 'base'
    ],
    'Biology': [
      'cell', 'organism', 'dna', 'protein', 'gene', 'evolution',
      'ecosystem', 'photosynthesis', 'metabolism', 'reproduction'
    ],
    'Engineering': [
      'circuit', 'voltage', 'current', 'resistance', 'mechanical', 'electrical',
      'design', 'material', 'stress', 'strain', 'manufacturing'
    ],
    'Business': [
      'management', 'marketing', 'finance', 'accounting', 'economics',
      'strategy', 'organization', 'leadership', 'profit', 'revenue'
    ],
    'Data Science': [
      'machine learning', 'artificial intelligence', 'neural network', 'dataset',
      'regression', 'classification', 'clustering', 'feature', 'model'
    ]
  }
  
  // Check filename and question text for subject keywords
  const combinedText = `${name} ${text}`;
  let bestMatch = 'General';
  let maxScore = 0;
  
  for (const [subject, keywords] of Object.entries(subjects)) {
    const score = keywords.reduce((count, keyword) => {
      return count + (combinedText.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      bestMatch = subject;
    }
  }
  
  // Fallback to specific patterns if no clear match
  if (maxScore === 0) {
    if (name.includes('assignment') || name.includes('homework')) {
      return 'Assignment';
    } else if (name.includes('exam') || name.includes('test')) {
      return 'Exam Preparation';
    } else if (name.includes('lecture') || name.includes('notes')) {
      return 'Lecture Notes';
    }
  }
  
  return bestMatch;
}

function removeDuplicateQuestions(questions: Question[]): Question[] {
  const seen = new Set<string>()
  return questions.filter(q => {
    const key = q.question.toLowerCase().trim()
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function generateFallbackQuestions(filename: string): Question[] {
  const sampleQuestions: Omit<Question, 'id'>[] = [
    {
      question: "What is the primary purpose of object-oriented programming?",
      options: [
        "To write shorter code",
        "To organize code into reusable objects and classes",
        "To make programs run faster",
        "To reduce memory usage"
      ],
      correctAnswer: "To organize code into reusable objects and classes",
      difficulty: "medium",
      category: "Programming Concepts",
      explanation: "Object-oriented programming helps organize code into reusable, maintainable structures using objects and classes."
    },
    {
      question: "Which data structure follows the Last In First Out (LIFO) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: "Stack",
      difficulty: "easy",
      category: "Data Structures",
      explanation: "A stack follows LIFO principle where the last element added is the first one to be removed."
    },
    {
      question: "What is the time complexity of binary search in a sorted array?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)",
      difficulty: "medium",
      category: "Algorithms",
      explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity."
    },
    {
      question: "In database normalization, what does the First Normal Form (1NF) eliminate?",
      options: [
        "Partial dependencies",
        "Transitive dependencies", 
        "Repeating groups and ensures atomic values",
        "All redundancy"
      ],
      correctAnswer: "Repeating groups and ensures atomic values",
      difficulty: "hard",
      category: "Database Management",
      explanation: "1NF ensures that each column contains atomic values and eliminates repeating groups."
    },
    {
      question: "What is the main advantage of using recursion?",
      options: [
        "It uses less memory",
        "It's faster than iteration",
        "It provides elegant solutions for problems with recursive structure",
        "It's easier to debug"
      ],
      correctAnswer: "It provides elegant solutions for problems with recursive structure",
      difficulty: "medium",
      category: "Programming Concepts",
      explanation: "Recursion is particularly useful for problems that have a recursive structure, making the solution more intuitive and elegant."
    },
    {
      question: "What is the difference between TCP and UDP?",
      options: [
        "TCP is faster, UDP is slower",
        "TCP is reliable, UDP is unreliable but faster",
        "UDP is reliable, TCP is unreliable", 
        "No difference"
      ],
      correctAnswer: "TCP is reliable, UDP is unreliable but faster",
      difficulty: "medium",
      category: "Computer Networks",
      explanation: "TCP provides reliable, ordered delivery with error checking, while UDP is connectionless and faster but unreliable."
    },
    {
      question: "What is a closure in programming?",
      options: [
        "A way to close programs",
        "A function that has access to variables from its outer scope",
        "A type of loop",
        "A database operation"
      ],
      correctAnswer: "A function that has access to variables from its outer scope",
      difficulty: "hard",
      category: "Programming Concepts",
      explanation: "A closure is a function that retains access to variables from its lexical scope even when executed outside that scope."
    },
    {
      question: "What is the purpose of a hash function?",
      options: [
        "To encrypt data",
        "To map data to fixed-size values",
        "To sort data",
        "To compress files"
      ],
      correctAnswer: "To map data to fixed-size values",
      difficulty: "medium",
      category: "Data Structures",
      explanation: "Hash functions map input data to fixed-size values, commonly used in hash tables for fast lookups."
    }
  ]
  
  const selectedQuestions = shuffleArray(sampleQuestions).slice(0, Math.min(sampleQuestions.length, 10))
  
  return selectedQuestions.map(q => ({
    ...q,
    id: generateId(),
    category: filename.includes('python') ? 'Python Programming' : 
              filename.includes('java') ? 'Java Programming' :
              filename.includes('data') ? 'Data Structures' :
              filename.includes('algorithm') ? 'Algorithms' :
              filename.includes('network') ? 'Computer Networks' :
              filename.includes('database') ? 'Database Management' :
              q.category
  }))
}

// sample questions for when no files uploaded
export function getSampleQuestions(): Question[] {
  const questions: Omit<Question, 'id'>[] = [
    // basics
    {
      question: "What is the output of the following Python code? `print(2 ** 3)`",
      options: ["6", "8", "9", "12"],
      correctAnswer: "8",
      difficulty: "easy",
      category: "Python Programming",
      explanation: "The ** operator is used for exponentiation in Python. 2 ** 3 means 2 raised to the power of 3, which equals 8."
    },
    {
      question: "Which of the following is NOT a core data type in Python?",
      options: ["List", "Dictionary", "Tuple", "Class"],
      correctAnswer: "Class",
      difficulty: "easy",
      category: "Python Programming",
      explanation: "Class is not a core data type in Python. It's a construct used to define custom data types."
    },
    {
      question: "What keyword is used to define a function in Python?",
      options: ["def", "function", "fun", "define"],
      correctAnswer: "def",
      difficulty: "easy",
      category: "Python Programming",
      explanation: "The 'def' keyword is used to define functions in Python."
    },
    {
      question: "How do you start a single-line comment in Python?",
      options: ["//", "/*", "#", "<!--"],
      correctAnswer: "#",
      difficulty: "easy",
      category: "Python Programming",
      explanation: "Single-line comments in Python start with the # symbol."
    },
    {
      question: "What is the result of `len([1, 2, 3, 4])`?",
      options: ["3", "4", "5", "Error"],
      correctAnswer: "4",
      difficulty: "easy",
      category: "Python Programming",
      explanation: "The len() function returns the number of items in a sequence. The list [1, 2, 3, 4] has 4 elements."
    },
    {
      question: "Which method is used to add an element to the end of a list in Python?",
      options: ["add()", "append()", "insert()", "push()"],
      correctAnswer: "append()",
      difficulty: "easy",
      category: "Python Programming",
      explanation: "The append() method adds an element to the end of a list."
    },
    {
      question: "What does the 'break' statement do in a loop?",
      options: ["Skips current iteration", "Exits the loop", "Restarts the loop", "Does nothing"],
      correctAnswer: "Exits the loop",
      difficulty: "easy",
      category: "Programming Concepts",
      explanation: "The 'break' statement immediately exits the current loop."
    },
    {
      question: "Which operator is used for string concatenation in Python?",
      options: ["+", "&", ".", "||"],
      correctAnswer: "+",
      difficulty: "easy",
      category: "Python Programming",
      explanation: "The + operator is used for string concatenation in Python."
    },
    {
      question: "What is the correct way to declare a variable in Java?",
      options: ["var x = 5;", "int x = 5;", "x = 5;", "declare int x = 5;"],
      correctAnswer: "int x = 5;",
      difficulty: "easy",
      category: "Java Programming",
      explanation: "In Java, you must specify the data type when declaring a variable."
    },
    {
      question: "Which access modifier makes a method accessible only within the same class?",
      options: ["public", "private", "protected", "default"],
      correctAnswer: "private",
      difficulty: "easy",
      category: "Java Programming",
      explanation: "The private access modifier restricts access to within the same class only."
    },

    // data structures
    {
      question: "Which data structure follows the Last In First Out (LIFO) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: "Stack",
      difficulty: "easy",
      category: "Data Structures",
      explanation: "A stack follows LIFO principle where the last element added is the first one to be removed."
    },
    {
      question: "Which data structure follows the First In First Out (FIFO) principle?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correctAnswer: "Queue",
      difficulty: "easy",
      category: "Data Structures",
      explanation: "A queue follows FIFO principle where the first element added is the first one to be removed."
    },
    {
      question: "What is the time complexity of accessing an element in an array by index?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: "O(1)",
      difficulty: "easy",
      category: "Data Structures",
      explanation: "Array elements can be accessed directly by index in constant time."
    },
    {
      question: "Which traversal method visits the root node first in a binary tree?",
      options: ["Inorder", "Preorder", "Postorder", "Level order"],
      correctAnswer: "Preorder",
      difficulty: "medium",
      category: "Data Structures",
      explanation: "Preorder traversal visits root node first, then left and right subtrees."
    },
    {
      question: "What is a hash table used for?",
      options: ["Sorting data", "Fast key-value lookups", "Tree traversal", "Graph algorithms"],
      correctAnswer: "Fast key-value lookups",
      difficulty: "easy",
      category: "Data Structures",
      explanation: "Hash tables provide fast O(1) average-case lookups for key-value pairs."
    },
    {
      question: "In a linked list, what does each node contain?",
      options: ["Only data", "Only pointer", "Data and pointer", "Index and data"],
      correctAnswer: "Data and pointer",
      difficulty: "easy",
      category: "Data Structures",
      explanation: "Each node in a linked list contains data and a pointer to the next node."
    },
    {
      question: "What is the maximum number of children a node can have in a binary tree?",
      options: ["1", "2", "3", "Unlimited"],
      correctAnswer: "2",
      difficulty: "easy",
      category: "Data Structures",
      explanation: "In a binary tree, each node can have at most 2 children (left and right)."
    },
    {
      question: "Which data structure is used in Breadth-First Search (BFS)?",
      options: ["Stack", "Queue", "Priority Queue", "Deque"],
      correctAnswer: "Queue",
      difficulty: "medium",
      category: "Data Structures",
      explanation: "BFS uses a queue to store vertices in the order they should be visited."
    },
    {
      question: "What is the space complexity of merge sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: "O(n)",
      difficulty: "hard",
      category: "Algorithms",
      explanation: "Merge sort requires O(n) additional space for the temporary arrays used in merging."
    },
    {
      question: "Which data structure would be most efficient for implementing undo functionality?",
      options: ["Array", "Queue", "Stack", "Hash Table"],
      correctAnswer: "Stack",
      difficulty: "medium",
      category: "Data Structures",
      explanation: "Stack's LIFO property makes it perfect for undo operations - last action is undone first."
    },

    // algorithms
    {
      question: "What is the time complexity of binary search in a sorted array?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)",
      difficulty: "medium",
      category: "Algorithms",
      explanation: "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity."
    },
    {
      question: "Which sorting algorithm has O(n log n) average case complexity?",
      options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
      correctAnswer: "Quick Sort",
      difficulty: "medium",
      category: "Algorithms",
      explanation: "Quick Sort has O(n log n) average case time complexity, though worst case is O(n²)."
    },
    {
      question: "What is the worst-case time complexity of quicksort?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
      correctAnswer: "O(n²)",
      difficulty: "hard",
      category: "Algorithms",
      explanation: "Quicksort's worst-case occurs when the pivot is always the smallest or largest element."
    },
    {
      question: "Which algorithm is best for finding the shortest path in a weighted graph?",
      options: ["DFS", "BFS", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
      correctAnswer: "Dijkstra's Algorithm",
      difficulty: "medium",
      category: "Algorithms",
      explanation: "Dijkstra's algorithm finds shortest paths from a source vertex to all other vertices in a weighted graph."
    },
    {
      question: "What is the stable sorting algorithm among the following?",
      options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
      correctAnswer: "Merge Sort",
      difficulty: "medium",
      category: "Algorithms",
      explanation: "Merge Sort is stable - it maintains the relative order of equal elements."
    },
    {
      question: "Which algorithm is used to detect cycles in a graph?",
      options: ["Dijkstra", "Floyd-Warshall", "DFS", "Prim's"],
      correctAnswer: "DFS",
      difficulty: "medium",
      category: "Algorithms",
      explanation: "DFS can detect cycles by checking for back edges during traversal."
    },
    {
      question: "What is the time complexity of the Sieve of Eratosthenes?",
      options: ["O(n)", "O(n log n)", "O(n log log n)", "O(n²)"],
      correctAnswer: "O(n log log n)",
      difficulty: "hard",
      category: "Algorithms",
      explanation: "The Sieve of Eratosthenes has time complexity O(n log log n) for finding all primes up to n."
    },
    {
      question: "Which technique is used in quicksort to improve performance?",
      options: ["Divide and conquer", "Dynamic programming", "Greedy approach", "Backtracking"],
      correctAnswer: "Divide and conquer",
      difficulty: "medium",
      category: "Algorithms",
      explanation: "Quicksort uses divide and conquer by partitioning the array around a pivot."
    },

    // oop
    {
      question: "What is encapsulation in object-oriented programming?",
      options: ["Creating objects", "Hiding implementation details", "Inheriting from classes", "Method overriding"],
      correctAnswer: "Hiding implementation details",
      difficulty: "medium",
      category: "Object-Oriented Programming",
      explanation: "Encapsulation is the principle of hiding internal implementation details and exposing only necessary interfaces."
    },
    {
      question: "What is inheritance in OOP?",
      options: ["Creating new objects", "Acquiring properties from parent class", "Hiding implementation", "Method overloading"],
      correctAnswer: "Acquiring properties from parent class",
      difficulty: "easy",
      category: "Object-Oriented Programming",
      explanation: "Inheritance allows a class to acquire properties and methods from its parent class."
    },
    {
      question: "What is polymorphism in OOP?",
      options: ["Having multiple forms", "Creating objects", "Hiding data", "Inheriting properties"],
      correctAnswer: "Having multiple forms",
      difficulty: "medium",
      category: "Object-Oriented Programming",
      explanation: "Polymorphism allows objects of different types to be treated as instances of the same type."
    },
    {
      question: "What is method overriding?",
      options: ["Creating new methods", "Redefining parent class method", "Calling multiple methods", "Deleting methods"],
      correctAnswer: "Redefining parent class method",
      difficulty: "medium",
      category: "Object-Oriented Programming",
      explanation: "Method overriding involves providing a new implementation for a method inherited from the parent class."
    },
    {
      question: "What is abstraction in OOP?",
      options: ["Showing all details", "Hiding unnecessary details", "Creating objects", "Defining methods"],
      correctAnswer: "Hiding unnecessary details",
      difficulty: "medium",
      category: "Object-Oriented Programming",
      explanation: "Abstraction hides complex implementation details and shows only essential features."
    },
    {
      question: "What is the difference between method overloading and overriding?",
      options: ["No difference", "Overloading = same name, different parameters; Overriding = redefining inherited method", "Overriding = same name, different parameters; Overloading = redefining inherited method", "Both are the same thing"],
      correctAnswer: "Overloading = same name, different parameters; Overriding = redefining inherited method",
      difficulty: "hard",
      category: "Object-Oriented Programming",
      explanation: "Method overloading allows multiple methods with same name but different parameters, while overriding redefines inherited methods."
    },

    // databases
    {
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
      correctAnswer: "Structured Query Language",
      difficulty: "easy",
      category: "Database Management",
      explanation: "SQL stands for Structured Query Language, used for managing relational databases."
    },
    {
      question: "Which of the following is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
      correctAnswer: "MongoDB",
      difficulty: "easy",
      category: "Database Management",
      explanation: "MongoDB is a popular NoSQL document database that stores data in flexible JSON-like documents."
    },
    {
      question: "What is the purpose of an index in a database?",
      options: ["To store data", "To speed up queries", "To backup data", "To compress data"],
      correctAnswer: "To speed up queries",
      difficulty: "medium",
      category: "Database Management",
      explanation: "Indexes are used to speed up query performance by creating fast access paths to data."
    },
    {
      question: "What is a primary key in a database?",
      options: ["A key that can have duplicates", "A unique identifier for each record", "A foreign key reference", "An optional field"],
      correctAnswer: "A unique identifier for each record",
      difficulty: "easy",
      category: "Database Management",
      explanation: "A primary key uniquely identifies each record in a table and cannot be null or duplicate."
    },
    {
      question: "What is normalization in databases?",
      options: ["Copying data", "Organizing data to reduce redundancy", "Deleting data", "Encrypting data"],
      correctAnswer: "Organizing data to reduce redundancy",
      difficulty: "medium",
      category: "Database Management",
      explanation: "Normalization organizes database tables to minimize redundancy and dependency."
    },
    {
      question: "What does ACID stand for in database transactions?",
      options: ["Atomicity, Consistency, Isolation, Durability", "Accurate, Complete, Integrated, Detailed", "Atomic, Continuous, Individual, Durable", "Access, Control, Input, Data"],
      correctAnswer: "Atomicity, Consistency, Isolation, Durability",
      difficulty: "hard",
      category: "Database Management",
      explanation: "ACID properties ensure reliable database transactions: Atomicity, Consistency, Isolation, and Durability."
    },
    {
      question: "Which SQL command is used to retrieve data from a database?",
      options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
      correctAnswer: "SELECT",
      difficulty: "easy",
      category: "Database Management",
      explanation: "SELECT is the SQL command used to query and retrieve data from database tables."
    },
    {
      question: "What is a foreign key?",
      options: ["A primary key in another table", "A reference to primary key in another table", "A duplicate key", "An encrypted key"],
      correctAnswer: "A reference to primary key in another table",
      difficulty: "medium",
      category: "Database Management",
      explanation: "A foreign key creates a link between two tables by referencing the primary key of another table."
    },

    // networks
    {
      question: "Which protocol is used for web communication?",
      options: ["FTP", "SMTP", "HTTP", "SSH"],
      correctAnswer: "HTTP",
      difficulty: "easy",
      category: "Computer Networks",
      explanation: "HTTP (HyperText Transfer Protocol) is the foundation protocol used for web communication."
    },
    {
      question: "What is the default port for HTTPS?",
      options: ["80", "443", "21", "22"],
      correctAnswer: "443",
      difficulty: "medium",
      category: "Computer Networks",
      explanation: "HTTPS (HTTP Secure) uses port 443 by default for encrypted web communication."
    },
    {
      question: "Which layer of the OSI model handles routing?",
      options: ["Physical", "Data Link", "Network", "Transport"],
      correctAnswer: "Network",
      difficulty: "medium",
      category: "Computer Networks",
      explanation: "The Network layer (Layer 3) of the OSI model is responsible for routing packets between networks."
    },
    {
      question: "What is the purpose of DNS?",
      options: ["Encrypt data", "Translate domain names to IP addresses", "Route packets", "Compress files"],
      correctAnswer: "Translate domain names to IP addresses",
      difficulty: "easy",
      category: "Computer Networks",
      explanation: "DNS (Domain Name System) translates human-readable domain names to machine-readable IP addresses."
    },
    {
      question: "What does TCP provide that UDP doesn't?",
      options: ["Speed", "Reliability", "Simplicity", "Broadcasting"],
      correctAnswer: "Reliability",
      difficulty: "medium",
      category: "Computer Networks",
      explanation: "TCP provides reliable, ordered delivery of data with error checking, while UDP is unreliable but faster."
    },
    {
      question: "Which protocol is used for sending emails?",
      options: ["HTTP", "FTP", "SMTP", "DNS"],
      correctAnswer: "SMTP",
      difficulty: "easy",
      category: "Computer Networks",
      explanation: "SMTP (Simple Mail Transfer Protocol) is used for sending emails between mail servers."
    },
    {
      question: "What is the maximum size of an IPv4 address?",
      options: ["16 bits", "32 bits", "64 bits", "128 bits"],
      correctAnswer: "32 bits",
      difficulty: "medium",
      category: "Computer Networks",
      explanation: "IPv4 addresses are 32 bits long, typically written as four 8-bit octets (e.g., 192.168.1.1)."
    },
    {
      question: "What is a subnet mask used for?",
      options: ["Encrypting data", "Determining network and host portions of IP", "Routing packets", "DNS resolution"],
      correctAnswer: "Determining network and host portions of IP",
      difficulty: "medium",
      category: "Computer Networks",
      explanation: "A subnet mask determines which bits of an IP address represent the network and which represent the host."
    },

    // web dev
    {
      question: "Which HTML tag is used for creating hyperlinks?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correctAnswer: "<a>",
      difficulty: "easy",
      category: "Web Development",
      explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML."
    },
    {
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      correctAnswer: "Cascading Style Sheets",
      difficulty: "easy",
      category: "Web Development",
      explanation: "CSS stands for Cascading Style Sheets, used for styling HTML documents."
    },
    {
      question: "Which JavaScript method is used to add an element to an array?",
      options: ["add()", "push()", "insert()", "append()"],
      correctAnswer: "push()",
      difficulty: "easy",
      category: "Web Development",
      explanation: "The push() method adds one or more elements to the end of an array."
    },
    {
      question: "What is the difference between '==' and '===' in JavaScript?",
      options: ["No difference", "'==' checks type, '===' doesn't", "'===' checks type and value, '==' only checks value", "Both are the same"],
      correctAnswer: "'===' checks type and value, '==' only checks value",
      difficulty: "medium",
      category: "Web Development",
      explanation: "'===' performs strict comparison checking both type and value, while '==' performs type coercion."
    },
    {
      question: "Which HTTP method is used to retrieve data from a server?",
      options: ["POST", "GET", "PUT", "DELETE"],
      correctAnswer: "GET",
      difficulty: "easy",
      category: "Web Development",
      explanation: "GET is the HTTP method used to retrieve data from a server."
    },
    {
      question: "What is the DOM in web development?",
      options: ["Data Object Model", "Document Object Model", "Dynamic Object Model", "Display Object Model"],
      correctAnswer: "Document Object Model",
      difficulty: "easy",
      category: "Web Development",
      explanation: "DOM (Document Object Model) represents the HTML document as a tree structure that can be manipulated with JavaScript."
    },
    {
      question: "Which CSS property is used to change the text color?",
      options: ["background-color", "color", "text-color", "font-color"],
      correctAnswer: "color",
      difficulty: "easy",
      category: "Web Development",
      explanation: "The 'color' property in CSS is used to set the text color of an element."
    },
    {
      question: "What is a Promise in JavaScript?",
      options: ["A function", "An object representing eventual completion of an async operation", "A variable", "A loop"],
      correctAnswer: "An object representing eventual completion of an async operation",
      difficulty: "medium",
      category: "Web Development",
      explanation: "A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation."
    },

    // ml & ai
    {
      question: "Which of the following is a supervised learning algorithm?",
      options: ["K-means", "Linear Regression", "DBSCAN", "PCA"],
      correctAnswer: "Linear Regression",
      difficulty: "easy",
      category: "Machine Learning",
      explanation: "Linear Regression is a supervised learning algorithm that uses labeled data to learn relationships."
    },
    {
      question: "What is overfitting in machine learning?",
      options: ["Model performs well on all data", "Model memorizes training data but fails on new data", "Model is too simple", "Model has no bias"],
      correctAnswer: "Model memorizes training data but fails on new data",
      difficulty: "medium",
      category: "Machine Learning",
      explanation: "Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize."
    },
    {
      question: "Which type of learning uses labeled training data?",
      options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Semi-supervised Learning"],
      correctAnswer: "Supervised Learning",
      difficulty: "easy",
      category: "Machine Learning",
      explanation: "Supervised learning uses labeled training data where the correct output is known for each input."
    },
    {
      question: "What is the purpose of cross-validation?",
      options: ["To speed up training", "To evaluate model performance on unseen data", "To reduce data size", "To clean data"],
      correctAnswer: "To evaluate model performance on unseen data",
      difficulty: "medium",
      category: "Machine Learning",
      explanation: "Cross-validation helps evaluate how well a model will generalize to unseen data."
    },
    {
      question: "Which algorithm is commonly used for classification tasks?",
      options: ["Linear Regression", "K-means", "Decision Tree", "PCA"],
      correctAnswer: "Decision Tree",
      difficulty: "easy",
      category: "Machine Learning",
      explanation: "Decision Trees are commonly used for both classification and regression tasks."
    },
    {
      question: "What is gradient descent?",
      options: ["A classification algorithm", "An optimization algorithm to minimize cost function", "A data preprocessing technique", "A validation method"],
      correctAnswer: "An optimization algorithm to minimize cost function",
      difficulty: "medium",
      category: "Machine Learning",
      explanation: "Gradient descent is an optimization algorithm used to minimize the cost function by iteratively adjusting parameters."
    },
    {
      question: "What is the bias-variance tradeoff?",
      options: ["Choosing between accuracy and speed", "Balancing model complexity vs generalization", "Selecting features vs samples", "Training vs testing time"],
      correctAnswer: "Balancing model complexity vs generalization",
      difficulty: "hard",
      category: "Machine Learning",
      explanation: "Bias-variance tradeoff involves finding the right balance between underfitting (high bias) and overfitting (high variance)."
    },

    // os
    {
      question: "Which process is responsible for memory management in an operating system?",
      options: ["Compiler", "Operating System Kernel", "CPU", "Hard Disk"],
      correctAnswer: "Operating System Kernel",
      difficulty: "easy",
      category: "Operating Systems",
      explanation: "The OS kernel manages memory allocation, deallocation, and virtual memory."
    },
    {
      question: "What is a deadlock in operating systems?",
      options: ["Process completion", "Resource sharing", "Circular wait for resources", "Memory overflow"],
      correctAnswer: "Circular wait for resources",
      difficulty: "medium",
      category: "Operating Systems",
      explanation: "Deadlock occurs when processes wait for each other's resources in a circular manner, preventing progress."
    },
    {
      question: "Which scheduling algorithm gives equal time slices to all processes?",
      options: ["FCFS", "SJF", "Round Robin", "Priority"],
      correctAnswer: "Round Robin",
      difficulty: "medium",
      category: "Operating Systems",
      explanation: "Round Robin scheduling algorithm assigns equal CPU time slices to all processes in a circular manner."
    },
    {
      question: "What is virtual memory?",
      options: ["RAM only", "Hard disk space used as extended RAM", "Cache memory", "ROM memory"],
      correctAnswer: "Hard disk space used as extended RAM",
      difficulty: "medium",
      category: "Operating Systems",
      explanation: "Virtual memory uses hard disk space to extend the available RAM, allowing larger programs to run."
    },
    {
      question: "What is the purpose of system calls?",
      options: ["To call functions", "To interface between user programs and OS", "To allocate memory", "To schedule processes"],
      correctAnswer: "To interface between user programs and OS",
      difficulty: "medium",
      category: "Operating Systems",
      explanation: "System calls provide an interface for user programs to request services from the operating system kernel."
    },
    {
      question: "What is thrashing in operating systems?",
      options: ["CPU overheating", "Excessive paging activity", "Process scheduling", "Memory allocation"],
      correctAnswer: "Excessive paging activity",
      difficulty: "hard",
      category: "Operating Systems",
      explanation: "Thrashing occurs when the system spends more time paging than executing processes due to insufficient physical memory."
    },

    // hardware
    {
      question: "Which logic gate produces output 1 only when all inputs are 1?",
      options: ["OR Gate", "AND Gate", "NOT Gate", "XOR Gate"],
      correctAnswer: "AND Gate",
      difficulty: "easy",
      category: "Digital Electronics",
      explanation: "AND gate outputs 1 only when all input values are 1, otherwise it outputs 0."
    },
    {
      question: "What is the binary representation of decimal 10?",
      options: ["1010", "1100", "1001", "1111"],
      correctAnswer: "1010",
      difficulty: "easy",
      category: "Digital Electronics",
      explanation: "Decimal 10 in binary is 1010 (1×8 + 0×4 + 1×2 + 0×1 = 10)."
    },
    {
      question: "How many bits are in a byte?",
      options: ["4", "8", "16", "32"],
      correctAnswer: "8",
      difficulty: "easy",
      category: "Digital Electronics",
      explanation: "A byte consists of 8 bits, which can represent values from 0 to 255."
    },
    {
      question: "What is the two's complement of binary 1010?",
      options: ["0101", "0110", "1100", "1111"],
      correctAnswer: "0110",
      difficulty: "medium",
      category: "Digital Electronics",
      explanation: "Two's complement of 1010: first invert to get 0101, then add 1 to get 0110."
    },
    {
      question: "Which memory type is volatile?",
      options: ["ROM", "EPROM", "RAM", "Flash Memory"],
      correctAnswer: "RAM",
      difficulty: "easy",
      category: "Computer Architecture",
      explanation: "RAM (Random Access Memory) is volatile - it loses data when power is turned off."
    },
    {
      question: "What is the purpose of cache memory?",
      options: ["Permanent storage", "Speed up CPU access to frequently used data", "Graphics processing", "Network communication"],
      correctAnswer: "Speed up CPU access to frequently used data",
      difficulty: "medium",
      category: "Computer Architecture",
      explanation: "Cache memory stores frequently accessed data closer to the CPU to reduce access time."
    },

    // math
    {
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2"],
      correctAnswer: "2x",
      difficulty: "easy",
      category: "Mathematics",
      explanation: "Using the power rule: d/dx(x²) = 2x^(2-1) = 2x."
    },
    {
      question: "What is the integral of 2x dx?",
      options: ["x²", "x² + C", "2", "2x² + C"],
      correctAnswer: "x² + C",
      difficulty: "medium",
      category: "Mathematics",
      explanation: "The integral of 2x is x² + C, where C is the constant of integration."
    },
    {
      question: "What is the value of sin(90°)?",
      options: ["0", "1", "-1", "undefined"],
      correctAnswer: "1",
      difficulty: "easy",
      category: "Mathematics",
      explanation: "sin(90°) = 1, which corresponds to the peak of the sine wave."
    },
    {
      question: "What is the determinant of a 2×2 identity matrix?",
      options: ["0", "1", "2", "4"],
      correctAnswer: "1",
      difficulty: "medium",
      category: "Mathematics",
      explanation: "The determinant of any identity matrix is always 1."
    },
    {
      question: "What is the probability of getting heads in a fair coin toss?",
      options: ["0.25", "0.5", "0.75", "1.0"],
      correctAnswer: "0.5",
      difficulty: "easy",
      category: "Statistics",
      explanation: "A fair coin has equal probability (0.5 or 50%) for heads and tails."
    },
    {
      question: "What does a p-value of 0.05 typically indicate in hypothesis testing?",
      options: ["95% confidence", "5% significance level", "Strong evidence", "All of the above"],
      correctAnswer: "All of the above",
      difficulty: "medium",
      category: "Statistics",
      explanation: "A p-value of 0.05 represents a 5% significance level, equivalent to 95% confidence, indicating strong statistical evidence."
    },

    // software eng
    {
      question: "What is the main purpose of version control systems like Git?",
      options: ["Code compilation", "Track changes and collaborate on code", "Run programs", "Debug code"],
      correctAnswer: "Track changes and collaborate on code",
      difficulty: "easy",
      category: "Software Engineering",
      explanation: "Version control systems track code changes over time and enable team collaboration."
    },
    {
      question: "What is Agile methodology?",
      options: ["A programming language", "An iterative software development approach", "A testing framework", "A database system"],
      correctAnswer: "An iterative software development approach",
      difficulty: "easy",
      category: "Software Engineering",
      explanation: "Agile is an iterative approach to software development that emphasizes collaboration and adaptive planning."
    },
    {
      question: "What is the purpose of unit testing?",
      options: ["Test entire application", "Test individual components", "Test user interface", "Test database"],
      correctAnswer: "Test individual components",
      difficulty: "easy",
      category: "Software Engineering",
      explanation: "Unit testing focuses on testing individual components or functions in isolation."
    },
    {
      question: "What is technical debt?",
      options: ["Money owed to developers", "Code that needs refactoring due to shortcuts", "Hardware costs", "Software licenses"],
      correctAnswer: "Code that needs refactoring due to shortcuts",
      difficulty: "medium",
      category: "Software Engineering",
      explanation: "Technical debt refers to the cost of additional rework caused by choosing quick solutions over better approaches."
    },

    // security
    {
      question: "What is the purpose of encryption?",
      options: ["Compress data", "Protect data confidentiality", "Speed up transmission", "Organize files"],
      correctAnswer: "Protect data confidentiality",
      difficulty: "easy",
      category: "Cybersecurity",
      explanation: "Encryption converts data into a coded format to protect confidentiality and prevent unauthorized access."
    },
    {
      question: "What is a firewall?",
      options: ["Antivirus software", "Network security device that filters traffic", "Backup system", "Encryption tool"],
      correctAnswer: "Network security device that filters traffic",
      difficulty: "easy",
      category: "Cybersecurity",
      explanation: "A firewall is a network security device that monitors and filters incoming and outgoing traffic."
    },
    {
      question: "What is social engineering in cybersecurity?",
      options: ["Building social networks", "Manipulating people to reveal information", "Creating user interfaces", "Designing databases"],
      correctAnswer: "Manipulating people to reveal information",
      difficulty: "medium",
      category: "Cybersecurity",
      explanation: "Social engineering involves manipulating people to divulge confidential information or perform actions that compromise security."
    },
    {
      question: "What is two-factor authentication (2FA)?",
      options: ["Using two passwords", "Authentication using two different factors", "Logging in twice", "Two-step password reset"],
      correctAnswer: "Authentication using two different factors",
      difficulty: "medium",
      category: "Cybersecurity",
      explanation: "2FA requires two different authentication factors (something you know, have, or are) for enhanced security."
    },

    // cloud
    {
      question: "What is cloud computing?",
      options: ["Weather prediction", "On-demand computing services over internet", "Local network computing", "Desktop applications"],
      correctAnswer: "On-demand computing services over internet",
      difficulty: "easy",
      category: "Cloud Computing",
      explanation: "Cloud computing provides on-demand access to computing resources like servers, storage, and applications over the internet."
    },
    {
      question: "What does SaaS stand for?",
      options: ["Software as a Service", "System as a Service", "Storage as a Service", "Security as a Service"],
      correctAnswer: "Software as a Service",
      difficulty: "easy",
      category: "Cloud Computing",
      explanation: "SaaS (Software as a Service) delivers software applications over the internet on a subscription basis."
    },
    {
      question: "Which is an example of Infrastructure as a Service (IaaS)?",
      options: ["Gmail", "Netflix", "Amazon EC2", "Spotify"],
      correctAnswer: "Amazon EC2",
      difficulty: "medium",
      category: "Cloud Computing",
      explanation: "Amazon EC2 provides virtual computing resources, which is a classic example of IaaS."
    },
    {
      question: "What is the main benefit of cloud scalability?",
      options: ["Reduced costs", "Automatic resource adjustment based on demand", "Better security", "Faster internet"],
      correctAnswer: "Automatic resource adjustment based on demand",
      difficulty: "medium",
      category: "Cloud Computing",
      explanation: "Cloud scalability allows automatic adjustment of computing resources based on current demand."
    },

    // international
    {
      question: "バイナリサーチの時間計算量は何ですか？",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)",
      difficulty: "medium",
      category: "アルゴリズム",
      explanation: "バイナリサーチは各比較で検索空間を半分に分割するため、時間計算量はO(log n)です。"
    },
    {
      question: "¿Cuál es la complejidad temporal de la búsqueda binaria?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)",
      difficulty: "medium", 
      category: "Algoritmos",
      explanation: "La búsqueda binaria divide el espacio de búsqueda por la mitad en cada comparación, resultando en complejidad O(log n)."
    },
    {
      question: "Quelle est la complexité temporelle de la recherche binaire?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)",
      difficulty: "medium",
      category: "Algorithmes",
      explanation: "La recherche binaire divise l'espace de recherche par deux à chaque comparaison."
    },
    {
      question: "Was ist die Zeitkomplexität der binären Suche?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)",
      difficulty: "medium",
      category: "Algorithmen",
      explanation: "Die binäre Suche halbiert den Suchraum bei jeder Iteration."
    },
    {
      question: "Qual è la complessità temporale della ricerca binaria?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: "O(log n)",
      difficulty: "medium",
      category: "Algoritmi",
      explanation: "La ricerca binaria divide lo spazio di ricerca a metà ad ogni confronto."
    },

    // extra cs questions
    {
      question: "What is Big Data characterized by?",
      options: ["Volume, Velocity, Variety", "Speed, Size, Structure", "Data, Information, Knowledge", "Input, Process, Output"],
      correctAnswer: "Volume, Velocity, Variety",
      difficulty: "medium",
      category: "Big Data",
      explanation: "Big Data is commonly characterized by the 3 Vs: Volume (amount), Velocity (speed), and Variety (types)."
    },
    {
      question: "What is blockchain technology primarily used for?",
      options: ["Data compression", "Distributed ledger systems", "Image processing", "Network routing"],
      correctAnswer: "Distributed ledger systems",
      difficulty: "medium",
      category: "Blockchain",
      explanation: "Blockchain is a distributed ledger technology that maintains a continuously growing list of records."
    },
    {
      question: "In microservices architecture, what is the main benefit?",
      options: ["Single codebase", "Independent deployment and scaling", "Shared database", "Centralized logging"],
      correctAnswer: "Independent deployment and scaling",
      difficulty: "medium",
      category: "Software Architecture",
      explanation: "Microservices allow each service to be developed, deployed, and scaled independently."
    },
    {
      question: "What is the primary purpose of containerization?",
      options: ["Data backup", "Application isolation and portability", "Network security", "Code compilation"],
      correctAnswer: "Application isolation and portability",
      difficulty: "medium",
      category: "DevOps",
      explanation: "Containerization packages applications with their dependencies for consistent deployment across environments."
    },
    {
      question: "What is the difference between authentication and authorization?",
      options: ["No difference", "Authentication verifies identity, Authorization determines permissions", "Authorization verifies identity, Authentication determines permissions", "Both verify identity"],
      correctAnswer: "Authentication verifies identity, Authorization determines permissions",
      difficulty: "medium",
      category: "Cybersecurity",
      explanation: "Authentication confirms who you are, while authorization determines what you're allowed to do."
    },
    {
      question: "What is the time complexity of inserting an element in a heap?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
      correctAnswer: "O(log n)",
      difficulty: "medium",
      category: "Data Structures",
      explanation: "Inserting into a heap requires bubbling up the element, which takes O(log n) time."
    },
    {
      question: "What is the main advantage of NoSQL databases over SQL databases?",
      options: ["Better ACID compliance", "Horizontal scalability", "Stronger consistency", "Complex queries"],
      correctAnswer: "Horizontal scalability",
      difficulty: "medium",
      category: "Database Management",
      explanation: "NoSQL databases are designed for horizontal scaling across multiple servers."
    },
    {
      question: "What is the purpose of load balancing?",
      options: ["Data encryption", "Distribute incoming requests across multiple servers", "Compress network traffic", "Backup data"],
      correctAnswer: "Distribute incoming requests across multiple servers",
      difficulty: "easy",
      category: "System Design",
      explanation: "Load balancing distributes incoming network traffic across multiple servers to ensure reliability and performance."
    },
    {
      question: "What is the CAP theorem in distributed systems?",
      options: ["Consistency, Availability, Partition tolerance", "Capacity, Access, Performance", "Cache, API, Protocol", "Create, Access, Process"],
      correctAnswer: "Consistency, Availability, Partition tolerance",
      difficulty: "hard",
      category: "Distributed Systems",
      explanation: "CAP theorem states that distributed systems can only guarantee two of: Consistency, Availability, and Partition tolerance."
    },
    {
      question: "What is the purpose of an API Gateway?",
      options: ["Data storage", "Single entry point for API requests", "Code compilation", "User authentication only"],
      correctAnswer: "Single entry point for API requests",
      difficulty: "medium",
      category: "System Design",
      explanation: "API Gateway acts as a single entry point that routes requests to appropriate microservices."
    },
    {
      question: "What is the difference between compiled and interpreted languages?",
      options: ["No difference", "Compiled languages are translated before execution, interpreted during execution", "Interpreted languages are faster", "Compiled languages use more memory"],
      correctAnswer: "Compiled languages are translated before execution, interpreted during execution",
      difficulty: "easy",
      category: "Programming Concepts",
      explanation: "Compiled languages are translated to machine code before execution, while interpreted languages are translated during execution."
    },
    {
      question: "What is the purpose of CI/CD in software development?",
      options: ["Code review", "Continuous Integration and Continuous Deployment", "Code documentation", "Bug tracking"],
      correctAnswer: "Continuous Integration and Continuous Deployment",
      difficulty: "easy",
      category: "Software Engineering",
      explanation: "CI/CD automates the integration of code changes and deployment to production."
    },
    {
      question: "What is the main characteristic of functional programming?",
      options: ["Object-oriented design", "Immutability and pure functions", "Procedural approach", "Memory management"],
      correctAnswer: "Immutability and pure functions",
      difficulty: "medium",
      category: "Programming Paradigms",
      explanation: "Functional programming emphasizes immutability and pure functions without side effects."
    },
    {
      question: "What is the purpose of indexing in databases?",
      options: ["Data backup", "Improve query performance", "Data encryption", "User authentication"],
      correctAnswer: "Improve query performance",
      difficulty: "easy",
      category: "Database Management",
      explanation: "Database indexes improve query performance by creating fast access paths to data."
    },
    {
      question: "What is the difference between horizontal and vertical scaling?",
      options: ["No difference", "Horizontal adds more machines, Vertical upgrades existing machine", "Vertical adds more machines, Horizontal upgrades existing machine", "Both are the same"],
      correctAnswer: "Horizontal adds more machines, Vertical upgrades existing machine",
      difficulty: "medium",
      category: "System Design",
      explanation: "Horizontal scaling (scale out) adds more servers, while vertical scaling (scale up) upgrades existing server resources."
    }
  ]
  
  return questions.map(q => ({
    ...q,
    id: generateId()
  }))
}
