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

// Use try-catch to handle race conditions
try {
  if (fs.existsSync(appLocalJsonPath)) {
    appLocalJson = JSON.parse(fs.readFileSync(appLocalJsonPath, 'utf8'));
    console.log('✅ Found app.local.json');
  } else {
    console.log('⚠️  app.local.json not found. Creating from app.json...');
    // Create app.local.json from app.json if it doesn't exist
    // Use atomic file operations to prevent race conditions
    // Check if file exists before attempting to create
    if (!fs.existsSync(appLocalJsonPath)) {
      try {
        fs.writeFileSync(appLocalJsonPath, JSON.stringify(appJson, null, 2), { flag: 'wx' });
        console.log('✅ Created app.local.json - please add your credentials there!');
        process.exit(0);
      } catch (writeError) {
        // File might have been created by another process between existsSync and writeFileSync
        if (writeError.code === 'EEXIST') {
          console.log('⚠️  app.local.json was created by another process, reading it...');
          appLocalJson = JSON.parse(fs.readFileSync(appLocalJsonPath, 'utf8'));
        } else {
          throw writeError;
        }
      }
    } else {
      // File already exists, read it
      appLocalJson = JSON.parse(fs.readFileSync(appLocalJsonPath, 'utf8'));
    }
  }
} catch (error) {
  console.error('❌ Error reading app.local.json:', error.message);
  process.exit(1);
}

// Backup original app.json (with race condition handling)
// Use atomic file operations to prevent race conditions
// Double-check pattern to handle race conditions safely
if (!fs.existsSync(appJsonBackupPath)) {
  try {
    // Use 'wx' flag for atomic write - fails if file exists (created by another process)
    fs.writeFileSync(appJsonBackupPath, JSON.stringify(appJson, null, 2), { flag: 'wx' });
    console.log('✅ Backed up original app.json');
  } catch (backupError) {
    // File might have been created by another process between existsSync and writeFileSync
    if (backupError.code === 'EEXIST') {
      // Another process created the backup - this is fine, continue silently
      // This is expected behavior in concurrent scenarios
    } else {
      // Real error occurred
      console.warn('⚠️  Could not create backup:', backupError.message);
    }
  }
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

