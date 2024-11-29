import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Über mich',
      href: getPermalink('/homes/personal'),
    },
    {
      text: 'Ausbildung',
      href: getPermalink('/homes/personal#resume'),
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
  links: [
    {
      title: '',
      links: [
        { text: 'Über mich', href: '/homes/personal' },
      ],
    },
    {
      title: '',
      links: [
        { text: 'Ausbildung', href: '/homes/personal#resume' },
      ],
    },
    {
      title: '',
      links: [
        { text: 'Angebote', href: '/pricing' },
      ],
    },
    {
      title: '',
      links: [
        { text: 'Kontakt', href: '/contact' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Impressum', href: getPermalink('/terms') },
    { text: 'Datenschutz', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
  ],
  footNote: `
    © Stefanie Leidel | Gesundheitspraxis · <a href="/terms">Impressum</a> · <a href="/privacy">Datenschutz</a>
  `,
};
