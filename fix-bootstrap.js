const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, 'node_modules/bootstrap-sass/assets/stylesheets/bootstrap');

if (!fs.existsSync(baseDir)) {
  console.error(`❌ La ruta no existe: ${baseDir}`);
  process.exit(1);
}

let modifiedCount = 0;

function fixMathDivInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = content.replace(/math\.div\(([^,]+),\s*([^)]+)\)/g, '($1 / $2)');
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      modifiedCount++;
      console.log(`✔️  Corregido: ${filePath}`);
    }
  } catch (err) {
    console.warn(`⚠️  Error leyendo ${filePath}: ${err.message}`);
  }
}

function walkDir(dirPath) {
  try {
    const entries = fs.readdirSync(dirPath);
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (stat.isFile() && fullPath.endsWith('.scss')) {
        fixMathDivInFile(fullPath);
      }
    }
  } catch (err) {
    console.warn(`⚠️  Error accediendo a ${dirPath}: ${err.message}`);
  }
}

walkDir(baseDir);

console.log(`\n✅ Corrección completada. Archivos modificados: ${modifiedCount}`);

