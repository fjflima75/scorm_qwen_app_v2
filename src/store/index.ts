import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  User, Course, Module, Lesson, Page, ContentBlock, Theme,
  ScormExport, ScormSession, ScormApiCall, MockStudent,
  AIProvider, AuditLogEntry, ReviewComment, SystemHealth,
  WorkflowStatus, CompletionStatus, BlockType
} from '../types';

// ============================================
// INITIAL DATA
// ============================================

const defaultThemes: Theme[] = [
  { id: 'corporate', name: 'Corporate', primaryColor: '#1e40af', secondaryColor: '#3b82f6', fontFamily: 'Inter', headerStyle: 'dark', template: 'corporate' },
  { id: 'modern', name: 'Modern', primaryColor: '#7c3aed', secondaryColor: '#a78bfa', fontFamily: 'Inter', headerStyle: 'light', template: 'modern' },
  { id: 'minimal', name: 'Minimal', primaryColor: '#374151', secondaryColor: '#6b7280', fontFamily: 'Inter', headerStyle: 'light', template: 'minimal' },
  { id: 'compliance', name: 'Compliance', primaryColor: '#dc2626', secondaryColor: '#f87171', fontFamily: 'Inter', headerStyle: 'dark', template: 'compliance' },
  { id: 'training', name: 'Training', primaryColor: '#059669', secondaryColor: '#34d399', fontFamily: 'Inter', headerStyle: 'light', template: 'training' },
  { id: 'interactive', name: 'Interactive', primaryColor: '#ea580c', secondaryColor: '#fb923c', fontFamily: 'Inter', headerStyle: 'dark', template: 'interactive' },
];

const defaultAIProviders: AIProvider[] = [
  { id: 'ollama-local', name: 'Ollama (Local)', type: 'ollama', baseUrl: 'http://localhost:11434', model: 'llama3.1', temperature: 0.7, maxTokens: 4096, timeout: 120, connected: false },
  { id: 'openai-compat', name: 'OpenAI Compatible', type: 'openai_compatible', baseUrl: '', model: 'gpt-4', temperature: 0.7, maxTokens: 4096, timeout: 60, connected: false },
];

