import { Question } from '../store/examStore'

interface QuestionCategory {
  id: string
  name: string
  description: string
  subcategories: QuestionSubcategory[]
}

interface QuestionSubcategory {
  id: string
  name: string
  description: string
  questions: Question[]
}

// Generate questions for each subcategory
const generateQuestions = (
  categoryId: string,
  subcategoryId: string,
  baseQuestions: Array<{
    question: string
    options: string[]
    correctAnswer: string
    difficulty: 'easy' | 'medium' | 'hard'
    explanation?: string
  }>
): Question[] => {
  return baseQuestions.map((q, index) => ({
    id: `${categoryId}_${subcategoryId}_${index + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    difficulty: q.difficulty,
    category: categoryId,
    subcategory: subcategoryId,
    explanation: q.explanation || `Correct answer is: ${q.correctAnswer}`
  }))
}

// DSA (Data Structures and Algorithms) Questions
const dsaArrayQuestions = [
  {
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: "O(1)",
    difficulty: "easy" as const,
    explanation: "Array elements can be accessed directly using their index in constant time."
  },
  {
    question: "Which operation is most efficient on a dynamic array when adding elements?",
    options: ["Adding at the beginning", "Adding at the middle", "Adding at the end", "All are equally efficient"],
    correctAnswer: "Adding at the end",
    difficulty: "medium" as const
  },
  {
    question: "What is the worst-case time complexity for searching an element in an unsorted array?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(n)",
    difficulty: "easy" as const
  },
  {
    question: "In a 2D array, how would you calculate the memory address of element at position [i][j] given base address and element size?",
    options: [
      "base + (i * columns + j) * size",
      "base + (i + j) * size",
      "base + i * j * size",
      "base + (i * rows + j) * size"
    ],
    correctAnswer: "base + (i * columns + j) * size",
    difficulty: "hard" as const
  },
  {
    question: "Which of the following best describes a jagged array?",
    options: [
      "An array with uneven elements",
      "An array of arrays where sub-arrays can have different lengths",
      "A 3D array",
      "An array with negative indices"
    ],
    correctAnswer: "An array of arrays where sub-arrays can have different lengths",
    difficulty: "medium" as const
  }
]

const dsaLinkedListQuestions = [
  {
    question: "What is the main advantage of a linked list over an array?",
    options: [
      "Faster access to elements",
      "Dynamic size allocation",
      "Better cache performance",
      "Lower memory usage"
    ],
    correctAnswer: "Dynamic size allocation",
    difficulty: "easy" as const
  },
  {
    question: "In a singly linked list, what information does each node contain?",
    options: [
      "Only data",
      "Data and pointer to next node",
      "Data and pointer to previous node",
      "Data and pointers to both next and previous nodes"
    ],
    correctAnswer: "Data and pointer to next node",
    difficulty: "easy" as const
  },
  {
    question: "What is the time complexity of inserting a node at the beginning of a linked list?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: "O(1)",
    difficulty: "medium" as const
  },
  {
    question: "How do you detect a cycle in a linked list efficiently?",
    options: [
      "Use a hash table to store visited nodes",
      "Use Floyd's Cycle Detection Algorithm (Tortoise and Hare)",
      "Traverse the list twice",
      "Both A and B are correct"
    ],
    correctAnswer: "Both A and B are correct",
    difficulty: "hard" as const
  },
  {
    question: "In a doubly linked list, what is the space complexity compared to a singly linked list?",
    options: [
      "Same space complexity",
      "Double the space complexity",
      "Slightly higher due to extra pointer per node",
      "Lower space complexity"
    ],
    correctAnswer: "Slightly higher due to extra pointer per node",
    difficulty: "medium" as const
  }
]

const dsaStackQuestions = [
  {
    question: "What principle does a stack follow?",
    options: ["FIFO", "LIFO", "Random access", "Priority-based"],
    correctAnswer: "LIFO",
    difficulty: "easy" as const
  },
  {
    question: "Which of the following operations is NOT typically associated with a stack?",
    options: ["Push", "Pop", "Peek/Top", "Dequeue"],
    correctAnswer: "Dequeue",
    difficulty: "easy" as const
  },
  {
    question: "What happens when you try to pop from an empty stack?",
    options: [
      "Returns null",
      "Stack underflow error",
      "Returns 0",
      "Creates a new element"
    ],
    correctAnswer: "Stack underflow error",
    difficulty: "medium" as const
  },
  {
    question: "Which application commonly uses stack data structure?",
    options: [
      "Function call management",
      "Expression evaluation",
      "Undo operations in editors",
      "All of the above"
    ],
    correctAnswer: "All of the above",
    difficulty: "medium" as const
  },
  {
    question: "In the infix to postfix conversion using stack, what is the correct postfix expression for 'A + B * C'?",
    options: ["ABC*+", "AB+C*", "A+BC*", "ABC+*"],
    correctAnswer: "ABC*+",
    difficulty: "hard" as const
  }
]

// Cloud Computing Questions
const cloudBasicsQuestions = [
  {
    question: "What does 'Cloud Computing' primarily refer to?",
    options: [
      "Computing in the sky",
      "On-demand delivery of computing services over the internet",
      "A type of weather prediction system",
      "Distributed computing only"
    ],
    correctAnswer: "On-demand delivery of computing services over the internet",
    difficulty: "easy" as const
  },
  {
    question: "Which of the following is NOT a cloud service model?",
    options: ["IaaS", "PaaS", "SaaS", "DaaS (Desktop as a Service)"],
    correctAnswer: "DaaS (Desktop as a Service)",
    difficulty: "easy" as const
  },
  {
    question: "What does 'IaaS' stand for?",
    options: [
      "Internet as a Service",
      "Infrastructure as a Service",
      "Information as a Service",
      "Integration as a Service"
    ],
    correctAnswer: "Infrastructure as a Service",
    difficulty: "easy" as const
  },
  {
    question: "Which cloud deployment model provides the highest level of control and security?",
    options: ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Community Cloud"],
    correctAnswer: "Private Cloud",
    difficulty: "medium" as const
  },
  {
    question: "What is the main characteristic of elastic computing in cloud environments?",
    options: [
      "Fixed resource allocation",
      "Manual scaling only",
      "Automatic scaling of resources based on demand",
      "Limited to storage scaling"
    ],
    correctAnswer: "Automatic scaling of resources based on demand",
    difficulty: "medium" as const
  }
]

const cloudAwsQuestions = [
  {
    question: "What does EC2 stand for in AWS?",
    options: [
      "Elastic Compute Cloud",
      "Enhanced Cloud Computing",
      "Elastic Container Cloud",
      "Enterprise Cloud Computing"
    ],
    correctAnswer: "Elastic Compute Cloud",
    difficulty: "easy" as const
  },
  {
    question: "Which AWS service is primarily used for object storage?",
    options: ["EBS", "EFS", "S3", "RDS"],
    correctAnswer: "S3",
    difficulty: "easy" as const
  },
  {
    question: "What is the purpose of AWS IAM?",
    options: [
      "Internet Access Management",
      "Identity and Access Management",
      "Infrastructure and Application Management",
      "Instance and AMI Management"
    ],
    correctAnswer: "Identity and Access Management",
    difficulty: "medium" as const
  },
  {
    question: "Which AWS service provides a managed relational database?",
    options: ["DynamoDB", "S3", "RDS", "ElastiCache"],
    correctAnswer: "RDS",
    difficulty: "medium" as const
  },
  {
    question: "What is the difference between EBS and Instance Store in AWS?",
    options: [
      "EBS is temporary, Instance Store is persistent",
      "EBS is persistent, Instance Store is temporary",
      "Both are persistent",
      "Both are temporary"
    ],
    correctAnswer: "EBS is persistent, Instance Store is temporary",
    difficulty: "hard" as const
  }
]

// Programming Questions
const programmingBasicsQuestions = [
  {
    question: "What is a variable in programming?",
    options: [
      "A fixed value",
      "A named storage location for data",
      "A type of loop",
      "A programming language"
    ],
    correctAnswer: "A named storage location for data",
    difficulty: "easy" as const
  },
  {
    question: "Which of the following is a primitive data type in most programming languages?",
    options: ["Array", "Object", "Integer", "List"],
    correctAnswer: "Integer",
    difficulty: "easy" as const
  },
  {
    question: "What is the difference between '==' and '===' in JavaScript?",
    options: [
      "No difference",
      "== checks value, === checks value and type",
      "=== is older syntax",
      "== is for numbers, === is for strings"
    ],
    correctAnswer: "== checks value, === checks value and type",
    difficulty: "medium" as const
  },
  {
    question: "What is recursion in programming?",
    options: [
      "A loop that runs indefinitely",
      "A function calling itself",
      "A type of variable",
      "An error handling mechanism"
    ],
    correctAnswer: "A function calling itself",
    difficulty: "medium" as const
  },
  {
    question: "What is the purpose of the 'return' statement in a function?",
    options: [
      "To end the program",
      "To start a loop",
      "To send a value back to the calling code",
      "To declare a variable"
    ],
    correctAnswer: "To send a value back to the calling code",
    difficulty: "easy" as const
  }
]

const programmingOopQuestions = [
  {
    question: "What does OOP stand for?",
    options: [
      "Object-Oriented Programming",
      "Open-Office Protocol",
      "Operating-Object Platform",
      "Online-Offline Processing"
    ],
    correctAnswer: "Object-Oriented Programming",
    difficulty: "easy" as const
  },
  {
    question: "Which of the following is NOT a pillar of Object-Oriented Programming?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Compilation"],
    correctAnswer: "Compilation",
    difficulty: "easy" as const
  },
  {
    question: "What is encapsulation in OOP?",
    options: [
      "Creating multiple objects",
      "Hiding internal implementation details",
      "Inheriting from parent class",
      "Using multiple forms"
    ],
    correctAnswer: "Hiding internal implementation details",
    difficulty: "medium" as const
  },
  {
    question: "What is method overriding?",
    options: [
      "Creating multiple methods with same name but different parameters",
      "Replacing a parent class method in child class",
      "Deleting a method",
      "Creating private methods"
    ],
    correctAnswer: "Replacing a parent class method in child class",
    difficulty: "medium" as const
  },
  {
    question: "What is the difference between abstract class and interface?",
    options: [
      "No difference",
      "Abstract class can have implementation, interface cannot",
      "Interface can have implementation, abstract class cannot",
      "Both are exactly the same"
    ],
    correctAnswer: "Abstract class can have implementation, interface cannot",
    difficulty: "hard" as const
  }
]

// Algorithms Questions
const algorithmsSearchingQuestions = [
  {
    question: "What is the time complexity of linear search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: "O(n)",
    difficulty: "easy" as const
  },
  {
    question: "What is the prerequisite for binary search to work?",
    options: [
      "Array must be sorted",
      "Array must be unsorted",
      "Array must contain only numbers",
      "No prerequisites"
    ],
    correctAnswer: "Array must be sorted",
    difficulty: "easy" as const
  },
  {
    question: "What is the time complexity of binary search?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: "O(log n)",
    difficulty: "medium" as const
  },
  {
    question: "In binary search, what happens if the middle element is equal to the target?",
    options: [
      "Continue searching left",
      "Continue searching right",
      "Return the index",
      "Return error"
    ],
    correctAnswer: "Return the index",
    difficulty: "easy" as const
  },
  {
    question: "Which searching algorithm is more efficient for large sorted datasets?",
    options: [
      "Linear Search",
      "Binary Search",
      "Both are equally efficient",
      "Depends on the data type"
    ],
    correctAnswer: "Binary Search",
    difficulty: "medium" as const
  }
]

const algorithmsSortingQuestions = [
  {
    question: "What is the average time complexity of Quick Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    correctAnswer: "O(n log n)",
    difficulty: "medium" as const
  },
  {
    question: "Which sorting algorithm is considered stable?",
    options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
    correctAnswer: "Merge Sort",
    difficulty: "medium" as const
  },
  {
    question: "What does 'stable sorting' mean?",
    options: [
      "The algorithm never crashes",
      "Equal elements maintain their relative order",
      "It works on all data types",
      "It has consistent performance"
    ],
    correctAnswer: "Equal elements maintain their relative order",
    difficulty: "medium" as const
  },
  {
    question: "What is the worst-case time complexity of Bubble Sort?",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
    correctAnswer: "O(n²)",
    difficulty: "easy" as const
  },
  {
    question: "Which sorting algorithm has the best worst-case time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Insertion Sort"],
    correctAnswer: "Merge Sort",
    difficulty: "hard" as const
  }
]

// Create the complete sample question bank
export const sampleQuestionBank: QuestionCategory[] = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    description: "Comprehensive questions covering fundamental data structures and algorithms",
    subcategories: [
      {
        id: "arrays",
        name: "Arrays & Strings",
        description: "Questions about array operations, string manipulation, and related algorithms",
        questions: [
          ...generateQuestions("dsa", "arrays", dsaArrayQuestions),
          // Add more questions to reach ~50 per subcategory
          ...Array.from({ length: 45 }, (_, i) => ({
            id: `dsa_arrays_${i + 6}`,
            question: `Array Question ${i + 6}: What is the space complexity of storing n elements in an array?`,
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: "O(n)",
            difficulty: (["easy", "medium", "hard"] as const)[i % 3],
            category: "dsa",
            subcategory: "arrays",
            explanation: "Arrays require O(n) space to store n elements."
          }))
        ]
      },
      {
        id: "linkedlists",
        name: "Linked Lists",
        description: "Singly, doubly, and circular linked lists with operations",
        questions: [
          ...generateQuestions("dsa", "linkedlists", dsaLinkedListQuestions),
          ...Array.from({ length: 45 }, (_, i) => ({
            id: `dsa_linkedlists_${i + 6}`,
            question: `Linked List Question ${i + 6}: What is the advantage of doubly linked lists over singly linked lists?`,
            options: ["Faster insertion", "Bidirectional traversal", "Less memory usage", "Better cache performance"],
            correctAnswer: "Bidirectional traversal",
            difficulty: (["easy", "medium", "hard"] as const)[i % 3],
            category: "dsa",
            subcategory: "linkedlists",
            explanation: "Doubly linked lists allow traversal in both directions."
          }))
        ]
      },
      {
        id: "stacks",
        name: "Stacks & Queues",
        description: "Stack and queue implementations with applications",
        questions: [
          ...generateQuestions("dsa", "stacks", dsaStackQuestions),
          ...Array.from({ length: 45 }, (_, i) => ({
            id: `dsa_stacks_${i + 6}`,
            question: `Stack/Queue Question ${i + 6}: What is the time complexity of enqueue operation in a queue?`,
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: "O(1)",
            difficulty: (["easy", "medium", "hard"] as const)[i % 3],
            category: "dsa",
            subcategory: "stacks",
            explanation: "Enqueue operation in a properly implemented queue takes constant time."
          }))
        ]
      },
      {
        id: "trees",
        name: "Trees & Graphs",
        description: "Binary trees, BST, graph traversal algorithms",
        questions: Array.from({ length: 50 }, (_, i) => ({
          id: `dsa_trees_${i + 1}`,
          question: `Tree/Graph Question ${i + 1}: What is the height of a balanced binary tree with n nodes?`,
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctAnswer: "O(log n)",
          difficulty: (["easy", "medium", "hard"] as const)[i % 3],
          category: "dsa",
          subcategory: "trees",
          explanation: "A balanced binary tree has height O(log n)."
        }))
      }
    ]
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    description: "Cloud platforms, services, and deployment models",
    subcategories: [
      {
        id: "basics",
        name: "Cloud Fundamentals",
        description: "Basic concepts, service models, and deployment models",
        questions: [
          ...generateQuestions("cloud", "basics", cloudBasicsQuestions),
          ...Array.from({ length: 45 }, (_, i) => ({
            id: `cloud_basics_${i + 6}`,
            question: `Cloud Basics Question ${i + 6}: What is the main benefit of cloud computing scalability?`,
            options: ["Fixed costs", "Manual resource management", "Automatic resource adjustment", "Limited availability"],
            correctAnswer: "Automatic resource adjustment",
            difficulty: (["easy", "medium", "hard"] as const)[i % 3],
            category: "cloud",
            subcategory: "basics",
            explanation: "Cloud scalability allows automatic adjustment of resources based on demand."
          }))
        ]
      },
      {
        id: "aws",
        name: "Amazon Web Services",
        description: "AWS services, EC2, S3, RDS, and more",
        questions: [
          ...generateQuestions("cloud", "aws", cloudAwsQuestions),
          ...Array.from({ length: 45 }, (_, i) => ({
            id: `cloud_aws_${i + 6}`,
            question: `AWS Question ${i + 6}: Which AWS service is used for content delivery?`,
            options: ["CloudFront", "Route 53", "VPC", "IAM"],
            correctAnswer: "CloudFront",
            difficulty: (["easy", "medium", "hard"] as const)[i % 3],
            category: "cloud",
            subcategory: "aws",
            explanation: "CloudFront is AWS's content delivery network (CDN) service."
          }))
        ]
      },
      {
        id: "azure",
        name: "Microsoft Azure",
        description: "Azure services, virtual machines, and cloud solutions",
        questions: Array.from({ length: 50 }, (_, i) => ({
          id: `cloud_azure_${i + 1}`,
          question: `Azure Question ${i + 1}: What is Azure Resource Manager?`,
          options: ["A monitoring tool", "A deployment and management service", "A storage service", "A networking service"],
          correctAnswer: "A deployment and management service",
          difficulty: (["easy", "medium", "hard"] as const)[i % 3],
          category: "cloud",
          subcategory: "azure",
          explanation: "Azure Resource Manager is the deployment and management service for Azure."
        }))
      },
      {
        id: "devops",
        name: "DevOps & CI/CD",
        description: "Continuous integration, deployment, and DevOps practices",
        questions: Array.from({ length: 50 }, (_, i) => ({
          id: `cloud_devops_${i + 1}`,
          question: `DevOps Question ${i + 1}: What does CI/CD stand for?`,
          options: [
            "Continuous Integration/Continuous Deployment",
            "Cloud Integration/Cloud Deployment", 
            "Code Integration/Code Deployment",
            "Container Integration/Container Deployment"
          ],
          correctAnswer: "Continuous Integration/Continuous Deployment",
          difficulty: (["easy", "medium", "hard"] as const)[i % 3],
          category: "cloud",
          subcategory: "devops",
          explanation: "CI/CD stands for Continuous Integration and Continuous Deployment."
        }))
      }
    ]
  },
  {
    id: "programming",
    name: "Programming Concepts",
    description: "Core programming principles and paradigms",
    subcategories: [
      {
        id: "basics",
        name: "Programming Fundamentals",
        description: "Variables, data types, control structures, and functions",
        questions: [
          ...generateQuestions("programming", "basics", programmingBasicsQuestions),
          ...Array.from({ length: 45 }, (_, i) => ({
            id: `programming_basics_${i + 6}`,
            question: `Programming Basics Question ${i + 6}: What is the purpose of a loop in programming?`,
            options: ["To declare variables", "To repeat code execution", "To define functions", "To handle errors"],
            correctAnswer: "To repeat code execution",
            difficulty: (["easy", "medium", "hard"] as const)[i % 3],
            category: "programming",
            subcategory: "basics",
            explanation: "Loops are used to repeat code execution multiple times."
          }))
        ]
      },
      {
        id: "oop",
        name: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, polymorphism, and encapsulation",
        questions: [
          ...generateQuestions("programming", "oop", programmingOopQuestions),
          ...Array.from({ length: 45 }, (_, i) => ({
            id: `programming_oop_${i + 6}`,
            question: `OOP Question ${i + 6}: What is a constructor in object-oriented programming?`,
            options: [
              "A method to destroy objects",
              "A special method to initialize objects",
              "A method to copy objects",
              "A method to compare objects"
            ],
            correctAnswer: "A special method to initialize objects",
            difficulty: (["easy", "medium", "hard"] as const)[i % 3],
            category: "programming",
            subcategory: "oop",
            explanation: "A constructor is a special method used to initialize objects when they are created."
          }))
        ]
      },
      {
        id: "functional",
        name: "Functional Programming",
        description: "Pure functions, immutability, and functional concepts",
        questions: Array.from({ length: 50 }, (_, i) => ({
          id: `programming_functional_${i + 1}`,
          question: `Functional Programming Question ${i + 1}: What is a pure function?`,
          options: [
            "A function with no bugs",
            "A function that always returns the same output for the same input and has no side effects",
            "A function written in a pure language",
            "A function that uses only primitive data types"
          ],
          correctAnswer: "A function that always returns the same output for the same input and has no side effects",
          difficulty: (["easy", "medium", "hard"] as const)[i % 3],
          category: "programming",
          subcategory: "functional",
          explanation: "A pure function is deterministic and has no side effects."
        }))
      },
      {
        id: "design-patterns",
        name: "Design Patterns",
        description: "Common software design patterns and architectural principles",
        questions: Array.from({ length: 50 }, (_, i) => ({
          id: `programming_patterns_${i + 1}`,
          question: `Design Patterns Question ${i + 1}: What is the Singleton pattern?`,
          options: [
            "A pattern that creates multiple instances",
            "A pattern that ensures only one instance of a class exists",
            "A pattern for database connections",
            "A pattern for user interfaces"
          ],
          correctAnswer: "A pattern that ensures only one instance of a class exists",
          difficulty: (["easy", "medium", "hard"] as const)[i % 3],
          category: "programming",
          subcategory: "design-patterns",
          explanation: "The Singleton pattern restricts a class to have only one instance."
        }))
      }
    ]
  },
  {
    id: "algorithms",
    name: "Algorithms",
    description: "Searching, sorting, and algorithmic problem-solving techniques",
    subcategories: [
      {
        id: "searching",
        name: "Searching Algorithms",
        description: "Linear search, binary search, and advanced searching techniques",
        questions: [
          ...generateQuestions("algorithms", "searching", algorithmsSearchingQuestions),
          ...Array.from({ length: 45 }, (_, i) => ({
            id: `algorithms_searching_${i + 6}`,
            question: `Searching Question ${i + 6}: What is the space complexity of binary search?`,
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: "O(1)",
            difficulty: (["easy", "medium", "hard"] as const)[i % 3],
            category: "algorithms",
            subcategory: "searching",
            explanation: "Binary search uses constant extra space."
          }))
        ]
      },
      {
        id: "sorting",
        name: "Sorting Algorithms",
        description: "Bubble sort, merge sort, quick sort, and comparison of sorting techniques",
        questions: [
          ...generateQuestions("algorithms", "sorting", algorithmsSortingQuestions),
          ...Array.from({ length: 45 }, (_, i) => ({
            id: `algorithms_sorting_${i + 6}`,
            question: `Sorting Question ${i + 6}: Which sorting algorithm is best for small datasets?`,
            options: ["Merge Sort", "Quick Sort", "Insertion Sort", "Heap Sort"],
            correctAnswer: "Insertion Sort",
            difficulty: (["easy", "medium", "hard"] as const)[i % 3],
            category: "algorithms",
            subcategory: "sorting",
            explanation: "Insertion sort performs well on small datasets due to its simplicity and low overhead."
          }))
        ]
      },
      {
        id: "dynamic-programming",
        name: "Dynamic Programming",
        description: "Memoization, tabulation, and classic DP problems",
        questions: Array.from({ length: 50 }, (_, i) => ({
          id: `algorithms_dp_${i + 1}`,
          question: `Dynamic Programming Question ${i + 1}: What is the key principle of dynamic programming?`,
          options: [
            "Divide and conquer",
            "Optimal substructure and overlapping subproblems",
            "Greedy choice",
            "Randomization"
          ],
          correctAnswer: "Optimal substructure and overlapping subproblems",
          difficulty: (["easy", "medium", "hard"] as const)[i % 3],
          category: "algorithms",
          subcategory: "dynamic-programming",
          explanation: "Dynamic programming relies on optimal substructure and overlapping subproblems."
        }))
      },
      {
        id: "graph-algorithms",
        name: "Graph Algorithms",
        description: "BFS, DFS, shortest path, and network algorithms",
        questions: Array.from({ length: 50 }, (_, i) => ({
          id: `algorithms_graph_${i + 1}`,
          question: `Graph Algorithms Question ${i + 1}: What is the time complexity of DFS in a graph with V vertices and E edges?`,
          options: ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
          correctAnswer: "O(V + E)",
          difficulty: (["easy", "medium", "hard"] as const)[i % 3],
          category: "algorithms",
          subcategory: "graph-algorithms",
          explanation: "DFS visits each vertex once and explores each edge once, resulting in O(V + E) time complexity."
        }))
      }
    ]
  }
]

// Helper function to get questions by category and difficulty
export const getQuestionsByCategory = (
  categoryId: string,
  subcategoryId?: string,
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed',
  limit?: number
): Question[] => {
  const category = sampleQuestionBank.find(cat => cat.id === categoryId)
  if (!category) return []

  let allQuestions: Question[] = []

  if (subcategoryId) {
    const subcategory = category.subcategories.find(sub => sub.id === subcategoryId)
    if (subcategory) {
      allQuestions = subcategory.questions
    }
  } else {
    allQuestions = category.subcategories.flatMap(sub => sub.questions)
  }

  // Filter by difficulty
  if (difficulty && difficulty !== 'mixed') {
    allQuestions = allQuestions.filter(q => q.difficulty === difficulty)
  }

  // Shuffle and limit
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
  return limit ? shuffled.slice(0, limit) : shuffled
}

// Get all categories for UI
export const getAllCategories = () => {
  return sampleQuestionBank.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    subcategories: cat.subcategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      questionCount: sub.questions.length
    }))
  }))
}
