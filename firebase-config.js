// ─────────────────────────────────────────
//  Unmasked — firebase-config.js
//
//  Leeg = de app draait op de lokale backend (localStorage, werkt over
//  meerdere tabs/vensters op dit toestel, niet tussen verschillende
//  telefoons).
//
//  Om echte multiplayer over meerdere telefoons te krijgen:
//   1. Maak een gratis project op https://console.firebase.google.com
//   2. Activeer "Firestore Database" (starten in test mode is prima om te beginnen)
//   3. Project settings → General → "Your apps" → Web app → kopieer de config
//   4. Plak de waarden hieronder
//   5. Herlaad de pagina — script.js en backend.js hoeven niet aangepast
// ─────────────────────────────────────────

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBf1JrsNuTTEQES113QEJqPTKIw2l54z3A',
  authDomain: 'unmasked-game-30706.firebaseapp.com',
  projectId: 'unmasked-game-30706',
  storageBucket: 'unmasked-game-30706.firebasestorage.app',
  messagingSenderId: '395651008935',
  appId: '1:395651008935:web:810b603c975311d96c0e82',
};
