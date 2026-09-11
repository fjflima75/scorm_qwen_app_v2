import React, { useState } from 'react';
import {
  Users, Shield, FileText, Database, Activity, Settings,
  HardDrive, Clock, Key, Eye, Edit, Trash2, Plus,
  CheckCircle, AlertTriangle, Server, Cpu, MemoryStick,
  BarChart3, BookOpen, Package, Brain, Lock
} from 'lucide-react';
import type { Store } from '../store';

interface Props { store: Store; }

export default function Admin({ store }: Props) {
  const [activeSection, setActiveSection] = useState('overview');

  const health = store.getSystemHealth();

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'system', label: 'System Health', icon: Activity },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'backups', label: 'Backups', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your platform settings and users</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-gray-200 p-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeSection === section.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Users', value: '5', icon: Users, color: 'bg-blue-500' },
                  { label: 'Courses', value: store.courses.length.toString(), icon: BookOpen, color: 'bg-green-500' },
                  { label: 'Exports', value: store.exports.length.toString(), icon: Package, color: 'bg-purple-500' },
                  { label: 'AI Requests', value: '47', icon: Brain, color: 'bg-orange-500' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* System Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Application', status: health.application },
                    { name: 'Database', status: health.database },
                    { name: 'Storage', status: health.storage },
                    { name: 'AI Engine', status: health.ai },
                    { name: 'Ollama', status: health.ollama },
                    { name: 'Version', status: 'v1.0.0' as any },
                  ].map(item => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{item.name}</span>
                      {typeof item.status === 'string' && item.status.startsWith('v') ? (
                        <span className="text-sm font-medium text-gray-900">{item.status}</span>
                      ) : (
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${
                          item.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {item.status === 'healthy' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          {item.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {store.auditLogs.slice(0, 10).map(log => (
                    <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Activity className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{log.details}</p>
                        <p className="text-xs text-gray-400">{log.action} · {new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  {store.auditLogs.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">No activity recorded yet</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Users</h3>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                  <Plus className="w-3.5 h-3.5" /> Add User
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { name: 'Admin User', email: 'admin@company.com', role: 'ADMIN', status: 'active' },
                  { name: 'John Author', email: 'john@company.com', role: 'AUTHOR', status: 'active' },
                  { name: 'Jane Reviewer', email: 'jane@company.com', role: 'REVIEWER', status: 'active' },
                  { name: 'Bob Manager', email: 'bob@company.com', role: 'COURSE_MANAGER', status: 'active' },
                  { name: 'Alice Viewer', email: 'alice@company.com', role: 'VIEWER', status: 'inactive' },
                ].map(user => (
                  <div key={user.email} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">{user.role}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {user.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 hover:bg-red-100 rounded text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'roles' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Roles & Permissions</h3>
                <div className="space-y-4">
                  {[
                    { role: 'ADMIN', permissions: ['All permissions'], color: 'bg-red-100 text-red-700' },
                    { role: 'COURSE_MANAGER', permissions: ['courses.read', 'courses.create', 'courses.update', 'courses.delete', 'courses.publish', 'scorm.export', 'scorm.validate'], color: 'bg-blue-100 text-blue-700' },
                    { role: 'AUTHOR', permissions: ['courses.read', 'courses.create', 'courses.update', 'ai.use', 'scorm.validate'], color: 'bg-green-100 text-green-700' },
                    { role: 'REVIEWER', permissions: ['courses.read', 'courses.update'], color: 'bg-yellow-100 text-yellow-700' },
                    { role: 'VIEWER', permissions: ['courses.read'], color: 'bg-gray-100 text-gray-700' },
                  ].map(item => (
                    <div key={item.role} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.color}`}>{item.role}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.permissions.map(p => (
                          <span key={p} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">{p}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'audit' && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Audit Logs</h3>
                <p className="text-xs text-gray-500 mt-1">Complete record of all system actions</p>
              </div>
              <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                {store.auditLogs.map(log => (
                  <div key={log.id} className="flex items-center gap-4 px-5 py-3">
                    <span className="text-xs text-gray-400 font-mono w-36 flex-shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono flex-shrink-0">{log.action}</span>
                    <span className="text-sm text-gray-700 flex-1">{log.details}</span>
                    <span className="text-xs text-gray-400">{log.ipAddress}</span>
                  </div>
                ))}
                {store.auditLogs.length === 0 && (
                  <div className="p-8 text-center text-gray-400 text-sm">No audit logs recorded yet</div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'system' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-600">Resources</h4>
                    {[
                      { label: 'CPU Usage', value: health.cpuUsage, color: 'bg-blue-500' },
                      { label: 'Memory Usage', value: health.memoryUsage, color: 'bg-purple-500' },
                      { label: 'Disk Usage', value: health.diskUsage, color: 'bg-green-500' },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{item.label}</span><span>{item.value}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-600">Services</h4>
                    {[
                      { name: 'Application', status: health.application },
                      { name: 'Database', status: health.database },
                      { name: 'Storage', status: health.storage },
                      { name: 'AI Engine', status: health.ai },
                      { name: 'Ollama', status: health.ollama },
                    ].map(item => (
                      <div key={item.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <span className={`flex items-center gap-1 text-xs font-medium ${
                          item.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {item.status === 'healthy' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  Last backup: {new Date(health.lastBackup).toLocaleString()} · Version: {health.version}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'storage' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Storage</h3>
              <div className="space-y-4">
                {[
                  { path: 'data/projects/', size: '245 MB', files: 12 },
                  { path: 'data/assets/', size: '1.2 GB', files: 89 },
                  { path: 'data/exports/', size: '89 MB', files: 15 },
                  { path: 'data/backups/', size: '3.4 GB', files: 7 },
                  { path: 'data/logs/', size: '12 MB', files: 45 },
                  { path: 'data/temp/', size: '3 MB', files: 2 },
                ].map(item => (
                  <div key={item.path} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <HardDrive className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-mono text-gray-700 flex-1">{item.path}</span>
                    <span className="text-sm text-gray-500">{item.files} files</span>
                    <span className="text-sm font-medium text-gray-900">{item.size}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Total Storage Used</span>
                    <span className="font-medium">5.0 GB / 50 GB</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'backups' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Backups</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                    <Database className="w-4 h-4" /> Create Backup
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { date: new Date(Date.now() - 3600000).toISOString(), size: '3.4 GB', type: 'Automatic' },
                    { date: new Date(Date.now() - 86400000).toISOString(), size: '3.2 GB', type: 'Automatic' },
                    { date: new Date(Date.now() - 172800000).toISOString(), size: '3.1 GB', type: 'Manual' },
                    { date: new Date(Date.now() - 259200000).toISOString(), size: '2.9 GB', type: 'Automatic' },
                  ].map((backup, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <Database className="w-5 h-5 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{new Date(backup.date).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{backup.type} backup</p>
                      </div>
                      <span className="text-sm text-gray-600">{backup.size}</span>
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200">Restore</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Application Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">General</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Application Name</label>
                        <input type="text" defaultValue="SCORM Studio" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Default Language</label>
                        <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                          <option>English</option><option>Portuguese</option><option>Spanish</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Security</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Session Timeout</span>
                        <select className="px-3 py-1.5 border border-gray-200 rounded text-sm bg-white">
                          <option>30 minutes</option><option>1 hour</option><option>4 hours</option><option>8 hours</option>
                        </select>
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Brute Force Protection</span>
                        <input type="checkbox" defaultChecked className="text-blue-600 rounded" />
                      </label>
                      <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Password Policy (min 8 chars)</span>
                        <input type="checkbox" defaultChecked className="text-blue-600 rounded" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">SCORM</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Default SCORM Version</label>
                        <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                          <option>SCORM 1.2</option><option>SCORM 2004</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Default Passing Score</label>
                        <input type="number" defaultValue={80} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Settings</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
