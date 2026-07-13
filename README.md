# JW Notes

Monorepo für die JW-Notes-Anwendung (Mitschriften von Vorträgen).

## Struktur

```
apps/
  frontend/   Web-App (Vite + Vue + Vue Router 5)
packages/     Gemeinsame Pakete (geplant, z. B. shared types)
```

## Entwicklung

Aus dem Repository-Root:

```bash
npm install
npm run dev
```

Weitere Skripte: `npm run build`, `npm run preview`

Details zur Web-App: [apps/frontend/README.md](apps/frontend/README.md)

Entwicklungsplan: [plan/roadmap.md](plan/roadmap.md)
