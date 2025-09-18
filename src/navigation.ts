import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Start',
      href: getPermalink(),
    },
    {
      text: 'Über mich',
      href: getPermalink('/ueber-mich'),
    },
    {
      text: 'Termin buchen',
      href: getPermalink('/anamnese'),
    },
    {
      text: 'Fragen?',
      href: getPermalink('/kontakt'),
    },
  ],
};

export const footerData = {
  secondaryLinks: [
    { text: 'Impressum', href: getPermalink('/impressum') },
    { text: 'Datenschutz', href: getPermalink('/datenschutz') },
  ],
  socialLinks: [
    {
      ariaLabel: 'Instagram',
      icon: 'tabler:brand-instagram',
      href: 'https://www.instagram.com/stories/wohl_fuehl_gesundheit/',
    },
  ],
  footNote: `
    © Wohlfühlgesundheit · <a class="text-primary hover:text-black dark:text-secondary" href="/impressum">Impressum</a> · <a class="text-primary hover:text-black dark:text-secondary" href="/datenschutz">Datenschutz</a>
  `,
};
