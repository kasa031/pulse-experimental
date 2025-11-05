#!/usr/bin/env node

/**
 * Setup script for local development
 * This script merges app.local.json with app.json for local development
 */

const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(__dirname, '..', 'app.json');
const appLocalJsonPath = path.join(__dirname, '..', 'app.local.json');
const appJsonBackupPath = path.join(__dirname, '..', 'app.json.backup');

// Read files
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
let appLocalJson = null;

if (fs.existsSync(appLocalJsonPath)) {
  appLocalJson = JSON.parse(fs.readFileSync(appLocalJsonPath, 'utf8'));
  console.log('✅ Found app.local.json');
} else {
  console.log('⚠️  app.local.json not found. Creating from app.json...');
  // Create app.local.json from app.json if it doesn't exist
  fs.writeFileSync(appLocalJsonPath, JSON.stringify(appJson, null, 2));
  console.log('✅ Created app.local.json - please add your credentials there!');
  process.exit(0);
}

// Backup original app.json
if (!fs.existsSync(appJsonBackupPath)) {
  fs.writeFileSync(appJsonBackupPath, JSON.stringify(appJson, null, 2));
  console.log('✅ Backed up original app.json');
}

// Merge: use app.local.json extra values if they exist
if (appLocalJson?.expo?.extra) {
  appJson.expo.extra = {
    ...appJson.expo.extra,
    ...appLocalJson.expo.extra,
  };
  console.log('✅ Merged credentials from app.local.json');
}

// Write merged config
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
console.log('✅ app.json updated with local credentials');
console.log('');
console.log('🚀 You can now run: npm start');

