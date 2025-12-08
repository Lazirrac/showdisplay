#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Eliminar la variable de entorno problemática
delete process.env.ELECTRON_RUN_AS_NODE;

// Ejecutar electron
const electronPath = path.join(__dirname, 'node_modules', 'electron', 'dist', 'electron.exe');
const child = spawn(electronPath, process.argv.slice(2), {
  stdio: 'inherit',
  env: process.env
});

child.on('exit', (code) => {
  process.exit(code);
});
