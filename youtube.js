// ─────────────────────────────────────────
//  Unmasked — youtube.js
//  Muziek voor Ronde 4 (Soundtrack & Spirit) via YouTube in plaats van
//  Spotify.
//
//  Vervangt de vorige Spotify-integratie: die vereiste een OAuth-login
//  per host (redirect naar Spotify en terug, een exact geregistreerde
//  redirect-URI, en — zolang de Spotify-app in Development Mode staat —
//  dat elk testend account expliciet werd toegevoegd). Dat bleek in de
//  praktijk te broos om betrouwbaar op te zetten.
//
//  YouTube Data API v3 heeft geen van die stappen nodig: een kale
//  API-sleutel (zie youtube-config.js) volstaat om te zoeken, en
//  afspelen gebeurt via de publieke YouTube IFrame Player API — geen
//  login, geen redirect-URI, geen tester-lijst.
// ─────────────────────────────────────────

function youtubeConfigured() {
  return typeof YOUTUBE_API_KEY !== 'undefined' && YOUTUBE_API_KEY && YOUTUBE_API_KEY.length > 10;
}

async function youtubeSearchTrack(query) {
  if (!youtubeConfigured()) return null;
  const params = new URLSearchParams({
    part: 'snippet', maxResults: '1', type: 'video', q: query, key: YOUTUBE_API_KEY,
  });
  try {
    const res = await fetch('https://www.googleapis.com/youtube/v3/search?' + params.toString());
    if (!res.ok) return null;
    const data = await res.json();
    const item = data.items && data.items[0];
    if (!item) return null;
    return {
      id: item.id.videoId,
      name: item.snippet.title,
      artist: item.snippet.channelTitle,
      albumArt: (item.snippet.thumbnails && item.snippet.thumbnails.default) ? item.snippet.thumbnails.default.url : '',
    };
  } catch (e) { return null; } // netwerkfout — behandeld als "geen match gevonden"
}

// ── IFrame Player API (host device only) ──────────────────────────────

let youtubePlayer = null;
let youtubeIframeApiReadyPromise = null;

function loadYouTubeIframeApi() {
  if (youtubeIframeApiReadyPromise) return youtubeIframeApiReadyPromise;
  youtubeIframeApiReadyPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) { resolve(window.YT); return; }
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });
  return youtubeIframeApiReadyPromise;
}

async function playYouTubeTrack(videoId, elementId) {
  const YT = await loadYouTubeIframeApi();
  return new Promise((resolve) => {
    const el = document.getElementById(elementId);
    el.innerHTML = '';
    const holder = document.createElement('div');
    el.appendChild(holder);
    youtubePlayer = new YT.Player(holder, {
      height: '80', width: '100%',
      videoId,
      playerVars: { autoplay: 1 },
      events: {
        onReady: (e) => { try { e.target.playVideo(); } catch (err) { /* autoplay kan geblokkeerd zijn — herafspeelknop blijft beschikbaar */ } resolve(e.target); },
      },
    });
  });
}

function stopYouTubePlayback() {
  if (youtubePlayer) { try { youtubePlayer.pauseVideo(); } catch (e) { /* ignore */ } }
}
