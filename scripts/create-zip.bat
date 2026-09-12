@echo off
echo ================================================
echo   SCORM Studio - Criar ZIP da Aplicacao
echo ================================================
echo.

set ZIP_NAME=scorm-studio.zip

REM Verificar se o 7-Zip esta instalado
where 7z >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] 7-Zip nao encontrado!
    echo.
    echo Por favor, instale o 7-Zip:
    echo https://www.7-zip.org/
    echo.
    echo Ou use o script PowerShell:
    echo powershell -ExecutionPolicy Bypass -File scripts\create-zip.ps1
    echo.
    pause
    exit /b 1
)

REM Remover ZIP existente
if exist %ZIP_NAME% (
    echo [INFO] A remover ZIP existente...
    del %ZIP_NAME%
)

echo [INFO] A criar ZIP da aplicacao...
echo.

REM Criar lista de ficheiros a incluir
echo src\> filelist.txt
echo public\>> filelist.txt
echo package.json>> filelist.txt
echo package-lock.json>> filelist.txt
echo index.html>> filelist.txt
echo tsconfig.json>> filelist.txt
echo vite.config.js>> filelist.txt
echo README.md>> filelist.txt
echo LICENSE>> filelist.txt
echo CHANGELOG.md>> filelist.txt
echo CONTRIBUTING.md>> filelist.txt
echo CODE_OF_CONDUCT.md>> filelist.txt
echo DEPLOYMENT.md>> filelist.txt
echo .env.example>> filelist.txt
echo .gitignore>> filelist.txt

REM Criar ZIP com 7-Zip
7z a -tzip %ZIP_NAME% @filelist.txt -mx=9

REM Limpar ficheiro temporario
del filelist.txt

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   ZIP criado com sucesso!
    echo ================================================
    echo.
    echo Ficheiro: %ZIP_NAME%
    echo.
    echo Para usar:
    echo   1. Descompactar: 7z x %ZIP_NAME%
    echo   2. Instalar dependencias: npm install
    echo   3. Iniciar aplicacao: npm run dev
    echo.
) else (
    echo.
    echo [ERRO] Falha ao criar ZIP
    echo.
)

pause
