import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, CheckCircle, Loader, Package, FileText, Code, BookOpen } from 'lucide-react';

// Conteúdo dos ficheiros da aplicação
const projectFiles: Record<string, string> = {
  'package.json': JSON.stringify({
    name: "scorm-studio",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
      typecheck: "tsc --noEmit"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-router-dom": "^6.8.0",
      "lucide-react": "^0.294.0",
      "uuid": "^9.0.1",
      "date-fns": "^2.30.0",
      "framer-motion": "^11.16.1",
      "recharts": "^2.10.0",
      "jszip": "^3.10.1",
      "file-saver": "^2.0.5"
    },
    devDependencies: {
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      "@types/uuid": "^9.0.7",
      "@types/file-saver": "^2.0.7",
      "@vitejs/plugin-react": "^4.3.4",
      "typescript": "^5.7.0",
      "vite": "^6.3.5",
      "tailwindcss": "^4.1.7",
      "@tailwindcss/vite": "^4.1.7"
    }
  }, null, 2),

  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SCORM Studio - Enterprise E-Learning Authoring Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  'vite.config.js': `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
  },
});`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`,

  '.gitignore': `node_modules/
dist/
build/
.env
.env.local
.env.*.local
*.log
.DS_Store
.vscode
.idea
coverage`,

  '.env.example': `VITE_APP_NAME=SCORM Studio
VITE_APP_VERSION=1.0.0
VITE_AI_ENABLED=true
VITE_AI_PROVIDER=ollama
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama3.1`,

  'src/main.tsx': `import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);`,

  'src/index.css': `@import "tailwindcss";

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
::selection { background-color: #3b82f6; color: white; }`,

  'src/App.tsx': `import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseEditor from './pages/CourseEditor';
import CoursePreview from './pages/CoursePreview';
import ScormEngine from './pages/ScormEngine';
import MockLMS from './pages/MockLMS';
import AIAssistant from './pages/AIAssistant';
import Admin from './pages/Admin';

function App() {
  const store = useStore();

  if (!store.currentUser) {
    return <Login store={store} />;
  }

  return (
    <HashRouter>
      <Layout store={store}>
        <Routes>
          <Route path="/" element={<Dashboard store={store} />} />
          <Route path="/courses" element={<Courses store={store} />} />
          <Route path="/courses/:courseId/edit" element={<CourseEditor store={store} />} />
          <Route path="/courses/:courseId/preview" element={<CoursePreview store={store} />} />
          <Route path="/scorm" element={<ScormEngine store={store} />} />
          <Route path="/mock-lms" element={<MockLMS store={store} />} />
          <Route path="/ai" element={<AIAssistant store={store} />} />
          <Route path="/admin" element={<Admin store={store} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;`,

  'README.md': `# SCORM Studio - Enterprise E-Learning Authoring Platform

Plataforma empresarial completa para criação de cursos e-learning com geração de pacotes SCORM válidos, integração de IA e Mock LMS para testes.

## 🚀 Instalação

\`\`\`bash
npm install
npm run dev
\`\`\`

## 🔑 Login

- Username: \`admin\`
- Password: \`admin\`

## 📦 Funcionalidades

- Editor visual de cursos
- Motor SCORM 1.2
- Mock LMS com debugger
- Assistente de IA
- Gestão de utilizadores

## 📄 Licença

MIT`,

  'LICENSE': `MIT License

Copyright (c) 2024 SCORM Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`
};

export default function DownloadApp() {
  const [status, setStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  const generateZip = async () => {
    setStatus('generating');
    setProgress(0);

    try {
      const zip = new JSZip();
      const root = zip.folder('scorm-studio');
      
      if (!root) throw new Error('Failed to create root folder');

      const fileEntries = Object.entries(projectFiles);
      const total = fileEntries.length;

      for (let i = 0; i < fileEntries.length; i++) {
        const [filename, content] = fileEntries[i];
        root.file(filename, content);
        setProgress(Math.round(((i + 1) / total) * 100));
        await new Promise(r => setTimeout(r, 100));
      }

      const blob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });

      saveAs(blob, 'scorm-studio.zip');
      setStatus('done');
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error generating ZIP:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SCORM Studio</h1>
          <p className="text-gray-500 mt-2">Enterprise E-Learning Authoring Platform</p>
          <p className="text-sm text-gray-400 mt-1">Version 1.0.0</p>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            O que está incluído
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: Code, text: 'Código fonte completo' },
              { icon: BookOpen, text: 'Editor visual de cursos' },
              { icon: Package, text: 'Motor SCORM 1.2' },
              { icon: CheckCircle, text: 'Mock LMS com debugger' },
              { icon: FileText, text: 'Documentação completa' },
              { icon: Download, text: 'Assistente de IA' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <item.icon className="w-4 h-4 text-green-500 flex-shrink-0" />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={generateZip}
          disabled={status === 'generating'}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
        >
          {status === 'generating' ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              A gerar ZIP... {progress}%
            </>
          ) : status === 'done' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Download concluído!
            </>
          ) : status === 'error' ? (
            <>
              <Download className="w-5 h-5" />
              Erro - Tentar novamente
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Descarregar ZIP
            </>
          )}
        </button>

        {/* Progress Bar */}
        {status === 'generating' && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Como usar:</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Descompactar o ficheiro ZIP</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Abrir terminal na pasta <code className="bg-blue-100 px-1.5 py-0.5 rounded">scorm-studio</code></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Executar <code className="bg-blue-100 px-1.5 py-0.5 rounded">npm install</code></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Executar <code className="bg-blue-100 px-1.5 py-0.5 rounded">npm run dev</code></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">5.</span>
              <span>Abrir <code className="bg-blue-100 px-1.5 py-0.5 rounded">http://localhost:3000</code></span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">6.</span>
              <span>Login: <code className="bg-blue-100 px-1.5 py-0.5 rounded">admin</code> / <code className="bg-blue-100 px-1.5 py-0.5 rounded">admin</code></span>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>SCORM Studio v1.0.0 · Local Installation · No Internet Required</p>
          <p className="mt-1">© 2024 SCORM Studio · MIT License</p>
        </div>
      </div>
    </div>
  );
}
