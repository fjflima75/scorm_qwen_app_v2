# Scripts

Esta pasta contém scripts úteis para o desenvolvimento e manutenção do SCORM Studio.

## 📦 Criar ZIP da Aplicação

### Windows

#### Opção 1: Batch Script (Recomendado)
```bash
scripts\create-zip.bat
```

**Requisitos:**
- [7-Zip](https://www.7-zip.org/) instalado e no PATH

#### Opção 2: PowerShell Script
```powershell
powershell -ExecutionPolicy Bypass -File scripts\create-zip.ps1
```

**Requisitos:**
- PowerShell 5.0+
- .NET Framework (incluído no Windows)

### Linux / macOS

```bash
chmod +x scripts/create-zip.sh
./scripts/create-zip.sh
```

**Requisitos:**
- `zip` instalado (geralmente já vem no Linux/macOS)

### Node.js Script

```bash
node scripts/create-zip.js
```

**Requisitos:**
- Node.js 18+
- Dependências instaladas (`npm install`)

## 📋 O que é incluído no ZIP

O ZIP contém todos os ficheiros necessários para executar a aplicação:

### Incluído ✓
- Código fonte (`src/`)
- Ficheiros de configuração (`package.json`, `tsconfig.json`, `vite.config.js`)
- Documentação (`README.md`, `LICENSE`, `CHANGELOG.md`, etc.)
- Templates do GitHub (`.github/`)
- Exemplo de variáveis de ambiente (`.env.example`)
- `.gitignore`

### Excluído ✗
- `node_modules/` (instalado com `npm install`)
- `dist/` (gerado com `npm run build`)
- `.git/` (histórico do Git)
- `.env` e ficheiros de ambiente locais
- Logs e ficheiros temporários
- Configurações de editor (`.vscode/`, `.idea/`)
- Resultados de testes (`coverage/`, `test-results/`)

## 🚀 Após descompactar o ZIP

```bash
# 1. Entrar na pasta
cd scorm-studio

# 2. Instalar dependências
npm install

# 3. (Opcional) Configurar variáveis de ambiente
cp .env.example .env
# Editar .env conforme necessário

# 4. Iniciar em modo desenvolvimento
npm run dev

# Ou build para produção
npm run build
npm run preview
```

## 🔧 Adicionar novos scripts

Ao adicionar novos scripts:

1. **Nomeclatura clara**: Use nomes descritivos (`create-zip.sh`, não `script1.sh`)
2. **Documentação**: Adicione comentários explicando o que o script faz
3. **Cross-platform**: Considere criar versões para Windows (`.bat`, `.ps1`) e Unix (`.sh`)
4. **Tratamento de erros**: Verifique erros e forneça mensagens úteis
5. **Atualize este README**: Documente o novo script aqui

## 📝 Scripts disponíveis

| Script | Plataforma | Descrição |
|--------|-----------|-----------|
| `create-zip.bat` | Windows | Criar ZIP (requer 7-Zip) |
| `create-zip.ps1` | Windows | Criar ZIP (PowerShell) |
| `create-zip.sh` | Linux/macOS | Criar ZIP (requer `zip`) |
| `create-zip.js` | Cross-platform | Criar ZIP (Node.js) |

## 🐛 Troubleshooting

### Windows: "7-Zip não encontrado"
- Instale o 7-Zip: https://www.7-zip.org/
- Adicione ao PATH ou use o script PowerShell

### Linux/macOS: "zip: command not found"
```bash
# Ubuntu/Debian
sudo apt-get install zip

# macOS (com Homebrew)
brew install zip

# CentOS/RHEL
sudo yum install zip
```

### Node.js: "Cannot find module 'archiver'"
```bash
npm install
```

### Erro de permissão (Linux/macOS)
```bash
chmod +x scripts/create-zip.sh
```
