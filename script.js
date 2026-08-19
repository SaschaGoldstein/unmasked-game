// ─────────────────────────────────────────
//  Unmasked — script.js
//  Mobiele website prototype v1
// ─────────────────────────────────────────

// ── Vragenbank (30 vragen) ───────────────
// Per sessie worden 8 willekeurige vragen gekozen

const QUESTION_BANK = [
  // Gewoontes & Dagelijks leven
  { label: 'Ik word chagrijnig van:' },
  { label: 'Mijn geheime slechte gewoonte is:' },
  { label: 'De beste manier om het weekend te beginnen:' },
  { label: 'Dit doe ik als eerste als ik thuiskom:' },
  { label: 'Hier kan ik absoluut niet mee overweg:' },
  { label: 'Mijn vaste slaaphouding is:' },
  { label: 'Zo ziet mijn typische zondagochtend eruit:' },
  // Geld & Bezittingen
  { label: 'Ik geef het liefst geld uit aan:' },
  { label: 'Mijn meest onnodige aankoop ooit:' },
  { label: 'Dit heb ik gekocht en nooit gebruikt:' },
  { label: 'Hier heb ik al geld aan besteed zonder het af te maken:' },
  // Digitaal & Social Media
  { label: 'Dit heb ik het laatste gegoogled:' },
  { label: 'Dit staat als eerste op mijn startscherm:' },
  { label: 'Zo lang kan ik zonder mijn telefoon:' },
  { label: 'Mijn meest gebruikte emoji is:' },
  { label: 'Dit zijn de mensen die ik op Instagram het meest stalk:' },
  // Persoonlijkheid & Geheimen
  { label: 'Het rare feit over mezelf dat ik normaal verberg:' },
  { label: 'Ik heb ooit gelogen over:' },
  { label: 'Mijn grootste ongerechtvaardigde schuldgevoel:' },
  { label: 'Dit vind ik stiekem heel erg fijn maar durf ik niet toe te geven:' },
  { label: 'Iets waar ik stiekem trots op ben maar niemand vertel:' },
  { label: 'Dit is mijn meest irrationele angst:' },
  // Relaties & Sociale situaties
  { label: 'Zo reageer ik als iemand mij beledigt:' },
  { label: 'Dit soort mensen vermijd ik op feestjes:' },
  { label: 'Mijn strategie als ik iemand niet meer wil spreken:' },
  { label: 'De meest ongemakkelijke situatie die ik ooit heb meegemaakt:' },
  // Dromen & Ambities
  { label: 'Als ik één dag lang iemand anders kon zijn, dan:' },
  { label: 'Dit zou ik doen als ik morgen oneindig veel geld had:' },
  { label: 'Het beroep dat ik had gewild als kind:' },
  { label: 'Mijn meest onrealistische droom:' },
];

const DEMO_ANSWERS = {
  'Ik word chagrijnig van:': [{ text: 'Als mensen te laat komen', player: 'Lien' }, { text: 'Natte handdoeken op de vloer', player: 'Thomas' }, { text: 'Slechte wifi tijdens een film', player: 'Emma' }, { text: 'Als iemand mijn eten opeet', player: 'Kobe' }, { text: 'Reply-all mails', player: 'Nina' }, { text: 'Niet doorlopen in de supermarkt', player: 'Sander' }],
  'Ik geef het liefst geld uit aan:': [{ text: 'Sneakers die ik nooit draag', player: 'Thomas' }, { text: 'Planten die daarna doodgaan', player: 'Emma' }, { text: 'Concerttickets last minute', player: 'Lien' }, { text: 'Eten bij de bakker om 8u', player: 'Sander' }, { text: 'Online cursussen die ik niet afmaak', player: 'Nina' }, { text: 'Gadgets van AliExpress', player: 'Kobe' }],
  'Dit heb ik het laatste gegoogled:': [{ text: 'Hoe lang kan een mens zonder slaap?', player: 'Nina' }, { text: 'Calorieën frietje mayo', player: 'Kobe' }, { text: 'Weer morgen om 6u', player: 'Sander' }, { text: 'Symptomen burnout test', player: 'Emma' }, { text: 'Goedkoopste vlucht Barcelona', player: 'Lien' }, { text: 'Hoe kook je een ei perfect?', player: 'Thomas' }],
  'Mijn geheime slechte gewoonte is:': [{ text: 'Wekker 7 keer snoozen', player: 'Sander' }, { text: 'Hetzelfde jasje 3 weken dragen', player: 'Kobe' }, { text: 'Vrienden opslaan maar nooit bellen', player: 'Lien' }, { text: 'Berichten lezen en niet antwoorden', player: 'Emma' }, { text: 'Thumbnails pauzeren op akelige gezichten', player: 'Thomas' }, { text: 'Boodschappen doen met 1 euro over', player: 'Nina' }],
  'De beste manier om het weekend te beginnen:': [{ text: 'Pancakes maken in pyjama', player: 'Emma' }, { text: 'Zo lang mogelijk in bed blijven', player: 'Thomas' }, { text: 'Croissant en koffie buiten', player: 'Lien' }, { text: 'Vroeg sporten zodat de rest vrij is', player: 'Nina' }, { text: 'Netflix aan, telefoon uit', player: 'Sander' }, { text: 'Snoozen tot 12u, schuldig voelen, herhalen', player: 'Kobe' }],
  'Mijn meest onnodige aankoop ooit:': [{ text: 'Een broodmachine die nu ergens staat', player: 'Emma' }, { text: 'Spelcomputer die ik 3x heb gebruikt', player: 'Kobe' }, { text: '14 planten in één maand', player: 'Lien' }, { text: 'Een staande bureau die ik nooit gebruik', player: 'Nina' }, { text: 'Koptelefoon van 300 euro voor de bus', player: 'Thomas' }, { text: 'Een jaarabonnement op een app die ik vergat', player: 'Sander' }],
  'Dit heb ik gekocht en nooit gebruikt:': [{ text: 'Een yogamat', player: 'Nina' }, { text: 'Een telescoop', player: 'Kobe' }, { text: 'Een leren rijbroek', player: 'Thomas' }, { text: 'Een kookboek over Japans eten', player: 'Emma' }, { text: 'Een fitnessband', player: 'Sander' }, { text: 'Een taalcursus Italiaans', player: 'Lien' }],
  'Het rare feit over mezelf dat ik normaal verberg:': [{ text: 'Ik praat tegen mijn planten', player: 'Emma' }, { text: 'Ik doe mijn schoenen uit vóór de deur om stiekem', player: 'Lien' }, { text: 'Ik heb een speciaal slaapknuffelritme', player: 'Kobe' }, { text: 'Ik controleer het gas 3x voor ik slaap', player: 'Nina' }, { text: 'Ik eet altijd de snoepjes op kleur', player: 'Thomas' }, { text: 'Ik praat bij films mee als niemand kijkt', player: 'Sander' }],
};

