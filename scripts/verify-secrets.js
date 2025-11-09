#!/usr/bin/env node

/**
 * Script for å verifisere at alle nødvendige secrets er dokumentert
 * Dette er en lokal sjekk - faktiske secrets må sjekkes i GitHub
 */

const requiredSecrets = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
];

const optionalSecrets = [
  'EMAILJS_PUBLIC_KEY',
  'EMAILJS_SERVICE_ID',
  'EMAILJS_TEMPLATE_ID',
  'OPENROUTER_API_KEY',
];

console.log('🔐 GitHub Secrets Verifisering\n');
console.log('Dette scriptet viser hvilke secrets som trengs.');
console.log('For å faktisk sjekke om de er satt, må du gå til:');
console.log('https://github.com/kasa031/pulse-experimental/settings/secrets/actions\n');

console.log('📋 Påkrevde Secrets:');
requiredSecrets.forEach((secret, index) => {
  console.log(`  ${index + 1}. ${secret}`);
});

console.log('\n📋 Valgfrie Secrets:');
optionalSecrets.forEach((secret, index) => {
  console.log(`  ${index + 1}. ${secret}`);
});

console.log('\n📝 Hvordan sjekke:');
console.log('1. Gå til: https://github.com/kasa031/pulse-experimental/settings/secrets/actions');
console.log('2. Sjekk at alle påkrevde secrets er listet');
console.log('3. Hvis noen mangler, klikk "New repository secret" og legg dem til\n');

console.log('💡 Tips:');
console.log('- Secrets er case-sensitive (FIREBASE_API_KEY ≠ firebase_api_key)');
console.log('- Du kan ikke se verdien til eksisterende secrets, bare om de eksisterer');
console.log('- Hvis du trenger å oppdatere en secret, slett den gamle og lag en ny\n');

console.log('✅ Når alle secrets er satt, trigger en ny deployment:');
console.log('   https://github.com/kasa031/pulse-experimental/actions\n');

