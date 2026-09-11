#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Ficheiros e pastas a excluir
const excludePatterns = [
  'node_modules',
  'dist',
  '.git',
  '.env',
  '.env.local',
  '.env.*.local',
  '*.log',
  '.DS_Store',
  'Thumbs.db',
  '.vscode',
  '.idea',
  'coverage',
  '.nyc_output',
  'test-results',
  'playwright-report',
  'blob-report',
  'scripts/create-zip.js',
  'scorm-studio.zip'
];

function shouldExclude(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  return excludePatterns.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(relativePath);
    }
    return relativePath === pattern || relativePath.startsWith(pattern + path.sep);
  });
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (shouldExclude(filePath)) {
      return;
    }
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

async function createZip() {
  const output = fs.createWriteStream(path.join(rootDir, 'scorm-studio.zip'));
  const archive = archiver('zip', {
    zlib: { level: 9 } // Máxima compressão
  });

  output.on('close', () => {
    const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
    console.log(`\n✅ ZIP criado com sucesso!`);
    console.log(`📦 Ficheiro: scorm-studio.zip`);
    console.log(`📏 Tamanho: ${sizeInMB} MB`);
    console.log(`📁 Total de ficheiros: ${archive.pointer()} bytes comprimidos`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  console.log('🔄 A criar ZIP da aplicação...');
  console.log('📂 A recolher ficheiros...\n');

  const files = getAllFiles(rootDir);
  
  files.forEach(file => {
    const relativePath = path.relative(rootDir, file);
    console.log(`  ✓ ${relativePath}`);
    archive.file(file, { name: `scorm-studio/${relativePath}` });
  });

  await archive.finalize();
}

createZip().catch(err => {
  console.error('❌ Erro ao criar ZIP:', err);
  process.exit(1);
});
