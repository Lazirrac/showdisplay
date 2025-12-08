// Debug script to understand what's available
console.log('=== ENVIRONMENT INFO ===');
console.log('process.type:', process.type);
console.log('process.versions.electron:', process.versions.electron);
console.log('process.versions.node:', process.versions.node);

console.log('\n=== MODULE RESOLUTION ===');
try {
  const electronPath = require.resolve('electron');
  console.log('electron resolves to:', electronPath);

  const electron = require('electron');
  console.log('typeof require("electron"):', typeof electron);
  console.log('electron value:', electron);

  // Try to access it differently
  if (typeof electron === 'string') {
    console.log('\nElectron returned a string. Checking if there\'s another way...');
    console.log('process.electronBinding available?', typeof process.electronBinding);

    if (process.type === 'browser') {
      console.log('\nWe are in the main/browser process');
      // In modern Electron, the modules might be accessed differently
      console.log('Checking global:', Object.keys(global).filter(k => k.includes('electron') || k.includes('Electron')));
    }
  }
} catch (error) {
  console.error('Error requiring electron:', error.message);
}

console.log('\n=== PROCESS.VERSIONS ===');
console.log(JSON.stringify(process.versions, null, 2));

// Exit after 1 second
setTimeout(() => {
  process.exit(0);
}, 1000);
