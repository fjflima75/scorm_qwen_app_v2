import React, { useState, useRef } from 'react';
import { Play, Square, Upload, Users, BookOpen, Activity, Terminal, Bug, CheckCircle, XCircle, Clock, AlertTriangle, Zap, RotateCcw } from 'lucide-react';
import type { Store } from '../store';
import type { CompletionStatus } from '../types';

interface Props { store: Store; }

export default function MockLMS({ store }: Props) {
  const [activeTab, setActiveTab] = useState<'launch' | 'students' | 'sessions' | 'debugger' | 'scenarios'>('launch');
  const [selectedCourse, setSelectedCourse] = useState(store.courses[0]?.id || '');
  const [selectedStudent, setSelectedStudent] = useState(store.students[0]?.id || '');
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<{ timestamp: string; method: string; args: string; result: string; type: 'success' | 'error' | 'info' }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [scenarioRunning, setScenarioRunning] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const handleLaunch = () => {
    if (!selectedCourse || !selectedStudent) return;
    const session = store.launchCourse(selectedCourse, selectedStudent);
    setActiveSession(session.id);
    setDebugLog([{
      timestamp: new Date().toISOString(),
      method: 'LMSInitialize',
      args: '""',
      result: 'true',
      type: 'success'
    }]);
    setActiveTab('debugger');
  };

  const simulateCall = (method: string, args: string) => {
    if (!activeSession) return;
    const result = method.includes('Get') ? '"value"' : 'true';
    const entry = { timestamp: new Date().toISOString(), method, args, result, type: 'success' as const };
    setDebugLog(prev => [...prev, entry]);
    store.simulateApiCall(activeSession, method, args);
    setTimeout(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, 100);
  };

  const runScenario = async (scenario: string) => {
    if (!activeSession) return;
    setScenarioRunning(scenario);
    setIsRunning(true);

    const scenarios: Record<string, (() => void)[]> = {
      'new_student': [
        () => simulateCall('LMSInitialize', '""'),
        () => simulateCall('LMSGetValue', '"cmi.core.student_id"'),
        () => simulateCall('LMSGetValue', '"cmi.core.student_name"'),
        () => simulateCall('LMSGetValue', '"cmi.core.lesson_status"'),
        () => simulateCall('LMSSetValue', '"cmi.core.lesson_location", "1"'),
        () => simulateCall('LMSCommit', '""'),
        () => simulateCall('LMSFinish', '""'),
      ],
      'pass_course': [
        () => simulateCall('LMSInitialize', '""'),
        () => simulateCall('LMSSetValue', '"cmi.core.score.raw", "92"'),
        () => simulateCall('LMSSetValue', '"cmi.core.score.min", "0"'),
        () => simulateCall('LMSSetValue', '"cmi.core.score.max", "100"'),
        () => simulateCall('LMSSetValue', '"cmi.core.lesson_status", "passed"'),
        () => simulateCall('LMSCommit', '""'),
        () => simulateCall('LMSFinish', '""'),
      ],
      'fail_course': [
        () => simulateCall('LMSInitialize', '""'),
        () => simulateCall('LMSSetValue', '"cmi.core.score.raw", "45"'),
        () => simulateCall('LMSSetValue', '"cmi.core.lesson_status", "failed"'),
        () => simulateCall('LMSCommit', '""'),
        () => simulateCall('LMSFinish', '""'),
      ],
      'resume': [
        () => simulateCall('LMSInitialize', '""'),
        () => simulateCall('LMSGetValue', '"cmi.core.lesson_location"'),
        () => simulateCall('LMSGetValue', '"cmi.suspend_data"'),
        () => simulateCall('LMSSetValue', '"cmi.core.lesson_location", "3"'),
        () => simulateCall('LMSSetValue', '"cmi.suspend_data", "page=3&module=2&time=420"'),
        () => simulateCall('LMSCommit', '""'),
        () => simulateCall('LMSFinish', '""'),
      ],
      'multiple_attempts': [
        () => simulateCall('LMSInitialize', '""'),
        () => simulateCall('LMSSetValue', '"cmi.core.score.raw", "60"'),
        () => simulateCall('LMSSetValue', '"cmi.core.lesson_status", "failed"'),
        () => simulateCall('LMSCommit', '""'),
        () => simulateCall('LMSFinish', '""'),
        () => simulateCall('LMSInitialize', '""'),
        () => simulateCall('LMSSetValue', '"cmi.core.score.raw", "75"'),
        () => simulateCall('LMSSetValue', '"cmi.core.lesson_status", "failed"'),
        () => simulateCall('LMSCommit', '""'),
        () => simulateCall('LMSFinish', '""'),
        () => simulateCall('LMSInitialize', '""'),
        () => simulateCall('LMSSetValue', '"cmi.core.score.raw", "88"'),
        () => simulateCall('LMSSetValue', '"cmi.core.lesson_status", "passed"'),
        () => simulateCall('LMSCommit', '""'),
        () => simulateCall('LMSFinish', '""'),
      ],
    };

    const steps = scenarios[scenario] || [];
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 500));
      step();
    }
    setIsRunning(false);
    setScenarioRunning(null);
  };

  const scenarios = [
    { id: 'new_student', name: 'New Student', description: 'First-time course access', icon: '🆕' },
    { id: 'resume', name: 'Resume Course', description: 'Continue from suspend point', icon: '▶️' },
    { id: 'pass_course', name: 'Pass Course', description: 'Complete with passing score', icon: '✅' },
    { id: 'fail_course', name: 'Fail Course', description: 'Complete below passing score', icon: '❌' },
    { id: 'multiple_attempts', name: 'Multiple Attempts', description: 'Retry until passing', icon: '🔄' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mock LMS</h1>
        <p className="text-gray-500 text-sm mt-1">Test SCORM packages in a simulated LMS environment</p>
      </div>

      {/* Launch Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Course</label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {store.courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Student</label>
              <select
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {store.students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={handleLaunch}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors shadow-sm"
          >
            <Play className="w-4 h-4" /> Launch Course
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {([
          { id: 'launch', label: '📋 Dashboard' },
          { id: 'students', label: '👥 Students' },
          { id: 'sessions', label: '📊 Sessions' },
          { id: 'debugger', label: '🐛 Debugger' },
          { id: 'scenarios', label: '🧪 Scenarios' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'launch' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{store.courses.length}</p>
                <p className="text-xs text-gray-500">Available Courses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{store.students.length}</p>
                <p className="text-xs text-gray-500">Test Students</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{store.sessions.length}</p>
                <p className="text-xs text-gray-500">Total Sessions</p>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="md:col-span-3 bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Sessions</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {store.sessions.slice(-10).reverse().map(session => (
                <div key={session.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    session.status === 'passed' ? 'bg-green-100 text-green-700' :
                    session.status === 'failed' ? 'bg-red-100 text-red-700' :
                    session.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {session.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{session.studentName}</p>
                    <p className="text-xs text-gray-500">{session.courseTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{session.score}%</p>
                    <p className="text-xs text-gray-500">{session.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{session.apiCalls.length} API calls</p>
                    <p className="text-xs text-gray-400">{new Date(session.startedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {store.sessions.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">No sessions yet. Launch a course to begin.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Test Students</h3>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">+ Add Student</button>
          </div>
          <div className="divide-y divide-gray-50">
            {store.students.map(student => (
              <div key={student.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{student.sessions.length} sessions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Session History</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {store.sessions.map(session => (
              <div key={session.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{session.studentName} → {session.courseTitle}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Started: {new Date(session.startedAt).toLocaleString()}
                      {session.completedAt && ` · Completed: ${new Date(session.completedAt).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">Score: <strong>{session.score}%</strong></span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      session.status === 'passed' ? 'bg-green-100 text-green-700' :
                      session.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{session.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {store.sessions.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">No sessions recorded</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'debugger' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">SCORM API Debugger</h3>
              {activeSession && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Active Session</span>}
            </div>
            <button onClick={() => setDebugLog([])} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-medium text-gray-500 mb-2">Quick API Calls</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => simulateCall('LMSInitialize', '""')} className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono hover:bg-blue-50 hover:border-blue-200 transition-colors">LMSInitialize()</button>
              <button onClick={() => simulateCall('LMSGetValue', '"cmi.core.student_name"')} className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono hover:bg-blue-50 hover:border-blue-200 transition-colors">GetValue(student_name)</button>
              <button onClick={() => simulateCall('LMSSetValue', '"cmi.core.score.raw", "85"')} className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono hover:bg-blue-50 hover:border-blue-200 transition-colors">SetValue(score, 85)</button>
              <button onClick={() => simulateCall('LMSSetValue', '"cmi.core.lesson_status", "completed"')} className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono hover:bg-blue-50 hover:border-blue-200 transition-colors">SetValue(status, completed)</button>
              <button onClick={() => simulateCall('LMSCommit', '""')} className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono hover:bg-blue-50 hover:border-blue-200 transition-colors">LMSCommit()</button>
              <button onClick={() => simulateCall('LMSFinish', '""')} className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-mono hover:bg-blue-50 hover:border-blue-200 transition-colors">LMSFinish()</button>
            </div>
          </div>

          {/* Debug Log */}
          <div ref={logRef} className="h-96 overflow-y-auto bg-gray-900 p-4 font-mono text-sm">
            {debugLog.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                <p>No API calls recorded.</p>
                <p className="text-xs mt-2">Launch a course or use quick actions to simulate SCORM API calls.</p>
              </div>
            ) : (
              debugLog.map((entry, i) => (
                <div key={i} className="mb-2">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 text-xs mt-0.5">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span className={`${entry.type === 'success' ? 'text-green-400' : entry.type === 'error' ? 'text-red-400' : 'text-blue-400'}`}>
                      {entry.type === 'success' ? '→' : entry.type === 'error' ? '✗' : 'ℹ'}
                    </span>
                    <span className="text-yellow-300">{entry.method}</span>
                    <span className="text-gray-400">({entry.args})</span>
                  </div>
                  <div className="ml-8 text-gray-400">
                    → <span className={entry.type === 'success' ? 'text-green-400' : 'text-red-400'}>{entry.result}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-6 text-xs">
            <span className="text-gray-500">Total Calls: <strong className="text-gray-900">{debugLog.length}</strong></span>
            <span className="text-gray-500">Success: <strong className="text-green-600">{debugLog.filter(d => d.type === 'success').length}</strong></span>
            <span className="text-gray-500">Errors: <strong className="text-red-600">{debugLog.filter(d => d.type === 'error').length}</strong></span>
          </div>
        </div>
      )}

      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-1">Test Scenarios</h3>
            <p className="text-sm text-gray-500">Run automated SCORM test scenarios</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map(scenario => (
              <div key={scenario.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl">{scenario.icon}</span>
                    <h4 className="font-medium text-gray-900 mt-2">{scenario.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{scenario.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => runScenario(scenario.id)}
                  disabled={!activeSession || isRunning}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {scenarioRunning === scenario.id ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" /> Run Scenario
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
