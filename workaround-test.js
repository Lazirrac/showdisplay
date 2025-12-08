console.log('=== ELECTRON MODULE WORKAROUND TEST ===\n');

// Método 1: require normal
console.log('Method 1 - require("electron"):');
const electron1 = require('electron');
console.log('  typeof:', typeof electron1);
console.log('  value:', electron1);

// Método 2: process.electronBinding (acceso interno de Electron)
console.log('\nMethod 2 - process.electronBinding:');
console.log('  exists?', typeof process.electronBinding);

// Método 3: Buscar en el módulo cache
console.log('\nMethod 3 - Check require.cache:');
const electronKeys = Object.keys(require.cache).filter(k => k.includes('electron'));
console.log('  electron modules in cache:', electronKeys.length);
electronKeys.slice(0, 5).forEach(k => console.log('   -', k));

// Método 4: Forzar carga desde dist
console.log('\nMethod 4 - Try loading from electron app.asar:');
try {
  const asarPath = 'c:\\Users\\ibirc\\OneDrive\\Documentos\\projects\\showdisplay\\node_modules\\electron\\dist\\resources\\electron.asar';
  const fs = require('fs');
  console.log('  electron.asar exists?', fs.existsSync(asarPath));
} catch (e) {
  console.log('  Error:', e.message);
}

// Método 5: Check global objects
console.log('\nMethod 5 - Check global variables:');
console.log('  global.electron:', typeof global.electron);
console.log('  global.require:', typeof global.require);

// Método 6: Native modules
console.log('\nMethod 6 - process.binding:');
console.log('  exists?', typeof process.binding);

console.log('\n=== END TEST ===');
process.exit(0);
