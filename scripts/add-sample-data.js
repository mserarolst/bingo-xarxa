// Aquest script afegeix packs d'exemple a la base de dades
// Executa'l amb: node scripts/add-sample-data.js
// NOTA: Necessites tenir Node.js instal·lat i haver configurat Firebase

const admin = require('firebase-admin');

// Inicialitza Firebase Admin
// Per a això necessites un fitxer de credencials de servei
// Descarrega'l des de Firebase Console > Project Settings > Service Accounts
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const samplePacks = [
  {
    name: 'Pack Spa i Benestar',
    description: 'Massatge relaxant, tractament facial i manicura. Inclou vals per a 2 persones.',
    sponsor: 'Centre d\'Estètica Bellesa Natural',
    available: true,
    order: 1,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Pack Gastronòmic',
    description: 'Sopar per a 2 persones al Restaurant El Racó, cistell de productes artesans i curs de cuina.',
    sponsor: 'Restaurant El Racó & Productes Ca l\'Avi',
    available: true,
    order: 2,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Pack Aventura',
    description: 'Escapada d\'aventura amb ruta en kayak, escalada i àpat inclòs per a 2 persones.',
    sponsor: 'Aventura Sport',
    available: true,
    order: 3,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Pack Cultural',
    description: '2 entrades per al teatre, visita guiada al museu i llibres de lectura seleccionats.',
    sponsor: 'Teatre Municipal & Llibreria Pages',
    available: true,
    order: 4,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Pack Tech',
    description: 'Auriculars bluetooth, power bank de 20000mAh i suport per a portàtil.',
    sponsor: 'TecnoStore',
    available: true,
    order: 5,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Pack Esport',
    description: 'Motxilla esportiva, samarreta tècnica, ampolla reutilitzable i vals per a 3 mesos de gimnàs.',
    sponsor: 'Gimnàs FitLife',
    available: true,
    order: 6,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

async function addSampleData() {
  try {
    console.log('Afegint packs d\'exemple...');
    
    const batch = db.batch();
    
    samplePacks.forEach((pack) => {
      const docRef = db.collection('packs').doc();
      batch.set(docRef, pack);
    });
    
    await batch.commit();
    
    console.log('✅ Packs d\'exemple afegits correctament!');
    console.log(`Total: ${samplePacks.length} packs`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error afegint packs:', error);
    process.exit(1);
  }
}

addSampleData();
