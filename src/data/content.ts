export const site = {
  name: 'AndyArbeit München',
  tagline: 'Service rund um Ihr Haus!',
  phone: '+49 176 6762 0599',
  phoneHref: 'tel:+4917667620599',
  email: 'kontakt@andyarbeit.info',
  emailHref: 'mailto:kontakt@andyarbeit.info',
} as const

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Leistungen', path: '/leistungen' },
  { label: 'Servicegebiet', path: '/servicegebiet' },
  { label: 'Über uns', path: '/ueber-uns' },
  { label: 'Kontakt', path: '/kontakt' },
] as const

export const hero = {
  title: 'AndyArbeit München',
  subtitle: 'Service rund um Ihr Haus!',
  intro:
    'Willkommen bei Ihrem kompetenten und zuverlässigen Partner in München und Umgebung.',
  description:
    'Vom Hausmeisterservice über Gebäudereinigung und Abwassertechnik bis hin zur Komplettsanierung bieten wir Ihnen umfassende Lösungen aus einer Hand.',
  usps: [
    '24/7-Notdienst für Abwassertechnik',
    'Haftpflichtversicherung für maximale Sicherheit',
    'Flexible Arbeitszeiten & schnelle Reaktion',
    'Langjährige Erfahrung und Kompetenz',
  ],
} as const

export const services = [
  {
    id: 'abwassertechnik',
    title: 'Abwassertechnik',
    description: 'Rohrreinigung, Wartung (inkl. 24/7-Notdienst)',
  },
  {
    id: 'gebaeudereinigung',
    title: 'Gebäudereinigung',
    description: 'Saubere Büros, Gewerberäume & Treppenhäuser',
  },
  {
    id: 'komplettsanierung',
    title: 'Komplettsanierung',
    description:
      'Elektrik, Gas/Wasser, Abriss & mehr in Kooperation mit einem Meisterbetrieb',
  },
  {
    id: 'hausmeisterservice',
    title: 'Hausmeisterservice',
    description: 'Rundum-Betreuung von Wohnanlagen',
  },
  {
    id: 'garten-landschaftspflege',
    title: 'Garten- & Landschaftspflege',
    description: 'In Kooperation mit einem Meisterbetrieb',
  },
] as const

export const serviceAreas = [
  'München Stadt',
  'Pasing',
  'Germering',
  'Gröbenzell',
  'Fürstenfeldbruck',
  'Dachau',
  'Karlsfeld',
  'Unterschleißheim',
] as const

export const whyUs = [
  {
    title: 'Langjährige Erfahrung und Kompetenz',
    description:
      'Zuverlässige Betreuung durch erfahrene Fachkräfte – für Privathaushalte, Gewerbe und Wohnanlagen.',
  },
  {
    title: 'Flexible Arbeitszeiten & schnelle Reaktion',
    description:
      'Wir passen uns Ihrem Bedarf an und reagieren schnell, wenn Sie uns brauchen.',
  },
  {
    title: 'Haftpflichtversicherung für maximale Sicherheit',
    description:
      'Für Ihre Sicherheit sind wir haftpflichtversichert – professionell und verantwortungsvoll.',
  },
  {
    title: '24h Notdienst für Abwassertechnik',
    description:
      'Bei Rohrproblemen sind wir rund um die Uhr erreichbar – Tag und Nacht.',
  },
] as const

export const cta = {
  title: 'Sie benötigen schnelle Hilfe?',
  description:
    'Wir sind für Sie erreichbar, damit Sie jederzeit die Unterstützung erhalten, die Sie benötigen. Egal ob Tag oder Nacht, wir stehen bereit, um Ihre Anliegen schnell und zuverlässig zu erledigen.',
} as const

export const about = {
  title: 'Ihr Partner für Haus und Gebäude in München',
  paragraphs: [
    'AndyArbeit steht für zuverlässigen Service rund um Ihr Haus – von der regelmäßigen Betreuung als Hausmeister bis zur schnellen Hilfe bei Abwasserproblemen.',
    'Mit langjähriger Erfahrung, flexiblen Einsatzzeiten und einem 24-Stunden-Notdienst für Abwassertechnik sind wir Ihr Ansprechpartner im gesamten Münchner Großraum.',
  ],
} as const
