#!/usr/bin/env node

/**
 * Build script for web deployment
 * Merges local config and builds for web
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Building for web...\n');

// Merge local config first
const setupScript = path.join(__dirname, 'setup-local-config.js');
try {
  require(setupScript);
} catch (error) {
  console.error('❌ Feil ved setup av lokal config:', error.message);
  process.exit(1);
}

// Build for web
try {
  console.log('📦 Building web bundle...');
  execSync('npx expo export:web', { stdio: 'inherit' });
  console.log('\n✅ Web build ferdig!');
  console.log('📁 Output: ./web-build/');
  console.log('\n📝 Neste steg:');
  console.log('   1. Push til GitHub');
  console.log('   2. GitHub Actions deployer automatisk til GitHub Pages');
  console.log('   3. Åpne: https://kasa031.github.io/pulse-experimental/');
} catch (error) {
  console.error('❌ Feil ved build:', error.message);
  process.exit(1);
}

