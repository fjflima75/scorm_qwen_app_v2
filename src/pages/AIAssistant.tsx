import React, { useState } from 'react';
import { Brain, Sparkles, MessageSquare, FileText, HelpCircle, Shield, Settings, CheckCircle, XCircle, Wifi, WifiOff, Send, Bot, User, Zap, RefreshCw } from 'lucide-react';
import type { Store } from '../store';

interface Props { store: Store; }

export default function AIAssistant({ store }: Props) {
  const [activeTab, setActiveTab] = useState<'chat' | 'generate' | 'review' | 'providers'>('chat');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant for course creation. I can help you generate courses, create content, build quizzes, and review your materials. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generateType, setGenerateType] = useState('course');
  const [generateTopic, setGenerateTopic] = useState('');
  const [generateResult, setGenerateResult] = useState('');

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user' as const, content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Based on your topic, I recommend structuring the course into 3 modules: Introduction, Core Concepts, and Practical Application. Each module should include knowledge checks to reinforce learning.',
        'Here\'s a suggested outline for your course:\n\n1. **Introduction** - Overview and objectives\n2. **Fundamentals** - Key concepts and principles\n3. **Application** - Real-world scenarios\n4. **Assessment** - Final knowledge check\n\nWould you like me to generate the full content for any of these sections?',
        'I\'ve analyzed your course content and here are my recommendations:\n\n✅ Strong learning objectives\n✅ Good content structure\n⚠️ Consider adding more interactive elements\n⚠️ Some sections could benefit from real-world examples\n💡 Add a scenario-based assessment for better engagement',
        'Great question! For SCORM compliance, make sure to:\n- Set proper completion criteria\n- Configure scoring thresholds\n- Enable resume functionality\n- Test with the Mock LMS before export',
      ];
      const aiMsg = { role: 'assistant' as const, content: responses[Math.floor(Math.random() * responses.length)] };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const handleGenerate = async () => {
    if (!generateTopic.trim()) return;
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    const result = store.generateAIContent(generateType);
    setGenerateResult(result);
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-500 text-sm mt-1">Generate courses, content, and quizzes with AI</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {([
          { id: 'chat', label: '💬 Chat' },
          { id: 'generate', label: '✨ Generate' },
          { id: 'review', label: '🔍 Review' },
          { id: 'providers', label: '⚙️ Providers' },
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

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                )}
                <div className={`max-w-[70%] p-4 rounded-xl text-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-2 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {['Generate course outline', 'Create quiz questions', 'Improve readability', 'Check SCORM compliance'].map(action => (
                <button
                  key={action}
                  onClick={() => { setChatInput(action); }}
                  className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AI anything about your course..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Generate Content</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                <select
                  value={generateType}
                  onChange={e => setGenerateType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="course">Full Course</option>
                  <option value="quiz">Quiz Questions</option>
                  <option value="content">Page Content</option>
                  <option value="objectives">Learning Objectives</option>
                  <option value="scenario">Scenario</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Topic / Instructions</label>
                <textarea
                  value={generateTopic}
                  onChange={e => setGenerateTopic(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Describe what you want to generate..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Tone</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Academic</option>
                    <option>Friendly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Language</label>
                  <select className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white">
                    <option>English</option>
                    <option>Portuguese</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating || !generateTopic.trim()}
                className="w-full py-3 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate with AI
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Generated Output</h3>
            {generateResult ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono overflow-auto max-h-96">
                  {JSON.stringify(JSON.parse(generateResult), null, 2)}
                </pre>
                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">Apply to Course</button>
                  <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300">Copy</button>
                  <button className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300">Regenerate</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto text-gray-300" />
                  <p className="mt-3 text-sm">Generated content will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Tab */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">AI Course Review</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quality Analysis</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Learning Objectives', score: 92, status: 'good' },
                    { label: 'Content Structure', score: 88, status: 'good' },
                    { label: 'Readability', score: 76, status: 'warning' },
                    { label: 'Engagement', score: 81, status: 'good' },
                    { label: 'Assessment Quality', score: 85, status: 'good' },
                    { label: 'Accessibility', score: 72, status: 'warning' },
                    { label: 'SCORM Compliance', score: 95, status: 'good' },
                    { label: 'Consistency', score: 90, status: 'good' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-40">{item.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${item.score}%` }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-8">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recommendations</h4>
                <div className="space-y-3">
                  {[
                    { type: 'warning', text: 'Some text blocks exceed recommended reading level. Consider simplifying language for broader accessibility.' },
                    { type: 'info', text: 'Add more interactive elements (quizzes, scenarios) to improve engagement scores.' },
                    { type: 'success', text: 'Course structure follows best practices for SCORM delivery.' },
                    { type: 'warning', text: 'Images are missing alt text descriptions. Add for WCAG compliance.' },
                    { type: 'info', text: 'Consider adding a course summary at the end of each module.' },
                  ].map((rec, i) => (
                    <div key={i} className={`p-3 rounded-lg text-sm ${
                      rec.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                      rec.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                      'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {rec.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Overall Quality Score</p>
                  <p className="text-sm text-gray-600">Based on AI analysis of your course</p>
                </div>
                <div className="text-3xl font-bold text-purple-600">87<span className="text-lg text-gray-400">/100</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          {store.aiProviders.map(provider => (
            <div key={provider.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${provider.connected ? 'bg-green-50' : 'bg-gray-100'}`}>
                    <Brain className={`w-5 h-5 ${provider.connected ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                    <p className="text-xs text-gray-500">{provider.type === 'ollama' ? 'Local AI (Ollama)' : 'OpenAI Compatible API'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {provider.connected ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <Wifi className="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                      <WifiOff className="w-3 h-3" /> Disconnected
                    </span>
                  )}
                  <button
                    onClick={() => store.testAIConnection(provider.id)}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                  >
                    Test Connection
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">Base URL</label>
                  <p className="text-sm text-gray-900 mt-1 font-mono">{provider.baseUrl || 'Not configured'}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Model</label>
                  <p className="text-sm text-gray-900 mt-1">{provider.model}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Temperature</label>
                  <p className="text-sm text-gray-900 mt-1">{provider.temperature}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Max Tokens</label>
                  <p className="text-sm text-gray-900 mt-1">{provider.maxTokens}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
            <h3 className="font-semibold text-gray-900">Privacy Settings</h3>
            <p className="text-sm text-gray-600 mt-1">Control how AI processes your data</p>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="privacy" defaultChecked className="text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Local Only</p>
                  <p className="text-xs text-gray-500">Only use local Ollama models. No data leaves your machine.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="privacy" className="text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">External AI Allowed</p>
                  <p className="text-xs text-gray-500">Allow sending data to external AI providers.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="privacy" className="text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">External AI Restricted</p>
                  <p className="text-xs text-gray-500">External AI with automatic sensitive data redaction.</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
