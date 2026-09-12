import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Plus, Trash2, Edit3, Eye, Package,
  Save, Sparkles, ArrowLeft, FileText,
  Layers, BookOpen, HelpCircle, CheckCircle
} from 'lucide-react';
import type { Store } from '../store';
import type { BlockType, ContentBlock } from '../types';

interface Props { store: Store; }

const blockTypes: { type: BlockType; label: string; icon: string; category: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H', category: 'Content' },
  { type: 'text', label: 'Text', icon: 'T', category: 'Content' },
  { type: 'image', label: 'Image', icon: '🖼', category: 'Content' },
  { type: 'video', label: 'Video', icon: '🎬', category: 'Content' },
  { type: 'callout', label: 'Callout', icon: '💡', category: 'Content' },
  { type: 'accordion', label: 'Accordion', icon: '▼', category: 'Content' },
  { type: 'cards', label: 'Cards', icon: '▦', category: 'Content' },
  { type: 'timeline', label: 'Timeline', icon: '→', category: 'Content' },
  { type: 'quote', label: 'Quote', icon: '"', category: 'Content' },
  { type: 'divider', label: 'Divider', icon: '—', category: 'Content' },
  { type: 'tabs', label: 'Tabs', icon: '⊟', category: 'Content' },
  { type: 'multiple_choice', label: 'Multiple Choice', icon: '○', category: 'Assessment' },
  { type: 'true_false', label: 'True/False', icon: '✓', category: 'Assessment' },
  { type: 'fill_blank', label: 'Fill in Blank', icon: '_', category: 'Assessment' },
  { type: 'knowledge_check', label: 'Knowledge Check', icon: '?', category: 'Assessment' },
];

