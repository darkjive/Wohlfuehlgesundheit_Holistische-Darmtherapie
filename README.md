# Stefanie Leidel - Holistische Darmtherapie

Website: Wohlfühlgesundheit Holistische Darmtherapie , entwickelt mit Astro und Tailwind CSS.

## Projektstruktur

```
/
├── public/
│   ├── _headers
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── favicons/
│   │   ├── images/
│   │   └── styles/
│   │       └── tailwind.css
│   ├── components/
│   │   ├── blog/
│   │   ├── common/
│   │   ├── ui/
│   │   ├── widgets/
│   │   │   ├── Header.astro
│   │   │   └── ...
│   │   ├── CustomStyles.astro
│   │   ├── Favicons.astro
│   │   └── Logo.astro
│   ├── layouts/
│   │   ├── Layout.astro
│   │   ├── MarkdownLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   └── ...
│   ├── utils/
│   ├── config.yaml
│   └── navigation.js
├── package.json
├── astro.config.ts
└── ...
```

## Installation und Entwicklung

Alle Befehle werden im Hauptverzeichnis des Projekts ausgeführt:

| Befehl              | Aktion                                            |
| ------------------- | ------------------------------------------------- |
| `npm install`       | Installiert Abhängigkeiten                        |
| `npm run dev`       | Startet den Entwicklungsserver auf localhost:4321 |
| `npm run build`     | Erstellt die produktionsreife Website in ./dist/  |
| `npm run preview`   | Vorschau der gebauten Website vor dem Deployment  |
| `npm run check`     | Überprüft das Projekt auf Fehler                  |
| `npm run fix`       | Führt ESLint aus und formatiert Code mit Prettier |
| `npm run astro ...` | Führt Astro CLI-Befehle aus                       |

## Konfiguration

Die Hauptkonfigurationsdatei befindet sich unter `./src/config.yaml`:

```yaml
site:
  name: 'Stefanie Leidel - Holistische Darmtherapie'
  site: 'https://gesundheitspraxis-stefaniel.de'
  base: '/'
  trailingSlash: false

metadata:
  title:
    default: 'Stefanie Leidel - Holistische Darmtherapie'
    template: '%s — Stefanie Leidel - Holistische Darmtherapie'
  description: 'Professionelle Gesundheitsdienstleistungen in [Ort]'
  robots:
    index: true
    follow: true

ui:
  theme: 'system' # "system" | "light" | "dark"
```

## Anpassungen

### Styling

Für Anpassungen der Schriftarten, Farben oder anderen Design-Elementen:

- `src/components/CustomStyles.astro`
- `src/assets/styles/tailwind.css`

### Inhalte

- Seiten: `src/pages/`
- Komponenten: `src/components/`

## Deployment

1. Produktionsbuild erstellen:

   ```bash
   npm run build
   ```

2. Der `dist/` Ordner enthält alle statischen Dateien für das Deployment

## Technische Details

- **Framework**: Astro 4.x
- **Styling**: Tailwind CSS
- **Deployment**: Statische Website

## Lizenz

Dieses Projekt basiert auf dem AstroWind Template und steht unter der MIT-Lizenz.