const FALLBACK_ANSWERS = [
  { text: 'Antwoord A van Sander', player: 'Sander' }, { text: 'Antwoord B van Lien', player: 'Lien' },
  { text: 'Antwoord C van Thomas', player: 'Thomas' }, { text: 'Antwoord D van Emma', player: 'Emma' },
  { text: 'Antwoord E van Nina', player: 'Nina' }, { text: 'Antwoord F van Kobe', player: 'Kobe' },
];

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

const DOSSIER_QS = [
  'Ik word chagrijnig van:',
  'De mooiste plek op de wereld waar ik ben geweest:',
  'Ik geef het liefst geld uit aan:',
  'Dit heb ik het laatste gegoogled:',
  'De beste manier om het weekend te beginnen:',
];

let dossierQ = 0;
let r1Q = 0, r1Score = 0, r1Timer = null, r1Time = 5, r1Answered = false, r1Questions = [];
let r2Q = 0, r2Score = 0, r2ZoomTimer = null, r2Answered = false;

function go(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function pickSessionQuestions() {
  return shuffle(QUESTION_BANK).slice(0, 8).map(q => ({
    label: q.label,
    answers: DEMO_ANSWERS[q.label] || FALLBACK_ANSWERS,
  }));
}

function nextQ() {
  dossierQ++;
  const total = DOSSIER_QS.length;
  document.getElementById('q-counter').textContent = `Vraag ${dossierQ + 1} van ${total}`;
  document.getElementById('q-text').textContent = DOSSIER_QS[dossierQ % total];
  document.getElementById('dossier-progress').style.width = Math.min(Math.round(((dossierQ + 1) / total) * 100), 100) + '%';
  document.getElementById('q-answer').value = '';
  if (dossierQ >= total - 1) {
    const btn = document.getElementById('dossier-next-btn');
    btn.textContent = 'Dossier indienen →';
    btn.onclick = () => go('s-waiting');
  }
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

function startRound2() { r2Q = 0; r2Score = 0; showR2Q(); go('s-round2-q'); }

function showR2Q() {
  r2Answered = false;
  clearInterval(r2ZoomTimer);
  const photo = R2_PHOTOS[r2Q];
  document.getElementById('r2-qnum').textContent = `Foto ${r2Q + 1} van ${R2_PHOTOS.length}`;
  document.getElementById('r2-progress').style.width = Math.round(((r2Q + 1) / R2_PHOTOS.length) * 100) + '%';
  document.getElementById('r2-score').textContent = r2Score + ' pt';
  document.getElementById('r2-feedback').textContent = '';
  document.getElementById('r2-pts-flash').textContent = '';
  document.getElementById('r2-next-btn').style.display = 'none';
  document.getElementById('r2-zoom-hint').textContent = 'Foto zoomt uit... raad wie het is!';
  const photoEl = document.getElementById('r2-photo');
  photoEl.textContent = photo.emoji;
  photoEl.style.transition = 'none';
  photoEl.style.transform = 'scale(8)';
  const zoomBar = document.getElementById('r2-zoombar');
  zoomBar.style.transition = 'none';
  zoomBar.style.width = '0%';
  const wrap = document.getElementById('r2-players');
  wrap.innerHTML = '';
  shuffle(PLAYERS).forEach(p => {
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

function nextR2Q() { r2Q++; if (r2Q < R2_PHOTOS.length) showR2Q(); else showScoreR2(); }

function buildScoreboard(containerId, myScore) {
  const others = PLAYERS.filter(p => p.name !== 'Sander').map(p => ({ name: p.name, pts: rand(4, 13), color: p.color }));
  const all = [{ name: 'Sander (jij)', pts: myScore, color: '#ff3d6b', you: true }, ...others].sort((a, b) => b.pts - a.pts);
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
