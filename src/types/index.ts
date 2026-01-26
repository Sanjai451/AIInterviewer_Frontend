// User roles - scalable for future additions
export type UserRole = 'user' | 'hr' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export type InterviewType = 'mcq' | 'in-person';

export type InterviewStatus = 'pending' | 'in-progress' | 'completed' | 'expired';

export interface Interview {
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

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface InPersonQuestion {
  id: string;
  question: string;
  expectedTopics: string[];
  points: number;
}

export interface InterviewResult {
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
