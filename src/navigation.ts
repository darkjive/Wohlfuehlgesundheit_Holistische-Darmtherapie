import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
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
};

export const footerData = {
  secondaryLinks: [
    { text: 'Impressum', href: getPermalink('/terms') },
    { text: 'Datenschutz', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'Pinterest', icon: 'tabler:brand-pinterest', href: '#' },
  ],
  footNote: `
    © Gesundheitspraxis | Stefanie Leidel <br/> <a class="text-primary hover:text-black dark:text-secondary" href="/terms">Impressum</a> · <a class="text-primary hover:text-black dark:text-secondary" href="/privacy">Datenschutz</a>
  `,
};
