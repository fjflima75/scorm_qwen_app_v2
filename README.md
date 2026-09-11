# SCORM Studio - Enterprise E-Learning Authoring Platform

Uma plataforma empresarial completa para criação de cursos e-learning com geração de pacotes SCORM válidos, integração de IA e Mock LMS para testes.

## 🎯 Funcionalidades Principais

### 📚 Course Authoring
- Editor visual profissional com drag & drop
- Estrutura hierárquica: Curso → Módulo → Lição → Página
- 15+ tipos de blocos de conteúdo
- Sistema de quizzes e avaliações
- Temas personalizáveis
- Versionamento de cursos

### 📦 SCORM Engine
- Compilador SCORM 1.2 completo
- Geração de pacotes ZIP válidos
- Validação automática de manifestos
- Runtime SCORM integrado
- Zero dependências externas nos pacotes

### 🧪 Mock LMS
- Simulador LMS completo para testes
- Debugger SCORM em tempo real
- Execução de cenários automatizados
- Tracking de sessões e progresso
- Simulação de alunos

### 🤖 AI Assistant
- Geração de cursos com IA
- Criação de conteúdo inteligente
- Geração de quizzes automática
- Revisão e análise de qualidade
- Suporte a Ollama (local) e OpenAI

### 🔐 Enterprise Features
- Autenticação e autorização RBAC
- Sistema de audit logs
- Gestão de utilizadores e permissões
- Backup e restore
- Monitorização de saúde do sistema

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Lucide React** - Icons

### Backend (Planeado)
- **Python 3.11+**
- **FastAPI** - API framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Pydantic** - Validation

### AI
- **Ollama** - Local AI models
- **OpenAI Compatible API** - External AI

## 📋 Pré-requisitos

- Node.js 18+ e npm
- (Opcional) Ollama para IA local
- (Futuro) PostgreSQL para backend

## 🚀 Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/scorm-studio.git
cd scorm-studio

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📖 Uso

### Primeiro Acesso
1. Acesse `http://localhost:5173`
2. Login com credenciais padrão:
   - **Username:** `admin`
   - **Password:** `admin`

### Criar um Curso
1. Navegue para "Courses"
2. Clique em "New Course"
3. Configure as propriedades do curso
4. Adicione módulos, lições e páginas
5. Insira blocos de conteúdo
6. Exporte como SCORM

### Testar no Mock LMS
1. Navegue para "Mock LMS"
2. Selecione um curso e aluno
3. Clique em "Launch Course"
4. Use o debugger para ver chamadas SCORM
5. Execute cenários de teste

### Gerar Conteúdo com IA
1. Navegue para "AI Assistant"
2. Configure o provider (Ollama ou OpenAI)
3. Use "Generate Course" para criar cursos completos
4. Ou use "Generate Content" para blocos individuais

## 🏗️ Estrutura do Projeto

```
scorm-studio/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   └── Layout.tsx
│   ├── pages/           # Páginas da aplicação
│   │   ├── Dashboard.tsx
│   │   ├── Courses.tsx
│   │   ├── CourseEditor.tsx
│   │   ├── CoursePreview.tsx
│   │   ├── ScormEngine.tsx
│   │   ├── MockLMS.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── Admin.tsx
│   │   └── Login.tsx
│   ├── store/           # State management
│   │   └── index.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── App.tsx          # Componente principal
│   ├── main.tsx         # Entry point
│   └── index.css        # Estilos globais
├── public/              # Assets estáticos
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 📦 SCORM 1.2 Support

O sistema suporta completamente SCORM 1.2:

### API Functions
- `LMSInitialize()`
- `LMSFinish()`
- `LMSGetValue()`
- `LMSSetValue()`
- `LMSCommit()`
- `LMSGetLastError()`
- `LMSGetErrorString()`
- `LMSGetDiagnostic()`

### Data Model
- `cmi.core.student_id`
- `cmi.core.student_name`
- `cmi.core.lesson_status`
- `cmi.core.score.raw`
- `cmi.core.score.min`
- `cmi.core.score.max`
- `cmi.core.session_time`
- `cmi.suspend_data`
- `cmi.core.lesson_location`

### Completion Status
- `not_attempted`
- `incomplete`
- `completed`
- `passed`
- `failed`

## 🎨 Tipos de Blocos de Conteúdo

### Content Blocks
- Heading (H1, H2, H3)
- Text
- Image
- Video
- Callout (info, warning, error)
- Accordion
- Cards
- Timeline
- Quote
- Tabs
- Divider

### Assessment Blocks
- Multiple Choice
- True/False
- Fill in the Blank
- Matching
- Ordering
- Knowledge Check

## 🔒 Segurança

- Autenticação baseada em roles (RBAC)
- Validação de inputs no frontend
- Proteção contra XSS
- Sanitização de dados
- Audit logs de todas as ações
- Privacy guard para IA

## 🧪 Testing

```bash
# Executar testes
npm test

# Testes com coverage
npm run test:coverage

# Testes E2E (futuro)
npm run test:e2e
```

## 📝 Roadmap

### Phase 1 - Foundation ✅
- [x] Setup do projeto
- [x] Estrutura de componentes
- [x] Sistema de rotas
- [x] State management
- [x] UI base com Tailwind

### Phase 2 - Course Authoring ✅
- [x] Editor de cursos
- [x] Blocos de conteúdo
- [x] Sistema de quizzes
- [x] Preview de cursos
- [x] Temas personalizáveis

### Phase 3 - SCORM Engine ✅
- [x] Compilador SCORM 1.2
- [x] Validação de pacotes
- [x] Runtime SCORM
- [x] Export de ZIP

### Phase 4 - Mock LMS ✅
- [x] Simulador LMS
- [x] Debugger SCORM
- [x] Cenários de teste
- [x] Tracking de sessões

### Phase 5 - AI Integration ✅
- [x] Interface de IA
- [x] Geração de cursos
- [x] Geração de conteúdo
- [x] Revisão automática

### Phase 6 - Backend (Próximo)
- [ ] API FastAPI
- [ ] PostgreSQL
- [ ] Autenticação JWT
- [ ] Persistência de dados
- [ ] File storage

### Phase 7 - Enterprise
- [ ] Audit logs completos
- [ ] Backup/restore
- [ ] Multi-tenancy
- [ ] API pública

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🐛 Known Issues

- Backend ainda não implementado (dados em localStorage)
- Export SCORM gera estrutura mas não ZIP real
- IA requer configuração manual de providers

## 📞 Support

Para issues e perguntas:
- Abra uma issue no GitHub
- Email: seu-email@exemplo.com

## 🙏 Agradecimentos

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [SCORM Specification](https://scorm.com/)

---

**Nota:** Este é o frontend da plataforma. O backend completo (Python/FastAPI + PostgreSQL) será desenvolvido em fase posterior para persistência de dados e funcionalidades enterprise avançadas.
