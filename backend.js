// ─────────────────────────────────────────
//  Unmasked — backend.js
//  Swappable multiplayer data layer.
//
//  Core primitives every backend implements:
//    createLobby(hostName, maxPlayers) -> { code, playerId }
//    joinLobby(code, name)             -> { code, playerId }
//    subscribe(code, cb)               -> unsubscribe()
//    updateLobby(code, mutateFn)       -> read-modify-write the lobby doc
//    submitVoice(code, playerId, dataUrl) / getVoice(code, playerId)
//      — audio is too big for the main lobby doc, so it's stored separately.
//
//  Everything else (dossier answers, photos, scores, hot-or-not votes,
//  verhoor state, ...) is implemented once in this file as free functions
//  built on top of updateLobby(), so Local and Firebase never need their
//  own copy of that logic — see "Game operations" below.
//
//  Today ACTIVE_BACKEND is LocalBackend (localStorage + BroadcastChannel —
//  works across browser tabs on one device, good for testing without a
//  server). Once firebase-config.js has real keys, FirebaseBackend takes
//  over automatically — nothing in script.js needs to change.
// ─────────────────────────────────────────

const AVATAR_PALETTE = [
  { color: '#ff3d6b', bg: '#2a1020' },
  { color: '#378add', bg: '#0e1e30' },
  { color: '#ef9f27', bg: '#1a1510' },
  { color: '#4caf82', bg: '#0e1e14' },
  { color: '#c084fc', bg: '#1a1030' },
  { color: '#f87171', bg: '#1e100e' },
];

function avatarFor(index) { return AVATAR_PALETTE[index % AVATAR_PALETTE.length]; }

function makeLobbyCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let s = '';
  for (let i = 0; i < 2; i++) s += letters[Math.floor(Math.random() * letters.length)];
  return 'UM-' + s + Math.floor(10 + Math.random() * 90);
}

function makeId() { return Math.random().toString(36).slice(2, 10); }

function newPlayer(id, name, index) {
  const av = avatarFor(index);
  return { id, name, color: av.color, bg: av.bg, letter: name.trim()[0].toUpperCase(), dossierDone: false, dossierAnswers: {}, score: 0 };
}

// ── LocalBackend: localStorage + BroadcastChannel ──────────────────────
// Real for multiple tabs/windows on the same browser. Not cross-device —
// that needs an actual server (see FirebaseBackend below).

class LocalBackend {
  constructor() { this.channels = {}; this.localSubs = {}; }

  _key(code) { return `unmasked:lobby:${code}`; }
  _voiceKey(code, playerId) { return `unmasked:voice:${code}:${playerId}`; }

  _read(code) {
    const raw = localStorage.getItem(this._key(code));
    return raw ? JSON.parse(raw) : null;
  }

  _write(code, lobby) {
    localStorage.setItem(this._key(code), JSON.stringify(lobby));
    // BroadcastChannel does not deliver messages back to the sending tab,
    // so the tab that made the change has to be notified directly.
    this._channel(code).postMessage(lobby);
    (this.localSubs[code] || []).forEach(cb => cb(lobby));
  }

  _channel(code) {
    if (!this.channels[code]) this.channels[code] = new BroadcastChannel('unmasked:' + code);
    return this.channels[code];
  }

  async updateLobby(code, mutateFn) {
    const lobby = this._read(code);
    if (!lobby) throw new Error('Lobby niet gevonden. Klopt de code?');
    mutateFn(lobby);
    this._write(code, lobby);
    return lobby;
  }

  async createLobby(hostName, maxPlayers) {
    const code = makeLobbyCode();
    const playerId = makeId();
    const lobby = {
      code, hostId: playerId, maxPlayers,
      phase: 'lobby', round: 0,
      players: [newPlayer(playerId, hostName, 0)],
      createdAt: Date.now(),
    };
    this._write(code, lobby);
    return { code, playerId };
  }

  async joinLobby(code, name) {
    const lobby = this._read(code);
    if (!lobby) throw new Error('Lobby niet gevonden. Klopt de code?');
    if (lobby.players.length >= lobby.maxPlayers) throw new Error('Deze lobby is al vol.');
    const playerId = makeId();
    lobby.players.push(newPlayer(playerId, name, lobby.players.length));
    this._write(code, lobby);
    return { code, playerId };
  }

