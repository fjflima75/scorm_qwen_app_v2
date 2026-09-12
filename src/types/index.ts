// ============================================
// ENTERPRISE SCORM AUTHORING PLATFORM - TYPES
// ============================================

export type UserRole = 'ADMIN' | 'COURSE_MANAGER' | 'AUTHOR' | 'REVIEWER' | 'VIEWER';

export type WorkflowStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export type ScormVersion = '1.2' | '2004';

export type CompletionStatus = 'not_attempted' | 'incomplete' | 'completed' | 'passed' | 'failed';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  createdAt: string;
  lastLogin?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  author: string;
  version: string;
  estimatedDuration: number;
  passingScore: number;
  completionRule: 'all_pages' | 'all_quizzes' | 'final_assessment';
  navigationRule: 'free' | 'sequential' | 'restricted';
  resumeEnabled: boolean;
  themeId: string;
  scormVersion: ScormVersion;
  status: WorkflowStatus;
  modules: Module[];
  createdAt: string;
  updatedAt: string;
  qualityScore?: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  pages: Page[];
}

export interface Page {
  id: string;
  title: string;
  type: 'content' | 'quiz' | 'assessment';
  order: number;
  blocks: ContentBlock[];
  quizSettings?: QuizSettings;
}

export type BlockType = 
  | 'heading' | 'text' | 'image' | 'video' | 'audio'
  | 'gallery' | 'quote' | 'accordion' | 'tabs' | 'cards'
  | 'timeline' | 'callout' | 'button' | 'divider'
  | 'multiple_choice' | 'true_false' | 'fill_blank'
  | 'matching' | 'ordering' | 'knowledge_check';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  order: number;
}

export interface QuizSettings {
  passingScore: number;
  maxAttempts: number;
  randomize: boolean;
  showFeedback: boolean;
  timeLimit?: number;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching';
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headerStyle: 'light' | 'dark' | 'transparent';
  template: 'corporate' | 'modern' | 'minimal' | 'compliance' | 'training' | 'interactive';
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  category: string;
  uploadedAt: string;
  metadata: Record<string, string>;
}

export interface ScormExport {
  id: string;
  courseId: string;
  courseTitle: string;
  version: string;
  scormVersion: ScormVersion;
  createdAt: string;
  validationStatus: 'pass' | 'warning' | 'error';
  testStatus: 'pass' | 'fail' | 'pending';
  fileSize: number;
  fileName: string;
}

export interface ScormSession {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  startedAt: string;
  completedAt?: string;
  status: CompletionStatus;
  score: number;
  progress: number;
  suspendData: string;
  lessonLocation: string;
  sessionTime: string;
  apiCalls: ScormApiCall[];
}

export interface ScormApiCall {
  id: string;
  timestamp: string;
  method: string;
  argument: string;
  result: string;
  error?: string;
}

export interface MockStudent {
  id: string;
  name: string;
  email: string;
  sessions: ScormSession[];
}

export interface AIProvider {
  id: string;
  name: string;
  type: 'ollama' | 'openai_compatible';
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
  connected: boolean;
  apiKey?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface ReviewComment {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  content: string;
  type: 'comment' | 'issue' | 'suggestion';
  status: 'open' | 'resolved' | 'rejected';
  createdAt: string;
}

export interface SystemHealth {
  application: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  storage: 'healthy' | 'degraded' | 'down';
  ai: 'healthy' | 'degraded' | 'down';
  ollama: 'healthy' | 'degraded' | 'down';
  diskUsage: number;
  memoryUsage: number;
  cpuUsage: number;
  lastBackup: string;
  version: string;
}
