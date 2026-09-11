# Script PowerShell para criar ZIP da aplicação SCORM Studio

Write-Host "🔄 A criar ZIP da aplicação SCORM Studio..." -ForegroundColor Cyan
Write-Host ""

$zipName = "scorm-studio.zip"
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent

# Remover ZIP existente se houver
if (Test-Path $zipName) {
    Write-Host "🗑️  A remover ZIP existente..." -ForegroundColor Yellow
    Remove-Item $zipName -Force
}

# Lista de pastas e ficheiros a excluir
$excludePatterns = @(
    "node_modules",
    "dist",
    ".git",
    ".env",
    ".env.local",
    "*.log",
    ".DS_Store",
    "Thumbs.db",
    ".vscode",
    ".idea",
    "coverage",
    ".nyc_output",
    "test-results",
    "playwright-report",
    "blob-report",
    "scripts\create-zip.js",
    "scripts\create-zip.sh",
    "scripts\create-zip.ps1",
    $zipName
)

# Função para verificar se deve excluir
function Should-Exclude($path) {
    $relativePath = $path.Replace($rootDir, "").TrimStart("\").TrimStart("/")
    foreach ($pattern in $excludePatterns) {
        if ($relativePath -like "$pattern*" -or $relativePath -like "*\$pattern*" -or $relativePath -like "*/$pattern*") {
            return $true
        }
    }
    return $false
}

# Recolher todos os ficheiros
Write-Host "📂 A recolher ficheiros..." -ForegroundColor Cyan
$files = Get-ChildItem -Path $rootDir -Recurse -File | Where-Object { -not (Should-Exclude $_.FullName) }

Write-Host "  ✓ Encontrados $($files.Count) ficheiros" -ForegroundColor Green
Write-Host ""

# Criar ZIP
try {
    # Usar .NET para criar ZIP
    Add-Type -Assembly System.IO.Compression.FileSystem
    
    $compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
    $zip = [System.IO.Compression.ZipFile]::Open($zipName, 'Create')
    
    foreach ($file in $files) {
        $relativePath = $file.FullName.Replace($rootDir, "").TrimStart("\").TrimStart("/")
        $entryName = "scorm-studio/$relativePath"
        
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $entryName, $compressionLevel) | Out-Null
        Write-Host "  ✓ $relativePath" -ForegroundColor Gray
    }
    
    $zip.Dispose()
    
    Write-Host ""
    Write-Host "✅ ZIP criado com sucesso!" -ForegroundColor Green
    Write-Host "📦 Ficheiro: $zipName" -ForegroundColor Cyan
    
    $fileInfo = Get-Item $zipName
    $sizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
    Write-Host "📏 Tamanho: $sizeMB MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Para usar:" -ForegroundColor Yellow
    Write-Host "  1. Descompactar: Expand-Archive $zipName" -ForegroundColor White
    Write-Host "  2. Instalar dependências: npm install" -ForegroundColor White
    Write-Host "  3. Iniciar aplicação: npm run dev" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao criar ZIP: $_" -ForegroundColor Red
    exit 1
}
