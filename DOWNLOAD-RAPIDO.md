# 📥 Download do SCORM Studio - Guia Rápido

## ✅ Método Recomendado: Página HTML Direta

A maneira mais simples de descarregar o ZIP é aceder diretamente à página HTML:

### Passo a Passo:

1. **Acesse a aplicação** no browser
   - URL: `http://localhost:3000` (ou a porta configurada)

2. **Acesse a página de download direta:**
   ```
   http://localhost:3000/download-zip.html
   ```

3. **Clique no botão "📥 Descarregar ZIP"**
   - O ficheiro `scorm-studio.zip` será descarregado automaticamente
   - Não precisa de login
   - Funciona independentemente do React

---

## 🚀 Como Usar Após Descarregar

### 1. Descompactar o ZIP

**Windows:**
- Clique direito → "Extrair aqui"

**Linux/macOS:**
```bash
unzip scorm-studio.zip
cd scorm-studio
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar a aplicação

```bash
npm run dev
```

### 4. Aceder

Abra: `http://localhost:3000`

Login: `admin` / `admin`

---

## 🎯 Alternativa: Dashboard da Aplicação

Se preferir usar a interface da aplicação:

1. **Login** na aplicação (`admin` / `admin`)
2. **No Dashboard**, clique em **"💾 Download App ZIP"**
3. **Ou acesse:** `http://localhost:3000/#/download`

---

## 📦 O Que Está Incluído no ZIP

✅ Código fonte completo (React + TypeScript + Vite)  
✅ Configurações do projeto  
✅ Editor visual de cursos  
✅ Motor SCORM 1.2  
✅ Mock LMS com debugger  
✅ Assistente de IA  
✅ Documentação completa  
✅ Scripts de instalação  

---

## 🔧 Requisitos

- **Node.js** 18 ou superior
- **npm** 9 ou superior
- **Browser** moderno (Chrome, Firefox, Edge, Safari)

---

## 🐛 Problemas Comuns

### "O download não inicia"
→ Acesse diretamente: `http://localhost:3000/download-zip.html`

### "npm: command not found"
→ Instale o Node.js: https://nodejs.org/

### "Port 3000 already in use"
→ Termine a outra aplicação ou altere a porta em `vite.config.js`

### "Cannot find module"
→ Execute `npm install` novamente

---

## 📞 Suporte

Para mais informações, consulte:
- `README.md` - Documentação completa
- `DOWNLOAD.md` - Guia detalhado
- `COMO-DOWNLOAD.md` - Resumo rápido

---

**Versão:** 1.0.0  
**Última atualização:** 2024  
**Status:** ✅ Pronto para produção