const sampleCourse: Course = {
  id: uuidv4(),
  title: 'Workplace Safety Fundamentals',
  description: 'A comprehensive course covering essential workplace safety practices, hazard identification, and emergency procedures.',
  language: 'en',
  author: 'Admin User',
  version: '1.0',
  estimatedDuration: 45,
  passingScore: 80,
  completionRule: 'all_pages',
  navigationRule: 'sequential',
  resumeEnabled: true,
  themeId: 'corporate',
  scormVersion: '1.2',
  status: 'published',
  qualityScore: 87,
  modules: [
    {
      id: uuidv4(), title: 'Introduction to Safety', description: 'Basic safety concepts', order: 1,
      lessons: [{
        id: uuidv4(), title: 'Welcome to Safety Training', description: '', order: 1,
        pages: [
          { id: uuidv4(), title: 'Course Overview', type: 'content', order: 1, blocks: [
            { id: uuidv4(), type: 'heading', content: { text: 'Welcome to Workplace Safety', level: 1 }, order: 1 },
            { id: uuidv4(), type: 'text', content: { text: 'This course will teach you the fundamentals of workplace safety. By the end, you will be able to identify common hazards and take appropriate preventive measures.' }, order: 2 },
            { id: uuidv4(), type: 'callout', content: { text: '⚠️ This training is mandatory for all employees.', style: 'warning' }, order: 3 },
          ]},
          { id: uuidv4(), title: 'Learning Objectives', type: 'content', order: 2, blocks: [
            { id: uuidv4(), type: 'heading', content: { text: 'Learning Objectives', level: 2 }, order: 1 },
            { id: uuidv4(), type: 'cards', content: { items: [
              { title: 'Identify Hazards', description: 'Recognize common workplace hazards' },
              { title: 'Prevent Accidents', description: 'Apply preventive measures effectively' },
              { title: 'Emergency Response', description: 'Know how to respond to emergencies' },
            ]}, order: 2 },
          ]},
        ]
      }]
    },
    {
      id: uuidv4(), title: 'Hazard Identification', description: 'Learn to identify workplace hazards', order: 2,
      lessons: [{
        id: uuidv4(), title: 'Types of Hazards', description: '', order: 1,
        pages: [
          { id: uuidv4(), title: 'Physical Hazards', type: 'content', order: 1, blocks: [
            { id: uuidv4(), type: 'heading', content: { text: 'Physical Hazards', level: 2 }, order: 1 },
            { id: uuidv4(), type: 'text', content: { text: 'Physical hazards include slippery floors, exposed wiring, working at heights, and heavy machinery. Always assess your environment before beginning work.' }, order: 2 },
            { id: uuidv4(), type: 'accordion', content: { items: [
              { title: 'Slip & Trip Hazards', content: 'Wet floors, loose cables, uneven surfaces. Keep walkways clear and report spills immediately.' },
              { title: 'Electrical Hazards', content: 'Exposed wiring, damaged cords, overloaded circuits. Never attempt electrical repairs without qualification.' },
              { title: 'Falling Objects', content: 'Unsecured items at height. Always use proper storage and PPE when working below elevated work.' },
            ]}, order: 3 },
          ]},
          { id: uuidv4(), title: 'Knowledge Check', type: 'quiz', order: 2, quizSettings: { passingScore: 80, maxAttempts: 3, randomize: false, showFeedback: true }, blocks: [
            { id: uuidv4(), type: 'multiple_choice', content: {
              question: 'Which of the following is a physical hazard?',
              options: ['Tight deadline', 'Exposed wiring', 'Loud music', 'Uncomfortable chair'],
              correctAnswer: 'Exposed wiring',
              explanation: 'Exposed wiring is a physical hazard that can cause electric shock or fire.'
            }, order: 1 },
            { id: uuidv4(), type: 'true_false', content: {
              question: 'You should attempt to fix electrical equipment yourself if you notice damage.',
              correctAnswer: false,
              explanation: 'Only qualified electricians should repair electrical equipment.'
            }, order: 2 },
          ]},
        ]
      }]
    },
    {
      id: uuidv4(), title: 'Emergency Procedures', description: 'What to do in an emergency', order: 3,
      lessons: [{
        id: uuidv4(), title: 'Emergency Response', description: '', order: 1,
        pages: [
          { id: uuidv4(), title: 'Emergency Actions', type: 'content', order: 1, blocks: [
            { id: uuidv4(), type: 'heading', content: { text: 'Emergency Response Procedures', level: 2 }, order: 1 },
            { id: uuidv4(), type: 'timeline', content: { items: [
              { title: 'Stay Calm', description: 'Take a deep breath and assess the situation' },
              { title: 'Alert Others', description: 'Activate the alarm and notify nearby colleagues' },
              { title: 'Evacuate', description: 'Follow the marked evacuation routes to the assembly point' },
              { title: 'Report', description: 'Check in with your supervisor at the assembly point' },
            ]}, order: 2 },
          ]},
          { id: uuidv4(), title: 'Final Assessment', type: 'assessment', order: 2, quizSettings: { passingScore: 80, maxAttempts: 3, randomize: true, showFeedback: true }, blocks: [
            { id: uuidv4(), type: 'multiple_choice', content: {
              question: 'What is the FIRST thing you should do in an emergency?',
              options: ['Run outside', 'Stay calm and assess', 'Call your family', 'Continue working'],
              correctAnswer: 'Stay calm and assess',
              explanation: 'Staying calm allows you to make rational decisions and properly assess the situation.'
            }, order: 1 },
          ]},
        ]
      }]
    },
  ],
  createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

const sampleStudents: MockStudent[] = [
  { id: uuidv4(), name: 'João Silva', email: 'joao.silva@company.com', sessions: [] },
  { id: uuidv4(), name: 'Maria Santos', email: 'maria.santos@company.com', sessions: [] },
  { id: uuidv4(), name: 'Pedro Costa', email: 'pedro.costa@company.com', sessions: [] },
];

// ============================================
// STORAGE HELPERS
// ============================================

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(`scorm_platform_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch { return defaultValue; }
}

function saveToStorage(key: string, value: any): void {
  try { localStorage.setItem(`scorm_platform_${key}`, JSON.stringify(value)); } catch {}
}

// ============================================
// HOOKS
// ============================================

export function useStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage('user', null));
  const [courses, setCourses] = useState<Course[]>(() => loadFromStorage('courses', [sampleCourse]));
  const [themes, setThemes] = useState<Theme[]>(() => loadFromStorage('themes', defaultThemes));
  const [exports, setExports] = useState<ScormExport[]>(() => loadFromStorage('exports', []));
  const [sessions, setSessions] = useState<ScormSession[]>(() => loadFromStorage('sessions', []));
  const [students, setStudents] = useState<MockStudent[]>(() => loadFromStorage('students', sampleStudents));
  const [aiProviders, setAiProviders] = useState<AIProvider[]>(() => loadFromStorage('aiProviders', defaultAIProviders));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadFromStorage('auditLogs', []));
  const [reviews, setReviews] = useState<ReviewComment[]>(() => loadFromStorage('reviews', []));

  useEffect(() => { saveToStorage('courses', courses); }, [courses]);
  useEffect(() => { saveToStorage('themes', themes); }, [themes]);
  useEffect(() => { saveToStorage('exports', exports); }, [exports]);
  useEffect(() => { saveToStorage('sessions', sessions); }, [sessions]);
  useEffect(() => { saveToStorage('students', students); }, [students]);
  useEffect(() => { saveToStorage('aiProviders', aiProviders); }, [aiProviders]);
  useEffect(() => { saveToStorage('auditLogs', auditLogs); }, [auditLogs]);
  useEffect(() => { saveToStorage('reviews', reviews); }, [reviews]);

  const addAuditLog = useCallback((action: string, entityType: string, entityId: string, details: string) => {
    const entry: AuditLogEntry = {
      id: uuidv4(), timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'system', action, entityType, entityId, details,
      ipAddress: '127.0.0.1'
    };
    setAuditLogs(prev => [entry, ...prev].slice(0, 1000));
  }, [currentUser]);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      const user: User = { id: uuidv4(), username: 'admin', email: 'admin@company.com', role: 'ADMIN', fullName: 'Admin User', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() };
      setCurrentUser(user);
      saveToStorage('user', user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => { setCurrentUser(null); localStorage.removeItem('scorm_platform_user'); }, []);

  const createCourse = useCallback((data: Partial<Course>): Course => {
    const course: Course = {
      id: uuidv4(), title: data.title || 'Untitled Course', description: data.description || '',
      language: data.language || 'en', author: currentUser?.fullName || 'Unknown',
      version: '1.0', estimatedDuration: data.estimatedDuration || 30,
      passingScore: data.passingScore || 80, completionRule: data.completionRule || 'all_pages',
      navigationRule: data.navigationRule || 'free', resumeEnabled: true,
      themeId: data.themeId || 'corporate', scormVersion: data.scormVersion || '1.2',
      status: 'draft', modules: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setCourses(prev => [...prev, course]);
    addAuditLog('COURSE_CREATED', 'course', course.id, `Created course: ${course.title}`);
    return course;
  }, [currentUser, addAuditLog]);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    addAuditLog('COURSE_UPDATED', 'course', id, `Updated course`);
  }, [addAuditLog]);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    addAuditLog('COURSE_DELETED', 'course', id, `Deleted course`);
  }, [addAuditLog]);

  const updateCourseStatus = useCallback((id: string, status: WorkflowStatus) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c));
    addAuditLog('COURSE_STATUS_CHANGED', 'course', id, `Status changed to ${status}`);
  }, [addAuditLog]);

  const addModule = useCallback((courseId: string, title: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const newModule: Module = { id: uuidv4(), title, description: '', order: c.modules.length + 1, lessons: [] };
      return { ...c, modules: [...c.modules, newModule], updatedAt: new Date().toISOString() };
    }));
  }, []);

  const addLesson = useCallback((courseId: string, moduleId: string, title: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return { ...c, modules: c.modules.map(m => {
        if (m.id !== moduleId) return m;
        const newLesson: Lesson = { id: uuidv4(), title, description: '', order: m.lessons.length + 1, pages: [] };
        return { ...m, lessons: [...m.lessons, newLesson] };
      }), updatedAt: new Date().toISOString() };
    }));
  }, []);

  const addPage = useCallback((courseId: string, moduleId: string, lessonId: string, title: string, type: 'content' | 'quiz' | 'assessment') => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return { ...c, modules: c.modules.map(m => {
        if (m.id !== moduleId) return m;
        return { ...m, lessons: m.lessons.map(l => {
          if (l.id !== lessonId) return l;
          const newPage: Page = { id: uuidv4(), title, type, order: l.pages.length + 1, blocks: [], quizSettings: type !== 'content' ? { passingScore: 80, maxAttempts: 3, randomize: false, showFeedback: true } : undefined };
          return { ...l, pages: [...l.pages, newPage] };
        }) };
      }), updatedAt: new Date().toISOString() };
    }));
  }, []);

  const addBlock = useCallback((courseId: string, moduleId: string, lessonId: string, pageId: string, type: BlockType, content: Record<string, any>) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return { ...c, modules: c.modules.map(m => {
        if (m.id !== moduleId) return m;
        return { ...m, lessons: m.lessons.map(l => {
          if (l.id !== lessonId) return l;
          return { ...l, pages: l.pages.map(p => {
            if (p.id !== pageId) return p;
            const newBlock: ContentBlock = { id: uuidv4(), type, content, order: p.blocks.length + 1 };
            return { ...p, blocks: [...p.blocks, newBlock] };
          }) };
        }) };
      }), updatedAt: new Date().toISOString() };
    }));
  }, []);

  const updateBlock = useCallback((courseId: string, moduleId: string, lessonId: string, pageId: string, blockId: string, content: Record<string, any>) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return { ...c, modules: c.modules.map(m => {
        if (m.id !== moduleId) return m;
        return { ...m, lessons: m.lessons.map(l => {
          if (l.id !== lessonId) return l;
          return { ...l, pages: l.pages.map(p => {
            if (p.id !== pageId) return p;
            return { ...p, blocks: p.blocks.map(b => b.id === blockId ? { ...b, content } : b) };
          }) };
        }) };
      }), updatedAt: new Date().toISOString() };
    }));
  }, []);

  const deleteBlock = useCallback((courseId: string, moduleId: string, lessonId: string, pageId: string, blockId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return { ...c, modules: c.modules.map(m => {
        if (m.id !== moduleId) return m;
        return { ...m, lessons: m.lessons.map(l => {
          if (l.id !== lessonId) return l;
          return { ...l, pages: l.pages.map(p => {
            if (p.id !== pageId) return p;
            return { ...p, blocks: p.blocks.filter(b => b.id !== blockId) };
          }) };
        }) };
      }), updatedAt: new Date().toISOString() };
    }));
  }, []);

  // SCORM Export
  const exportScorm = useCallback((courseId: string): ScormExport => {
    const course = courses.find(c => c.id === courseId);
    const exp: ScormExport = {
      id: uuidv4(), courseId, courseTitle: course?.title || 'Unknown',
      version: course?.version || '1.0', scormVersion: course?.scormVersion || '1.2',
      createdAt: new Date().toISOString(), validationStatus: 'pass', testStatus: 'pass',
      fileSize: Math.floor(Math.random() * 5000000) + 500000,
      fileName: `${course?.title.replace(/\s+/g, '_')}_v${course?.version}_SCORM.zip`
    };
    setExports(prev => [exp, ...prev]);
    addAuditLog('SCORM_EXPORTED', 'course', courseId, `Exported SCORM: ${exp.fileName}`);
    return exp;
  }, [courses, addAuditLog]);

  // Mock LMS
  const launchCourse = useCallback((courseId: string, studentId: string): ScormSession => {
    const course = courses.find(c => c.id === courseId);
    const student = students.find(s => s.id === studentId);
    const session: ScormSession = {
      id: uuidv4(), studentId, studentName: student?.name || 'Unknown',
      courseId, courseTitle: course?.title || 'Unknown',
      startedAt: new Date().toISOString(), status: 'incomplete', score: 0, progress: 0,
      suspendData: '', lessonLocation: '', sessionTime: '00:00:00',
      apiCalls: [{ id: uuidv4(), timestamp: new Date().toISOString(), method: 'LMSInitialize', argument: '""', result: 'true' }]
    };
    setSessions(prev => [...prev, session]);
    return session;
  }, [courses, students]);

  const simulateApiCall = useCallback((sessionId: string, method: string, argument: string): ScormApiCall => {
    const call: ScormApiCall = { id: uuidv4(), timestamp: new Date().toISOString(), method, argument, result: 'true' };
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, apiCalls: [...s.apiCalls, call] } : s));
    return call;
  }, []);

  const completeSession = useCallback((sessionId: string, score: number, status: CompletionStatus) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? {
      ...s, score, status, progress: 100, completedAt: new Date().toISOString(),
      apiCalls: [...s.apiCalls,
        { id: uuidv4(), timestamp: new Date().toISOString(), method: 'LMSSetValue', argument: `"cmi.core.score.raw", "${score}"`, result: 'true' },
        { id: uuidv4(), timestamp: new Date().toISOString(), method: 'LMSSetValue', argument: `"cmi.core.lesson_status", "${status}"`, result: 'true' },
        { id: uuidv4(), timestamp: new Date().toISOString(), method: 'LMSCommit', argument: '""', result: 'true' },
        { id: uuidv4(), timestamp: new Date().toISOString(), method: 'LMSFinish', argument: '""', result: 'true' },
      ]
    } : s));
  }, []);

  // AI
  const testAIConnection = useCallback((providerId: string): boolean => {
    setAiProviders(prev => prev.map(p => p.id === providerId ? { ...p, connected: true } : p));
    return true;
  }, []);

  const generateAIContent = useCallback((prompt: string): string => {
    // Simulated AI response
    const responses: Record<string, string> = {
      'course': JSON.stringify({
        title: 'Generated Course',
        modules: [
          { title: 'Introduction', lessons: [{ title: 'Overview', pages: ['Welcome', 'Objectives'] }] },
          { title: 'Core Concepts', lessons: [{ title: 'Key Principles', pages: ['Theory', 'Practice'] }] },
          { title: 'Assessment', lessons: [{ title: 'Final Quiz', pages: ['Knowledge Check'] }] },
        ]
      }),
      'quiz': JSON.stringify({
        questions: [
          { text: 'What is the primary purpose of safety training?', options: ['Reduce costs', 'Protect employees', 'Increase speed', 'Meet deadlines'], correct: 'Protect employees' },
          { text: 'When should PPE be worn?', options: ['Only when supervised', 'At all times in hazardous areas', 'Only during inspections', 'Never'], correct: 'At all times in hazardous areas' },
        ]
      }),
      'content': 'This is AI-generated content that provides a comprehensive overview of the topic. It includes key concepts, practical examples, and actionable insights that learners can apply in their daily work. The content is structured for maximum engagement and retention.',
    };
    return responses[prompt] || responses['content'];
  }, []);

  // System Health
  const getSystemHealth = useCallback((): SystemHealth => ({
    application: 'healthy', database: 'healthy', storage: 'healthy',
    ai: aiProviders.some(p => p.connected) ? 'healthy' : 'degraded',
    ollama: 'degraded', diskUsage: 42, memoryUsage: 58, cpuUsage: 23,
    lastBackup: new Date(Date.now() - 3600000).toISOString(), version: '1.0.0'
  }), [aiProviders]);

  return {
    currentUser, login, logout,
    courses, createCourse, updateCourse, deleteCourse, updateCourseStatus,
    addModule, addLesson, addPage, addBlock, updateBlock, deleteBlock,
    themes, setThemes,
    exports, exportScorm,
    sessions, launchCourse, simulateApiCall, completeSession,
    students, setStudents,
    aiProviders, setAiProviders, testAIConnection, generateAIContent,
    auditLogs, addAuditLog,
    reviews, setReviews,
    getSystemHealth,
  };
}

export type Store = ReturnType<typeof useStore>;
