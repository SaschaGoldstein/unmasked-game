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

// ── Gedeelde klok ───────────────────────────────────────────────────
// Telefoons lopen nooit exact gelijk. Timers en snelheidspunten vergelijken
// tijdstempels van verschillende toestellen, dus zonder correctie onthulde
// een voorlopende telefoon te vroeg voor iedereen en kreeg een achterlopende
// telefoon meer punten dan het maximum. serverNow() geeft de (geschatte)
// servertijd — Backend.syncClock() meet het verschil één keer bij het
// opstarten. Lukt dat niet, dan valt het gewoon terug op de eigen klok.
let clockOffsetMs = 0;
function serverNow() { return Date.now() + clockOffsetMs; }

// Opruimen: Firestore verwijdert lobby's (en de stemopnames) automatisch
// zodra expiresAt verstreken is, mits er een TTL-policy op dat veld staat
// (zie README-opruiming). Foto's, bekentenissen en stemmen blijven zo niet
// eindeloos bewaard.
const LOBBY_TTL_MS = 48 * 60 * 60 * 1000;
function lobbyExpiry() { return new Date(Date.now() + LOBBY_TTL_MS); }

function nameTaken(lobby, name) {
  const n = (name || '').trim().toLowerCase();
  return lobby.players.some(p => (p.name || '').trim().toLowerCase() === n);
}
const NAME_TAKEN_MSG = 'Die naam is al in gebruik in deze lobby — kies een andere (bv. met de eerste letter van je achternaam erbij).';

