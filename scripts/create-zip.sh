#!/bin/bash

echo "🔄 A criar ZIP da aplicação SCORM Studio..."
echo ""

# Nome do ficheiro ZIP
ZIP_NAME="scorm-studio.zip"

# Remover ZIP existente se houver
if [ -f "$ZIP_NAME" ]; then
    echo "🗑️  A remover ZIP existente..."
    rm "$ZIP_NAME"
fi

# Criar ZIP excluindo ficheiros desnecessários
zip -r "$ZIP_NAME" . \
    -x "node_modules/*" \
    -x "dist/*" \
    -x ".git/*" \
    -x ".env" \
    -x ".env.local" \
    -x ".env.*.local" \
    -x "*.log" \
    -x ".DS_Store" \
    -x "Thumbs.db" \
    -x ".vscode/*" \
    -x ".idea/*" \
    -x "coverage/*" \
    -x ".nyc_output/*" \
    -x "test-results/*" \
    -x "playwright-report/*" \
    -x "blob-report/*" \
    -x "scripts/create-zip.js" \
    -x "scripts/create-zip.sh" \
    -x "$ZIP_NAME"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ZIP criado com sucesso!"
    echo "📦 Ficheiro: $ZIP_NAME"
    echo "📏 Tamanho: $(du -h "$ZIP_NAME" | cut -f1)"
    echo ""
    echo "Para usar:"
    echo "  1. Descompactar: unzip $ZIP_NAME"
    echo "  2. Instalar dependências: npm install"
    echo "  3. Iniciar aplicação: npm run dev"
else
    echo ""
    echo "❌ Erro ao criar ZIP"
    exit 1
fi
