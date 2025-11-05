// seedPolls.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
// Filnavn kan variere - oppdater hvis filen har et annet navn
const serviceAccount = require('./pulse-oslo-firebase-adminsdk-fbsvc-7cc1242b6c.json');

// Initialiser Firebase Admin SDK
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const polls = [
  {
    title: "Burde Sofienbergparken få flere blomsterenger?",
    description: "Vi vurderer å plante flere blomsterenger i Sofienbergparken for å støtte biodiversiteten og gi en vakrere park.",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Oslo Kommune",
    district: "Grünerløkka",
    category: "miljø",
    options: [
      { text: "Ja, absolutt!", votes: 0 },
      { text: "Nei, det er ikke nødvendig", votes: 0 }
    ]
  },
  {
    title: "Bør det innføres bompenger for elbiler i Oslo sentrum?",
    description: "Elbiler har hittil vært fritatt for bompenger. Bør dette endres for å redusere trafikk og øke inntektene til kollektivtransport?",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Oslo Kommune",
    district: "Sentrum",
    category: "transport",
    options: [
      { text: "Ja, elbiler bør betale bompenger", votes: 0 },
      { text: "Nei, elbiler bør fortsatt være fritatt", votes: 0 }
    ]
  },
  {
    title: "Skal det innføres rushtidsavgift på T-banen i Oslo?",
    description: "For å redusere trengsel vurderes det å innføre høyere billettpriser i rushtiden. Er dette en god idé?",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Ruter",
    district: "Hele Oslo",
    category: "transport",
    options: [
      { text: "Ja, det er rettferdig", votes: 0 },
      { text: "Nei, det rammer de som må reise i rushtiden", votes: 0 }
    ]
  },
  {
    title: "Bør det bygges flere høyhus (>20 etasjer) i Oslo sentrum?",
    description: "Noen mener høyhus gir flere boliger og mindre press på marka, andre mener det ødelegger bybildet.",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Plan- og bygningsetaten",
    district: "Sentrum",
    category: "byutvikling",
    options: [
      { text: "Ja, flere høyhus", votes: 0 },
      { text: "Nei, bevar dagens bybilde", votes: 0 }
    ]
  },
  {
    title: "Skal det innføres totalforbud mot elsparkesykler i Oslo sentrum?",
    description: "Elsparkesykler har ført til både økt mobilitet og flere ulykker. Bør de forbys helt i sentrum?",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Oslo Kommune",
    district: "Sentrum",
    category: "transport",
    options: [
      { text: "Ja, forbud mot elsparkesykler", votes: 0 },
      { text: "Nei, la dem være tillatt", votes: 0 }
    ]
  },
  {
    title: "Bør det innføres flere parkeringsplasser for biler i Oslo sentrum?",
    description: "Noen mener flere parkeringsplasser gir bedre tilgjengelighet, andre mener det gir mer trafikk og forurensning.",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Bymiljøetaten",
    district: "Sentrum",
    category: "transport",
    options: [
      { text: "Ja, flere parkeringsplasser", votes: 0 },
      { text: "Nei, færre parkeringsplasser", votes: 0 }
    ]
  },
  {
    title: "Bør det innføres flere bilfrie soner i Oslo sentrum for å redusere luftforurensning?",
    description: "Bilfrie soner kan gi bedre luftkvalitet og tryggere byrom, men kan også gjøre det vanskeligere for noen å komme seg frem.",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Oslo Kommune",
    district: "Sentrum",
    category: "miljø",
    options: [
      { text: "Ja, flere bilfrie soner", votes: 0 },
      { text: "Nei, det er nok bilfrie soner", votes: 0 }
    ]
  },
  {
    title: "Skal det innføres forbud mot engangsgriller i Oslos parker?",
    description: "Engangsgriller fører ofte til forsøpling og brannfare. Bør de forbys i parker som Frognerparken og Tøyenparken?",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Bymiljøetaten",
    district: "Hele Oslo",
    category: "miljø",
    options: [
      { text: "Ja, forby engangsgriller", votes: 0 },
      { text: "Nei, behold dagens regler", votes: 0 }
    ]
  },
  {
    title: "Bør det settes ut flere bikuber i Oslo for å støtte pollinerende insekter?",
    description: "Bikuber kan bidra til økt pollinering og bedre forhold for byens blomster og trær.",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Oslo Kommune",
    district: "Hele Oslo",
    category: "natur",
    options: [
      { text: "Ja, flere bikuber", votes: 0 },
      { text: "Nei, det er ikke nødvendig", votes: 0 }
    ]
  },
  {
    title: "Skal det innføres båndtvang for katter i hekkesesongen for å beskytte fugleunger?",
    description: "Katter tar mange fugleunger hver vår. Bør det innføres båndtvang eller andre tiltak i hekkesesongen?",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Dyrebeskyttelsen Oslo",
    district: "Hele Oslo",
    category: "dyr",
    options: [
      { text: "Ja, båndtvang for katter i hekkesesongen", votes: 0 },
      { text: "Nei, la katter gå fritt", votes: 0 }
    ]
  },
  {
    title: "Bør det innføres gratis kollektivtransport for barn under 16 år i Oslo?",
    description: "Gratis kollektiv kan gi flere barn mulighet til å delta i fritidsaktiviteter og redusere bilbruk.",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Ruter",
    district: "Hele Oslo",
    category: "barn",
    options: [
      { text: "Ja, gratis kollektiv for barn", votes: 0 },
      { text: "Nei, dagens ordning er bra nok", votes: 0 }
    ]
  },
  {
    title: "Skal Oslo satse mer på grønne skolegårder med trær og natur?",
    description: "Grønne skolegårder gir bedre lekemiljø og kan bidra til økt trivsel og læring for barn.",
    isActive: true,
    startDate: new Date("2025-07-01"),
    endDate: new Date("2025-07-10"),
    createdBy: "Utdanningsetaten",
    district: "Hele Oslo",
    category: "barn",
    options: [
      { text: "Ja, mer natur i skolegårdene", votes: 0 },
      { text: "Nei, det er ikke nødvendig", votes: 0 }
    ]
  },
  {
    title: "Bør Oslo innføre eiendomsskatt for å finansiere velferdstjenester?",
    description: "Eiendomsskatt kan gi økte inntekter til kommunen, men er omstridt blant mange innbyggere.",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Byrådet i Oslo",
    district: "Hele Oslo",
    category: "politikk",
    options: [
      { text: "Ja, innfør eiendomsskatt", votes: 0 },
      { text: "Nei, ikke innfør eiendomsskatt", votes: 0 }
    ]
  },
  {
    title: "Skal Oslo åpne for flere sprøyterom for rusavhengige?",
    description: "Flere sprøyterom kan redusere overdosedødsfall, men møter motstand fra enkelte nabolag.",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Helseetaten",
    district: "Hele Oslo",
    category: "politikk",
    options: [
      { text: "Ja, flere sprøyterom", votes: 0 },
      { text: "Nei, ikke flere sprøyterom", votes: 0 }
    ]
  },
  {
    title: "Bør Oslo prioritere flere lærere fremfor gratis skolemat?",
    description: "Noen mener flere lærere gir bedre undervisning, andre ønsker gratis skolemat for alle.",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Utdanningsetaten",
    district: "Hele Oslo",
    category: "politikk",
    options: [
      { text: "Flere lærere", votes: 0 },
      { text: "Gratis skolemat", votes: 0 }
    ]
  },
  {
    title: "Skal det bygges flere kommunale boliger i Oslo sentrum?",
    description: "Flere kommunale boliger kan hjelpe vanskeligstilte, men kan også påvirke boligprisene og byutviklingen.",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Boligbygg Oslo KF",
    district: "Sentrum",
    category: "politikk",
    options: [
      { text: "Ja, flere kommunale boliger", votes: 0 },
      { text: "Nei, ikke flere kommunale boliger", votes: 0 }
    ]
  },
  {
    title: "Bør Oslo satse mer på integreringstiltak for innvandrere?",
    description: "Integreringstiltak kan bidra til bedre inkludering, men krever ressurser og prioritering.",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Byrådsavdeling for mangfold og integrering",
    district: "Hele Oslo",
    category: "politikk",
    options: [
      { text: "Ja, mer satsing på integrering", votes: 0 },
      { text: "Nei, dagens innsats er tilstrekkelig", votes: 0 }
    ]
  },
  {
    title: "Hva bør Oslo prioritere i neste års budsjett?",
    description: "Kommunen har begrensede midler. Hva mener du bør prioriteres høyest?",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Byrådet i Oslo",
    district: "Hele Oslo",
    category: "budsjett",
    options: [
      { text: "Flere lærere og bedre skoler", votes: 0 },
      { text: "Bedre eldreomsorg", votes: 0 },
      { text: "Klimatiltak og grønn byutvikling", votes: 0 },
      { text: "Tryggere by og mer politi", votes: 0 }
    ]
  },
  {
    title: "Bør Oslo bruke mer penger på å verne Marka mot utbygging?",
    description: "Marka er viktig for friluftsliv og naturmangfold, men det er press på å bygge flere boliger.",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Bymiljøetaten",
    district: "Hele Oslo",
    category: "vern",
    options: [
      { text: "Ja, mer vern av Marka", votes: 0 },
      { text: "Nei, åpne for mer utbygging", votes: 0 }
    ]
  },
  {
    title: "Skal bydeler få mer selvstyre over egne budsjetter?",
    description: "Noen mener lokaldemokrati gir bedre løsninger for innbyggerne, andre ønsker sterkere sentral styring.",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Byrådsavdeling for finans",
    district: "Hele Oslo",
    category: "lokaldemokrati",
    options: [
      { text: "Ja, mer makt til bydelene", votes: 0 },
      { text: "Nei, behold dagens styring", votes: 0 }
    ]
  },
  {
    title: "Bør Oslo bruke mer av budsjettet på å støtte lokale idrettslag og kulturtilbud?",
    description: "Støtte til idrett og kultur kan gi økt aktivitet og fellesskap, men krever omprioritering av midler.",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Kulturetaten",
    district: "Hele Oslo",
    category: "budsjett",
    options: [
      { text: "Ja, mer til idrett og kultur", votes: 0 },
      { text: "Nei, prioriter andre områder", votes: 0 }
    ]
  },
  {
    title: "Skal Oslo innføre flere borgerpaneler for å involvere innbyggerne i viktige beslutninger?",
    description: "Borgerpaneler kan gi bedre forankring og mer demokrati, men kan også gjøre prosesser tregere.",
    isActive: true,
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-10"),
    createdBy: "Byrådsavdeling for byutvikling",
    district: "Hele Oslo",
    category: "lokaldemokrati",
    options: [
      { text: "Ja, flere borgerpaneler", votes: 0 },
      { text: "Nei, dagens ordning er bra", votes: 0 }
    ]
  }
];

async function seed() {
  for (const poll of polls) {
    await db.collection('polls').add(poll);
    console.log(`La til avstemning: ${poll.title}`);
  }
  process.exit();
}

seed(); 