# Bingo Solidari - La Marató de TV3

Aplicació web per gestionar els packs de regals del Bingo Solidari de l'escola.

## Característiques

✨ **Visualització en temps real** - Els assistents poden veure quins packs estan disponibles i quins ja s'han guanyat
🎨 **Disseny atractiu** - Interfície amigable i colorida adequada per una escola
⚙️ **Panell d'administració** - Gestió fàcil dels packs sense necessitat de sistema d'usuaris
🔄 **Actualització automàtica** - Canvis visibles a l'instant a totes les pantalles

## Configuració

### 1. Instal·lar dependències

```bash
npm install
```

### 2. Configurar Firebase

1. Ves a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nou projecte
3. Afegeix una aplicació web al projecte
4. Copia les credencials de configuració
5. Edita el fitxer `.env.local` amb les teves credencials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=la_teva_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=el_teu_projecte.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=el_teu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=el_teu_projecte.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=el_teu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=la_teva_app_id
```

6. A Firebase Console, activa **Firestore Database**:
   - Ves a "Build" > "Firestore Database"
   - Clica "Create database"
   - Selecciona mode "Start in test mode" (o configura les regles de seguretat)
   - Tria la ubicació més propera

### 3. Executar l'aplicació

```bash
npm run dev
```

Obre [http://localhost:3000](http://localhost:3000) al teu navegador.

## Ús

### Pantalla Pública

- Mostra tots els packs de regals
- Els packs disponibles apareixen amb vora verda i l'etiqueta "DISPONIBLE"
- Els packs guanyats apareixen en gris amb l'etiqueta "GUANYAT"
- S'actualitza automàticament quan hi ha canvis

### Panell d'Administració

Accés: Clica el botó ⚙️ a la part inferior dreta o ves a `/admin`

Funcions:
- **Afegir packs**: Clica "+ Afegir Nou Pack" i omple el formulari
- **Editar packs**: Clica "Editar" a qualsevol pack
- **Marcar com a guanyat**: Clica "Marcar Guanyat" quan un pack s'hagi sortejar
- **Tornar disponible**: Si cal revertir, clica "Marcar Disponible"
- **Eliminar packs**: Clica "Eliminar" per esborrar un pack

## Desplegament

### Opció 1: Vercel (Recomanat)

1. Puja el projecte a GitHub
2. Ves a [vercel.com](https://vercel.com)
3. Importa el repositori
4. Afegeix les variables d'entorn (les mateixes del `.env.local`)
5. Desplega!

### Opció 2: Altres plataformes

L'aplicació es pot desplegar a qualsevol servei que suporti Next.js:
- Netlify
- Railway
- Render
- etc.

## Consells d'ús

- **Durant el bingo**: Deixa la pantalla pública projectada perquè tothom la vegi
- **Gestió dels packs**: Un administrador pot gestionar els packs des del seu mòbil/tablet
- **Imatges**: Pots afegir URLs d'imatges dels packs per fer-ho més visual
- **Ordre**: Usa el camp "Ordre" per controlar com es mostren els packs

## Tecnologies utilitzades

- **Next.js 15** - Framework React
- **TypeScript** - Tipat estàtic
- **Tailwind CSS** - Estils
- **Firebase/Firestore** - Base de dades en temps real
- **React Hooks** - Gestió d'estat

## Suport

Per qualsevol problema o dubte, revisa la configuració de Firebase i les variables d'entorn.

---

**Fet amb 💜 per l'escola i La Marató de TV3**
