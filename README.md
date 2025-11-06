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
  name: ''
  site: 'https://wohlfühlgesundheit.de'
  base: '/'
  trailingSlash: false

metadata:
  title:
    default:
    template: '%s | Wohlfühlgesundheit - Holistische Darmtherapie'
  description: 'Wohlfühlgesundheit - Holistische Darmtherapie, Ihre Holistische Darmtherapeutin. Entdecken Sie Tipps und Programme zur Verbesserung Ihrer Gesundheit und Ihres Wohlbefindens. Starten Sie Ihre Reise zu einem gesünderen Lebensstil noch heute!'
  robots:
    index: true
    follow: true
  openGraph:
    site_name: Wohlfühlgesundheit - Holistische Darmtherapie
    images:
      - url: '~/assets/images/default.png'
        width: 1200
        height: 628
    type: website
  twitter:
    handle: '@onwidget'
    site: '@onwidget'
    cardType: summary_large_image

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

### Frontend

- **Framework**: Astro 5.x (Static Site Generator)
- **Styling**: Tailwind CSS 3.x mit Typography Plugin
- **Programmiersprache**: TypeScript
- **Icons**: Astro Icon (Tabler Icons & Flat Color Icons)
- **Schriftarten**:
  - Noto Serif Display (Variable Font)
  - Quicksand (Variable Font)

### Backend & APIs

- **PHP Backend**: Custom PHP API für Formular-Handling (`/public/api/anamnese-booking.php`)
- **Zoom Integration**:
  - Server-to-Server OAuth Authentifizierung
  - Automatische Meeting-Erstellung
  - E-Mail-Benachrichtigungen mit Zoom-Zugangsdaten
  - Terminverwaltung über Zoom API

### Integrationen & Plugins

- **@astrojs/sitemap**: XML-Sitemap-Generierung
- **@astrojs/rss**: RSS-Feed-Support
- **@astrojs/partytown**: Optimierung von Third-Party-Scripts
- **@jop-software/astro-cookieconsent**: DSGVO-konforme Cookie-Verwaltung
- **@astrolib/analytics**: Analytics-Integration
- **@astrolib/seo**: SEO-Optimierung
- **astro-compress**: Asset-Komprimierung (CSS, HTML, JS)
- **astro-embed**: Embed-Support für externe Inhalte
- **astro-emoji**: Emoji-Support

### Analytics & SEO

- **Google Analytics**: G-TT6VB0HM46
- **Google Site Verification**: orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M
- **OpenGraph & Twitter Cards**: Vollständige Social-Media-Integration
- **Robots.txt**: Suchmaschinen-Steuerung

### Besondere Features

#### 1. Zoom-Booking-System

Vollautomatisches Terminbuchungssystem mit:

- Zoom-Meeting-Erstellung via API
- Automatische E-Mail-Benachrichtigungen (HTML für Kunden, Text für Admin)
- Terminvalidierung und Zeitzonenmanagement (Europe/Berlin)
- Warteraum-Funktion für mehr Sicherheit
- Flexible Terminlängen (30/60 Minuten)

#### 2. Umfangreicher Anamnesebogen

Mehrstufiges Formular mit:

- Persönliche Daten & Kontaktinformationen
- Gesundheitsinformationen & Vorerkrankungen
- Ernährungs- und Lifestyle-Analyse
- Verdauungs- und Stuhlgang-Details
- Bereitschafts-Assessment für Therapie
- DSGVO-konforme Datenverarbeitung

#### 3. Dark Mode

- System-Theme-Erkennung
- Manueller Light/Dark Mode Toggle
- Persistente Theme-Speicherung

#### 4. Cookie Consent Management

- DSGVO-konform
- Kategorien: Notwendig, Statistik, Marketing
- Vollständig auf Deutsch lokalisiert
- Anpassbare Einstellungen

#### 5. Performance-Optimierungen

- Statische Site-Generierung für beste Performance
- Asset-Komprimierung (HTML, CSS, JS)
- Lazy Loading für Bilder
- CSS Code-Splitting
- Optimierte Font-Loading-Strategie

### Deployment

- **Build-Output**: Statische HTML/CSS/JS-Dateien
- **PHP-Support erforderlich**: Für Backend-API (`/public/api/`)
- **HTTPS empfohlen**: Für sichere Datenübertragung

## Lizenz

Dieses Projekt basiert auf dem AstroWind Template und steht unter der MIT-Lizenz.
