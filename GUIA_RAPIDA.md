# ⚡ Començar Ràpidament

## Pas 1: Configura Firebase (5 minuts)

### 1.1. Crea el projecte Firebase
1. Ves a https://console.firebase.google.com/
2. Clica **"Afegir projecte"** (o "Add project")
3. Nom del projecte: `bingo-escola` (o el que vulguis)
4. Pots desactivar Google Analytics si vols
5. Clica **"Crear projecte"**

### 1.2. Afegeix una aplicació web
1. A la pàgina del projecte, clica la icona **</>** (Web)
2. Nom de l'app: `Bingo Solidari`
3. **NO** marcar "Firebase Hosting"
4. Clica **"Registrar app"**

### 1.3. Copia les credencials
Veuràs un codi JavaScript. Copia els valors i edita el fitxer `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bingo-escola.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bingo-escola
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bingo-escola.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 1.4. Activa Firestore
1. Al menú lateral, ves a **"Build" > "Firestore Database"**
2. Clica **"Create database"**
3. Ubicació: Tria **"europe-west"** (més proper a Catalunya)
4. Mode: **"Start in test mode"** (permet llegir/escriure durant 30 dies)
5. Clica **"Enable"**

## Pas 2: Executa l'aplicació

```bash
# Reinicia el servidor si estava corrent
npm run dev
```

Obre http://localhost:3000

## Pas 3: Afegeix packs

1. Clica el botó ⚙️ (o ves a `/admin`)
2. Clica **"+ Afegir Nou Pack"**
3. Omple el formulari
4. Clica **"Crear Pack"**
5. Torna a la pàgina principal i veuràs el pack!

## Problemes comuns

### ❌ "Firebase no està configurat"
- Verifica que has editat el `.env.local` amb les credencials reals
- Reinicia el servidor (`npm run dev`)

### ❌ "Error connectant amb la base de dades"
- Verifica que has activat Firestore Database a Firebase Console
- Comprova que el `projectId` al `.env.local` és correcte

### ❌ "Missing or insufficient permissions"
- Assegura't que Firestore està en mode "test mode"
- O configura regles de seguretat adequades

## Regles de seguretat recomanades

Després del període de test, usa aquestes regles a Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /packs/{packId} {
      allow read: if true;  // Tothom pot llegir
      allow write: if true; // Temporalment permetre a tothom (canvia això en producció)
    }
  }
}
```

---

**Ara ja pots començar a usar l'aplicació! 🎉**
