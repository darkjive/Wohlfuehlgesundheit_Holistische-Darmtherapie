import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Start',
      href: getPermalink(),
    },
    {
      text: 'Über mich',
      href: getPermalink('/homes/personal'),
    },
    {
      text: 'Angebote',
      href: getPermalink('/pricing'),
    },
    {
      text: 'Kontakt',
      href: getPermalink('/contact'),
    },
  ],
  //    actions: [{ text: 'Download', href: 'https://github.com/arthelokyo/astrowind', target: '_blank' }],
};

export const footerData = {
  secondaryLinks: [
    { text: 'Impressum', href: getPermalink('/terms') },
    { text: 'Datenschutz', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    {
      ariaLabel: 'Instagram',
      icon: 'tabler:brand-instagram',
      href: 'https://www.instagram.com/stories/wohl_fuehl_gesundheit/',
    },
    // { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    // { ariaLabel: 'Pinterest', icon: 'tabler:brand-pinterest', href: '#' },
  ],
  footNote: `
    © Wohlfühlgesundheit · <a class="text-primary hover:text-black dark:text-secondary" href="/terms">Impressum</a> · <a class="text-primary hover:text-black dark:text-secondary" href="/privacy">Datenschutz</a>
  `,
};
