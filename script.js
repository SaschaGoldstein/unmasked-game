// ─────────────────────────────────────────
//  Unmasked — script.js
//  Mobiele website prototype v1
// ─────────────────────────────────────────

// ── Ronde 1 demo-antwoorden ───────────────
// Gebruikt zolang er nog geen (of te weinig) echte dossier-antwoorden
// binnen zijn van medespelers — zie pickSessionQuestions().

const DEMO_ANSWERS = {
  'Ik word chagrijnig van:': [{ text: 'Als mensen te laat komen', player: 'Lien' }, { text: 'Natte handdoeken op de vloer', player: 'Thomas' }, { text: 'Slechte wifi tijdens een film', player: 'Emma' }, { text: 'Als iemand mijn eten opeet', player: 'Kobe' }, { text: 'Reply-all mails', player: 'Nina' }, { text: 'Niet doorlopen in de supermarkt', player: 'Sander' }],
  'De mooiste plek op de wereld waar ik ben geweest:': [{ text: 'Lissabon, met te weinig geld', player: 'Lien' }, { text: 'Een camping in de Ardennen met kapotte tent', player: 'Kobe' }, { text: 'Bali, net voor het te toeristisch werd', player: 'Emma' }, { text: 'Thuis, gewoon in mijn eigen tuin', player: 'Sander' }, { text: 'IJsland in de regen, alsnog prachtig', player: 'Nina' }, { text: 'Een strand in Portugal zonder bereik', player: 'Thomas' }],
  'Ik geef het liefst geld uit aan:': [{ text: 'Sneakers die ik nooit draag', player: 'Thomas' }, { text: 'Planten die daarna doodgaan', player: 'Emma' }, { text: 'Concerttickets last minute', player: 'Lien' }, { text: 'Eten bij de bakker om 8u', player: 'Sander' }, { text: 'Online cursussen die ik niet afmaak', player: 'Nina' }, { text: 'Gadgets van AliExpress', player: 'Kobe' }],
  'Dit heb ik het laatste gegoogled:': [{ text: 'Hoe lang kan een mens zonder slaap?', player: 'Nina' }, { text: 'Calorieën frietje mayo', player: 'Kobe' }, { text: 'Weer morgen om 6u', player: 'Sander' }, { text: 'Symptomen burnout test', player: 'Emma' }, { text: 'Goedkoopste vlucht Barcelona', player: 'Lien' }, { text: 'Hoe kook je een ei perfect?', player: 'Thomas' }],
  'De beste manier om het weekend te beginnen:': [{ text: 'Pancakes maken in pyjama', player: 'Emma' }, { text: 'Zo lang mogelijk in bed blijven', player: 'Thomas' }, { text: 'Croissant en koffie buiten', player: 'Lien' }, { text: 'Vroeg sporten zodat de rest vrij is', player: 'Nina' }, { text: 'Netflix aan, telefoon uit', player: 'Sander' }, { text: 'Snoozen tot 12u, schuldig voelen, herhalen', player: 'Kobe' }],
};

const PLAYERS = [
  { name: 'Sander', color: '#ff3d6b', bg: '#2a1020', letter: 'S' },
  { name: 'Lien',   color: '#378add', bg: '#0e1e30', letter: 'L' },
  { name: 'Thomas', color: '#ef9f27', bg: '#1a1510', letter: 'T' },
  { name: 'Emma',   color: '#4caf82', bg: '#0e1e14', letter: 'E' },
  { name: 'Nina',   color: '#c084fc', bg: '#1a1030', letter: 'N' },
  { name: 'Kobe',   color: '#f87171', bg: '#1e100e', letter: 'K' },
];

const R2_PHOTOS = [
  { emoji: '🧑‍🦱', player: 'Sander' },
  { emoji: '👩‍🦰', player: 'Lien'   },
  { emoji: '🧔',   player: 'Thomas' },
  { emoji: '👩‍🦳', player: 'Emma'   },
  { emoji: '👩‍🦲', player: 'Nina'   },
  { emoji: '🧑‍🦯', player: 'Kobe'  },
];

const CONFESSIONS = [
  { text: '"Ik heb ooit een parkeerboete van een andere auto afgehaald en op mijn eigen voorruit gelegd."', player: 'Kobe' },
  { text: '"Ik heb een hele zak chips opgegeten en de lege zak teruggezet in de kast."', player: 'Emma' },
  { text: '"Ik heb ooit gedaan alsof mijn telefoon geen bereik had om een saai gesprek te ontlopen."', player: 'Lien' },
  { text: '"Ik heb een leugen verteld die drie weken lang is blijven groeien."', player: 'Thomas' },
  { text: '"Ik heb ooit stiekem een cadeau dat ik kreeg, doorverkocht."', player: 'Nina' },
  { text: '"Ik heb een vergadering overgeslagen door te doen alsof ik ziek was, en ben gewoon gaan wandelen."', player: 'Sander' },
  { text: '"Ik heb ooit een grote leugen verteld over waar ik was, gewoon om even alleen te kunnen zijn."', player: 'Emma' },
  { text: '"Ik heb ooit expres een appje op \'gelezen\' laten staan om niet te hoeven antwoorden."', player: 'Kobe' },
  { text: '"Ik heb ooit gezegd dat ik een cadeau prachtig vond, en het de volgende dag weggegeven."', player: 'Lien' },
  { text: '"Ik heb ooit een taxi laten wachten omdat ik nog snel mijn haar wilde doen."', player: 'Nina' },
];

const WHOAMI_BANK = [
  { clues: ['Wordt heel vroeg wakker, zelfs in het weekend.', 'Heeft een leeslijst die alleen maar langer wordt.', 'Drinkt koffie altijd zwart.'], player: 'Nina' },
  { clues: ['Kan totaal niet tegen slechte wifi.', 'Heeft een la vol opladers die nergens meer bij passen.', 'Kijkt alles op social media, post zelf nooit iets.'], player: 'Thomas' },
  { clues: ['Praat hardop tegen huisdieren, ook als er niemand thuis is.', 'Heeft een speciale mok die niemand anders mag gebruiken.', 'Kan een hele avond over één hobby praten.'], player: 'Emma' },
  { clues: ['Plant elke vakantie tot op de minuut.', 'Heeft altijd een reservepowerbank bij zich.', 'Wordt nerveus van last-minute plannen.'], player: 'Sander' },
  { clues: ['Vergeet vaak waar de sleutels liggen.', 'Zingt mee met reclames.', 'Heeft een verzameling tas­jes vol andere tasjes.'], player: 'Lien' },
  { clues: ['Reageert als laatste in elke groepschat.', 'Heeft een geheime Spotify-playlist die niemand kent.', 'Bestelt altijd hetzelfde gerecht in een nieuw restaurant.'], player: 'Kobe' },
  { clues: ['Kan niet slapen zonder achtergrondgeluid.', 'Heeft een lijst met films die "ooit nog eens" bekeken worden.', 'Is de eerste die weggaat van een feestje.'], player: 'Thomas' },
  { clues: ['Onthoudt verjaardagen van bijna iedereen.', 'Heeft een la vol elastiekjes en losse batterijen.', 'Kan niet tegen ongelijke stapels.'], player: 'Nina' },
];

// De eerste 5 vragen voeden Ronde 1 (Quick Fire) en Ronde 4 (Wie Ben Ik).
// De laatste vraag is een bekentenis en voedt alleen Ronde 3 (Verhoor).
const PREFERENCE_QS = [
  'Ik word chagrijnig van:',
  'De mooiste plek op de wereld waar ik ben geweest:',
  'Ik geef het liefst geld uit aan:',
  'Dit heb ik het laatste gegoogled:',
  'De beste manier om het weekend te beginnen:',
];
const CONFESSION_Q = 'Beken hier iets kleins (een leugentje, iets stiekems, een onschuldig grensgeval):';
const SONG_Q = 'Mijn lievelingsnummer is (artiest - titel):';
const DRINK_Q = 'Mijn lievelingsdrankje is:';
const DOSSIER_QS = [...PREFERENCE_QS, CONFESSION_Q, SONG_Q, DRINK_Q];

// Sjablonen om Ronde 4-aanwijzingen te bouwen uit iemands eigen dossierantwoorden.
const R4_CLUE_TEMPLATES = {
  'Ik word chagrijnig van:': (a) => `Wordt chagrijnig van: ${a}`,
  'De mooiste plek op de wereld waar ik ben geweest:': (a) => `De mooiste plek die deze persoon ooit bezocht: ${a}`,
  'Ik geef het liefst geld uit aan:': (a) => `Geeft het liefst geld uit aan: ${a}`,
  'Dit heb ik het laatste gegoogled:': (a) => `Zocht laatst op: "${a}"`,
  'De beste manier om het weekend te beginnen:': (a) => `Begint het weekend het liefst met: ${a}`,
};

let dossierQ = 0;
let pendingPhotoDataUrl = null;
let r1Q = 0, r1Score = 0, r1Timer = null, r1Time = 5, r1Answered = false, r1Questions = [];
let r2Q = 0, r2Score = 0, r2ZoomTimer = null, r2Answered = false, r2Photos = [], r2UsePlayers = PLAYERS;
let r4Q = 0, r4Score = 0, r4Timer = null, r4Time = 15, r4Answered = false, r4Questions = [], r4Timeouts = [], r4UsePlayers = PLAYERS;

// ── Multiplayer session ───────────────────
// Backed by window.Backend (see backend.js). Session tracks who we are in
// the current lobby; latestLobby is the most recent snapshot pushed by the
// backend's subscription, kept fresh regardless of which screen is active.

const Session = { code: null, playerId: null, isHost: false, unsub: null, dossierAnswers: {} };
let latestLobby = null;

