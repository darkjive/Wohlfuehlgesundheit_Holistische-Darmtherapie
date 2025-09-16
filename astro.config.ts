import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import partytown from '@astrojs/partytown';

import icon from 'astro-icon';
import compress from 'astro-compress';
import type { AstroIntegration } from 'astro';

import astrowind from './vendor/integration';

import jopSoftwarecookieconsent from '@jop-software/astro-cookieconsent';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (items: (() => AstroIntegration) | (() => AstroIntegration)[] = []) =>
  hasExternalScripts ? (Array.isArray(items) ? items.map((item) => item()) : [items()]) : [];

export default defineConfig({
  output: 'static',

  // Production Build-Optimierungen
  compressHTML: true,
  build: {
    assets: '_astro',
    inlineStylesheets: 'auto',
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),
    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ['dataLayer.push'] },
      })
    ),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
    astrowind({
      config: './src/config.yaml',
    }),
    jopSoftwarecookieconsent({
      guiOptions: {
        consentModal: {
          layout: 'cloud',
          position: 'bottom center',
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          position: 'right',
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          autoClear: {
            cookies: [{ name: /^_ga/ }, { name: /^_gid/ }],
          },
        },
        marketing: {},
      },
      language: {
        default: 'de',
        translations: {
          de: {
            consentModal: {
              title: 'Wir verwenden Cookies',
              description:
                'Wir nutzen Cookies, um unsere Website und Services zu verbessern. Du kannst deine Zustimmung jederzeit anpassen.',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur notwendige',
              showPreferencesBtn: 'Einstellungen',
            },
            preferencesModal: {
              title: 'Cookie-Einstellungen',
              acceptAllBtn: 'Alle akzeptieren',
              acceptNecessaryBtn: 'Nur notwendige',
              savePreferencesBtn: 'Speichern',
              closeIconLabel: 'Schließen',
              sections: [
                {
                  title: 'Notwendig',
                  description: 'Diese Cookies sind für die grundlegende Funktionalität erforderlich.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Statistik',
                  description: 'Hilft uns zu verstehen, wie Besucher unsere Website nutzen.',
                  linkedCategory: 'analytics',
                },
                {
                  title: 'Marketing',
                  description: 'Wird verwendet, um personalisierte Inhalte und Werbung anzuzeigen.',
                  linkedCategory: 'marketing',
                },
              ],
            },
          },
        },
      },
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },

    // Source-Map-Fehler beheben
    build: {
      sourcemap: false, // Source Maps für Production deaktivieren
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // Asset-Namen optimieren
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
        },
      },
    },

    // CSS-Optimierungen
    css: {
      devSourcemap: false,
    },
  },
});
