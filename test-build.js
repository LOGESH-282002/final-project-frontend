#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 Testing Next.js build...\n');

try {
  // Change to frontend directory
  process.chdir(path.join(__dirname));
  
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n🏗️  Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('\n✅ Build successful! Your app is ready for deployment.');
  console.log('\n🚀 You can now deploy to Vercel with confidence.');
  
} catch (error) {
  console.error('\n❌ Build failed!');
  console.error('Error:', error.message);
  console.log('\n🔍 Please fix the errors above before deploying.');
  process.exit(1);
}