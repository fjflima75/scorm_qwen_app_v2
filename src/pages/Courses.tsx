import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, BookOpen, Trash2, Edit, Eye, Package } from 'lucide-react';
import type { Store } from '../store';
import type { ScormVersion, WorkflowStatus } from '../types';

interface Props { store: Store; }

export default function Courses({ store }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', scormVersion: '1.2' as ScormVersion, passingScore: 80, estimatedDuration: 30 });

  const filtered = store.courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    if (!newCourse.title.trim()) return;
    const course = store.createCourse(newCourse);
    setShowCreate(false);
    setNewCourse({ title: '', description: '', scormVersion: '1.2', passingScore: 80, estimatedDuration: 30 });
    navigate(`/courses/${course.id}/edit`);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your e-learning courses</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(course => (
          <div key={course.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{course.title}</h3>
                    <p className="text-xs text-gray-500">v{course.version} · {course.language.toUpperCase()}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[course.status]}`}>
                  {course.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{course.description}</p>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span>{course.modules.length} modules</span>
                <span>·</span>
                <span>{course.estimatedDuration} min</span>
                <span>·</span>
                <span>SCORM {course.scormVersion}</span>
              </div>
              {course.qualityScore && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${course.qualityScore}%` }} />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{course.qualityScore}%</span>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{new Date(course.updatedAt).toLocaleDateString()}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => navigate(`/courses/${course.id}/edit`)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition-colors" title="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => navigate(`/courses/${course.id}/preview`)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-green-600 transition-colors" title="Preview">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => { store.exportScorm(course.id); }} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-purple-600 transition-colors" title="Export SCORM">
                  <Package className="w-4 h-4" />
                </button>
                <button onClick={() => store.deleteCourse(course.id)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 mt-4">No courses found</p>
          <button onClick={() => setShowCreate(true)} className="mt-4 text-blue-600 text-sm font-medium hover:underline">
            Create your first course
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900">Create New Course</h2>
            <p className="text-sm text-gray-500 mt-1">Set up the basic information for your course</p>
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={e => setNewCourse(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Workplace Safety Training"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={e => setNewCourse(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Brief description of the course..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SCORM Version</label>
                  <select
                    value={newCourse.scormVersion}
                    onChange={e => setNewCourse(p => ({ ...p, scormVersion: e.target.value as ScormVersion }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="1.2">SCORM 1.2</option>
                    <option value="2004">SCORM 2004</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score</label>
                  <input
                    type="number"
                    value={newCourse.passingScore}
                    onChange={e => setNewCourse(p => ({ ...p, passingScore: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0} max={100}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={newCourse.estimatedDuration}
                  onChange={e => setNewCourse(p => ({ ...p, estimatedDuration: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Create Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
