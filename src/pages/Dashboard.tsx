import React from 'react';
import { BookOpen, Package, PlayCircle, Brain, TrendingUp, Clock, CheckCircle, AlertTriangle, Users, FileText } from 'lucide-react';
import type { Store } from '../store';

interface Props { store: Store; }

export default function Dashboard({ store }: Props) {
  const stats = [
    { label: 'Total Courses', value: store.courses.length, icon: BookOpen, color: 'bg-blue-500', change: '+2 this week' },
    { label: 'SCORM Exports', value: store.exports.length, icon: Package, color: 'bg-purple-500', change: '+5 this week' },
    { label: 'LMS Sessions', value: store.sessions.length, icon: PlayCircle, color: 'bg-green-500', change: '+12 today' },
    { label: 'AI Requests', value: 47, icon: Brain, color: 'bg-orange-500', change: '+8 today' },
  ];

  const recentCourses = store.courses.slice(0, 5);
  const recentExports = store.exports.slice(0, 5);
  const recentSessions = store.sessions.slice(0, 5);

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    in_review: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-blue-100 text-blue-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {store.currentUser?.fullName}. Here's your platform overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
            <p className="text-xs text-green-600 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Courses</h2>
            <span className="text-xs text-gray-400">{store.courses.length} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentCourses.map(course => (
              <div key={course.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-500">{course.modules.length} modules · v{course.version}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[course.status]}`}>
                  {course.status.replace('_', ' ')}
                </span>
                {course.qualityScore && (
                  <span className="text-xs font-medium text-gray-600">{course.qualityScore}%</span>
                )}
              </div>
            ))}
            {recentCourses.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">No courses yet</div>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">System Health</h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Application', status: 'healthy' },
              { label: 'Database', status: 'healthy' },
              { label: 'Storage', status: 'healthy' },
              { label: 'AI Engine', status: store.aiProviders.some(p => p.connected) ? 'healthy' : 'degraded' },
              { label: 'Ollama', status: 'degraded' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.status === 'healthy' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className={`text-xs font-medium ${item.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Disk Usage</span><span>42%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exports */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent SCORM Exports</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentExports.map(exp => (
              <div key={exp.id} className="flex items-center gap-3 p-4">
                <Package className="w-5 h-5 text-purple-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{exp.fileName}</p>
                  <p className="text-xs text-gray-500">{new Date(exp.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  exp.validationStatus === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {exp.validationStatus.toUpperCase()}
                </span>
              </div>
            ))}
            {recentExports.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">No exports yet</div>
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">LMS Sessions</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recentSessions.map(session => (
              <div key={session.id} className="flex items-center gap-3 p-4">
                <Users className="w-5 h-5 text-green-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{session.studentName}</p>
                  <p className="text-xs text-gray-500">{session.courseTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{session.score}%</p>
                  <p className="text-xs text-gray-500">{session.status}</p>
                </div>
              </div>
            ))}
            {recentSessions.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">No sessions yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg">Quick Actions</h3>
        <p className="text-blue-100 text-sm mt-1">Get started with common tasks</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
            + New Course
          </button>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
            ✨ AI Generate Course
          </button>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
            📦 Export SCORM
          </button>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
            🧪 Test in Mock LMS
          </button>
        </div>
      </div>
    </div>
  );
}
