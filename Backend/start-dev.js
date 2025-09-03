#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Development Server...');
console.log('📁 Working directory:', process.cwd());
console.log('🔧 Node version:', process.version);

// Check if .env file exists
import { existsSync } from 'fs';
const envPath = join(__dirname, '.env');
if (!existsSync(envPath)) {
  console.log('⚠️  No .env file found!');
  console.log('📝 Please create a .env file with the following content:');
  console.log('');
  console.log('MONGODB_URL=mongodb://localhost:27017');
  console.log('PORT=3000');
  console.log('NODE_ENV=development');
  console.log('FRONTEND_ORIGIN=http://localhost:5174');
  console.log('');
  console.log('💡 You can copy from env.example file');
}

// Start the server
const server = spawn('node', ['src/index.js'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: 'development' }
});

// Handle server process events
server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🔄 Shutting down...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🔄 Shutting down...');
  server.kill('SIGTERM');
});

// Keep the process alive
process.stdin.resume();