  subscribe(code, cb) {
    const existing = this._read(code);
    if (existing) cb(existing);
    if (!this.localSubs[code]) this.localSubs[code] = [];
    this.localSubs[code].push(cb);
    const ch = this._channel(code);
    const onMsg = (ev) => cb(ev.data);
    ch.addEventListener('message', onMsg);
    const onStorage = (ev) => { if (ev.key === this._key(code) && ev.newValue) cb(JSON.parse(ev.newValue)); };
    window.addEventListener('storage', onStorage);
    return () => {
      this.localSubs[code] = (this.localSubs[code] || []).filter(f => f !== cb);
      ch.removeEventListener('message', onMsg);
      window.removeEventListener('storage', onStorage);
    };
  }

  async submitVoice(code, playerId, dataUrl) {
    localStorage.setItem(this._voiceKey(code, playerId), dataUrl);
  }

  async getVoice(code, playerId) {
    return localStorage.getItem(this._voiceKey(code, playerId));
  }
}

// ── FirebaseBackend: Firestore ──────────────────────────────────────────
// Same interface as LocalBackend. The lobby lives at `lobbies/{code}`;
// voice recordings (too big for that single doc) live in the
// `lobbies/{code}/voices/{playerId}` subcollection instead.
// NOT wired in by default and not yet tested against a real project —
// fill in firebase-config.js with real keys to activate it, then smoke-test
// the full lobby → dossier → waiting → round flow before relying on it.

class FirebaseBackend {
  constructor(config) {
    this.config = config;
    this._ready = this._init();
  }

  async _init() {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const fs = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    this.fs = fs;
    const app = initializeApp(this.config);
    this.db = fs.getFirestore(app);
  }

  async _doc(code) { await this._ready; return this.fs.doc(this.db, 'lobbies', code); }
  async _voiceDoc(code, playerId) { await this._ready; return this.fs.doc(this.db, 'lobbies', code, 'voices', playerId); }

  async createLobby(hostName, maxPlayers) {
    await this._ready;
    const code = makeLobbyCode();
    const playerId = makeId();
    const lobby = {
      code, hostId: playerId, maxPlayers,
      phase: 'lobby', round: 0,
      players: [newPlayer(playerId, hostName, 0)],
      createdAt: Date.now(),
    };
    await this.fs.setDoc(await this._doc(code), lobby);
    return { code, playerId };
  }

  async joinLobby(code, name) {
    const ref = await this._doc(code);
    const snap = await this.fs.getDoc(ref);
    if (!snap.exists()) throw new Error('Lobby niet gevonden. Klopt de code?');
    const lobby = snap.data();
    if (lobby.players.length >= lobby.maxPlayers) throw new Error('Deze lobby is al vol.');
    const playerId = makeId();
    lobby.players.push(newPlayer(playerId, name, lobby.players.length));
    await this.fs.updateDoc(ref, { players: lobby.players });
    return { code, playerId };
  }

  subscribe(code, cb) {
    let unsub = () => {};
    this._doc(code).then((ref) => {
      unsub = this.fs.onSnapshot(ref, (snap) => { if (snap.exists()) cb(snap.data()); });
    });
    return () => unsub();
  }

  async updateLobby(code, mutateFn) {
    const ref = await this._doc(code);
    const snap = await this.fs.getDoc(ref);
    if (!snap.exists()) throw new Error('Lobby niet gevonden. Klopt de code?');
    const lobby = snap.data();
    mutateFn(lobby);
    await this.fs.setDoc(ref, lobby);
    return lobby;
  }

  async submitVoice(code, playerId, dataUrl) {
    const ref = await this._voiceDoc(code, playerId);
    await this.fs.setDoc(ref, { dataUrl });
  }

  async getVoice(code, playerId) {
    const ref = await this._voiceDoc(code, playerId);
    const snap = await this.fs.getDoc(ref);
    return snap.exists() ? snap.data().dataUrl : null;
  }
}

// ── Backend selection ────────────────────────────────────────────────
// FIREBASE_CONFIG lives in firebase-config.js, kept separate so pasting
// real keys never touches this file. Falls back to LocalBackend whenever
// it's missing or still has placeholder values.

const hasRealFirebaseConfig = typeof FIREBASE_CONFIG !== 'undefined'
  && FIREBASE_CONFIG
  && FIREBASE_CONFIG.apiKey
  && FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY';

