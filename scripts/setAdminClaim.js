// setAdminClaim.js
// Script for å sette admin custom claim på brukere

const admin = require('firebase-admin');
const readline = require('readline');

// Initialiser Firebase Admin SDK
const serviceAccount = require('../pulse-oslo-firebase-adminsdk-fbsvc-7cc1242b6c.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const auth = admin.auth();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setAdminClaim(email) {
  try {
    // Hent bruker
    const user = await auth.getUserByEmail(email);
    
    console.log(`\n📋 Bruker funnet: ${user.email}`);
    console.log(`   UID: ${user.uid}`);
    
    // Sjekk nåværende claims
    const currentClaims = user.customClaims || {};
    console.log(`\n📊 Nåværende claims:`, currentClaims);
    
    // Sett admin claim
    await auth.setCustomUserClaims(user.uid, {
      ...currentClaims,
      admin: true
    });
    
    console.log(`\n✅ Admin-claim satt på ${email}!`);
    console.log(`\n⚠️  VIKTIG: Brukeren må logge ut og inn igjen for at endringen skal trå i kraft.`);
    console.log(`\n📝 Brukeren kan nå:`);
    console.log(`   • Opprette polls`);
    console.log(`   • Oppdatere polls`);
    console.log(`   • Publisere nyheter`);
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`\n❌ Feil: Bruker med e-post ${email} ikke funnet.`);
      console.error(`   Sjekk at brukeren har registrert seg i Firebase Authentication.`);
    } else {
      console.error(`\n❌ Feil ved setting av admin-claim:`, error.message);
    }
    process.exit(1);
  }
}

// Hent e-post fra kommandolinje eller spør brukeren
const email = process.argv[2];

if (email) {
  setAdminClaim(email);
} else {
  rl.question('Skriv inn e-postadressen til brukeren som skal være admin: ', (email) => {
    setAdminClaim(email);
    rl.close();
  });
}

