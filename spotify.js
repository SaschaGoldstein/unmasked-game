// ─────────────────────────────────────────
//  Unmasked — spotify.js
//  Host-only Spotify connection for Round 4 (Soundtrack & Spirit).
//
//  Uses Authorization Code + PKCE (no client secret — safe for a static
//  site with no backend). Only the host needs to connect: the host's
//  browser searches each player's submitted song and plays it out loud
//  via the Spotify iFrame Embed API, the same way the host's phone reads
//  Round 3's confessions aloud. Other players never need a Spotify
//  account — they just guess.
// ─────────────────────────────────────────

// Normalized so it's identical no matter how the page was opened — with
// or without a trailing slash, as ".../" or as ".../index.html" — since
// Spotify requires an EXACT string match against what's registered in
// the dashboard. Without this, sharing a link without the trailing
// slash (easy to do by hand) would silently compute a different
// redirect_uri and Spotify would reject the login with "Invalid redirect URI".
const SPOTIFY_REDIRECT_URI = window.location.origin + window.location.pathname.replace(/index\.html$/, '').replace(/\/*$/, '/');
const SPOTIFY_TOKEN_KEY = 'unmasked:spotify:token';
const SPOTIFY_VERIFIER_KEY = 'unmasked:spotify:verifier';
const SPOTIFY_AUTH_ERROR_KEY = 'unmasked:spotify:autherror';

function spotifyConfigured() {
  return typeof SPOTIFY_CLIENT_ID !== 'undefined' && SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_ID.length > 10;
}

function randomString(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) s += chars[arr[i] % chars.length];
  return s;
}

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function pkceChallenge(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64UrlEncode(digest);
}

const UNMASKED_RESUME_KEY = 'unmasked:resume';

async function spotifyConnect() {
  clearSpotifyAuthError();
  // window.location.href is a full page navigation away to Spotify's login —
  // everything in memory (which lobby we're in, who we are) would otherwise
  // be lost when the browser comes back. Persist it so script.js can restore
  // the session once the page reloads with the auth code.
  sessionStorage.setItem(UNMASKED_RESUME_KEY, JSON.stringify({
    code: Session.code, playerId: Session.playerId, isHost: Session.isHost, screen: 's-round4-intro',
  }));
  const verifier = randomString(64);
  sessionStorage.setItem(SPOTIFY_VERIFIER_KEY, verifier);
  const challenge = await pkceChallenge(verifier);
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    scope: '',
  });
  window.location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
}

// Bewaart de reden bij een mislukte verbinding — voorheen zag de host
// enkel "niet verbonden", zonder enig aanknopingspunt waarom (bv. een
// redirect-URI die niet exact overeenkomt met wat in het Spotify-
// dashboard staat, of een account dat niet is toegevoegd als tester
// zolang de app in "Development Mode" staat).
function getSpotifyAuthError() { return sessionStorage.getItem(SPOTIFY_AUTH_ERROR_KEY); }
function clearSpotifyAuthError() { sessionStorage.removeItem(SPOTIFY_AUTH_ERROR_KEY); }

async function handleSpotifyRedirect() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');
  const authError = url.searchParams.get('error');
  if (!code && !authError) return;
  const verifier = sessionStorage.getItem(SPOTIFY_VERIFIER_KEY);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  url.searchParams.delete('error');
  window.history.replaceState({}, '', url.toString());
  if (authError) { sessionStorage.setItem(SPOTIFY_AUTH_ERROR_KEY, authError); return; }
  if (!verifier) { sessionStorage.setItem(SPOTIFY_AUTH_ERROR_KEY, 'sessie verlopen (geen verifier gevonden) — probeer opnieuw'); return; }
  try {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code', code,
        redirect_uri: SPOTIFY_REDIRECT_URI, client_id: SPOTIFY_CLIENT_ID,
        code_verifier: verifier,
      }),
    });
    const data = await res.json();
    if (data.access_token) {
      sessionStorage.setItem(SPOTIFY_TOKEN_KEY, JSON.stringify({
        access_token: data.access_token, refresh_token: data.refresh_token,
        expires_at: Date.now() + (data.expires_in - 30) * 1000,
      }));
      clearSpotifyAuthError();
    } else {
      sessionStorage.setItem(SPOTIFY_AUTH_ERROR_KEY, data.error_description || data.error || 'onbekende fout bij het ophalen van de toegangstoken');
    }
  } catch (e) { sessionStorage.setItem(SPOTIFY_AUTH_ERROR_KEY, 'netwerkfout: ' + e.message); }
}

async function spotifyRefreshToken(refresh_token) {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token, client_id: SPOTIFY_CLIENT_ID }),
  });
  return res.json();
}

async function getSpotifyToken() {
  const raw = sessionStorage.getItem(SPOTIFY_TOKEN_KEY);
  if (!raw) return null;
  let tok = JSON.parse(raw);
  if (Date.now() > tok.expires_at && tok.refresh_token) {
    const data = await spotifyRefreshToken(tok.refresh_token);
    if (!data.access_token) { sessionStorage.removeItem(SPOTIFY_TOKEN_KEY); return null; }
    tok = { access_token: data.access_token, refresh_token: data.refresh_token || tok.refresh_token, expires_at: Date.now() + (data.expires_in - 30) * 1000 };
    sessionStorage.setItem(SPOTIFY_TOKEN_KEY, JSON.stringify(tok));
  }
  return tok.access_token;
}

function spotifyDisconnect() { sessionStorage.removeItem(SPOTIFY_TOKEN_KEY); }
function spotifyIsConnected() { return !!sessionStorage.getItem(SPOTIFY_TOKEN_KEY); }

async function spotifySearchTrack(query) {
  const token = await getSpotifyToken();
  if (!token) return null;
  const params = new URLSearchParams({ q: query, type: 'track', limit: '1' });
  const res = await fetch('https://api.spotify.com/v1/search?' + params.toString(), {
    headers: { Authorization: 'Bearer ' + token },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const track = data.tracks && data.tracks.items && data.tracks.items[0];
  if (!track) return null;
  return {
    id: track.id,
    name: track.name,
    artist: track.artists.map(a => a.name).join(', '),
    albumArt: track.album.images[0] ? track.album.images[0].url : '',
  };
}

// ── iFrame Embed playback (host device only) ─────────────────────────

let spotifyIframeController = null;
let spotifyIframeApiReadyPromise = null;

function loadSpotifyIframeApi() {
  if (spotifyIframeApiReadyPromise) return spotifyIframeApiReadyPromise;
  spotifyIframeApiReadyPromise = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => resolve(IFrameAPI);
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    document.head.appendChild(script);
  });
  return spotifyIframeApiReadyPromise;
}

async function playSpotifyTrack(trackId, elementId) {
  const IFrameAPI = await loadSpotifyIframeApi();
  return new Promise((resolve) => {
    const el = document.getElementById(elementId);
    el.innerHTML = '';
    IFrameAPI.createController(el, { uri: 'spotify:track:' + trackId, width: '100%', height: '80' }, (controller) => {
      spotifyIframeController = controller;
      controller.addListener('ready', () => { controller.play(); resolve(controller); });
    });
  });
}

function stopSpotifyPlayback() {
  if (spotifyIframeController) { try { spotifyIframeController.pause(); } catch (e) { /* ignore */ } }
}

handleSpotifyRedirect();
