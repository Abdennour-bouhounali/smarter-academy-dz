// Single source of truth for the visitor-facing primary navigation —
// consumed by Navbar, Footer, and CommandPalette so the IA can't drift
// between the three.
// No catalogue link: /courses requires an account (RequireAccount).
// `labelKey` resolves through i18n's `nav` namespace at render time
// (src/i18n/locales/ar/nav.json) — data files carry keys, never copy.
export const navLinks = [
  { labelKey: 'home', path: '/' },
  { labelKey: 'method', path: '/methode' },
  { labelKey: 'about', path: '/about' },
  { labelKey: 'books', path: '/books' },
  { labelKey: 'faq', path: '/faq' },
  { labelKey: 'contact', path: '/contact' },
];
