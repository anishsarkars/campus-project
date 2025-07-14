export interface UserProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  year: number;
  skillsToTeach: string[];
  skillsToLearn: string[];
  availability: TimeSlot[];
  role: 'student' | 'instructor';
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Card {
  id: string;
  posterId: string;
  posterName: string;
  type: 'teach' | 'learn' | 'team';
  title: string;
  description: string;
  tags: string[];
  timeSlots: TimeSlot[];
  timestamp: Date;
  status: 'active' | 'completed' | 'cancelled';
  contactNumber?: string; // private until match approved
}

export interface Match {
  id: string;
  cardId: string;
  cardTitle: string;
  requesterId: string;
  requesterName: string;
  posterId: string;
  posterName: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  meetLink?: string;
  icebreakerQuestions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  type: 'code' | 'design' | 'quiz';
  description: string;
  spec: string;
  dueDate: Date;
  points: number;
  testCases?: TestCase[];
  quizQuestions?: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  code?: string;
  quizAnswers?: number[];
  status: 'submitted' | 'passed' | 'failed';
  hint?: string;
  submittedAt: Date;
  gradedAt?: Date;
}

export interface DashboardStats {
  totalStudents: number;
  totalSubmissions: number;
  passedSubmissions: number;
  averageScore: number;
  stuckStudents: number;
} 