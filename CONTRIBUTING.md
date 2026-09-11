# Contributing to SCORM Studio

Primeiramente, obrigado por considerar contribuir para o SCORM Studio! É a comunidade que torna o open source possível e este projeto não é exceção.

## 🎯 Como Contribuir

### Reportar Bugs
- Use o template de Bug Report no GitHub
- Inclua passos detalhados para reproduzir
- Mencione o ambiente (OS, browser, versão)
- Adicione screenshots se aplicável

### Sugerir Funcionalidades
- Use o template de Feature Request
- Explique o caso de uso
- Considere alternativas
- Indique se pode contribuir com a implementação

### Submeter Pull Requests

1. **Fork o repositório**
   ```bash
   git clone https://github.com/seu-usuario/scorm-studio.git
   cd scorm-studio
   ```

2. **Crie uma branch**
   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```

3. **Faça suas alterações**
   - Siga o estilo de código existente
   - Adicione testes quando aplicável
   - Mantenha a documentação atualizada

4. **Teste suas alterações**
   ```bash
   npm run build
   npm run test
   ```

5. **Commit suas mudanças**
   ```bash
   git commit -m "feat: adicionar nova funcionalidade"
   ```
   
   Use conventional commits:
   - `feat:` nova funcionalidade
   - `fix:` correção de bug
   - `docs:` mudanças na documentação
   - `style:` formatação, ponto e vírgula, etc
   - `refactor:` refatoração de código
   - `test:` adicionar ou corrigir testes
   - `chore:` mudanças de manutenção

6. **Push para sua fork**
   ```bash
   git push origin feature/nome-da-feature
   ```

7. **Abra um Pull Request**
   - Descreva claramente as mudanças
   - Referencie issues relacionadas
   - Aguarde revisão

## 💻 Setup de Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar testes
npm test

# Type checking
npm run typecheck
```

## 📐 Estilo de Código

### TypeScript
- Use tipos explícitos quando possível
- Evite `any`
- Prefira interfaces a types para objetos
- Use type imports: `import type { User } from './types'`

### React
- Componentes funcionais com hooks
- Props tipadas com interfaces
- Nome de componentes em PascalCase
- Nome de ficheiros em PascalCase para componentes

### CSS
- Use Tailwind CSS
- Prefira classes utilitárias
- Evite CSS inline
- Use classes customizadas apenas quando necessário

### Commits
- Mensagens claras e descritivas
- Uma mudança lógica por commit
- Use conventional commits

## 🧪 Testes

- Adicione testes para novas funcionalidades
- Mantenha cobertura de testes
- Teste edge cases
- Use nomes descritivos para testes

## 📚 Documentação

- Atualize o README quando necessário
- Documente funções públicas com JSDoc
- Mantenha exemplos atualizados
- Adicione comentários para código complexo

## 🔍 Processo de Revisão

1. Um mantenedor revisará seu PR
2. Podem ser solicitadas mudanças
3. Após aprovação, será feito merge
4. Seu nome será adicionado aos contribuidores

## 💬 Comunicação

- Use issues para discussões técnicas
- Seja respeitoso e construtivo
- Ajude outros contribuidores
- Celebre as contribuições de todos

## 🎓 Recursos

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [SCORM Specification](https://scorm.com/scorm-explained/technical-scorm/)

## ❓ Precisa de Ajuda?

Não hesite em abrir uma issue com a label "question" se tiver dúvidas.

---

Obrigado por contribuir! 🎉
