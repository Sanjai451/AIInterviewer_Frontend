import { createContext, useContext, useState, type ReactNode } from 'react';


type InterviewType = 'mcq' | 'in-person';

type InterviewStatus = 'pending' | 'in-progress' | 'completed' | 'expired';

interface Interview {
  id: string;
  title: string;
  description: string;
  type: InterviewType;
  assignedTo: string; // User ID
  assignedBy: string; // HR ID
  status: InterviewStatus;
  duration: number; // in minutes
  totalQuestions: number;
  score?: number;
  maxScore?: number;
  completedAt?: Date;
  createdAt: Date;
  scheduledFor?: Date;
}

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

interface InPersonQuestion {
  id: string;
  question: string;
  expectedTopics: string[];
  points: number;
}

interface InterviewResult {
  interviewId: string;
  score: number;
  maxScore: number;
  answers: {
    questionId: string;
    answer: string | number;
    isCorrect?: boolean;
    pointsEarned: number;
  }[];
  completedAt: Date;
}

interface InterviewContextType {
  interviews: Interview[];
  results: InterviewResult[];
  addInterview: (interview: Omit<Interview, 'id' | 'createdAt'>) => void;
  updateInterviewStatus: (id: string, status: Interview['status'], score?: number, maxScore?: number) => void;
  getInterviewsForUser: (userId: string) => Interview[];
  getInterviewsCreatedBy: (hrId: string) => Interview[];
  addResult: (result: InterviewResult) => void;
  getMCQQuestions: () => MCQQuestion[];
  getInPersonQuestions: () => InPersonQuestion[];
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

// Static questions for V1
const staticMCQQuestions: MCQQuestion[] = [
  {
    id: '1',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
    points: 10,
  },
  {
    id: '2',
    question: 'Which data structure uses LIFO principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctAnswer: 1,
    points: 10,
  },
  {
    id: '3',
    question: 'What does REST stand for?',
    options: [
      'Representational State Transfer',
      'Remote State Transfer',
      'Representational System Transfer',
      'Remote System Transfer',
    ],
    correctAnswer: 0,
    points: 10,
  },
  {
    id: '4',
    question: 'Which of the following is NOT a JavaScript framework?',
    options: ['React', 'Angular', 'Django', 'Vue'],
    correctAnswer: 2,
    points: 10,
  },
  {
    id: '5',
    question: 'What is the purpose of the virtual DOM in React?',
    options: [
      'To directly manipulate the browser DOM',
      'To improve performance by minimizing DOM updates',
      'To store application state',
      'To handle routing',
    ],
    correctAnswer: 1,
    points: 10,
  },
];

const staticInPersonQuestions: InPersonQuestion[] = [
  {
    id: '1',
    question: 'Explain the concept of closures in JavaScript and provide an example.',
    expectedTopics: ['function scope', 'lexical environment', 'encapsulation', 'data privacy'],
    points: 20,
  },
  {
    id: '2',
    question: 'What are the SOLID principles in software development? Explain each briefly.',
    expectedTopics: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation', 'Dependency Inversion'],
    points: 25,
  },
  {
    id: '3',
    question: 'Describe the difference between SQL and NoSQL databases. When would you use each?',
    expectedTopics: ['schema', 'scalability', 'ACID', 'flexibility', 'use cases'],
    points: 20,
  },
  {
    id: '4',
    question: 'Explain how you would optimize a slow-performing web application.',
    expectedTopics: ['profiling', 'caching', 'lazy loading', 'code splitting', 'database optimization'],
    points: 20,
  },
  {
    id: '5',
    question: 'What is your experience with version control systems? Describe your typical Git workflow.',
    expectedTopics: ['branching', 'merging', 'pull requests', 'code review', 'CI/CD'],
    points: 15,
  },
];

// Mock initial interviews - using 'demo' as assignedTo so any user can see them
const createInitialInterviews = (): Interview[] => [
  {
    id: 'demo-mcq',
    title: 'Frontend Developer Assessment',
    description: 'Technical assessment for frontend developer position covering React and JavaScript fundamentals.',
    type: 'mcq',
    assignedTo: 'demo', // Special demo assignment
    assignedBy: 'hr-demo',
    status: 'pending',
    duration: 30,
    totalQuestions: 5,
    createdAt: new Date(),
  },
  {
    id: 'demo-inperson',
    title: 'Senior Developer Technical Interview',
    description: 'In-depth technical interview covering system design and problem-solving skills.',
    type: 'in-person',
    assignedTo: 'demo', // Special demo assignment
    assignedBy: 'hr-demo',
    status: 'pending',
    duration: 45,
    totalQuestions: 5,
    createdAt: new Date(),
  },
];

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [interviews, setInterviews] = useState<Interview[]>(createInitialInterviews());
  const [results, setResults] = useState<InterviewResult[]>([]);

  const addInterview = (interview: Omit<Interview, 'id' | 'createdAt'>) => {
    const newInterview: Interview = {
      ...interview,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setInterviews(prev => [...prev, newInterview]);
  };

  const updateInterviewStatus = (id: string, status: Interview['status'], score?: number, maxScore?: number) => {
    setInterviews(prev =>
      prev.map(interview =>
        interview.id === id
          ? { ...interview, status, score, maxScore, completedAt: status === 'completed' ? new Date() : undefined }
          : interview
      )
    );
  };

  // Return demo interviews + user-specific interviews
  const getInterviewsForUser = (userId: string) => {
    return interviews.filter(i => i.assignedTo === userId || i.assignedTo === 'demo');
  };

  const getInterviewsCreatedBy = (hrId: string) => {
    return interviews.filter(i => i.assignedBy === hrId);
  };

  const addResult = (result: InterviewResult) => {
    setResults(prev => [...prev, result]);
  };

  const getMCQQuestions = () => staticMCQQuestions;
  const getInPersonQuestions = () => staticInPersonQuestions;

  return (
    <InterviewContext.Provider
      value={{
        interviews,
        results,
        addInterview,
        updateInterviewStatus,
        getInterviewsForUser,
        getInterviewsCreatedBy,
        addResult,
        getMCQQuestions,
        getInPersonQuestions,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
