# JW Notes

Monorepo für die JW-Notes-Anwendung (Mitschriften von Vorträgen).

## Struktur

```
apps/
  frontend/   Web-App (aktuell Nuxt, geplant: Vite + Vue)
packages/     Gemeinsame Pakete (geplant, z. B. shared types)
```

## Entwicklung

Aus dem Repository-Root:

```bash
npm install
npm run dev
```

Weitere Skripte: `npm run build`, `npm run generate`, `npm run preview`

Details zur Web-App: [apps/frontend/README.md](apps/frontend/README.md)
