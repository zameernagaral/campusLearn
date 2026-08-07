// TypeScript interfaces for the entire CampusLearn application

export type Role = 'student' | 'faculty' | 'hod' | 'admin';
export type Theme = 'light' | 'dark' | 'system';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  bio?: string;
  department?: Department | string;
  rollNumber?: string;
  semester?: number;
  year?: number;
  employeeId?: string;
  designation?: string;
  enrolledCourses?: string[];
  teachingCourses?: string[];
  isEmailVerified: boolean;
  isActive: boolean;
  streak: number;
  points: number;
  badges: string[];
  lastLogin?: string;
  preferences: {
    theme: Theme;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  createdAt: string;
}

export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  hod?: User | string;
  totalStudents: number;
  totalFaculty: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnail?: string;
  faculty: User | string;
  department: Department | string;
  semester?: number;
  credits: number;
  subjectCode?: string;
  modules?: Module[];
  enrolledStudents?: string[];
  totalLessons: number;
  isPublished: boolean;
  isApproved: boolean;
  rating: number;
  totalRatings: number;
  views: number;
  tags: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  learningOutcomes: string[];
  prerequisites: string[];
  createdAt: string;
}

export interface Module {
  _id: string;
  title: string;
  description?: string;
  course: string;
  order: number;
  lessons: Lesson[];
  isPublished: boolean;
  duration: number;
}

export interface Lesson {
  _id: string;
  title: string;
  description?: string;
  module: string;
  course: string;
  order: number;
  type: 'video' | 'document' | 'quiz' | 'text' | 'live';
  videoUrl?: string;
  duration?: number;
  documentUrl?: string;
  documentName?: string;
  content?: string;
  isPublished: boolean;
  isFree: boolean;
  views: number;
  completedBy: string[];
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: Course | string;
  faculty: User | string;
  dueDate: string;
  maxMarks: number;
  attachments: { name: string; url: string }[];
  isPublished: boolean;
  allowLateSubmission: boolean;
  createdAt: string;
}

export interface Submission {
  _id: string;
  assignment: string;
  student: User;
  course: string;
  content?: string;
  files: { name: string; url: string }[];
  submittedAt: string;
  isLate: boolean;
  status: 'submitted' | 'graded' | 'returned' | 'resubmit';
  marks?: number;
  feedback?: string;
}

export interface QuizQuestion {
  _id: string;
  question: string;
  type: 'mcq' | 'true_false' | 'short';
  options: { _id: string; text: string; isCorrect?: boolean }[];
  explanation?: string;
  marks: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  course: Course | string;
  questions: QuizQuestion[];
  duration: number;
  totalMarks: number;
  passingMarks: number;
  startTime?: string;
  endTime?: string;
  maxAttempts: number;
  isPublished: boolean;
  type: 'practice' | 'exam' | 'assignment';
}

export interface QuizResult {
  _id: string;
  quiz: string;
  student: User;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  timeTaken?: number;
  completedAt: string;
}

export interface AttendanceRecord {
  student: User | string;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface Attendance {
  _id: string;
  course: Course | string;
  faculty: User | string;
  date: string;
  topic?: string;
  records: AttendanceRecord[];
  totalPresent: number;
  totalAbsent: number;
}

export interface Result {
  _id: string;
  student: string;
  course: Course;
  semester: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  maxMarks: number;
  grade: string;
  gradePoints: number;
  sgpa?: number;
  status: 'pass' | 'fail' | 'absent';
  isPublished: boolean;
}

export interface Certificate {
  _id: string;
  certificateId: string;
  student: User | string;
  course: Course;
  type: 'completion' | 'merit' | 'participation' | 'achievement';
  issuedAt: string;
  grade?: string;
  imageUrl?: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender?: User;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DiscussionPost {
  _id: string;
  title: string;
  content: string;
  author: User;
  course?: Course | string;
  tags: string[];
  likes: string[];
  views: number;
  isPinned: boolean;
  isResolved: boolean;
  type: 'question' | 'discussion' | 'announcement' | 'doubt';
  createdAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  likes: string[];
  createdAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: User;
  targetAudience: 'all' | 'students' | 'faculty' | 'department' | 'course';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isActive: boolean;
  createdAt: string;
}

export interface LiveClass {
  _id: string;
  title: string;
  course: Course | string;
  faculty: User;
  scheduledAt: string;
  duration: number;
  meetingLink: string;
  platform: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Dashboard stat types
export interface StatCard {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}
