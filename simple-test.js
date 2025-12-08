console.log('=== SIMPLE ELECTRON TEST ===');
console.log('process.versions.electron:', process.versions.electron);
console.log('process.type:', process.type);
console.log('\nTrying to require electron...');

try {
  const electron = require('electron');
  console.log('SUCCESS! typeof electron:', typeof electron);

  if (typeof electron === 'object' && electron.app) {
    console.log('electron.app exists:', !!electron.app);
    electron.app.whenReady().then(() => {
      console.log('App is ready!');
      electron.app.quit();
    });
  } else {
    console.log('ERROR: electron is:', electron);
    process.exit(1);
  }
} catch (error) {
  console.error('FATAL ERROR:', error.message);
  process.exit(1);
}