// Spelnamen worden herkenbaar maar niet kieskeurig vergeleken — een
// speler die "vrijdagavond bij lien" intikt moet nog steeds matchen met
// een lobby die als "Vrijdagavond bij Lien" is aangemaakt.
function gameNamesMatch(a, b) {
  return (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();
}

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

  async getLobby(code) { return this._read(code); }

  async updateLobby(code, mutateFn) {
    const lobby = this._read(code);
    if (!lobby) throw new Error('Lobby niet gevonden. Klopt de code?');
    mutateFn(lobby);
    this._write(code, lobby);
    return lobby;
  }

  async syncClock() { clockOffsetMs = 0; }

  async createLobby(hostName, maxPlayers, gameName) {
    let code = makeLobbyCode();
    for (let i = 0; i < 10 && this._read(code); i++) code = makeLobbyCode();
    const playerId = makeId();
    const lobby = {
      code, hostId: playerId, maxPlayers, gameName,
      phase: 'lobby', round: 0,
      players: [newPlayer(playerId, hostName, 0)],
      createdAt: Date.now(), expiresAt: lobbyExpiry().getTime(),
    };
    this._write(code, lobby);
    return { code, playerId };
  }

  async joinLobby(code, name, gameName) {
    const lobby = this._read(code);
    if (!lobby) throw new Error('Lobby niet gevonden. Klopt de code?');
    if (!gameNamesMatch(lobby.gameName, gameName)) throw new Error('Spelnaam komt niet overeen met deze lobby. Vraag de host om de juiste naam.');
    if (lobby.players.length >= lobby.maxPlayers) throw new Error('Deze lobby is al vol.');
    if (nameTaken(lobby, name)) throw new Error(NAME_TAKEN_MSG);
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

  // Eén veld (bv. guesses.qf_3.<speler>) zetten zonder de rest van de
  // lobby te herschrijven — zie FirebaseBackend.fastSet.
  async fastSet(code, path, value) {
    return this.updateLobby(code, (lobby) => {
      const parts = path.split('.');
      let o = lobby;
      for (const k of parts.slice(0, -1)) { if (!o[k] || typeof o[k] !== 'object') o[k] = {}; o = o[k]; }
      o[parts[parts.length - 1]] = value;
    });
  }

  async submitPhotoData(code, playerId, url) { localStorage.setItem(`unmasked:photo:${code}:${playerId}`, url); }
  async getPhotoData(code, playerId) { return localStorage.getItem(`unmasked:photo:${code}:${playerId}`); }

  async getVoice(code, playerId) {
    return localStorage.getItem(this._voiceKey(code, playerId));
  }
}

// ── FirebaseBackend: Firestore ──────────────────────────────────────────
// Same interface as LocalBackend. The lobby lives at `lobbies/{code}`;
// voice recordings (too big for that single doc) live in the
// `lobbies/{code}/voices/{playerId}` subcollection instead.
// joinLobby and updateLobby both use runTransaction — several players
// acting around the same moment (very normal in practice) must not
// silently clobber each other's writes to the shared lobby document.

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

  // Meet het verschil tussen de eigen klok en de Firestore-serverklok:
  // schrijf een servertijdstempel weg, lees hem terug en vergelijk met het
  // midden van de schrijfactie. Beste van 3 metingen (kortste round-trip).
  async syncClock() {
    try {
      await this._ready;
      let best = null;
      for (let i = 0; i < 3; i++) {
        const ref = this.fs.doc(this.db, 'clock', makeId());
        const t0 = Date.now();
        await this.fs.setDoc(ref, { t: this.fs.serverTimestamp(), expiresAt: new Date(Date.now() + 3600000) });
        const t1 = Date.now();
        const snap = await this.fs.getDoc(ref);
        const serverMs = snap.data().t.toMillis();
        const rtt = t1 - t0;
        if (!best || rtt < best.rtt) best = { rtt, offset: serverMs - (t0 + t1) / 2 };
        this.fs.deleteDoc(ref).catch(() => {});
      }
      if (best) clockOffsetMs = best.offset;
    } catch (e) { clockOffsetMs = 0; /* geen meting mogelijk — eigen klok gebruiken */ }
  }

  async createLobby(hostName, maxPlayers, gameName) {
    await this._ready;
    const playerId = makeId();
    let code = null;
    // Nooit een bestaande lobby overschrijven: binnen een transactie
    // controleren of de code al bestaat, anders een nieuwe proberen.
    for (let attempt = 0; attempt < 10 && !code; attempt++) {
      const candidate = makeLobbyCode();
      const ref = this.fs.doc(this.db, 'lobbies', candidate);
      const lobby = {
        code: candidate, hostId: playerId, maxPlayers, gameName,
        phase: 'lobby', round: 0,
        players: [newPlayer(playerId, hostName, 0)],
        createdAt: Date.now(), expiresAt: lobbyExpiry(),
      };
      const created = await this.fs.runTransaction(this.db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (snap.exists()) return false;
        transaction.set(ref, lobby);
        return true;
      });
      if (created) code = candidate;
    }
    if (!code) throw new Error('Kon geen vrije lobby-code vinden. Probeer opnieuw.');
    return { code, playerId };
  }

  async joinLobby(code, name, gameName) {
    await this._ready;
    const ref = this.fs.doc(this.db, 'lobbies', code);
    const playerId = makeId();
    await this.fs.runTransaction(this.db, async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) throw new Error('Lobby niet gevonden. Klopt de code?');
      const lobby = snap.data();
      if (!gameNamesMatch(lobby.gameName, gameName)) throw new Error('Spelnaam komt niet overeen met deze lobby. Vraag de host om de juiste naam.');
      if (lobby.players.length >= lobby.maxPlayers) throw new Error('Deze lobby is al vol.');
      if (nameTaken(lobby, name)) throw new Error(NAME_TAKEN_MSG);
      lobby.players.push(newPlayer(playerId, name, lobby.players.length));
      transaction.set(ref, lobby);
    });
    return { code, playerId };
  }

  // Eenmalig de lobby lezen (zonder te abonneren) — gebruikt om te checken
  // of een lokaal onthouden speler nog in de lobby zit voor we hem herstellen.
  async getLobby(code) {
    const snap = await this.fs.getDoc(await this._doc(code));
    return snap.exists() ? snap.data() : null;
  }

  subscribe(code, cb) {
    let unsub = () => {};
    this._doc(code).then((ref) => {
      unsub = this.fs.onSnapshot(ref, { includeMetadataChanges: true }, (snap) => {
        if (window.onBackendConnectionInfo) window.onBackendConnectionInfo({ fromCache: snap.metadata.fromCache });
        if (snap.exists()) cb(snap.data());
      });
    });
    return () => unsub();
  }

  async updateLobby(code, mutateFn) {
    await this._ready;
    const ref = this.fs.doc(this.db, 'lobbies', code);
    let result;
    await this.fs.runTransaction(this.db, async (transaction) => {
      const snap = await transaction.get(ref);
      if (!snap.exists()) throw new Error('Lobby niet gevonden. Klopt de code?');
      const lobby = snap.data();
      mutateFn(lobby);
      transaction.set(ref, lobby);
      result = lobby;
    });
    return result;
  }

  // Gokken en stemmen: enkel dat ene veld bijwerken (geen transactie,
  // geen leesactie). Tien spelers die tegelijk tikken staan zo niet meer
  // op elkaar te wachten, en er gaat geen gok verloren door een
  // mislukte transactie.
  async fastSet(code, path, value) {
    const ref = await this._doc(code);
    await this.fs.updateDoc(ref, path, value);
  }

  // Foto's staan in een eigen document (lobbies/{code}/photos/{speler}),
  // niet meer in het lobbydocument zelf. Anders ging bij elke gok het hele
  // document mét alle foto's opnieuw naar elke telefoon.
  async submitPhotoData(code, playerId, url) {
    await this._ready;
    await this.fs.setDoc(this.fs.doc(this.db, 'lobbies', code, 'photos', playerId), { url, expiresAt: lobbyExpiry() });
  }

  async getPhotoData(code, playerId) {
    await this._ready;
    const snap = await this.fs.getDoc(this.fs.doc(this.db, 'lobbies', code, 'photos', playerId));
    return snap.exists() ? snap.data().url : null;
  }

  async submitVoice(code, playerId, dataUrl) {
    const ref = await this._voiceDoc(code, playerId);
    await this.fs.setDoc(ref, { dataUrl, expiresAt: lobbyExpiry() });
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
function findPlayerByName(lobby, name) { return lobby.players.find(p => p.name === name); }

// ── Puntenbalans ──
// Elke ronde levert per item hooguit 10 punten op, zodat geen enkele ronde
// het spel op zich beslist. Getimede rondes (1-3): 10 bij een onmiddellijke
// juiste gok, aflopend tot 1 op het laatste moment. Rondes zonder timer
// (4-5): de snelste juiste gokker krijgt 10, de volgenden telkens minder.
const MAX_ITEM_POINTS = 10;
function speedPoints(elapsedSec, secondsAllowed) {
  const e = Math.min(secondsAllowed, Math.max(0, elapsedSec));
  return Math.max(1, Math.min(MAX_ITEM_POINTS, 1 + Math.round(9 * (1 - e / secondsAllowed))));
}
const RANK_POINTS = [10, 8, 6, 5, 4, 3, 2];
function rankPoints(rankIndex) { return RANK_POINTS[rankIndex] ?? 1; }

// ── Gokken en stemmen ──
// Staan in lobby.guesses, per vraag in een eigen "emmer":
//   guesses.qf_3.<speler> = { guess, at }   (Ronde 1, vraag 4)
// Sleutels: qf (R1), pr (R2), vh (R3), st (R4 eigenaar), dr (R4 drankje),
// bc (R5 verhaal), bv (R5 stem beste verhaal), fav (bonus favoriete foto).
// Een gok die te laat binnenkomt, belandt zo in de emmer van zijn eigen
// vraag en nooit bij de volgende. hydrateGuesses() zet de emmer van de
// huidige vraag terug op de vertrouwde plek (qf.answers, ...), zodat de
// rest van de code ongewijzigd kan blijven.
function guessBucket(lobby, key) { return (lobby.guesses && lobby.guesses[key]) || {}; }
function bucketValues(bucket) {
  const out = {};
  for (const [id, a] of Object.entries(bucket)) out[id] = a && typeof a === 'object' ? a.guess : a;
  return out;
}
function hydrateGuesses(lobby) {
  if (!lobby) return lobby;
  if (lobby.quickfire) lobby.quickfire.answers = guessBucket(lobby, 'qf_' + lobby.quickfire.index);
  if (lobby.photoRound) lobby.photoRound.answers = guessBucket(lobby, 'pr_' + lobby.photoRound.index);
  if (lobby.verhoor) lobby.verhoor.answers = guessBucket(lobby, 'vh_' + lobby.verhoor.index);
  if (lobby.soundtrack) {
    lobby.soundtrack.ownerAnswers = guessBucket(lobby, 'st_' + lobby.soundtrack.index);
    lobby.soundtrack.drinkAnswers = bucketValues(guessBucket(lobby, 'dr_' + lobby.soundtrack.index));
  }
  if (lobby.biecht) {
    lobby.biecht.answers = guessBucket(lobby, 'bc_' + lobby.biecht.index);
    lobby.biecht.votes = bucketValues(guessBucket(lobby, 'bv'));
  }
  if (lobby.hotornot) lobby.hotornot.votes = bucketValues(guessBucket(lobby, 'fav'));
  return lobby;
}
window.hydrateGuesses = hydrateGuesses;

async function submitGuess(code, key, playerId, guess) {
  return Backend.fastSet(code, `guesses.${key}.${playerId}`, { guess, at: serverNow() });
}

// Een gok die pas ruim na het einde van de tijd binnenkomt (trage
// verbinding), telt niet meer mee.
function tooLate(a, startAt, secondsAllowed) { return (a.at - startAt) / 1000 > secondsAllowed + 1.5; }

// Telt hoe vaak iemand ontmaskerd werd (minstens één ander raadde het
// juist) — voor de titel "Meest Ontmaskerd" op de eindstand.
function markUnmasked(player) { if (player) player.timesUnmasked = (player.timesUnmasked || 0) + 1; }

async function submitDossier(code, playerId, answers) {
  return Backend.updateLobby(code, (lobby) => {
    const p = findPlayer(lobby, playerId);
    if (p) { p.dossierAnswers = answers; p.dossierDone = true; }
  });
}

// Zet dossierDone terug op false zodat de host/andere spelers in de
// wachtkamer zien dat deze speler weer aan het bewerken is (en de host
// niet per ongeluk start terwijl iemand zijn dossier herbekijkt) — de
// eerder ingediende antwoorden blijven gewoon staan tot er opnieuw
// ingediend wordt via submitDossier.
async function reopenDossier(code, playerId) {
  return Backend.updateLobby(code, (lobby) => {
    const p = findPlayer(lobby, playerId);
    if (p) p.dossierDone = false;
  });
}

// De foto zelf gaat naar een apart document; in de lobby komt enkel een
// klein kenmerk (heeft een foto + maskerpositie).
async function submitPhoto(code, playerId, photo) {
  if (photo && photo.url) await Backend.submitPhotoData(code, playerId, photo.url);
  return Backend.updateLobby(code, (lobby) => {
    const p = findPlayer(lobby, playerId);
    if (!p) return;
    if (!photo || !photo.url) { delete p.photo; return; }
    const meta = { has: true };
    if (photo.maskX !== undefined) Object.assign(meta, { maskX: photo.maskX, maskY: photo.maskY, maskScale: photo.maskScale });
    p.photo = meta;
  });
}

async function setSettings(code, settings) {
  return Backend.updateLobby(code, (lobby) => { lobby.settings = settings; });
}

// "Nog een potje": scores, rondes en gokken op nul. Met keepDossiers blijven
// alle antwoorden, foto's en opnames bewaard; zonder vult iedereen een nieuw
// dossier in. Welke Ronde 1-vragen al gesteld werden, wordt onthouden zodat
// een tweede potje andere vragen kiest.
async function startRematch(code, keepDossiers) {
  return Backend.updateLobby(code, (lobby) => {
    const asked = (lobby.quickfire && lobby.quickfire.questions) || [];
    lobby.usedQuestionKeys = [...new Set([...(lobby.usedQuestionKeys || []), ...asked.map(q => q.label + '|' + q.correctPlayer)])];
    lobby.gameNumber = (lobby.gameNumber || 1) + 1;
    lobby.phase = 'lobby';
    ['quickfire', 'photoRound', 'hotornot', 'verhoor', 'soundtrack', 'biecht', 'skipNotes', 'guesses'].forEach(k => { delete lobby[k]; });
    lobby.expiresAt = Backend instanceof LocalBackend ? Date.now() + LOBBY_TTL_MS : lobbyExpiry();
    lobby.players.forEach(p => {
      p.score = 0; p.timesUnmasked = 0;
      if (!keepDossiers) {
        p.dossierDone = false; p.dossierAnswers = {};
        delete p.photo; p.voiceReady = false; p.voiceSkipped = false;
        lobby.usedQuestionKeys = [];
      }
    });
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

async function setQuickfire(code, quickfireState) {
  return Backend.updateLobby(code, (lobby) => { lobby.quickfire = quickfireState; });
}

// Onthulling + puntentoekenning in ÉÉN atomaire schrijfactie, zodat elke
// speler dit veilig mag proberen zodra de tijd om is — niet enkel de host.
// Een tabblad op de achtergrond (scherm op slot, andere app) kan door de
// browser worden vertraagd of zelfs volledig gepauzeerd, en als alleen de
// host dit mag triggeren bleef de hele groep dan voor altijd op "0"
// staan wachten op een tik die nooit kwam. Nu maakt het niet uit wiens
// toestel toevallig nog actief is: de eerste geslaagde poging wint, en
// de guard-check op qf.revealed zit IN dezelfde transactie, dus dubbele
// pogingen door twee gelijktijdige spelers kunnen nooit dubbel scoren.
async function revealQuickfire(code, index, secondsAllowed) {
  return Backend.updateLobby(code, (lobby) => {
    hydrateGuesses(lobby);
    const qf = lobby.quickfire;
    if (!qf || qf.index !== index || qf.revealed) return;
    const q = qf.questions[qf.index];
    let caught = false;
    for (const [voterId, a] of Object.entries(qf.answers || {})) {
      const voter = findPlayer(lobby, voterId);
      // Je kan geen punten krijgen op je eigen antwoord — dat zou je
      // altijd al weten, dus geen echte gok.
      if (voter && voter.name === q.correctPlayer) continue;
      if (tooLate(a, qf.questionStartAt, secondsAllowed)) continue;
      if (a.guess === q.correctPlayer) {
        const pts = speedPoints((a.at - qf.questionStartAt) / 1000, secondsAllowed);
        if (voter) { voter.score = (voter.score || 0) + pts; caught = true; }
      }
    }
    if (caught) markUnmasked(findPlayerByName(lobby, q.correctPlayer));
    qf.revealed = true;
  });
}

// Elke gok draagt de vraagindex mee: komt een trage gok pas aan nadat de
// vraag al onthuld is of de host al verder ging, dan wordt hij genegeerd
// in plaats van stilletjes bij de VOLGENDE vraag te belanden.
async function submitQFGuess(code, playerId, guess, index) { return submitGuess(code, 'qf_' + index, playerId, guess); }

async function setPhotoRound(code, photoRoundState) {
  return Backend.updateLobby(code, (lobby) => { lobby.photoRound = photoRoundState; });
}

// Zelfde atomaire onthulling + score-toekenning als revealQuickfire —
// zie de uitleg daar.
async function revealPhotoRound(code, index, secondsAllowed) {
  return Backend.updateLobby(code, (lobby) => {
    hydrateGuesses(lobby);
    const pr = lobby.photoRound;
    if (!pr || pr.index !== index || pr.revealed) return;
    const photo = pr.photos[pr.index];
    let caught = false;
    for (const [voterId, a] of Object.entries(pr.answers || {})) {
      const voter = findPlayer(lobby, voterId);
      // Je kan geen punten krijgen door je eigen foto te "raden".
      if (voter && voter.name === photo.player) continue;
      if (tooLate(a, pr.questionStartAt, secondsAllowed)) continue;
      if (a.guess === photo.player) {
        const pts = speedPoints((a.at - pr.questionStartAt) / 1000, secondsAllowed);
        if (voter) { voter.score = (voter.score || 0) + pts; caught = true; }
      }
    }
    if (caught) markUnmasked(findPlayerByName(lobby, photo.player));
    pr.revealed = true;
  });
}

async function submitPhotoGuess(code, playerId, guess, index) { return submitGuess(code, 'pr_' + index, playerId, guess); }

async function setHotOrNot(code, honState) {
  return Backend.updateLobby(code, (lobby) => { lobby.hotornot = honState; });
}

// Bonusronde "Favoriete foto": één stem per speler, niet op je eigen foto.
async function voteFavoritePhoto(code, voterId, targetPlayerId) {
  if (voterId === targetPlayerId) return;
  return submitGuess(code, 'fav', voterId, targetPlayerId);
}

// Host-tool: speler uit de lobby halen (bv. iemand die afhaakte of per
// ongeluk dubbel binnenkwam). De host zelf kan nooit verwijderd worden.
async function removePlayer(code, playerId) {
  return Backend.updateLobby(code, (lobby) => {
    if (playerId === lobby.hostId) return;
    lobby.players = lobby.players.filter(p => p.id !== playerId);
  });
}

// Host overnemen als de host wegvalt. Lukt enkel als de host intussen
// niet al gewisseld is (expectedHostId), zodat twee spelers die tegelijk
// tikken niet om beurten host worden.
async function claimHost(code, playerId, expectedHostId) {
  return Backend.updateLobby(code, (lobby) => {
    if (lobby.hostId !== expectedHostId || !findPlayer(lobby, playerId)) return;
    lobby.hostId = playerId;
  });
}

async function setVerhoor(code, verhoorState) {
  return Backend.updateLobby(code, (lobby) => { lobby.verhoor = verhoorState; });
}

// Zelfde atomaire onthulling + score-toekenning als revealQuickfire —
// zie de uitleg daar. Kent hier ook de -3-boete toe aan wie ontmaskerd
// werd, in dezelfde schrijfactie.
async function revealVerhoor(code, index, secondsAllowed) {
  return Backend.updateLobby(code, (lobby) => {
    hydrateGuesses(lobby);
    const v = lobby.verhoor;
    if (!v || v.index !== index || v.revealed) return;
    const q = v.list[v.index];
    const answers = v.answers || {};
    let caught = false;
    for (const [voterId, a] of Object.entries(answers)) {
      // Je kan jezelf niet "ontmaskeren" — dat telt niet als gok.
      if (voterId === q.playerId) continue;
      if (tooLate(a, v.questionStartAt, secondsAllowed)) continue;
      if (a.guess === q.playerId) {
        caught = true;
        const pts = speedPoints((a.at - v.questionStartAt) / 1000, secondsAllowed);
        const p = findPlayer(lobby, voterId);
        if (p) p.score = (p.score || 0) + pts;
      }
    }
    if (caught) {
      const confessor = findPlayer(lobby, q.playerId);
      if (confessor) confessor.score = (confessor.score || 0) - 3;
      markUnmasked(confessor);
    }
    v.revealed = true;
  });
}

async function submitVerhoorGuess(code, playerId, guess, index) { return submitGuess(code, 'vh_' + index, playerId, guess); }

async function setBiecht(code, biechtState) {
  return Backend.updateLobby(code, (lobby) => { lobby.biecht = biechtState; });
}

async function markVoiceReady(code, playerId) {
  return Backend.updateLobby(code, (lobby) => {
    const p = findPlayer(lobby, playerId);
    if (p) p.voiceReady = true;
  });
}

async function markVoiceSkipped(code, playerId) {
  return Backend.updateLobby(code, (lobby) => {
    const p = findPlayer(lobby, playerId);
    if (p) p.voiceSkipped = true;
  });
}

async function voteBiecht(code, targetPlayerId, voterId) {
  if (targetPlayerId === voterId) return;
  return submitGuess(code, 'bv', voterId, targetPlayerId);
}

async function submitBiechtGuess(code, playerId, guess, index) { return submitGuess(code, 'bc_' + index, playerId, guess); }

// Atomaire onthulling + score-toekenning, zelfde patroon als
// revealQuickfire — kent punten toe aan wie het eerst juist gokte van
// wie het verhaal is. Geen vaste tijdslimiet (opnames zijn onbeperkt
// lang), dus "eerste juiste gok wint" i.p.v. een snelheidsformule.
async function revealBiechtStory(code, index) {
  return Backend.updateLobby(code, (lobby) => {
    hydrateGuesses(lobby);
    const b = lobby.biecht;
    if (!b || b.index !== index || b.revealed) return;
    const targetId = b.order[b.index];
    const correctGuessers = Object.entries(b.answers || {})
      // Je kan geen punten krijgen door je eigen verhaal te "raden".
      .filter(([voterId, a]) => voterId !== targetId && a.guess === targetId)
      .sort((a, b2) => a[1].at - b2[1].at);
    // Elke juiste gokker krijgt punten — de snelste 10, daarna aflopend.
    correctGuessers.forEach(([voterId], i) => {
      const p = findPlayer(lobby, voterId);
      if (p) p.score = (p.score || 0) + rankPoints(i);
    });
    if (correctGuessers.length) markUnmasked(findPlayer(lobby, targetId));
    b.revealed = true;
  });
}

// Atomaire afronding van de "beste verhaal"-stemronde — telt de stemmen
// en kent de bonuspunten toe, één keer, ongeacht hoe vaak dit wordt
// aangeroepen. Zonder deze guard kon een dubbele tik op "Bekijk de
// eindstand" de winnaar(s) van de stemronde twee keer de 5 bonuspunten
// geven, vlak voor de uiteindelijke eindstand.
async function finalizeBiechtVote(code) {
  return Backend.updateLobby(code, (lobby) => {
    hydrateGuesses(lobby);
    const b = lobby.biecht;
    if (!b || b.voteFinalized) return;
    const tally = {};
    // Een stem op je eigen verhaal telt niet.
    Object.entries(b.votes || {}).forEach(([voterId, pid]) => { if (voterId !== pid) tally[pid] = (tally[pid] || 0) + 1; });
    const maxVotes = Math.max(0, ...Object.values(tally));
    if (maxVotes > 0) {
      const winners = Object.entries(tally).filter(([, c]) => c === maxVotes).map(([pid]) => pid);
      for (const pid of winners) {
        const p = findPlayer(lobby, pid);
        if (p) p.score = (p.score || 0) + 5;
      }
    }
    b.voteFinalized = true;
  });
}

async function setSoundtrack(code, soundtrackState) {
  return Backend.updateLobby(code, (lobby) => { lobby.soundtrack = soundtrackState; });
}

// Atomaire onthulling + score-toekenning voor "van wie is dit nummer",
// zelfde patroon als revealQuickfire — zie de uitleg daar. Zonder deze
// guard-in-dezelfde-transactie kon een dubbele tik op "Onthul eigenaar
// & drankje" de winnaar twee keer de 5 punten geven.
async function revealSoundtrackOwner(code, index) {
  return Backend.updateLobby(code, (lobby) => {
    hydrateGuesses(lobby);
    const st = lobby.soundtrack;
    if (!st || st.index !== index || st.revealed) return;
    const track = st.list[st.index];
    const correctGuessers = Object.entries(st.ownerAnswers || {})
      // Je kan geen punten krijgen door je eigen nummer te "raden".
      .filter(([voterId, a]) => voterId !== track.playerId && a.guess === track.playerId)
      .sort((a, b) => a[1].at - b[1].at);
    // Elke juiste gokker krijgt punten — de snelste 10, daarna aflopend.
    correctGuessers.forEach(([voterId], i) => {
      const p = findPlayer(lobby, voterId);
      if (p) p.score = (p.score || 0) + rankPoints(i);
    });
    if (correctGuessers.length) markUnmasked(findPlayer(lobby, track.playerId));
    st.revealed = true;
  });
}

// Zelfde atomaire bescherming voor de drankje-bonusronde — voorkomt dat
// een dubbele tik op "Volgende nummer" de juiste gokkers twee keer de
// 2 bonuspunten geeft.
async function revealSoundtrackDrink(code, index) {
  return Backend.updateLobby(code, (lobby) => {
    hydrateGuesses(lobby);
    const st = lobby.soundtrack;
    if (!st || st.index !== index || st.drinkRevealed) return;
    const track = st.list[st.index];
    const correctDrink = (track.drink || '').trim();
    if (correctDrink) {
      const winners = Object.entries(st.drinkAnswers || {})
        // Je kan geen punten krijgen door je eigen drankje te "raden".
        .filter(([id, d]) => id !== track.playerId && d === correctDrink)
        .map(([id]) => id);
      for (const id of winners) {
        const p = findPlayer(lobby, id);
        if (p) p.score = (p.score || 0) + 2;
      }
    }
    st.drinkRevealed = true;
  });
}

async function submitSoundtrackGuess(code, playerId, guess, index) { return submitGuess(code, 'st_' + index, playerId, guess); }

async function submitSoundtrackDrinkGuess(code, playerId, drink, index) { return submitGuess(code, 'dr_' + index, playerId, drink); }

window.GameOps = {
  submitDossier, reopenDossier, submitPhoto, setPhase, addScore, setSettings, startRematch,
  setQuickfire, submitQFGuess, revealQuickfire, setPhotoRound, submitPhotoGuess, revealPhotoRound,
  setHotOrNot, voteFavoritePhoto, removePlayer, claimHost, speedPoints, rankPoints,
  setVerhoor, submitVerhoorGuess, revealVerhoor,
  setBiecht, markVoiceReady, markVoiceSkipped, voteBiecht, submitBiechtGuess, revealBiechtStory, finalizeBiechtVote,
  setSoundtrack, submitSoundtrackGuess, submitSoundtrackDrinkGuess, revealSoundtrackOwner, revealSoundtrackDrink,
};
