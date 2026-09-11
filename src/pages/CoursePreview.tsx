import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, BookOpen, CheckCircle, Play, Pause, Home, Menu, X, Maximize2 } from 'lucide-react';
import type { Store } from '../store';
import type { ContentBlock } from '../types';

interface Props { store: Store; }

export default function CoursePreview({ store }: Props) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = store.courses.find(c => c.id === courseId);

  // Flatten all pages for navigation
  const allPages: { moduleId: string; moduleTitle: string; lessonId: string; lessonTitle: string; page: any }[] = [];
  if (course) {
    for (const m of course.modules) {
      for (const l of m.lessons) {
        for (const p of l.pages) {
          allPages.push({ moduleId: m.id, moduleTitle: m.title, lessonId: l.id, lessonTitle: l.title, page: p });
        }
      }
    }
  }

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  if (!course || allPages.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Course not found or has no content</p>
        <button onClick={() => navigate('/courses')} className="mt-4 text-blue-600 text-sm">Back to courses</button>
      </div>
    );
  }

  const current = allPages[currentPageIndex];
  const progress = ((currentPageIndex + 1) / allPages.length) * 100;

  const theme = store.themes.find(t => t.id === course.themeId) || store.themes[0];

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        return <h2 className={`font-bold text-gray-900 ${block.content.level === 1 ? 'text-3xl' : block.content.level === 2 ? 'text-2xl' : 'text-xl'} mb-4`}>{block.content.text}</h2>;
      case 'text':
        return <p className="text-gray-700 leading-relaxed mb-4">{block.content.text}</p>;
      case 'callout':
        return (
          <div className={`p-5 rounded-lg border-l-4 mb-4 ${block.content.style === 'warning' ? 'bg-yellow-50 border-yellow-400' : block.content.style === 'error' ? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-400'}`}>
            <p className="text-sm text-gray-700">{block.content.text}</p>
          </div>
        );
      case 'accordion':
        return (
          <div className="space-y-2 mb-4">
            {block.content.items?.map((item: any, i: number) => (
              <details key={i} className="border border-gray-200 rounded-lg group">
                <summary className="px-4 py-3 bg-gray-50 font-medium text-sm text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">{item.title}</summary>
                <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200">{item.content}</div>
              </details>
            ))}
          </div>
        );
      case 'cards':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {block.content.items?.map((item: any, i: number) => (
              <div key={i} className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        );
      case 'timeline':
        return (
          <div className="space-y-4 mb-4">
            {block.content.items?.map((item: any, i: number) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: theme.primaryColor }}>{i + 1}</div>
                  {i < (block.content.items?.length || 0) - 1 && <div className="w-0.5 flex-1 min-h-[2rem]" style={{ backgroundColor: theme.secondaryColor + '40' }} />}
                </div>
                <div className="pb-4">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'quote':
        return (
          <blockquote className="border-l-4 border-gray-300 pl-5 py-3 mb-4 italic">
            <p className="text-gray-600 text-lg">"{block.content.text}"</p>
            {block.content.author && <p className="text-sm mt-2 not-italic text-gray-500">— {block.content.author}</p>}
          </blockquote>
        );
      case 'multiple_choice':
      case 'knowledge_check':
        return (
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 mb-4">
            <p className="font-semibold text-gray-900 mb-4">{block.content.question}</p>
            <div className="space-y-2">
              {block.content.options?.map((opt: string, i: number) => (
                <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  answers[block.id] === opt ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio" name={block.id} value={opt}
                    checked={answers[block.id] === opt}
                    onChange={() => setAnswers(prev => ({ ...prev, [block.id]: opt }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
            {showResults && answers[block.id] && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                answers[block.id] === block.content.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {answers[block.id] === block.content.correctAnswer ? '✓ Correct!' : '✗ Incorrect.'} {block.content.explanation}
              </div>
            )}
          </div>
        );
      case 'true_false':
        return (
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 mb-4">
            <p className="font-semibold text-gray-900 mb-4">{block.content.question}</p>
            <div className="flex gap-4">
              {['True', 'False'].map(val => (
                <label key={val} className={`flex items-center gap-2 p-3 px-6 rounded-lg border cursor-pointer transition-colors ${
                  answers[block.id] === val ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio" name={block.id} value={val}
                    checked={answers[block.id] === val}
                    onChange={() => setAnswers(prev => ({ ...prev, [block.id]: val }))}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{val}</span>
                </label>
              ))}
            </div>
            {showResults && answers[block.id] && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                (answers[block.id] === 'True') === block.content.correctAnswer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {(answers[block.id] === 'True') === block.content.correctAnswer ? '✓ Correct!' : '✗ Incorrect.'} {block.content.explanation}
              </div>
            )}
          </div>
        );
      case 'divider':
        return <hr className="border-gray-200 my-6" />;
      case 'image':
        return (
          <div className="bg-gray-100 rounded-xl p-12 text-center mb-4">
            <span className="text-5xl">🖼️</span>
            <p className="text-sm text-gray-500 mt-3">{block.content.alt || 'Image'}</p>
          </div>
        );
      default:
        return <div className="p-4 bg-gray-50 rounded text-sm text-gray-500 mb-4">{block.type} block</div>;
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col bg-gray-100">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <button onClick={() => navigate(`/courses/${course.id}/edit`)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-gray-900 text-sm truncate">{course.title}</h1>
          <p className="text-xs text-gray-500">{current.moduleTitle} → {current.lessonTitle} → {current.page.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">{currentPageIndex + 1} / {allPages.length}</span>
          <div className="w-32 bg-gray-200 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: theme.primaryColor }} />
          </div>
          <button onClick={() => setShowResults(!showResults)} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded text-xs font-medium hover:bg-purple-100">
            {showResults ? 'Hide' : 'Show'} Answers
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Course Navigation */}
        {showSidebar && (
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase">Contents</span>
                <button onClick={() => setShowSidebar(false)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {course.modules.map(module => (
                <div key={module.id} className="mb-3">
                  <p className="text-xs font-bold text-gray-700 px-2 py-1">{module.title}</p>
                  {module.lessons.map(lesson => (
                    <div key={lesson.id} className="ml-2">
                      <p className="text-xs text-gray-500 px-2 py-0.5">{lesson.title}</p>
                      {lesson.pages.map(page => {
                        const idx = allPages.findIndex(p => p.page.id === page.id);
                        const isCurrent = idx === currentPageIndex;
                        const isPast = idx < currentPageIndex;
                        return (
                          <button
                            key={page.id}
                            onClick={() => setCurrentPageIndex(idx)}
                            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors flex items-center gap-2 ${
                              isCurrent ? 'bg-blue-50 text-blue-700 font-medium' : isPast ? 'text-gray-500' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {isPast ? <CheckCircle className="w-3 h-3 text-green-500" /> : <BookOpen className="w-3 h-3" />}
                            <span className="truncate">{page.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-8">
            {/* Page header */}
            <div className="mb-6">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                {current.moduleTitle} · {current.lessonTitle}
              </p>
              <h1 className="text-2xl font-bold text-gray-900">{current.page.title}</h1>
              {current.page.type !== 'content' && (
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                  current.page.type === 'quiz' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {current.page.type === 'quiz' ? '📝 Knowledge Check' : '🎓 Assessment'}
                </span>
              )}
            </div>

            {/* Blocks */}
            <div className="space-y-2">
              {current.page.blocks.sort((a: ContentBlock, b: ContentBlock) => a.order - b.order).map((block: ContentBlock) => (
                <div key={block.id}>{renderBlock(block)}</div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentPageIndex(Math.max(0, currentPageIndex - 1))}
                disabled={currentPageIndex === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-sm text-gray-400">Page {currentPageIndex + 1} of {allPages.length}</span>
              <button
                onClick={() => setCurrentPageIndex(Math.min(allPages.length - 1, currentPageIndex + 1))}
                disabled={currentPageIndex === allPages.length - 1}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ backgroundColor: theme.primaryColor }}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