function go(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function pickSessionQuestions() {
  const pools = PREFERENCE_QS.map(q => {
    const real = (latestLobby ? latestLobby.players : [])
      .filter(p => p.dossierAnswers && p.dossierAnswers[q] && p.dossierAnswers[q].trim())
      .map(p => ({ text: p.dossierAnswers[q], player: p.name }));
    return { label: q, answers: real.length >= 2 ? real : DEMO_ANSWERS[q] };
  });
  return shuffle(pools);
}

function subscribeLobby() {
  if (Session.unsub) Session.unsub();
  Session.unsub = Backend.subscribe(Session.code, (lobby) => {
    latestLobby = lobby;
    renderLobbyScreen(lobby);
    renderWaitingScreen(lobby);
    renderHotOrNot(lobby);
    renderVerhoor(lobby);
    renderBiechtWaiting(lobby);
    renderBiecht(lobby);
    renderRound4Intro(lobby);
    renderSoundtrack(lobby);
  });
}

async function createLobbyClick() {
  const name = document.getElementById('create-name').value.trim();
  const maxPlayers = parseInt(document.getElementById('create-maxplayers').value, 10) || 6;
  const errEl = document.getElementById('create-error');
  errEl.style.display = 'none';
  if (!name) { errEl.textContent = 'Vul je naam in.'; errEl.style.display = 'block'; return; }
  try {
    const { code, playerId } = await Backend.createLobby(name, maxPlayers);
    Session.code = code; Session.playerId = playerId; Session.isHost = true;
    subscribeLobby();
    go('s-lobby');
  } catch (e) {
    errEl.textContent = e.message; errEl.style.display = 'block';
  }
}

async function joinLobbyClick() {
  const name = document.getElementById('join-name').value.trim();
  const code = document.getElementById('join-code').value.trim().toUpperCase();
  const errEl = document.getElementById('join-error');
  errEl.style.display = 'none';
  if (!name || !code) { errEl.textContent = 'Vul je naam en de lobby-code in.'; errEl.style.display = 'block'; return; }
  try {
    const res = await Backend.joinLobby(code, name);
    Session.code = res.code; Session.playerId = res.playerId; Session.isHost = false;
    subscribeLobby();
    resetDossierState();
    resetPhotoState();
    go('s-dossier-photo');
  } catch (e) {
    errEl.textContent = e.message; errEl.style.display = 'block';
  }
}

function copyInviteCode() {
  if (!Session.code) return;
  navigator.clipboard?.writeText(Session.code).catch(() => {});
}

function renderLobbyScreen(lobby) {
  const codeEl = document.getElementById('lobby-code-big');
  if (!codeEl) return;
  codeEl.textContent = lobby.code;
  document.getElementById('lobby-player-count').textContent = `Spelers (${lobby.players.length}/${lobby.maxPlayers})`;
  document.getElementById('lobby-player-list').innerHTML = lobby.players.map(p => `
    <div class="player-row">
      <div class="avatar" style="background:${p.bg};color:${p.color};">${p.letter}</div>
      <div class="player-name">${p.name}${p.id === Session.playerId ? ' (jij)' : ''}</div>
      <span class="player-status ${p.dossierDone ? 'status-done' : 'status-wait'}">${p.dossierDone ? 'Klaar' : 'Bezig...'}</span>
    </div>`).join('');
}

function renderWaitingScreen(lobby) {
  const notDoneEl = document.getElementById('waiting-notdone');
  if (!notDoneEl) return;
  const notDone = lobby.players.filter(p => !p.dossierDone);
  const done = lobby.players.filter(p => p.dossierDone);
  document.getElementById('waiting-notdone-card').style.display = notDone.length ? 'block' : 'none';
  notDoneEl.innerHTML = notDone.map(p => `<span class="pill">${p.name}</span>`).join('');
  document.getElementById('waiting-donecount').textContent = `Klaar (${done.length}/${lobby.players.length})`;
  document.getElementById('waiting-donelist').textContent = done.map(p => p.name).join(', ') || '—';

  const allDone = lobby.players.length > 0 && notDone.length === 0;
  document.getElementById('waiting-start-btn').style.display = Session.isHost && allDone ? 'block' : 'none';
  document.getElementById('waiting-nothost-msg').style.display = Session.isHost ? 'none' : 'block';

  if (lobby.phase === 'round1-intro' && document.getElementById('s-waiting').classList.contains('active')) {
    go('s-round1-intro');
  }
}

async function hostStartGame() {
  await GameOps.setPhase(Session.code, 'round1-intro');
  go('s-round1-intro');
}

function goDossier() { resetDossierState(); resetPhotoState(); go('s-dossier-photo'); }

// ── Dossierfoto (Ronde 2) ──────────────────

function resetPhotoState() {
  pendingPhotoDataUrl = null;
  const input = document.getElementById('photo-input');
  if (input) input.value = '';
  const img = document.getElementById('photo-preview');
  if (img) { img.src = ''; img.style.display = 'none'; }
  const icon = document.getElementById('photo-picker-icon');
  if (icon) icon.style.display = 'block';
}

function fileToResizedDataUrl(file, maxSize = 280, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function handlePhotoSelected(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const dataUrl = await fileToResizedDataUrl(file);
  pendingPhotoDataUrl = dataUrl;
  const img = document.getElementById('photo-preview');
  img.src = dataUrl;
  img.style.display = 'block';
  document.getElementById('photo-picker-icon').style.display = 'none';
}

function confirmPhotoAndContinue() {
  if (!pendingPhotoDataUrl) { go('s-dossier'); return; }
  openMaskEditor();
}

function skipPhotoAndContinue() { pendingPhotoDataUrl = null; go('s-dossier'); }

// ── Masker plaatsen (Ronde 2) ──────────────

let maskPos = { x: 50, y: 40, size: 34 };
let maskDragging = false;

function openMaskEditor() {
  maskPos = { x: 50, y: 40, size: 34 };
  document.getElementById('mask-editor-photo').src = pendingPhotoDataUrl;
  document.getElementById('mask-size-slider').value = maskPos.size;
  applyMaskPos();
  initMaskDrag();
  go('s-photo-mask');
}

function applyMaskPos() {
  const el = document.getElementById('mask-overlay');
  el.style.left = maskPos.x + '%';
  el.style.top = maskPos.y + '%';
  el.style.width = maskPos.size + '%';
}

function updateMaskSize(val) { maskPos.size = parseInt(val, 10); applyMaskPos(); }

function maskPointerMove(ev) {
  if (!maskDragging) return;
  const rect = document.getElementById('mask-editor').getBoundingClientRect();
  maskPos.x = Math.min(100, Math.max(0, ((ev.clientX - rect.left) / rect.width) * 100));
  maskPos.y = Math.min(100, Math.max(0, ((ev.clientY - rect.top) / rect.height) * 100));
  applyMaskPos();
}

function initMaskDrag() {
  const overlay = document.getElementById('mask-overlay');
  overlay.onpointerdown = (ev) => { maskDragging = true; overlay.setPointerCapture(ev.pointerId); };
  overlay.onpointermove = maskPointerMove;
  overlay.onpointerup = () => { maskDragging = false; };
  overlay.onpointercancel = () => { maskDragging = false; };
}

async function confirmMaskAndContinue() {
  if (Session.code && Session.playerId) {
    try {
      await GameOps.submitPhoto(Session.code, Session.playerId, {
        url: pendingPhotoDataUrl, maskX: maskPos.x, maskY: maskPos.y, maskScale: maskPos.size,
      });
    } catch (e) { /* local demo mode */ }
  }
  go('s-dossier');
}

function resetDossierState() {
  dossierQ = 0;
  Session.dossierAnswers = {};
  document.getElementById('q-counter').textContent = `Vraag 1 van ${DOSSIER_QS.length}`;
  document.getElementById('q-text').textContent = DOSSIER_QS[0];
  document.getElementById('dossier-progress').style.width = Math.round((1 / DOSSIER_QS.length) * 100) + '%';
  document.getElementById('q-answer').value = '';
  document.getElementById('dossier-next-btn').textContent = 'Volgende →';
}

function nextQ() {
  const answerEl = document.getElementById('q-answer');
  const currentQuestion = DOSSIER_QS[dossierQ];
  const val = answerEl.value.trim();
  if (val) Session.dossierAnswers[currentQuestion] = val;

  dossierQ++;
  const total = DOSSIER_QS.length;

  if (dossierQ >= total) {
    submitDossierAndWait();
    return;
  }

  document.getElementById('q-counter').textContent = `Vraag ${dossierQ + 1} van ${total}`;
  document.getElementById('q-text').textContent = DOSSIER_QS[dossierQ];
  document.getElementById('dossier-progress').style.width = Math.round(((dossierQ + 1) / total) * 100) + '%';
  answerEl.value = '';
  if (dossierQ === total - 1) {
    document.getElementById('dossier-next-btn').textContent = 'Dossier indienen →';
  }
}

async function submitDossierAndWait() {
  if (Session.code && Session.playerId) {
    try { await GameOps.submitDossier(Session.code, Session.playerId, Session.dossierAnswers); } catch (e) { /* local demo mode without a lobby */ }
  }
  go('s-waiting');
}

function startRound1() {
  r1Q = 0; r1Score = 0;
  r1Questions = pickSessionQuestions();
  showR1Q();
  go('s-round1-q');
}

function showR1Q() {
  r1Answered = false;
  clearInterval(r1Timer);
  const q = r1Questions[r1Q];
  const randAns = q.answers[Math.floor(Math.random() * q.answers.length)];
  document.getElementById('r1-qnum').textContent = `Vraag ${r1Q + 1} van ${r1Questions.length}`;
  document.getElementById('r1-progress').style.width = Math.round(((r1Q + 1) / r1Questions.length) * 100) + '%';
  document.getElementById('r1-score').textContent = r1Score + ' pt';
  document.getElementById('r1-qlabel').textContent = q.label;
  document.getElementById('r1-qanswer').textContent = '"' + randAns.text + '"';
  document.getElementById('r1-feedback').style.display = 'none';
  document.getElementById('r1-next-btn').style.display = 'none';
  const wrap = document.getElementById('r1-answers');
  wrap.innerHTML = '';
  shuffle(PLAYERS).forEach(p => {
    const d = document.createElement('div');
    d.className = 'answer-card';
    d.innerHTML = `<div class="answer-text">${p.name}</div>`;
    d.onclick = () => selectR1Answer(d, p.name, randAns.player);
    wrap.appendChild(d);
  });
  r1Time = 5;
  document.getElementById('timer-num').textContent = r1Time;
  document.getElementById('timer-arc').style.strokeDashoffset = '0';
  r1Timer = setInterval(() => {
    r1Time--;
    document.getElementById('timer-num').textContent = r1Time;
    document.getElementById('timer-arc').style.strokeDashoffset = Math.round(188.5 * (1 - r1Time / 5));
    if (r1Time <= 0) { clearInterval(r1Timer); if (!r1Answered) r1TimeUp(randAns.player); }
  }, 1000);
}

function selectR1Answer(el, chosen, correct) {
  if (r1Answered) return;
  r1Answered = true;
  clearInterval(r1Timer);
  document.querySelectorAll('#r1-answers .answer-card').forEach(c => {
    c.onclick = null;
    if (c.querySelector('.answer-text').textContent === correct) c.classList.add('correct');
  });
  const fb = document.getElementById('r1-feedback');
  fb.style.display = 'block';
  if (chosen === correct) {
    el.classList.add('correct');
    const pts = Math.max(1, r1Time + 1);
    r1Score += pts;
    document.getElementById('r1-score').textContent = r1Score + ' pt';
    fb.innerHTML = `<div class="result-correct">✓ Correct! +${pts} punten</div>`;
  } else {
    el.classList.add('wrong');
    fb.innerHTML = `<div class="result-wrong">✗ Fout — het was ${correct}</div>`;
  }
  const nb = document.getElementById('r1-next-btn');
  nb.style.display = 'block';
  if (r1Q === r1Questions.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR1; }
}

function r1TimeUp(correct) {
  r1Answered = true;
  document.querySelectorAll('#r1-answers .answer-card').forEach(c => {
    c.onclick = null;
    if (c.querySelector('.answer-text').textContent === correct) c.classList.add('correct');
  });
  const fb = document.getElementById('r1-feedback');
  fb.style.display = 'block';
  fb.innerHTML = `<div class="result-wrong">⏱ Te laat! Het was ${correct}</div>`;
  const nb = document.getElementById('r1-next-btn');
  nb.style.display = 'block';
  if (r1Q === r1Questions.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR1; }
}

function nextR1Q() { r1Q++; if (r1Q < r1Questions.length) showR1Q(); else showScoreR1(); }

function maskSvgHtml() {
  return `<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 25 Q2 5 30 8 Q50 2 70 8 Q98 5 98 25 Q98 40 70 38 Q50 44 30 38 Q2 40 2 25Z" fill="#0b0a13" stroke="#ff3d6b" stroke-width="1.5"/>
    <ellipse cx="28" cy="24" rx="11" ry="7" fill="#f4f2fb"/>
    <ellipse cx="72" cy="24" rx="11" ry="7" fill="#f4f2fb"/>
  </svg>`;
}

function pickRound2Photos() {
  const lobbyPlayers = latestLobby ? latestLobby.players : [];
  const withPhotos = lobbyPlayers.filter(p => p.photo && p.photo.url);
  if (withPhotos.length >= 3) {
    r2UsePlayers = lobbyPlayers.map(p => ({ name: p.name, color: p.color, bg: p.bg, letter: p.letter }));
    return shuffle(withPhotos).map(p => ({ photo: p.photo.url, mask: p.photo, player: p.name }));
  }
  r2UsePlayers = PLAYERS;
  return shuffle(R2_PHOTOS);
}

function startRound2() { r2Q = 0; r2Score = 0; r2Photos = pickRound2Photos(); showR2Q(); go('s-round2-q'); }

function showR2Q() {
  r2Answered = false;
  clearInterval(r2ZoomTimer);
  const photo = r2Photos[r2Q];
  document.getElementById('r2-qnum').textContent = `Foto ${r2Q + 1} van ${r2Photos.length}`;
  document.getElementById('r2-progress').style.width = Math.round(((r2Q + 1) / r2Photos.length) * 100) + '%';
  document.getElementById('r2-score').textContent = r2Score + ' pt';
  document.getElementById('r2-feedback').textContent = '';
  document.getElementById('r2-pts-flash').textContent = '';
  document.getElementById('r2-next-btn').style.display = 'none';
  document.getElementById('r2-zoom-hint').textContent = 'Foto zoomt uit... raad wie het is!';
  const photoEl = document.getElementById('r2-photo');
  if (photo.photo) {
    photoEl.textContent = '';
    photoEl.style.backgroundImage = `url(${photo.photo})`;
    photoEl.style.backgroundSize = 'cover';
    photoEl.style.backgroundPosition = 'center';
    const m = photo.mask;
    const maskHtml = m ? `<div class="r2-mask" style="left:${m.maskX}%;top:${m.maskY}%;width:${m.maskScale}%;">${maskSvgHtml()}</div>` : '';
    photoEl.innerHTML = maskHtml;
  } else {
    photoEl.style.backgroundImage = 'none';
    photoEl.textContent = photo.emoji;
  }
  photoEl.style.transition = 'none';
  photoEl.style.transform = 'scale(8)';
  const zoomBar = document.getElementById('r2-zoombar');
  zoomBar.style.transition = 'none';
  zoomBar.style.width = '0%';
  const wrap = document.getElementById('r2-players');
  wrap.innerHTML = '';
  shuffle(r2UsePlayers).forEach(p => {
    const d = document.createElement('div');
    d.className = 'player-btn';
    d.innerHTML = `<div class="pb-avatar" style="background:${p.bg};color:${p.color};">${p.letter}</div><div class="pb-name">${p.name}</div>`;
    d.onclick = () => selectR2Answer(d, p.name, photo.player);
    wrap.appendChild(d);
  });
  setTimeout(() => {
    photoEl.style.transition = 'transform 30s linear';
    photoEl.style.transform = 'scale(1)';
    zoomBar.style.transition = 'width 30s linear';
    zoomBar.style.width = '100%';
  }, 100);
  let elapsed = 0;
  r2ZoomTimer = setInterval(() => {
    elapsed++;
    if (elapsed >= 30) { clearInterval(r2ZoomTimer); if (!r2Answered) r2TimeUp(photo.player); }
  }, 1000);
}

function selectR2Answer(el, chosen, correct) {
  if (r2Answered) return;
  r2Answered = true;
  clearInterval(r2ZoomTimer);
  const photoEl = document.getElementById('r2-photo');
  photoEl.style.transition = 'transform 0.5s ease';
  photoEl.style.transform = 'scale(1)';
  document.getElementById('r2-zoom-hint').textContent = correct + ' was het!';
  document.querySelectorAll('#r2-players .player-btn').forEach(b => {
    b.onclick = null;
    if (b.querySelector('.pb-name').textContent === correct) b.classList.add('correct');
  });
  const flash = document.getElementById('r2-pts-flash');
  const fb = document.getElementById('r2-feedback');
  if (chosen === correct) {
    el.classList.add('correct');
    const zoomPct = parseFloat(document.getElementById('r2-zoombar').style.width) || 0;
    const pts = Math.max(1, Math.round((1 - (zoomPct / 100)) * 8) + 2);
    r2Score += pts;
    document.getElementById('r2-score').textContent = r2Score + ' pt';
    flash.style.color = 'var(--accent2)';
    flash.textContent = '+' + pts + ' punten!';
    fb.innerHTML = `<span style="color:var(--green);">✓ Correct! Hoe vroeger je raadt, hoe meer punten.</span>`;
  } else {
    el.classList.add('wrong');
    flash.style.color = '#e24b4a';
    flash.textContent = '0 punten';
    fb.innerHTML = `<span style="color:#e24b4a;">✗ Fout — het was ${correct}</span>`;
  }
  const nb = document.getElementById('r2-next-btn');
  nb.style.display = 'block';
  if (r2Q === r2Photos.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR2; }
}

function r2TimeUp(correct) {
  r2Answered = true;
  document.getElementById('r2-zoom-hint').textContent = correct + ' was het!';
  document.querySelectorAll('#r2-players .player-btn').forEach(b => {
    b.onclick = null;
    if (b.querySelector('.pb-name').textContent === correct) b.classList.add('correct');
  });
  document.getElementById('r2-pts-flash').textContent = '0 punten';
  document.getElementById('r2-pts-flash').style.color = '#e24b4a';
  document.getElementById('r2-feedback').innerHTML = `<span style="color:#e24b4a;">⏱ Tijd voorbij! Het was ${correct}</span>`;
  const nb = document.getElementById('r2-next-btn');
  nb.style.display = 'block';
  if (r2Q === r2Photos.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR2; }
}

function nextR2Q() { r2Q++; if (r2Q < r2Photos.length) showR2Q(); else showScoreR2(); }

async function pushRoundScore(points) {
  if (Session.code && Session.playerId && points) {
    try { await GameOps.addScore(Session.code, Session.playerId, points); } catch (e) { /* ignore */ }
  }
}

function liveStandings() {
  if (!latestLobby || !latestLobby.players || !latestLobby.players.length) return null;
  return latestLobby.players.map(p => ({
    name: p.id === Session.playerId ? `${p.name} (jij)` : p.name,
    pts: p.score || 0, color: p.color, you: p.id === Session.playerId,
  })).sort((a, b) => b.pts - a.pts);
}

function buildScoreboard(containerId, myScoreFallback) {
  let all = liveStandings();
  if (!all) {
    const others = PLAYERS.filter(p => p.name !== 'Sander').map(p => ({ name: p.name, pts: rand(4, 13), color: p.color }));
    all = [{ name: 'Sander (jij)', pts: myScoreFallback, color: '#ff3d6b', you: true }, ...others].sort((a, b) => b.pts - a.pts);
  }
  const max = all[0].pts || 1;
  const ranks = ['🥇', '🥈', '🥉', '4', '5', '6'];
  document.getElementById(containerId).innerHTML = all.map((s, i) => `
    <div class="score-row">
      <div class="score-rank ${i === 0 ? 'gold' : ''}">${ranks[i]}</div>
      <div style="flex:1">
        <div class="score-name" style="${s.you ? 'color:var(--accent);font-weight:600;' : ''}">${s.name}</div>
        <div style="margin-top:5px;background:var(--card-border);border-radius:3px;height:5px;overflow:hidden;">
          <div style="height:100%;width:${Math.round((s.pts / max) * 100)}%;background:${s.you ? 'var(--accent)' : 'var(--text-muted)'};border-radius:3px;"></div>
        </div>
      </div>
      <div class="score-pts">${s.pts} pt</div>
    </div>`).join('');
}

async function showScoreR1() {
  clearInterval(r1Timer);
  await pushRoundScore(r1Score);
  buildScoreboard('scoreboard-r1', r1Score);
  go('s-round1-score');
}
async function showScoreR2() {
  clearInterval(r2ZoomTimer);
  await pushRoundScore(r2Score);
  buildScoreboard('scoreboard-r2', r1Score + r2Score);
  document.getElementById('r2score-host-btn').style.display = Session.isHost ? 'block' : 'none';
  document.getElementById('r2score-wait-msg').style.display = Session.isHost ? 'none' : 'block';
  go('s-round2-score');
}

// ── Hot or Not (bonusronde, geen score) ────

function pickHotOrNotOrder() {
  const lobbyPlayers = latestLobby ? latestLobby.players : [];
  return lobbyPlayers.filter(p => p.photo && p.photo.url).map(p => p.id);
}

async function hostStartHotOrNot() {
  const order = pickHotOrNotOrder();
  if (order.length === 0) {
    await GameOps.setPhase(Session.code, 'round3-intro');
    go('s-round3-intro');
    renderVerhoor({ ...latestLobby, phase: 'round3-intro' });
    return;
  }
  const hon = { order, index: 0, targetId: order[0], votes: {} };
  await GameOps.setHotOrNot(Session.code, hon);
  await GameOps.setPhase(Session.code, 'hotornot');
  go('s-hotornot');
  // Don't wait on the subscription round-trip to populate the screen —
  // render with what we just wrote so the host never sees a blank screen.
  renderHotOrNot({ ...latestLobby, hotornot: hon, phase: 'hotornot' });
}

function renderHotOrNot(lobby) {
  const photoEl = document.getElementById('hon-photo');
  if (!photoEl) return;

  if (lobby.phase === 'round3-intro' && document.getElementById('s-hotornot').classList.contains('active')) {
    go('s-round3-intro');
    return;
  }
  if (!lobby.hotornot || !document.getElementById('s-hotornot').classList.contains('active')) return;

  const hon = lobby.hotornot;
  const target = lobby.players.find(p => p.id === hon.targetId);
  if (!target) return;

  if (target.photo && target.photo.url) {
    photoEl.style.backgroundImage = `url(${target.photo.url})`;
    photoEl.style.backgroundSize = 'cover';
    photoEl.style.backgroundPosition = 'center';
    photoEl.textContent = '';
  }
  document.getElementById('hon-name').textContent = target.name;

  const votes = hon.votes || {};
  const myVote = votes[Session.playerId];
  const isTarget = Session.playerId === hon.targetId;
  const disabled = !!myVote || isTarget;
  const hotBtn = document.getElementById('hon-btn-hot');
  const notBtn = document.getElementById('hon-btn-not');
  hotBtn.disabled = disabled; notBtn.disabled = disabled;
  hotBtn.style.opacity = disabled ? '0.4' : '1';
  notBtn.style.opacity = disabled ? '0.4' : '1';

  const eligibleVoters = lobby.players.filter(p => p.id !== hon.targetId).length;
  const votedCount = Object.keys(votes).length;
  const showResults = !!myVote || isTarget || votedCount >= eligibleVoters;
  document.getElementById('hon-results').style.display = showResults ? 'block' : 'none';
  if (showResults) {
    const hotCount = Object.values(votes).filter(v => v === 'hot').length;
    const totalVotes = Object.values(votes).length;
    const pct = totalVotes ? Math.round((hotCount / totalVotes) * 100) : 50;
    document.getElementById('hon-bar').style.width = pct + '%';
    document.getElementById('hon-tally').textContent = `${hotCount} 🔥 van ${totalVotes} stemmen`;
  }

  document.getElementById('hon-next-btn').style.display = Session.isHost ? 'block' : 'none';
  document.getElementById('hon-wait-msg').style.display = Session.isHost ? 'none' : 'block';
}

async function castHotOrNotVote(vote) {
  if (!latestLobby || !latestLobby.hotornot) return;
  const hon = latestLobby.hotornot;
  const votes = { ...(hon.votes || {}), [Session.playerId]: vote };
  await GameOps.voteHotOrNot(Session.code, hon.targetId, Session.playerId, vote);
  renderHotOrNot({ ...latestLobby, hotornot: { ...hon, votes } });
}

async function nextHotOrNot() {
  const hon = latestLobby.hotornot;
  const nextIndex = hon.index + 1;
  if (nextIndex >= hon.order.length) {
    await GameOps.setPhase(Session.code, 'round3-intro');
    go('s-round3-intro');
    renderVerhoor({ ...latestLobby, phase: 'round3-intro' });
    return;
  }
  const next = { order: hon.order, index: nextIndex, targetId: hon.order[nextIndex], votes: {} };
  await GameOps.setHotOrNot(Session.code, next);
  renderHotOrNot({ ...latestLobby, hotornot: next });
}

// ── Ronde 3: Verhoor (live, host-gestuurd) ─
// De hele ronde draait op lobby.verhoor, geschreven door de host en
// door alle clients reactief gerenderd. De host is ook de enige die
// scores toekent (tijdens de reveal) om dubbel tellen te vermijden.

const VERHOOR_SECONDS = 30;
let verhoorCountdownTimer = null;
let lastSpokenVerhoorIndex = -1;

function pickRound3Confessions() {
  const lobbyPlayers = latestLobby ? latestLobby.players : [];
  const real = lobbyPlayers
    .filter(p => p.dossierAnswers && p.dossierAnswers[CONFESSION_Q] && p.dossierAnswers[CONFESSION_Q].trim())
    .map(p => ({ text: `"${p.dossierAnswers[CONFESSION_Q].trim()}"`, playerId: p.id, playerName: p.name }));
  if (real.length >= 2) {
    return {
      list: shuffle(real).slice(0, Math.min(5, real.length)),
      players: lobbyPlayers.map(p => ({ id: p.id, name: p.name, color: p.color, bg: p.bg, letter: p.letter })),
    };
  }
  return {
    list: shuffle(CONFESSIONS).slice(0, 5).map(c => ({ text: c.text, playerId: c.player, playerName: c.player })),
    players: PLAYERS.map(p => ({ id: p.name, name: p.name, color: p.color, bg: p.bg, letter: p.letter })),
  };
}

function speakConfession(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/"/g, ''));
  u.lang = 'nl-NL';
  window.speechSynthesis.speak(u);
}

async function hostStartVerhoor() {
  const picked = pickRound3Confessions();
  const verhoor = { list: picked.list, players: picked.players, index: 0, questionStartAt: Date.now(), answers: {}, revealed: false, bonusGiven: false };
  await GameOps.setVerhoor(Session.code, verhoor);
  await GameOps.setPhase(Session.code, 'verhoor-active');
  go('s-round3-q');
  renderVerhoor({ ...latestLobby, verhoor, phase: 'verhoor-active' });
}

function renderVerhoor(lobby) {
  if (lobby.phase === 'verhoor-active' && document.getElementById('s-round3-intro').classList.contains('active')) {
    go('s-round3-q');
  }
  document.getElementById('r3intro-host-btn').style.display = Session.isHost ? 'block' : 'none';
  document.getElementById('r3intro-wait-msg').style.display = Session.isHost ? 'none' : 'block';

  if (lobby.phase === 'round3-score' && document.getElementById('s-round3-q').classList.contains('active')) {
    showScoreR3();
    return;
  }
  if (!lobby.verhoor || !document.getElementById('s-round3-q').classList.contains('active')) return;

  const v = lobby.verhoor;
  const q = v.list[v.index];
  document.getElementById('r3-qnum').textContent = `Bekentenis ${v.index + 1} van ${v.list.length}`;
  document.getElementById('r3-progress').style.width = Math.round(((v.index + 1) / v.list.length) * 100) + '%';
  document.getElementById('r3-confession').textContent = q.text;

  if (v.index !== lastSpokenVerhoorIndex) {
    lastSpokenVerhoorIndex = v.index;
    if (Session.isHost) speakConfession(q.text);
    clearInterval(verhoorCountdownTimer);
    verhoorCountdownTimer = setInterval(() => tickVerhoorCountdown(), 200);
    tickVerhoorCountdown();
  }

  const myGuess = (v.answers || {})[Session.playerId];
  const wrap = document.getElementById('r3-answers');
  wrap.innerHTML = '';
  v.players.forEach(p => {
    const d = document.createElement('div');
    d.className = 'player-btn';
    if (v.revealed) {
      if (p.id === q.playerId) d.classList.add('correct');
      else if (myGuess && myGuess.guess === p.id) d.classList.add('wrong');
    } else if (myGuess && myGuess.guess === p.id) {
      d.classList.add('pending');
    }
    d.innerHTML = `<div class="pb-avatar" style="background:${p.bg};color:${p.color};">${p.letter}</div><div class="pb-name">${p.name}</div>`;
    if (!myGuess && !v.revealed) d.onclick = () => submitMyVerhoorGuess(p.id);
    wrap.appendChild(d);
  });

  const revealBox = document.getElementById('r3-reveal');
  revealBox.style.display = v.revealed ? 'block' : 'none';
  if (v.revealed) {
    clearInterval(verhoorCountdownTimer);
    const confessor = v.players.find(p => p.id === q.playerId);
    const correctVoters = Object.entries(v.answers || {}).filter(([, a]) => a.guess === q.playerId).map(([voterId]) => v.players.find(p => p.id === voterId)).filter(Boolean);
    const caught = correctVoters.length > 0;
    document.getElementById('r3-reveal-card').innerHTML = `
      <div class="card-title">Het was ${confessor ? confessor.name : '?'}!</div>
      <div class="card-sub">${caught ? `Ontmaskerd door: ${correctVoters.map(p => p.name).join(', ')} (${confessor ? confessor.name : ''} verliest punten)` : 'Niemand raadde het op tijd — geen puntenverlies.'}</div>`;
    const bonusBtn = document.getElementById('r3-bonus-btn');
    bonusBtn.style.display = Session.isHost && !v.bonusGiven ? 'block' : 'none';
    const nextBtn = document.getElementById('r3-next-btn');
    nextBtn.style.display = Session.isHost ? 'block' : 'none';
    nextBtn.textContent = v.index === v.list.length - 1 ? 'Bekijk scorebord →' : 'Volgende bekentenis →';
    document.getElementById('r3-wait-reveal-msg').style.display = Session.isHost ? 'none' : 'block';
  }
}

function tickVerhoorCountdown() {
  const v = latestLobby && latestLobby.verhoor;
  if (!v || v.revealed) { clearInterval(verhoorCountdownTimer); return; }
  const elapsed = (Date.now() - v.questionStartAt) / 1000;
  const remaining = Math.max(0, VERHOOR_SECONDS - elapsed);
  document.getElementById('r3-timer-num').textContent = Math.ceil(remaining);
  document.getElementById('r3-timer-arc').style.strokeDashoffset = Math.round(188.5 * (1 - remaining / VERHOOR_SECONDS));
  if (remaining <= 0) {
    clearInterval(verhoorCountdownTimer);
    if (Session.isHost) hostRevealVerhoor();
  }
}

async function submitMyVerhoorGuess(targetId) {
  if (!latestLobby || !latestLobby.verhoor) return;
  await GameOps.submitVerhoorGuess(Session.code, Session.playerId, targetId);
  const v = latestLobby.verhoor;
  const answers = { ...(v.answers || {}), [Session.playerId]: { guess: targetId, at: Date.now() } };
  renderVerhoor({ ...latestLobby, verhoor: { ...v, answers } });
}

async function hostRevealVerhoor() {
  const v = latestLobby.verhoor;
  if (!v || v.revealed) return;
  const q = v.list[v.index];
  const answers = v.answers || {};
  for (const [voterId, a] of Object.entries(answers)) {
    if (a.guess === q.playerId) {
      const remaining = Math.max(0, VERHOOR_SECONDS - (a.at - v.questionStartAt) / 1000);
      const pts = Math.max(1, Math.round(remaining) + 1);
      await GameOps.addScore(Session.code, voterId, pts);
    }
  }
  const caught = Object.values(answers).some(a => a.guess === q.playerId);
  if (caught) await GameOps.addScore(Session.code, q.playerId, -3);
  await GameOps.setVerhoor(Session.code, { ...v, revealed: true });
  renderVerhoor({ ...latestLobby, verhoor: { ...v, revealed: true } });
}

async function awardVerhoorBonus() {
  const v = latestLobby.verhoor;
  if (!v || v.bonusGiven) return;
  const q = v.list[v.index];
  await GameOps.addScore(Session.code, q.playerId, 2);
  await GameOps.setVerhoor(Session.code, { ...v, bonusGiven: true });
  renderVerhoor({ ...latestLobby, verhoor: { ...v, bonusGiven: true } });
}

async function hostNextVerhoor() {
  const v = latestLobby.verhoor;
  const nextIndex = v.index + 1;
  if (nextIndex >= v.list.length) {
    await GameOps.setPhase(Session.code, 'round3-score');
    showScoreR3();
    return;
  }
  const next = { ...v, index: nextIndex, questionStartAt: Date.now(), answers: {}, revealed: false, bonusGiven: false };
  await GameOps.setVerhoor(Session.code, next);
  renderVerhoor({ ...latestLobby, verhoor: next });
}

function showScoreR3() {
  clearInterval(verhoorCountdownTimer);
  buildScoreboard('scoreboard-r3', 0);
  go('s-round3-score');
}

// ── Ronde 4: intro — kiest Soundtrack & Spirit (met Spotify) of ──
// de tekst-aanwijzingen-fallback "Wie Ben Ik" (zonder Spotify) ──

function goRound4Intro() {
  go('s-round4-intro');
  renderRound4Intro(latestLobby || {});
}

function renderRound4Intro(lobby) {
  const introScreen = document.getElementById('s-round4-intro');
  if (!introScreen) return;

  const spotifyOk = typeof spotifyConfigured === 'function' && spotifyConfigured();
  const connected = spotifyOk && spotifyIsConnected();
  document.getElementById('r4intro-icon').textContent = spotifyOk ? '🎵' : '🎭';
  document.getElementById('r4intro-accent').textContent = spotifyOk ? 'Soundtrack & Spirit' : 'Wie Ben Ik';
  document.getElementById('r4intro-sub').textContent = spotifyOk
    ? 'De host speelt ieders lievelingsnummer af. Wie is de eigenaar? En welk drankje hoort erbij?'
    : 'Aanwijzingen over een speler verschijnen één voor één, van vaag naar duidelijk. Raad zo vroeg mogelijk.';
  document.getElementById('r4intro-rules-soundtrack').style.display = spotifyOk ? 'block' : 'none';
  document.getElementById('r4intro-rules-whoami').style.display = spotifyOk ? 'none' : 'block';
  document.getElementById('r4intro-spotify-connect-btn').style.display = (Session.isHost && spotifyOk && !connected) ? 'block' : 'none';
  document.getElementById('r4intro-spotify-status').textContent = !spotifyOk ? '' : (connected ? '✓ Verbonden met Spotify' : 'Nog niet verbonden — zonder Spotify gebruikt deze ronde tekstaanwijzingen.');
  document.getElementById('r4intro-host-btn').style.display = Session.isHost ? 'block' : 'none';
  document.getElementById('r4intro-wait-msg').style.display = Session.isHost ? 'none' : 'block';

  if (introScreen.classList.contains('active')) {
    if (lobby.phase === 'round4-whoami') { startRound4(); return; }
    if (lobby.phase === 'soundtrack-active') { go('s-round4-soundtrack-q'); }
  }
}

async function hostStartRound4() {
  const soundtrack = await pickSoundtrack();
  if (soundtrack) {
    const state = { list: soundtrack.list, players: soundtrack.players, index: 0, stage: 'guessing', ownerAnswers: {}, drinkOptions: [], drinkAnswers: {}, revealed: false };
    await GameOps.setSoundtrack(Session.code, state);
    await GameOps.setPhase(Session.code, 'soundtrack-active');
    go('s-round4-soundtrack-q');
    renderSoundtrack({ ...latestLobby, soundtrack: state, phase: 'soundtrack-active' });
  } else {
    await GameOps.setPhase(Session.code, 'round4-whoami');
    startRound4();
  }
}

async function pickSoundtrack() {
  if (typeof spotifyConfigured !== 'function' || !spotifyConfigured() || !spotifyIsConnected()) return null;
  const lobbyPlayers = latestLobby ? latestLobby.players : [];
  const withSongs = lobbyPlayers.filter(p => p.dossierAnswers && p.dossierAnswers[SONG_Q] && p.dossierAnswers[SONG_Q].trim());
  const list = [];
  for (const p of withSongs) {
    const track = await spotifySearchTrack(p.dossierAnswers[SONG_Q].trim());
    if (track) {
      list.push({
        trackId: track.id, trackName: track.name, artist: track.artist, albumArt: track.albumArt,
        playerId: p.id, playerName: p.name, drink: (p.dossierAnswers[DRINK_Q] || '').trim(),
      });
    }
  }
  if (list.length < 2) return null;
  return { list: shuffle(list), players: lobbyPlayers.map(p => ({ id: p.id, name: p.name, color: p.color, bg: p.bg, letter: p.letter })) };
}

// ── Ronde 4 (fallback): Wie Ben Ik ────────

function pickRound4Riddles() {
  const lobbyPlayers = latestLobby ? latestLobby.players : [];
  const real = lobbyPlayers
    .map(p => {
      const entries = shuffle(Object.entries(p.dossierAnswers || {}).filter(([q, a]) => R4_CLUE_TEMPLATES[q] && a && a.trim()));
      const clues = entries.slice(0, 3).map(([q, a]) => R4_CLUE_TEMPLATES[q](a.trim()));
      return { clues, player: p.name };
    })
    .filter(r => r.clues.length === 3);
  if (real.length >= 2) {
    r4UsePlayers = lobbyPlayers.map(p => ({ name: p.name, color: p.color, bg: p.bg, letter: p.letter }));
    return shuffle(real).slice(0, Math.min(5, real.length));
  }
  r4UsePlayers = PLAYERS;
  return shuffle(WHOAMI_BANK).slice(0, 5);
}

function startRound4() {
  r4Q = 0; r4Score = 0;
  r4Questions = pickRound4Riddles();
  showR4Q();
  go('s-round4-q');
}

function addR4Clue(text, n) {
  const cluesEl = document.getElementById('r4-clues');
  const d = document.createElement('div');
  d.className = 'wsd-clue';
  d.innerHTML = `<strong>Aanwijzing ${n}:</strong> ${text}`;
  cluesEl.appendChild(d);
}

function showR4Q() {
  r4Answered = false;
  clearInterval(r4Timer);
  r4Timeouts.forEach(t => clearTimeout(t));
  r4Timeouts = [];
  const q = r4Questions[r4Q];
  document.getElementById('r4-qnum').textContent = `Persoon ${r4Q + 1} van ${r4Questions.length}`;
  document.getElementById('r4-progress').style.width = Math.round(((r4Q + 1) / r4Questions.length) * 100) + '%';
  document.getElementById('r4-score').textContent = r4Score + ' pt';
  document.getElementById('r4-feedback').textContent = '';
  document.getElementById('r4-next-btn').style.display = 'none';
  document.getElementById('r4-clues').innerHTML = '';
  addR4Clue(q.clues[0], 1);
  r4Timeouts.push(setTimeout(() => { if (!r4Answered) addR4Clue(q.clues[1], 2); }, 5000));
  r4Timeouts.push(setTimeout(() => { if (!r4Answered) addR4Clue(q.clues[2], 3); }, 10000));
  const wrap = document.getElementById('r4-players');
  wrap.innerHTML = '';
  shuffle(r4UsePlayers).forEach(p => {
    const d = document.createElement('div');
    d.className = 'player-btn';
    d.innerHTML = `<div class="pb-avatar" style="background:${p.bg};color:${p.color};">${p.letter}</div><div class="pb-name">${p.name}</div>`;
    d.onclick = () => selectR4Answer(d, p.name, q.player);
    wrap.appendChild(d);
  });
  r4Time = 15;
  document.getElementById('r4-timer-num').textContent = r4Time;
  document.getElementById('r4-timer-arc').style.strokeDashoffset = '0';
  r4Timer = setInterval(() => {
    r4Time--;
    document.getElementById('r4-timer-num').textContent = r4Time;
    document.getElementById('r4-timer-arc').style.strokeDashoffset = Math.round(188.5 * (1 - r4Time / 15));
    if (r4Time <= 0) { clearInterval(r4Timer); if (!r4Answered) r4TimeUp(q.player); }
  }, 1000);
}

function selectR4Answer(el, chosen, correct) {
  if (r4Answered) return;
  r4Answered = true;
  clearInterval(r4Timer);
  r4Timeouts.forEach(t => clearTimeout(t));
  const cluesShown = document.getElementById('r4-clues').children.length;
  document.querySelectorAll('#r4-players .player-btn').forEach(b => {
    b.onclick = null;
    if (b.querySelector('.pb-name').textContent === correct) b.classList.add('correct');
  });
  const fb = document.getElementById('r4-feedback');
  if (chosen === correct) {
    el.classList.add('correct');
    const pts = cluesShown === 1 ? 6 : cluesShown === 2 ? 4 : 2;
    r4Score += pts;
    document.getElementById('r4-score').textContent = r4Score + ' pt';
    fb.innerHTML = `<span style="color:var(--green);">✓ Correct! +${pts} punten (na ${cluesShown} aanwijzing${cluesShown > 1 ? 'en' : ''})</span>`;
  } else {
    el.classList.add('wrong');
    fb.innerHTML = `<span style="color:var(--red);">✗ Fout — het was ${correct}</span>`;
  }
  const nb = document.getElementById('r4-next-btn');
  nb.style.display = 'block';
  if (r4Q === r4Questions.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR4; }
}

function r4TimeUp(correct) {
  r4Answered = true;
  document.querySelectorAll('#r4-players .player-btn').forEach(b => {
    b.onclick = null;
    if (b.querySelector('.pb-name').textContent === correct) b.classList.add('correct');
  });
  document.getElementById('r4-feedback').innerHTML = `<span style="color:var(--red);">⏱ Tijd voorbij! Het was ${correct}</span>`;
  const nb = document.getElementById('r4-next-btn');
  nb.style.display = 'block';
  if (r4Q === r4Questions.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR4; }
}

function nextR4Q() { r4Q++; if (r4Q < r4Questions.length) showR4Q(); else showScoreR4(); }

async function showScoreR4() {
  clearInterval(r4Timer);
  r4Timeouts.forEach(t => clearTimeout(t));
  await pushRoundScore(r4Score);
  buildScoreboard('scoreboard-r4', r1Score + r2Score + r4Score);
  go('s-round4-score');
}

// ── Ronde 4 (met Spotify): Soundtrack & Spirit ────
// Host-gestuurd en live gesynchroniseerd, zoals Ronde 3: alleen de host
// speelt het fragment af (via de Spotify iFrame API) en kent scores toe,
// alle spelers gokken mee op hun eigen scherm.

let lastRenderedSoundtrackIndex = -1;
let soundtrackPlayedForIndex = -1;

function buildDrinkOptions(list, index) {
  const correct = list[index];
  const others = list.filter((_, i) => i !== index).map(t => t.drink).filter(Boolean);
  const distractors = shuffle(others).slice(0, 2);
  const opts = [...new Set([correct.drink || '(geen antwoord)', ...distractors])];
  while (opts.length < 2) opts.push(opts.length === 1 ? 'Water' : 'Cola');
  return shuffle(opts);
}

async function hostPlaySoundtrack() {
  const st = latestLobby.soundtrack;
  soundtrackPlayedForIndex = st.index;
  document.getElementById('st-host-play-btn').style.display = 'none';
  const track = st.list[st.index];
  await playSpotifyTrack(track.trackId, 'st-embed');
}

function renderSoundtrack(lobby) {
  if (lobby.phase === 'round4-score' && document.getElementById('s-round4-soundtrack-q').classList.contains('active')) {
    showScoreR4();
    return;
  }
  if (!lobby.soundtrack || !document.getElementById('s-round4-soundtrack-q').classList.contains('active')) return;

  const st = lobby.soundtrack;
  const track = st.list[st.index];
  if (st.index !== lastRenderedSoundtrackIndex) {
    lastRenderedSoundtrackIndex = st.index;
    document.getElementById('st-embed').innerHTML = '';
  }
  document.getElementById('st-qnum').textContent = `Nummer ${st.index + 1} van ${st.list.length}`;
  document.getElementById('st-progress').style.width = Math.round(((st.index + 1) / st.list.length) * 100) + '%';
  document.getElementById('st-host-player').style.display = Session.isHost ? 'block' : 'none';
  document.getElementById('st-guest-wait').style.display = Session.isHost ? 'none' : 'block';
  const alreadyPlayed = soundtrackPlayedForIndex === st.index;
  document.getElementById('st-host-play-btn').style.display = (Session.isHost && st.stage === 'guessing' && !alreadyPlayed) ? 'block' : 'none';

  const myOwnerGuess = (st.ownerAnswers || {})[Session.playerId];
  const ownerWrap = document.getElementById('st-owner-players');
  document.getElementById('st-stage-label').style.display = st.stage === 'guessing' ? 'block' : 'none';
  ownerWrap.style.display = st.stage === 'guessing' ? 'grid' : 'none';
  if (st.stage === 'guessing') {
    ownerWrap.innerHTML = '';
    st.players.forEach((p) => {
      const d = document.createElement('div');
      d.className = 'player-btn';
      if (myOwnerGuess && myOwnerGuess.guess === p.id) d.classList.add('pending');
      d.innerHTML = `<div class="pb-avatar" style="background:${p.bg};color:${p.color};">${p.letter}</div><div class="pb-name">${p.name}</div>`;
      if (!myOwnerGuess) d.onclick = () => submitSoundtrackOwnerGuess(p.id);
      ownerWrap.appendChild(d);
    });
  }

  document.getElementById('st-drink-stage').style.display = st.stage === 'drink' ? 'block' : 'none';
  if (st.stage === 'drink') {
    const owner = st.players.find(p => p.id === track.playerId);
    document.getElementById('st-drink-label').textContent = `Bonus: welk drankje hoort bij ${owner ? owner.name : 'deze persoon'}?`;
    const myDrinkGuess = (st.drinkAnswers || {})[Session.playerId];
    const drinkWrap = document.getElementById('st-drink-options');
    drinkWrap.innerHTML = '';
    (st.drinkOptions || []).forEach((opt) => {
      const d = document.createElement('div');
      d.className = 'player-btn';
      if (myDrinkGuess === opt) d.classList.add('pending');
      d.innerHTML = `<div class="pb-name" style="text-align:center;padding:4px 0;">${opt}</div>`;
      if (!myDrinkGuess) d.onclick = () => submitSoundtrackDrinkGuess(opt);
      drinkWrap.appendChild(d);
    });
  }

  document.getElementById('st-reveal').style.display = st.revealed ? 'block' : 'none';
  if (st.revealed) {
    const owner = st.players.find(p => p.id === track.playerId);
    document.getElementById('st-reveal-card').innerHTML = `<div class="card-title">Dit was het nummer van ${owner ? owner.name : '?'}!</div><div class="card-sub">${track.trackName} — ${track.artist}</div>`;
  }

  const nextBtn = document.getElementById('st-next-btn');
  nextBtn.style.display = Session.isHost ? 'block' : 'none';
  if (st.stage === 'guessing') {
    nextBtn.textContent = 'Onthul eigenaar & drankje →';
    nextBtn.onclick = hostRevealSoundtrackOwner;
  } else {
    nextBtn.textContent = st.index === st.list.length - 1 ? 'Bekijk scorebord →' : 'Volgende nummer →';
    nextBtn.onclick = hostNextSoundtrack;
  }
  document.getElementById('st-wait-msg').style.display = Session.isHost ? 'none' : 'block';
}

async function submitSoundtrackOwnerGuess(targetId) {
  if (!latestLobby || !latestLobby.soundtrack) return;
  await GameOps.submitSoundtrackGuess(Session.code, Session.playerId, targetId);
  const st = latestLobby.soundtrack;
  const ownerAnswers = { ...(st.ownerAnswers || {}), [Session.playerId]: { guess: targetId, at: Date.now() } };
  renderSoundtrack({ ...latestLobby, soundtrack: { ...st, ownerAnswers } });
}

async function hostRevealSoundtrackOwner() {
  const st = latestLobby.soundtrack;
  const track = st.list[st.index];
  const correctGuessers = Object.entries(st.ownerAnswers || {})
    .filter(([, a]) => a.guess === track.playerId)
    .sort((a, b) => a[1].at - b[1].at);
  if (correctGuessers.length) await GameOps.addScore(Session.code, correctGuessers[0][0], 5);
  const drinkOptions = buildDrinkOptions(st.list, st.index);
  const next = { ...st, stage: 'drink', revealed: true, drinkOptions, drinkAnswers: {} };
  await GameOps.setSoundtrack(Session.code, next);
  renderSoundtrack({ ...latestLobby, soundtrack: next });
}

async function submitSoundtrackDrinkGuess(drinkText) {
  if (!latestLobby || !latestLobby.soundtrack) return;
  await GameOps.submitSoundtrackDrinkGuess(Session.code, Session.playerId, drinkText);
  const st = latestLobby.soundtrack;
  const drinkAnswers = { ...(st.drinkAnswers || {}), [Session.playerId]: drinkText };
  renderSoundtrack({ ...latestLobby, soundtrack: { ...st, drinkAnswers } });
}

async function hostNextSoundtrack() {
  const st = latestLobby.soundtrack;
  const track = st.list[st.index];
  const correctDrink = (track.drink || '').trim();
  if (correctDrink) {
    const winners = Object.entries(st.drinkAnswers || {}).filter(([, d]) => d === correctDrink).map(([id]) => id);
    for (const id of winners) await GameOps.addScore(Session.code, id, 2);
  }
  if (typeof stopSpotifyPlayback === 'function') stopSpotifyPlayback();
  const nextIndex = st.index + 1;
  if (nextIndex >= st.list.length) {
    await GameOps.setPhase(Session.code, 'round4-score');
    showScoreR4();
    return;
  }
  const next = { ...st, index: nextIndex, stage: 'guessing', ownerAnswers: {}, drinkOptions: [], drinkAnswers: {}, revealed: false };
  await GameOps.setSoundtrack(Session.code, next);
  renderSoundtrack({ ...latestLobby, soundtrack: next });
}

// ── Ronde 5: Biecht-Finale (opname + stemvervorming + stemronde) ──

let mediaRecorder = null;
let recordedChunks = [];
let recordingTimer = null;
let recordingSeconds = 0;
let rawRecordingBlob = null;
let distortedVoiceDataUrl = null;
let lastRenderedBiechtKey = '';

async function startBiechtRecording() {
  const statusEl = document.getElementById('biecht-record-status');
  statusEl.style.color = 'var(--text-muted)';
  statusEl.textContent = 'Microfoon aanvragen... (bevestig de toestemming in je browser)';
  try {
    const micTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Geen reactie van de microfoon — controleer je browser-instellingen.')), 8000));
    const stream = await Promise.race([navigator.mediaDevices.getUserMedia({ audio: true }), micTimeout]);
    const mimeType = ['audio/mp4', 'audio/webm', 'audio/ogg'].find(t => window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
    recordedChunks = [];
    mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      if (!recordedChunks.length) {
        statusEl.style.color = 'var(--red)';
        statusEl.textContent = 'Geen geluid opgevangen. Probeer opnieuw, of sla over.';
        document.getElementById('biecht-record-btn').style.display = 'block';
        return;
      }
      rawRecordingBlob = new Blob(recordedChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
      processBiechtRecording();
    };
    mediaRecorder.start();
    recordingSeconds = 0;
    document.getElementById('biecht-record-btn').style.display = 'none';
    statusEl.textContent = 'Opname loopt... (max 12s)';
    recordingTimer = setInterval(() => {
      recordingSeconds++;
      document.getElementById('biecht-record-timer').textContent = recordingSeconds + 's';
      if (recordingSeconds >= 12) stopBiechtRecording();
    }, 1000);
  } catch (e) {
    statusEl.style.color = 'var(--red)';
    statusEl.textContent = 'Kon de microfoon niet gebruiken: ' + e.message;
  }
}

async function skipBiechtRecording() {
  if (Session.code && Session.playerId) {
    try { await GameOps.markVoiceSkipped(Session.code, Session.playerId); } catch (e) { /* local demo mode */ }
  }
  go('s-round5-waiting');
  if (latestLobby) {
    const p = latestLobby.players.find(pl => pl.id === Session.playerId);
    if (p) p.voiceSkipped = true;
    renderBiechtWaiting(latestLobby);
  }
}

function stopBiechtRecording() {
  clearInterval(recordingTimer);
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
}

async function processBiechtRecording() {
  const statusEl = document.getElementById('biecht-record-status');
  statusEl.style.color = 'var(--text-muted)';
  statusEl.textContent = 'Stem wordt vervormd...';
  try {
    distortedVoiceDataUrl = await distortVoice(rawRecordingBlob);
  } catch (e) {
    statusEl.style.color = 'var(--red)';
    statusEl.textContent = 'Kon de opname niet verwerken. Probeer opnieuw, of sla over.';
    document.getElementById('biecht-record-btn').style.display = 'block';
    return;
  }
  statusEl.style.color = 'var(--green)';
  statusEl.textContent = 'Klaar! Beluister hieronder voor je verstuurt.';
  const audio = document.getElementById('biecht-preview');
  audio.src = distortedVoiceDataUrl;
  document.getElementById('biecht-preview-wrap').style.display = 'block';
  document.getElementById('biecht-confirm-btn').style.display = 'block';
  const btn = document.getElementById('biecht-record-btn');
  btn.textContent = '🎙 Opnieuw opnemen';
  btn.style.display = 'block';
  btn.onclick = resetBiechtRecording;
}

function resetBiechtRecording() {
  distortedVoiceDataUrl = null;
  document.getElementById('biecht-preview-wrap').style.display = 'none';
  document.getElementById('biecht-confirm-btn').style.display = 'none';
  document.getElementById('biecht-record-status').textContent = '';
  document.getElementById('biecht-record-timer').textContent = '0s';
  const btn = document.getElementById('biecht-record-btn');
  btn.textContent = '🎙 Start opname';
  btn.onclick = startBiechtRecording;
}

async function confirmBiechtRecording() {
  if (!distortedVoiceDataUrl || !Session.code) return;
  await Backend.submitVoice(Session.code, Session.playerId, distortedVoiceDataUrl);
  await GameOps.markVoiceReady(Session.code, Session.playerId);
  go('s-round5-waiting');
  if (latestLobby) {
    const p = latestLobby.players.find(pl => pl.id === Session.playerId);
    if (p) p.voiceReady = true;
    renderBiechtWaiting(latestLobby);
  }
}

// Stemvervorming: neem het opgenomen fragment, verander toonhoogte + snelheid
// via playbackRate en filter het licht, render het offline en zet het om
// naar een WAV data-URL zodat het klein genoeg blijft om op te slaan.
async function distortVoice(blob) {
  const arrayBuf = await blob.arrayBuffer();
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const tempCtx = new AudioCtx();
  const audioBuffer = await tempCtx.decodeAudioData(arrayBuf);
  await tempCtx.close();

  const pitchFactor = Math.random() < 0.5 ? 0.72 : 1.45;
  const outSampleRate = 11025;
  const outLength = Math.ceil((audioBuffer.duration / pitchFactor) * outSampleRate);
  const offlineCtx = new OfflineAudioContext(1, outLength, outSampleRate);

  const src = offlineCtx.createBufferSource();
  src.buffer = audioBuffer;
  src.playbackRate.value = pitchFactor;
  const filter = offlineCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 4000;
  src.connect(filter);
  filter.connect(offlineCtx.destination);
  src.start();

  const rendered = await offlineCtx.startRendering();
  return audioBufferToWavDataUrl(rendered);
}

function audioBufferToWavDataUrl(buffer) {
  const sampleRate = buffer.sampleRate;
  const samples = buffer.getChannelData(0);
  const dataSize = samples.length * 2;
  const arr = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arr);
  const writeStr = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };

  writeStr(0, 'RIFF'); view.setUint32(4, 36 + dataSize, true); writeStr(8, 'WAVE');
  writeStr(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  writeStr(36, 'data'); view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  const blob = new Blob([arr], { type: 'audio/wav' });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

function renderBiechtWaiting(lobby) {
  const notDoneEl = document.getElementById('biecht-notdone');
  if (!notDoneEl || !document.getElementById('s-round5-waiting').classList.contains('active')) return;
  const notDone = lobby.players.filter(p => !p.voiceReady && !p.voiceSkipped);
  const done = lobby.players.filter(p => p.voiceReady || p.voiceSkipped);
  document.getElementById('biecht-notdone-card').style.display = notDone.length ? 'block' : 'none';
  notDoneEl.innerHTML = notDone.map(p => `<span class="pill">${p.name}</span>`).join('');
  document.getElementById('biecht-donecount').textContent = `Klaar (${done.length}/${lobby.players.length})`;
  document.getElementById('biecht-donelist').textContent = done.map(p => p.name).join(', ') || '—';
  const enough = done.length >= 2;
  document.getElementById('biecht-start-btn').style.display = Session.isHost && enough ? 'block' : 'none';
  document.getElementById('biecht-wait-msg').style.display = Session.isHost ? 'none' : 'block';
}

async function hostStartBiechtPlayback() {
  const order = latestLobby.players.filter(p => p.voiceReady).map(p => p.id);
  if (order.length === 0) {
    await GameOps.setPhase(Session.code, 'round5-final');
    showFinal();
    return;
  }
  const biecht = { stage: 'playback', order, index: 0, votes: {}, bonusGiven: false };
  await GameOps.setBiecht(Session.code, biecht);
  await GameOps.setPhase(Session.code, 'biecht-active');
  go('s-round5-play');
  renderBiecht({ ...latestLobby, biecht, phase: 'biecht-active' });
}

async function renderBiecht(lobby) {
  if (lobby.phase === 'round5-final' && document.getElementById('s-round5-waiting').classList.contains('active')) {
    showFinal();
    return;
  }
  if (lobby.phase === 'biecht-active' && document.getElementById('s-round5-waiting').classList.contains('active')) {
    go('s-round5-play');
  }
  if (!lobby.biecht) return;
  const b = lobby.biecht;

  if (b.stage === 'playback' && document.getElementById('s-round5-play').classList.contains('active')) {
    const targetId = b.order[b.index];
    const key = 'play:' + targetId;
    document.getElementById('biecht-play-num').textContent = `Verhaal ${b.index + 1} van ${b.order.length}`;
    if (key !== lastRenderedBiechtKey) {
      lastRenderedBiechtKey = key;
      const audioEl = document.getElementById('biecht-play-audio');
      audioEl.src = '';
      document.getElementById('biecht-play-hint').textContent = 'Laden...';
      Backend.getVoice(Session.code, targetId).then((url) => {
        audioEl.src = url;
        document.getElementById('biecht-play-hint').textContent = 'Een vervormde stem... wie zou het zijn?';
      });
    }
    document.getElementById('biecht-play-next-btn').style.display = Session.isHost ? 'block' : 'none';
    document.getElementById('biecht-play-next-btn').textContent = b.index === b.order.length - 1 ? 'Naar de stemronde →' : 'Volgende →';
    document.getElementById('biecht-play-wait-msg').style.display = Session.isHost ? 'none' : 'block';
  }

  if (b.stage === 'voting') {
    if (document.getElementById('s-round5-play').classList.contains('active')) go('s-round5-vote');
    if (!document.getElementById('s-round5-vote').classList.contains('active')) return;
    renderBiechtVoting(lobby, b);
  }
}

function renderBiechtVoting(lobby, b) {
  const wrap = document.getElementById('biecht-vote-players');
  const myVote = (b.votes || {})[Session.playerId];
  wrap.innerHTML = '';
  b.order.forEach((pid) => {
    const p = lobby.players.find(pl => pl.id === pid);
    if (!p) return;
    const d = document.createElement('div');
    d.className = 'player-btn';
    if (myVote === pid) d.classList.add('pending');
    d.innerHTML = `<div class="pb-avatar" style="background:${p.bg};color:${p.color};">${p.letter}</div><div class="pb-name">${p.name}</div>`;
    if (!myVote && p.id !== Session.playerId) d.onclick = () => castBiechtVote(pid);
    wrap.appendChild(d);
  });

  const votedCount = Object.keys(b.votes || {}).length;
  const eligible = lobby.players.length;
  const showResults = !!myVote || votedCount >= eligible;
  document.getElementById('biecht-vote-results').style.display = showResults ? 'block' : 'none';
  if (showResults) {
    const tally = {};
    Object.values(b.votes || {}).forEach((pid) => { tally[pid] = (tally[pid] || 0) + 1; });
    const rows = b.order.map((pid) => {
      const p = lobby.players.find(pl => pl.id === pid);
      return { name: p ? p.name : '?', count: tally[pid] || 0 };
    }).sort((a, b2) => b2.count - a.count);
    document.getElementById('biecht-vote-tally').innerHTML = rows.map(r => `<div class="score-row"><div class="score-name">${r.name}</div><div class="score-pts">${r.count} stem${r.count === 1 ? '' : 'men'}</div></div>`).join('');
  }
  document.getElementById('biecht-vote-next-btn').style.display = Session.isHost ? 'block' : 'none';
  document.getElementById('biecht-vote-wait-msg').style.display = Session.isHost ? 'none' : 'block';
}

async function hostNextBiechtPlay() {
  const b = latestLobby.biecht;
  const nextIndex = b.index + 1;
  if (nextIndex >= b.order.length) {
    const next = { ...b, stage: 'voting' };
    await GameOps.setBiecht(Session.code, next);
    go('s-round5-vote');
    renderBiecht({ ...latestLobby, biecht: next });
    return;
  }
  const next = { ...b, index: nextIndex };
  await GameOps.setBiecht(Session.code, next);
  renderBiecht({ ...latestLobby, biecht: next });
}

async function castBiechtVote(targetId) {
  if (!latestLobby || !latestLobby.biecht) return;
  await GameOps.voteBiecht(Session.code, targetId, Session.playerId);
  const b = latestLobby.biecht;
  const votes = { ...(b.votes || {}), [Session.playerId]: targetId };
  renderBiechtVoting({ ...latestLobby, biecht: { ...b, votes } }, { ...b, votes });
}

async function finishBiechtVoting() {
  const b = latestLobby.biecht;
  const tally = {};
  Object.values(b.votes || {}).forEach((pid) => { tally[pid] = (tally[pid] || 0) + 1; });
  const maxVotes = Math.max(0, ...Object.values(tally));
  if (maxVotes > 0) {
    const winners = Object.entries(tally).filter(([, c]) => c === maxVotes).map(([pid]) => pid);
    for (const pid of winners) await GameOps.addScore(Session.code, pid, 5);
  }
  await GameOps.setPhase(Session.code, 'final');
  showFinal();
}

// ── Ronde 5: Eindstand ────────────────────
// Elke ronde heeft haar punten al live doorgestuurd (Ronde 1/2/4 door de
// speler zelf bij het scorebord, Ronde 3 door de host tijdens de reveal),
// dus hier hoeft alleen de definitieve, echte stand nog getoond te worden.

function showFinal() {
  clearInterval(r4Timer);
  r4Timeouts.forEach(t => clearTimeout(t));
  let all = liveStandings();
  if (!all) {
    const myScore = r1Score + r2Score + r4Score;
    const others = PLAYERS.filter(p => p.name !== 'Sander').map(p => ({ name: p.name, pts: rand(14, 46), color: p.color }));
    all = [{ name: 'Sander (jij)', pts: myScore, color: '#ff3d6b', you: true }, ...others].sort((a, b) => b.pts - a.pts);
  }
  renderFinalPodium(all);
  buildScoreboard('scoreboard-final');
  renderMostUnmasked(all);
  go('s-round5-final');
  launchConfetti();
}

function renderMostUnmasked(all) {
  const el = document.getElementById('most-unmasked');
  if (!el || all.length < 2) { if (el) el.style.display = 'none'; return; }
  const loser = all[all.length - 1];
  el.style.display = 'block';
  el.innerHTML = `<div class="card-title" style="color:var(--accent2);">🫣 Meest Ontmaskerd</div><div class="card-sub">${loser.name} — helemaal doorzien deze avond.</div>`;
}

function renderFinalPodium(all) {
  const top3 = all.slice(0, 3);
  const layout = [
    { rank: top3[1], cls: 'silver', medal: '🥈' },
    { rank: top3[0], cls: 'gold', medal: '🥇' },
    { rank: top3[2], cls: 'bronze', medal: '🥉' },
  ];
  const el = document.getElementById('final-podium');
  el.innerHTML = layout.filter(l => l.rank).map(l => `
    <div class="podium-slot ${l.cls}">
      <div class="podium-avatar">${l.rank.you ? '👑' : '🎭'}</div>
      <div class="podium-bar">${l.medal}</div>
      <div class="podium-name">${l.rank.name}</div>
      <div class="podium-pts">${l.rank.pts} pt</div>
    </div>`).join('');
}

function launchConfetti() {
  const colors = ['#ff3d6b', '#f5a623', '#8b5cf6', '#4caf82', '#378add'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const size = rand(6, 12);
    el.style.width = size + 'px';
    el.style.height = Math.round(size * 0.4) + 'px';
    el.style.left = rand(0, 100) + 'vw';
    el.style.background = colors[rand(0, colors.length - 1)];
    el.style.animationDuration = (rand(22, 38) / 10) + 's';
    el.style.animationDelay = (rand(0, 15) / 10) + 's';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
}

// ── Sessieherstel na Spotify-login ────────
// spotifyConnect() navigeert de hele pagina weg naar Spotify en terug,
// wat al het in-memory Session-geheugen zou wissen. Als er iets bewaard
// staat, zit de speler dus middenin een terugkeer van die redirect —
// herstel de lobby en spring terug naar waar ze waren.

(function restoreSessionAfterRedirect() {
  const raw = sessionStorage.getItem('unmasked:resume');
  if (!raw) return;
  sessionStorage.removeItem('unmasked:resume');
  try {
    const saved = JSON.parse(raw);
    if (!saved.code || !saved.playerId) return;
    Session.code = saved.code;
    Session.playerId = saved.playerId;
    Session.isHost = !!saved.isHost;
    subscribeLobby();
    go(saved.screen || 's-home');
    if (saved.screen === 's-round4-intro') {
      // The Spotify token exchange (handleSpotifyRedirect in spotify.js) is
      // still in flight at this point — re-render shortly after so the
      // "✓ Verbonden" status picks it up without needing a lobby update.
      setTimeout(() => renderRound4Intro(latestLobby || {}), 1500);
    }
  } catch (e) { /* corrupt/expired resume data — just stay on the home screen */ }
})();