const Backend = hasRealFirebaseConfig ? new FirebaseBackend(FIREBASE_CONFIG) : new LocalBackend();
window.Backend = Backend;
window.UNMASKED_BACKEND_MODE = hasRealFirebaseConfig ? 'firebase' : 'local';

// ── Game operations ─────────────────────────────────────────────────
// Built once on top of Backend.updateLobby(), shared by both backends.

function findPlayer(lobby, playerId) { return lobby.players.find(p => p.id === playerId); }

async function submitDossier(code, playerId, answers) {
  return Backend.updateLobby(code, (lobby) => {
    const p = findPlayer(lobby, playerId);
    if (p) { p.dossierAnswers = answers; p.dossierDone = true; }
  });
}

async function submitPhoto(code, playerId, photo) {
  return Backend.updateLobby(code, (lobby) => {
    const p = findPlayer(lobby, playerId);
    if (p) p.photo = photo;
  });
}

async function setPhase(code, phase, extra = {}) {
  return Backend.updateLobby(code, (lobby) => { lobby.phase = phase; Object.assign(lobby, extra); });
}

async function addScore(code, playerId, points) {
  return Backend.updateLobby(code, (lobby) => {
    const p = findPlayer(lobby, playerId);
    if (p) p.score = (p.score || 0) + points;
  });
}

async function setHotOrNot(code, honState) {
  return Backend.updateLobby(code, (lobby) => { lobby.hotornot = honState; });
}

async function voteHotOrNot(code, targetPlayerId, voterId, vote) {
  return Backend.updateLobby(code, (lobby) => {
    if (!lobby.hotornot || lobby.hotornot.targetId !== targetPlayerId) return;
    if (!lobby.hotornot.votes) lobby.hotornot.votes = {};
    lobby.hotornot.votes[voterId] = vote;
  });
}

async function setVerhoor(code, verhoorState) {
  return Backend.updateLobby(code, (lobby) => { lobby.verhoor = verhoorState; });
}

async function submitVerhoorGuess(code, playerId, guess) {
  return Backend.updateLobby(code, (lobby) => {
    if (!lobby.verhoor) return;
    if (!lobby.verhoor.answers) lobby.verhoor.answers = {};
    if (lobby.verhoor.answers[playerId]) return; // one guess per question
    lobby.verhoor.answers[playerId] = { guess, at: Date.now() };
  });
}

async function setBiecht(code, biechtState) {
  return Backend.updateLobby(code, (lobby) => { lobby.biecht = biechtState; });
}

async function markVoiceReady(code, playerId) {
  return Backend.updateLobby(code, (lobby) => {
    const p = findPlayer(lobby, playerId);
    if (p) p.voiceReady = true;
  });
}

async function voteBiecht(code, targetPlayerId, voterId) {
  return Backend.updateLobby(code, (lobby) => {
    if (!lobby.biecht) return;
    if (!lobby.biecht.votes) lobby.biecht.votes = {};
    lobby.biecht.votes[voterId] = targetPlayerId;
  });
}

async function setSoundtrack(code, soundtrackState) {
  return Backend.updateLobby(code, (lobby) => { lobby.soundtrack = soundtrackState; });
}

async function submitSoundtrackGuess(code, playerId, guess) {
  return Backend.updateLobby(code, (lobby) => {
    if (!lobby.soundtrack) return;
    if (!lobby.soundtrack.ownerAnswers) lobby.soundtrack.ownerAnswers = {};
    if (lobby.soundtrack.ownerAnswers[playerId]) return;
    lobby.soundtrack.ownerAnswers[playerId] = { guess, at: Date.now() };
  });
}

async function submitSoundtrackDrinkGuess(code, playerId, drink) {
  return Backend.updateLobby(code, (lobby) => {
    if (!lobby.soundtrack) return;
    if (!lobby.soundtrack.drinkAnswers) lobby.soundtrack.drinkAnswers = {};
    if (lobby.soundtrack.drinkAnswers[playerId]) return;
    lobby.soundtrack.drinkAnswers[playerId] = drink;
  });
}

window.GameOps = {
  submitDossier, submitPhoto, setPhase, addScore,
  setHotOrNot, voteHotOrNot,
  setVerhoor, submitVerhoorGuess,
  setBiecht, markVoiceReady, voteBiecht,
  setSoundtrack, submitSoundtrackGuess, submitSoundtrackDrinkGuess,
};
