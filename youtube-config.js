// ─────────────────────────────────────────
//  Unmasked — youtube-config.js
//
//  Leeg = Ronde 4 draait op de ingebouwde tekstfallback (host leest de
//  titel voor, geen echt fragment).
//
//  Om echte fragmenten te horen in Ronde 4 (Soundtrack & Spirit):
//   1. Ga naar https://console.cloud.google.com/apis/credentials
//   2. Maak een project aan (of kies een bestaand project)
//   3. Activeer de "YouTube Data API v3" onder "APIs & Services"
//   4. Maak een API-sleutel aan (Credentials → Create Credentials →
//      API key) en kopieer die hieronder
//   5. Herlaad de pagina — script.js hoeft niet aangepast
//
//  In tegenstelling tot Spotify moet hier NIEMAND inloggen: een kale
//  API-sleutel volstaat om te zoeken en af te spelen. Geen redirect-URI
//  om te registreren, geen "voeg mij toe als tester"-stap.
// ─────────────────────────────────────────

const YOUTUBE_API_KEY = 'AIzaSyCoSi_pDarJO0DRli6LD0fd3zMYAszpbWI';
