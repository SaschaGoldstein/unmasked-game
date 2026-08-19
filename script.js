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
const DOSSIER_QS = [...PREFERENCE_QS, CONFESSION_Q];

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
let r3Q = 0, r3Score = 0, r3Timer = null, r3Time = 6, r3Answered = false, r3Questions = [], r3UsePlayers = PLAYERS;
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
  await Backend.setPhase(Session.code, 'round1-intro');
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

async function confirmPhotoAndContinue() {
  if (pendingPhotoDataUrl && Session.code && Session.playerId) {
    try { await Backend.submitPhoto(Session.code, Session.playerId, pendingPhotoDataUrl); } catch (e) { /* local demo mode */ }
  }
  go('s-dossier');
}

function skipPhotoAndContinue() { pendingPhotoDataUrl = null; go('s-dossier'); }

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
    try { await Backend.submitDossier(Session.code, Session.playerId, Session.dossierAnswers); } catch (e) { /* local demo mode without a lobby */ }
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

function pickRound2Photos() {
  const lobbyPlayers = latestLobby ? latestLobby.players : [];
  const withPhotos = lobbyPlayers.filter(p => p.photoDataUrl);
  if (withPhotos.length >= 3) {
    r2UsePlayers = lobbyPlayers.map(p => ({ name: p.name, color: p.color, bg: p.bg, letter: p.letter }));
    return shuffle(withPhotos).map(p => ({ photo: p.photoDataUrl, player: p.name }));
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
  if (r2Q === R2_PHOTOS.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR2; }
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
  if (r2Q === R2_PHOTOS.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR2; }
}

function nextR2Q() { r2Q++; if (r2Q < r2Photos.length) showR2Q(); else showScoreR2(); }

function buildScoreboard(containerId, myScore, precomputed) {
  let all = precomputed;
  if (!all) {
    const others = PLAYERS.filter(p => p.name !== 'Sander').map(p => ({ name: p.name, pts: rand(4, 13), color: p.color }));
    all = [{ name: 'Sander (jij)', pts: myScore, color: '#ff3d6b', you: true }, ...others].sort((a, b) => b.pts - a.pts);
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

function showScoreR1() { clearInterval(r1Timer); buildScoreboard('scoreboard-r1', r1Score); go('s-round1-score'); }
function showScoreR2() { clearInterval(r2ZoomTimer); buildScoreboard('scoreboard-r2', r1Score + r2Score); go('s-round2-score'); }

// ── Ronde 3: Verhoor ──────────────────────

function pickRound3Confessions() {
  const lobbyPlayers = latestLobby ? latestLobby.players : [];
  const real = lobbyPlayers
    .filter(p => p.dossierAnswers && p.dossierAnswers[CONFESSION_Q] && p.dossierAnswers[CONFESSION_Q].trim())
    .map(p => ({ text: `"${p.dossierAnswers[CONFESSION_Q].trim()}"`, player: p.name }));
  if (real.length >= 2) {
    r3UsePlayers = lobbyPlayers.map(p => ({ name: p.name, color: p.color, bg: p.bg, letter: p.letter }));
    return shuffle(real).slice(0, Math.min(5, real.length));
  }
  r3UsePlayers = PLAYERS;
  return shuffle(CONFESSIONS).slice(0, 5);
}

function startRound3() {
  r3Q = 0; r3Score = 0;
  r3Questions = pickRound3Confessions();
  showR3Q();
  go('s-round3-q');
}

function showR3Q() {
  r3Answered = false;
  clearInterval(r3Timer);
  const q = r3Questions[r3Q];
  document.getElementById('r3-qnum').textContent = `Bekentenis ${r3Q + 1} van ${r3Questions.length}`;
  document.getElementById('r3-progress').style.width = Math.round(((r3Q + 1) / r3Questions.length) * 100) + '%';
  document.getElementById('r3-score').textContent = r3Score + ' pt';
  document.getElementById('r3-confession').textContent = q.text;
  document.getElementById('r3-feedback').style.display = 'none';
  document.getElementById('r3-next-btn').style.display = 'none';
  const wrap = document.getElementById('r3-answers');
  wrap.innerHTML = '';
  shuffle(r3UsePlayers).forEach(p => {
    const d = document.createElement('div');
    d.className = 'player-btn';
    d.innerHTML = `<div class="pb-avatar" style="background:${p.bg};color:${p.color};">${p.letter}</div><div class="pb-name">${p.name}</div>`;
    d.onclick = () => selectR3Answer(d, p.name, q.player);
    wrap.appendChild(d);
  });
  r3Time = 6;
  document.getElementById('r3-timer-num').textContent = r3Time;
  document.getElementById('r3-timer-arc').style.strokeDashoffset = '0';
  r3Timer = setInterval(() => {
    r3Time--;
    document.getElementById('r3-timer-num').textContent = r3Time;
    document.getElementById('r3-timer-arc').style.strokeDashoffset = Math.round(188.5 * (1 - r3Time / 6));
    if (r3Time <= 0) { clearInterval(r3Timer); if (!r3Answered) r3TimeUp(q.player); }
  }, 1000);
}

function selectR3Answer(el, chosen, correct) {
  if (r3Answered) return;
  r3Answered = true;
  clearInterval(r3Timer);
  document.querySelectorAll('#r3-answers .player-btn').forEach(b => {
    b.onclick = null;
    if (b.querySelector('.pb-name').textContent === correct) b.classList.add('correct');
  });
  const fb = document.getElementById('r3-feedback');
  fb.style.display = 'block';
  if (chosen === correct) {
    el.classList.add('correct');
    const pts = Math.max(1, r3Time + 1);
    r3Score += pts;
    document.getElementById('r3-score').textContent = r3Score + ' pt';
    fb.innerHTML = `<div class="result-correct">✓ Ontmaskerd! +${pts} punten</div>`;
  } else {
    el.classList.add('wrong');
    fb.innerHTML = `<div class="result-wrong">✗ Fout — het was ${correct}</div>`;
  }
  const nb = document.getElementById('r3-next-btn');
  nb.style.display = 'block';
  if (r3Q === r3Questions.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR3; }
}

function r3TimeUp(correct) {
  r3Answered = true;
  document.querySelectorAll('#r3-answers .player-btn').forEach(b => {
    b.onclick = null;
    if (b.querySelector('.pb-name').textContent === correct) b.classList.add('correct');
  });
  const fb = document.getElementById('r3-feedback');
  fb.style.display = 'block';
  fb.innerHTML = `<div class="result-wrong">⏱ Te laat! Het was ${correct}</div>`;
  const nb = document.getElementById('r3-next-btn');
  nb.style.display = 'block';
  if (r3Q === r3Questions.length - 1) { nb.textContent = 'Bekijk scorebord →'; nb.onclick = showScoreR3; }
}

function nextR3Q() { r3Q++; if (r3Q < r3Questions.length) showR3Q(); else showScoreR3(); }

function showScoreR3() { clearInterval(r3Timer); buildScoreboard('scoreboard-r3', r1Score + r2Score + r3Score); go('s-round3-score'); }

// ── Ronde 4: Wie Ben Ik ───────────────────

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

function showScoreR4() {
  clearInterval(r4Timer);
  r4Timeouts.forEach(t => clearTimeout(t));
  buildScoreboard('scoreboard-r4', r1Score + r2Score + r3Score + r4Score);
  go('s-round4-score');
}

// ── Ronde 5: Eindstand ────────────────────

async function showFinal() {
  clearInterval(r4Timer);
  r4Timeouts.forEach(t => clearTimeout(t));
  const myScore = r1Score + r2Score + r3Score + r4Score;
  let all;
  if (Session.code && Session.playerId) {
    try { await Backend.addScore(Session.code, Session.playerId, myScore); } catch (e) { /* ignore */ }
    const lobby = latestLobby || {};
    const players = lobby.players && lobby.players.length ? lobby.players : [{ id: Session.playerId, name: 'Jij', color: '#ff3d6b', score: myScore }];
    all = players.map(p => ({ name: p.id === Session.playerId ? `${p.name} (jij)` : p.name, pts: p.id === Session.playerId ? myScore : (p.score || 0), color: p.color, you: p.id === Session.playerId }))
      .sort((a, b) => b.pts - a.pts);
  } else {
    const others = PLAYERS.filter(p => p.name !== 'Sander').map(p => ({ name: p.name, pts: rand(14, 46), color: p.color }));
    all = [{ name: 'Sander (jij)', pts: myScore, color: '#ff3d6b', you: true }, ...others].sort((a, b) => b.pts - a.pts);
  }
  renderFinalPodium(all);
  buildScoreboard('scoreboard-final', myScore, all);
  go('s-round5-final');
  launchConfetti();
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
