# Instruccions per configurar Firebase

Per fer funcionar aquesta aplicació, necessites configurar Firebase. Segueix aquests passos:

## 1. Crear un projecte Firebase

1. Ves a https://console.firebase.google.com/
2. Clica "Afegir projecte" o "Add project"
3. Dona-li un nom (per exemple: "bingo-escola")
4. Segueix els passos fins crear el projecte

## 2. Afegir una aplicació web

1. A la pàgina del projecte, clica la icona "</>" (Web)
2. Registra l'aplicació amb un nom (per exemple: "Bingo Solidari")
3. NO cal activar Firebase Hosting ara
4. Clica "Registrar app"

## 3. Copiar les credencials

Veuràs un codi com aquest:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "bingo-escola.firebaseapp.com",
  projectId: "bingo-escola",
  storageBucket: "bingo-escola.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Copia aquests valors al fitxer `.env.local` del projecte.

## 4. Activar Firestore Database

1. Al menú lateral, ves a "Build" > "Firestore Database"
2. Clica "Create database"
3. Selecciona la ubicació (per exemple: "europe-west1" per Europa)
4. Tria mode "Start in test mode" per començar

**IMPORTANT**: El mode test permet accés complet durant 30 dies. Per a producció, configura regles de seguretat adequades.

### Regles de seguretat recomanades

Després de crear la base de dades, ves a la pestanya "Rules" i pots usar aquestes regles:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permet llegir a tothom, però només escriure des de localhost o el teu domini
    match /packs/{packId} {
      allow read: if true;
      allow write: if request.auth != null || 
                     request.headers.origin.matches('http://localhost.*') ||
                     request.headers.origin == 'https://el-teu-domini.vercel.app';
    }
  }
}
```

O si prefereixes que qualsevol pugui editar (menys segur però més simple):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 5. Verificar que funciona

Després de configurar tot:

1. Executa `npm run dev`
2. Obre http://localhost:3000
3. Ves a http://localhost:3000/admin
4. Afegeix un pack de prova
5. Torna a la pàgina principal i hauries de veure el pack

Si hi ha errors, revisa:
- Les variables d'entorn al `.env.local`
- Que Firestore estigui activat
- La consola del navegador per veure errors específics