export default function CourseEditor({ store }: Props) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = store.courses.find(c => c.id === courseId);

  const [selectedPage, setSelectedPage] = useState<{ moduleId: string; lessonId: string; pageId: string } | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [showProperties, setShowProperties] = useState(true);
  const [addingItem, setAddingItem] = useState<{ type: 'module' | 'lesson' | 'page'; parentId?: string } | null>(null);
  const [newItemTitle, setNewItemTitle] = useState('');

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Course not found</p>
        <button onClick={() => navigate('/courses')} className="mt-4 text-blue-600 text-sm">Back to courses</button>
      </div>
    );
  }

  const currentPage = (() => {
    if (!selectedPage) return null;
    for (const m of course.modules) {
      if (m.id === selectedPage.moduleId) {
        for (const l of m.lessons) {
          if (l.id === selectedPage.lessonId) {
            return l.pages.find(p => p.id === selectedPage.pageId) || null;
          }
        }
      }
    }
    return null;
  })();

  const toggleModule = (id: string) => {
    setExpandedModules(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };
  const toggleLesson = (id: string) => {
    setExpandedLessons(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  const handleAddItem = () => {
    if (!newItemTitle.trim() || !addingItem) return;
    if (addingItem.type === 'module') {
      store.addModule(course.id, newItemTitle);
    } else if (addingItem.type === 'lesson' && addingItem.parentId) {
      store.addLesson(course.id, addingItem.parentId, newItemTitle);
    } else if (addingItem.type === 'page' && addingItem.parentId) {
      const [moduleId, lessonId] = addingItem.parentId.split(':');
      store.addPage(course.id, moduleId, lessonId, newItemTitle, 'content');
    }
    setNewItemTitle('');
    setAddingItem(null);
  };

  const handleAddBlock = (type: BlockType) => {
    if (!selectedPage) return;
    const defaultContent: Record<string, any> = {
      heading: { text: 'New Heading', level: 2 },
      text: { text: 'Enter your text here...' },
      image: { src: '', alt: 'Image description', caption: '' },
      video: { src: '', caption: '' },
      callout: { text: 'Important information here', style: 'info' },
      accordion: { items: [{ title: 'Section 1', content: 'Content here' }] },
      cards: { items: [{ title: 'Card 1', description: 'Description' }] },
      timeline: { items: [{ title: 'Step 1', description: 'Description' }] },
      quote: { text: 'Quote text', author: 'Author' },
      divider: {},
      tabs: { tabs: [{ title: 'Tab 1', content: 'Content' }] },
      multiple_choice: { question: 'Question?', options: ['Option A', 'Option B', 'Option C'], correctAnswer: 'Option A', explanation: '' },
      true_false: { question: 'Statement?', correctAnswer: true, explanation: '' },
      fill_blank: { question: 'The answer is ___.', correctAnswer: 'answer', explanation: '' },
      knowledge_check: { question: 'Question?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', explanation: '' },
    };
    store.addBlock(course.id, selectedPage.moduleId, selectedPage.lessonId, selectedPage.pageId, type, defaultContent[type] || {});
    setShowBlockPicker(false);
  };

  const handleGenerateAI = () => {
    if (!selectedPage) return;
    const content = store.generateAIContent('content');
    store.addBlock(course.id, selectedPage.moduleId, selectedPage.lessonId, selectedPage.pageId, 'text', { text: content });
  };

  const renderBlock = (block: ContentBlock) => {
    const isEditing = editingBlock === block.id;
    switch (block.type) {
      case 'heading':
        return <h2 className={`font-bold text-gray-900 ${block.content.level === 1 ? 'text-2xl' : block.content.level === 2 ? 'text-xl' : 'text-lg'}`}>{block.content.text}</h2>;
      case 'text':
        return <p className="text-gray-700 leading-relaxed">{block.content.text}</p>;
      case 'callout':
        return (
          <div className={`p-4 rounded-lg border-l-4 ${block.content.style === 'warning' ? 'bg-yellow-50 border-yellow-400' : block.content.style === 'error' ? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-400'}`}>
            <p className="text-sm text-gray-700">{block.content.text}</p>
          </div>
        );
      case 'accordion':
        return (
          <div className="space-y-2">
            {block.content.items?.map((item: any, i: number) => (
              <div key={i} className="border border-gray-200 rounded-lg">
                <div className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700 flex items-center gap-2">
                  <ChevronDown className="w-4 h-4" /> {item.title}
                </div>
                <div className="px-4 py-3 text-sm text-gray-600">{item.content}</div>
              </div>
            ))}
          </div>
        );
      case 'cards':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {block.content.items?.map((item: any, i: number) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-sm text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        );
      case 'timeline':
        return (
          <div className="space-y-3">
            {block.content.items?.map((item: any, i: number) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{i + 1}</div>
                  {i < (block.content.items?.length || 0) - 1 && <div className="w-0.5 h-8 bg-blue-200" />}
                </div>
                <div className="pb-4">
                  <p className="font-medium text-sm text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'multiple_choice':
      case 'knowledge_check':
        return (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-medium text-sm text-gray-900 mb-3">{block.content.question}</p>
            <div className="space-y-2">
              {block.content.options?.map((opt: string, i: number) => (
                <label key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="radio" name={block.id} className="text-blue-600" /> {opt}
                </label>
              ))}
            </div>
          </div>
        );
      case 'true_false':
        return (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-medium text-sm text-gray-900 mb-3">{block.content.question}</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="radio" name={block.id} /> True</label>
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="radio" name={block.id} /> False</label>
            </div>
          </div>
        );
      case 'quote':
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 py-2 italic text-gray-600">
            <p>"{block.content.text}"</p>
            {block.content.author && <p className="text-sm mt-1 not-italic text-gray-500">— {block.content.author}</p>}
          </blockquote>
        );
      case 'divider':
        return <hr className="border-gray-200 my-4" />;
      case 'image':
        return (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <span className="text-4xl">🖼️</span>
            <p className="text-sm text-gray-500 mt-2">{block.content.alt || 'Image placeholder'}</p>
          </div>
        );
      default:
        return <div className="p-4 bg-gray-50 rounded text-sm text-gray-500">{block.type} block</div>;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-t-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/courses')} className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">{course.title}</h1>
            <p className="text-xs text-gray-500">v{course.version} · {course.status.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleGenerateAI} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Sparkles className="w-3.5 h-3.5" /> AI Generate
          </button>
          <button onClick={() => navigate(`/courses/${course.id}/preview`)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button onClick={() => { store.exportScorm(course.id); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <Package className="w-3.5 h-3.5" /> Export SCORM
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Save className="w-3.5 h-3.5" /> Save
          </button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 border border-t-0 border-gray-200 rounded-b-xl overflow-hidden bg-white">
        {/* Course Tree */}
        <div className="w-64 border-r border-gray-200 overflow-y-auto flex-shrink-0 bg-gray-50/50">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Course Structure</span>
              <button onClick={() => setAddingItem({ type: 'module' })} className="p-1 hover:bg-gray-200 rounded text-gray-500">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {addingItem?.type === 'module' && (
              <div className="mb-3 p-2 bg-white rounded-lg border border-blue-200">
                <input
                  type="text" autoFocus value={newItemTitle}
                  onChange={e => setNewItemTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddItem()}
                  placeholder="Module title..."
                  className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex gap-1 mt-2">
                  <button onClick={handleAddItem} className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Add</button>
                  <button onClick={() => { setAddingItem(null); setNewItemTitle(''); }} className="px-2 py-1 text-xs text-gray-500">Cancel</button>
                </div>
              </div>
            )}

            {course.modules.map(module => (
              <div key={module.id} className="mb-1">
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleModule(module.id)} className="p-1 hover:bg-gray-200 rounded text-gray-400">
                    {expandedModules.has(module.id) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  <div className="flex items-center gap-1.5 flex-1 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer">
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-medium text-gray-700 truncate">{module.title}</span>
                  </div>
                  <button onClick={() => setAddingItem({ type: 'lesson', parentId: module.id })} className="p-1 hover:bg-gray-200 rounded text-gray-400 opacity-0 group-hover:opacity-100">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {expandedModules.has(module.id) && (
                  <div className="ml-5 mt-1 space-y-0.5">
                    {module.lessons.map(lesson => (
                      <div key={lesson.id}>
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleLesson(lesson.id)} className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                            {expandedLessons.has(lesson.id) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>
                          <div className="flex items-center gap-1.5 flex-1 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                            <BookOpen className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-600 truncate">{lesson.title}</span>
                          </div>
                          <button onClick={() => setAddingItem({ type: 'page', parentId: `${module.id}:${lesson.id}` })} className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {(addingItem?.type === 'page' && addingItem.parentId === `${module.id}:${lesson.id}`) && (
                          <div className="ml-5 mt-1 p-2 bg-white rounded border border-blue-200">
                            <input
                              type="text" autoFocus value={newItemTitle}
                              onChange={e => setNewItemTitle(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleAddItem()}
                              placeholder="Page title..."
                              className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="flex gap-1 mt-1">
                              <button onClick={handleAddItem} className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded">Add</button>
                              <button onClick={() => { setAddingItem(null); setNewItemTitle(''); }} className="px-2 py-0.5 text-xs text-gray-500">Cancel</button>
                            </div>
                          </div>
                        )}

                        {expandedLessons.has(lesson.id) && (
                          <div className="ml-8 mt-0.5 space-y-0.5">
                            {lesson.pages.map(page => (
                              <button
                                key={page.id}
                                onClick={() => setSelectedPage({ moduleId: module.id, lessonId: lesson.id, pageId: page.id })}
                                className={`w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition-colors ${
                                  selectedPage?.pageId === page.id ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-600'
                                }`}
                              >
                                {page.type === 'quiz' ? <HelpCircle className="w-3 h-3" /> : page.type === 'assessment' ? <CheckCircle className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                <span className="text-xs truncate">{page.title}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {addingItem?.type === 'lesson' && addingItem.parentId === module.id && (
                  <div className="ml-8 mt-1 p-2 bg-white rounded border border-blue-200">
                    <input
                      type="text" autoFocus value={newItemTitle}
                      onChange={e => setNewItemTitle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddItem()}
                      placeholder="Lesson title..."
                      className="w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="flex gap-1 mt-1">
                      <button onClick={handleAddItem} className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded">Add</button>
                      <button onClick={() => { setAddingItem(null); setNewItemTitle(''); }} className="px-2 py-0.5 text-xs text-gray-500">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Canvas */}
        <div className="flex-1 overflow-y-auto">
          {currentPage ? (
            <div className="max-w-3xl mx-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{currentPage.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">{currentPage.type} · {currentPage.blocks.length} blocks</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    currentPage.type === 'content' ? 'bg-blue-50 text-blue-700' :
                    currentPage.type === 'quiz' ? 'bg-yellow-50 text-yellow-700' : 'bg-purple-50 text-purple-700'
                  }`}>{currentPage.type}</span>
                </div>
              </div>

              {/* Blocks */}
              <div className="space-y-4">
                {currentPage.blocks.sort((a, b) => a.order - b.order).map(block => (
                  <div key={block.id} className="group relative">
                    <div className={`p-4 rounded-lg border transition-all ${
                      editingBlock === block.id ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-gray-400 font-mono">{block.type}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingBlock(editingBlock === block.id ? null : block.id)} className="p-1 hover:bg-gray-200 rounded text-gray-500">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => selectedPage && store.deleteBlock(course.id, selectedPage.moduleId, selectedPage.lessonId, selectedPage.pageId, block.id)} className="p-1 hover:bg-red-100 rounded text-gray-500 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {renderBlock(block)}
                    </div>
                    {editingBlock === block.id && (
                      <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">Content</label>
                        {block.type === 'heading' && (
                          <div className="space-y-2">
                            <input
                              type="text" value={block.content.text}
                              onChange={e => selectedPage && store.updateBlock(course.id, selectedPage.moduleId, selectedPage.lessonId, selectedPage.pageId, block.id, { ...block.content, text: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <select
                              value={block.content.level}
                              onChange={e => selectedPage && store.updateBlock(course.id, selectedPage.moduleId, selectedPage.lessonId, selectedPage.pageId, block.id, { ...block.content, level: parseInt(e.target.value) })}
                              className="px-3 py-2 border border-gray-200 rounded text-sm bg-white"
                            >
                              <option value={1}>H1</option><option value={2}>H2</option><option value={3}>H3</option>
                            </select>
                          </div>
                        )}
                        {block.type === 'text' && (
                          <textarea
                            value={block.content.text}
                            onChange={e => selectedPage && store.updateBlock(course.id, selectedPage.moduleId, selectedPage.lessonId, selectedPage.pageId, block.id, { ...block.content, text: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            rows={4}
                          />
                        )}
                        {(block.type === 'multiple_choice' || block.type === 'knowledge_check') && (
                          <div className="space-y-2">
                            <input
                              type="text" value={block.content.question}
                              onChange={e => selectedPage && store.updateBlock(course.id, selectedPage.moduleId, selectedPage.lessonId, selectedPage.pageId, block.id, { ...block.content, question: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Question..."
                            />
                            {block.content.options?.map((opt: string, i: number) => (
                              <input
                                key={i} type="text" value={opt}
                                onChange={e => {
                                  const newOpts = [...block.content.options];
                                  newOpts[i] = e.target.value;
                                  selectedPage && store.updateBlock(course.id, selectedPage.moduleId, selectedPage.lessonId, selectedPage.pageId, block.id, { ...block.content, options: newOpts });
                                }}
                                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder={`Option ${i + 1}`}
                              />
                            ))}
                            <select
                              value={block.content.correctAnswer}
                              onChange={e => selectedPage && store.updateBlock(course.id, selectedPage.moduleId, selectedPage.lessonId, selectedPage.pageId, block.id, { ...block.content, correctAnswer: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded text-sm bg-white"
                            >
                              {block.content.options?.map((opt: string, i: number) => <option key={i} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        )}
                        <button onClick={() => setEditingBlock(null)} className="mt-2 px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Done</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add block button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowBlockPicker(!showBlockPicker)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Block
                </button>

                {showBlockPicker && (
                  <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Content</span>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {blockTypes.filter(b => b.category === 'Content').map(bt => (
                          <button key={bt.type} onClick={() => handleAddBlock(bt.type)} className="p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-center transition-colors">
                            <span className="text-lg">{bt.icon}</span>
                            <p className="text-xs text-gray-600 mt-1">{bt.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Assessment</span>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {blockTypes.filter(b => b.category === 'Assessment').map(bt => (
                          <button key={bt.type} onClick={() => handleAddBlock(bt.type)} className="p-2 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 text-center transition-colors">
                            <span className="text-lg">{bt.icon}</span>
                            <p className="text-xs text-gray-600 mt-1">{bt.label}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-500 mt-4">Select a page to start editing</p>
                <p className="text-gray-400 text-sm mt-1">Choose from the course tree on the left</p>
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {showProperties && (
          <div className="w-72 border-l border-gray-200 overflow-y-auto flex-shrink-0 bg-gray-50/50">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Course Properties</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">Title</label>
                  <input type="text" value={course.title} readOnly className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm bg-white" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Status</label>
                  <select
                    value={course.status}
                    onChange={e => store.updateCourseStatus(course.id, e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded text-sm bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">SCORM Version</label>
                  <p className="text-sm text-gray-900 mt-1">SCORM {course.scormVersion}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Passing Score</label>
                  <p className="text-sm text-gray-900 mt-1">{course.passingScore}%</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Duration</label>
                  <p className="text-sm text-gray-900 mt-1">{course.estimatedDuration} minutes</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Navigation</label>
                  <p className="text-sm text-gray-900 mt-1">{course.navigationRule}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Resume</label>
                  <p className="text-sm text-gray-900 mt-1">{course.resumeEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <label className="text-xs font-medium text-gray-600">Quality Score</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${course.qualityScore || 0}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{course.qualityScore || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
