# JW Notes
Dies ist eine privat entwickelte WebApp um komfortabler Mitschriften von Vorträgen von Jehovas Zeugen anlegen zu können.

Die wesentlichen Unterschiede zu herkömmlichen Schreibprogrammen sind:
- Schwarzes Design, um die Akkuleistung zu maximieren. Hierfür muss das Gerät schwarze Bildpunkte als „nicht leuchten“ Interpretieren (Displaytyp: OLED).
- Bibeltexte werden erkannt und können per Klick direkt auf wol.jw.org geöffnet werden (@Ps 1:1)

## Development (Vite)

From the repository root:

```bash
npm install
npm run dev
npm run build
npm run preview
```

- `npm run dev` — local development server (Vite)
- `npm run build` — production build to `apps/frontend/dist`
- `npm run preview` — serve the production build locally
