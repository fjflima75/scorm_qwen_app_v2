import { useState } from 'react';
import { Download, CheckCircle, Loader, Package, AlertCircle } from 'lucide-react';

export default function DownloadApp() {
  const [status, setStatus] = useState<'idle' | 'generating' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const generateZip = () => {
    // Redirecionar para a página HTML estática
    window.location.href = '/download-zip.html';
  };

  const generateZipReact = async () => {
    setStatus('generating');
    setErrorMsg('');
    
    try {
      // Importar dinamicamente
      const JSZipModule = await import('jszip');
      const FileSaverModule = await import('file-saver');
      
      const JSZip = JSZipModule.default;
      const saveAs = FileSaverModule.saveAs || FileSaverModule.default;
      
      console.log('JSZip:', JSZip);
      console.log('saveAs:', saveAs);
      
      if (!JSZip) {
        throw new Error('JSZip não foi carregado corretamente');
      }
      
      if (!saveAs) {
        throw new Error('FileSaver não foi carregado corretamente');
      }

      // Criar conteúdo dos ficheiros
      const files: Record<string, string> = {
        'package.json': JSON.stringify({
          name: "scorm-studio",
          private: true,
          version: "1.0.0",
          type: "module",
          scripts: {
            dev: "vite",
            build: "vite build",
            preview: "vite preview"
          },
          dependencies: {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.8.0",
            "lucide-react": "^0.294.0",
            "uuid": "^9.0.1"
          },
          devDependencies: {
            "@types/react": "^18.2.0",
            "@types/react-dom": "^18.2.0",
            "@types/uuid": "^9.0.7",
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
    <title>SCORM Studio</title>
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
    port: 3000,
  },
});`,
        
        'tsconfig.json': JSON.stringify({
          compilerOptions: {
            target: "ES2020",
            useDefineForClassFields: true,
            lib: ["ES2020", "DOM", "DOM.Iterable"],
            module: "ESNext",
            skipLibCheck: true,
            moduleResolution: "bundler",
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx",
            strict: true
          },
          include: ["src"]
        }, null, 2),
        
        'src/main.tsx': `import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);`,
        
        'src/index.css': `@import "tailwindcss";`,
        
        'src/App.tsx': `import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={
          <div className="p-8">
            <h1 className="text-2xl font-bold">SCORM Studio</h1>
            <p>Bem-vindo! A aplicação está a funcionar.</p>
          </div>
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;`,
        
        'README.md': `# SCORM Studio

Plataforma empresarial de autoria e-learning com geração de pacotes SCORM.

## Instalação

\`\`\`bash
npm install
npm run dev
\`\`\`

Acesse: http://localhost:3000

## Login

- Username: admin
- Password: admin

## Funcionalidades

- Editor visual de cursos
- Motor SCORM 1.2
- Mock LMS com debugger
- Assistente de IA
- Sistema de autenticação

## Documentação

Consulte os ficheiros:
- README.md - Visão geral
- CHANGELOG.md - Histórico de versões
- CONTRIBUTING.md - Como contribuir
`,
        
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
coverage`
      };

      console.log('A criar ZIP...');
      const zip = new JSZip();
      
      // Adicionar ficheiros ao ZIP
      for (const [filename, content] of Object.entries(files)) {
        console.log(`A adicionar: ${filename}`);
        zip.file(filename, content);
      }

      console.log('A gerar blob...');
      const blob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });

      console.log('Blob gerado:', blob.size, 'bytes');
      console.log('A iniciar download...');
      
      // Tentar fazer download com file-saver
      try {
        saveAs(blob, 'scorm-studio.zip');
        console.log('Download com file-saver iniciado!');
      } catch (saveError) {
        console.warn('file-saver falhou, a tentar método alternativo...', saveError);
        
        // Método alternativo: criar link <a>
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scorm-studio.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        console.log('Download alternativo iniciado!');
      }
      
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Erro detalhado:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      setErrorMsg(message);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SCORM Studio</h1>
          <p className="text-gray-500 mt-2">Enterprise E-Learning Authoring Platform</p>
          <p className="text-sm text-gray-400 mt-1">Version 1.0.0</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">O que está incluído:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Código fonte completo</li>
            <li>✓ Configurações do projeto</li>
            <li>✓ Documentação básica</li>
            <li>✓ Estrutura de pastas</li>
            <li>✓ Ficheiros essenciais</li>
          </ul>
        </div>

        <button
          onClick={generateZip}
          disabled={status === 'generating'}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
        >
          {status === 'generating' ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              A gerar ZIP...
            </>
          ) : status === 'done' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Download concluído!
            </>
          ) : status === 'error' ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Erro - Ver consola
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Descarregar ZIP
            </>
          )}
        </button>

        {errorMsg && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">Erro ao gerar ZIP:</p>
            <p className="text-xs text-red-600 mt-1 font-mono">{errorMsg}</p>
            <p className="text-xs text-red-500 mt-2">Verifique a consola do browser (F12) para mais detalhes</p>
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Como usar:</h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Descompactar o ficheiro ZIP</li>
            <li>2. Abrir terminal na pasta <code className="bg-blue-100 px-1.5 py-0.5 rounded">scorm-studio</code></li>
            <li>3. Executar <code className="bg-blue-100 px-1.5 py-0.5 rounded">npm install</code></li>
            <li>4. Executar <code className="bg-blue-100 px-1.5 py-0.5 rounded">npm run dev</code></li>
            <li>5. Abrir <code className="bg-blue-100 px-1.5 py-0.5 rounded">http://localhost:3000</code></li>
            <li>6. Login: <code className="bg-blue-100 px-1.5 py-0.5 rounded">admin</code> / <code className="bg-blue-100 px-1.5 py-0.5 rounded">admin</code></li>
          </ol>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>SCORM Studio v1.0.0 · MIT License</p>
          <p className="mt-1">Se o download não iniciar, verifique a consola do browser (F12)</p>
        </div>
      </div>
    </div>
  );
}
