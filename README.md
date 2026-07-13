# JW Notes

Monorepo für die JW-Notes-Anwendung (Mitschriften von Vorträgen).

## Struktur

```
apps/
  frontend/   Web-App (Vite + Vue + Vue Router 5)
  server/     Transkriptions-Backend (NestJS + OpenRouter)
packages/     Gemeinsame Pakete (geplant, z. B. shared types)
```

## Entwicklung

Aus dem Repository-Root:

```bash
npm install
npm run dev
```

Weitere Skripte: `npm run build`, `npm run preview`, `npm run dev:server`, `npm run build:server`, `npm run start:server`

Details zur Web-App: [apps/frontend/README.md](apps/frontend/README.md)

Entwicklungsplan: [plan/roadmap.md](plan/roadmap.md)

## Transkriptions-Dienst (API)

Wenn in den Optionen eine Transkriptions-URL hinterlegt ist, sendet die App auf Knopfdruck die letzten 10, 15 oder 30 Sekunden der Aufnahme per `POST`:

```
POST {urlTranscriptionService}
Content-Type: multipart/form-data

audio          — Audio-Blob (webm/wav)
from_second    — Start des Abschnitts in Sekunden
to_second      — Ende des Abschnitts in Sekunden
window_seconds — Gewähltes Fenster (10, 15 oder 30)
note_id        — UUID der Mitschrift
```

Erwartete Antwort:

```json
{ "text": "Transkribierter Text..." }
```

Transkriptionen werden in `transcriptions[]` der Note gespeichert (mit `fromSecond`, `toSecond`, `windowSeconds`, `createdAt`). Audio-Blobs liegen separat unter dem IndexedDB-Key `audio:{audioId}`.

## Transkriptions-Backend (`apps/server`)

NestJS-Server, der Audio entgegennimmt und über [OpenRouter](https://openrouter.ai/docs/guides/overview/multimodal/stt) transkribiert.

### Einrichtung

```bash
cp apps/server/.env.example apps/server/.env
# OPENROUTER_API_KEY in apps/server/.env setzen
npm install
npm run dev:server
```

Server läuft standardmäßig auf `http://localhost:3000`.

### Endpoint

```
POST /transcribe?language=de
Content-Type: multipart/form-data
```

Query-Parameter `language` (optional, ISO-639-1, z. B. `de`) — weglassen für Auto-Erkennung.

Formularfelder wie oben (`audio`, `from_second`, …). Antwort: `{ "text": "..." }`.

In den App-Optionen z. B. `http://localhost:3000/transcribe?language=de` oder im Dev mit Vite-Proxy `/transcribe?language=de`.
