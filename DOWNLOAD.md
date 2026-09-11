# Como Descarregar o SCORM Studio

## 🎯 Método 1: Download Direto (Recomendado)

A aplicação inclui uma página de download integrada:

1. **Aceda à aplicação** no browser
2. **Faça login** com:
   - Username: `admin`
   - Password: `admin`
3. **No Dashboard**, clique em **"💾 Download App ZIP"**
4. **O ficheiro ZIP será descarregado automaticamente**

Ou aceda diretamente a: `http://localhost:3000/#/download`

---

## 📦 Método 2: Usar Scripts Incluídos

### Windows

#### Opção A: Batch Script (Requer 7-Zip)
```bash
scripts\create-zip.bat
```

#### Opção B: PowerShell Script
```powershell
powershell -ExecutionPolicy Bypass -File scripts\create-zip.ps1
```

### Linux / macOS

```bash
chmod +x scripts/create-zip.sh
./scripts/create-zip.sh
```

### Node.js (Cross-platform)

```bash
node scripts/create-zip.js
```

---

## 📋 O que está incluído no ZIP

✅ **Código fonte completo**
- Editor visual de cursos
- Motor SCORM 1.2
- Mock LMS com debugger
- Assistente de IA
- Sistema de autenticação
- Dashboard administrativo

✅ **Documentação**
- README.md
- LICENSE
- CHANGELOG.md
- CONTRIBUTING.md
- DEPLOYMENT.md

✅ **Configurações**
- package.json
- tsconfig.json
- vite.config.js
- .gitignore
- .env.example

---

## 🚀 Como usar após descarregar

### 1. Descompactar o ZIP

**Windows:**
- Clique direito no ficheiro `scorm-studio.zip`
- Selecione "Extrair aqui" ou "Extract Here"

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

**Modo desenvolvimento:**
```bash
npm run dev
```

**Modo produção:**
```bash
npm run build
npm run preview
```

### 4. Aceder à aplicação

Abra o browser em: `http://localhost:3000`

**Credenciais padrão:**
- Username: `admin`
- Password: `admin`

---

## 🔧 Requisitos

- **Node.js** 18 ou superior
- **npm** 9 ou superior
- **Browser** moderno (Chrome, Firefox, Edge, Safari)

### Verificar versão do Node.js

```bash
node --version
npm --version
```

Se não tiver instalado, descarregue em: https://nodejs.org/

---

## 🐛 Problemas comuns

### "npm: command not found"
Instale o Node.js: https://nodejs.org/

### "Port 3000 already in use"
Outra aplicação está a usar a porta 3000. Termine-a ou altere a porta em `vite.config.js`.

### "Cannot find module"
Execute `npm install` novamente para garantir que todas as dependências estão instaladas.

### "Build failed"
Verifique se tem espaço em disco suficiente e tente novamente.

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os requisitos do sistema
2. Certifique-se de que o Node.js está instalado
3. Execute `npm install` novamente
4. Consulte a documentação completa em `README.md`

---

## 📄 Licença

MIT License - Veja o ficheiro LICENSE para mais detalhes.
