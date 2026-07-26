export const site = {
  name: 'AndyArbeit München',
  legalName: 'AndyArbeit',
  owner: 'Andreas Graf',
  tagline: 'Service rund um Ihr Haus!',
  motto: 'An die Arbeit',
  url: 'https://www.andyarbeit.info',
  officePhone: '089 63857018',
  officePhoneHref: 'tel:+498963857018',
  phone: '+49 176 6762 0599',
  phoneHref: 'tel:+4917667620599',
  // International format without + or spaces (for wa.me links)
  whatsappPhone: '4917667620599',
  email: 'kontakt@andyarbeit.info',
  emailHref: 'mailto:kontakt@andyarbeit.info',
  address: {
    streetAddress: 'Thaddäus-Eck-Str. 15',
    postalCode: '81247',
    addressLocality: 'München',
    addressCountry: 'DE',
  },
} as const

/** Per-route document title + meta description (SPA head updates). */
export const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'AndyArbeit | Haus & Gebäudeservice München',
    description:
      'AndyArbeit München – Hausmeisterservice, Gebäudereinigung, Abwassertechnik und mehr. Ihr zuverlässiger Partner im Münchner Großraum.',
  },
  '/leistungen': {
    title: 'Leistungen München | AndyArbeit',
    description:
      'Unsere Leistungen: Abwassertechnik, Komplettsanierung, Hausmeisterservice, Garten- & Landschaftspflege und Gebäudereinigung in München.',
  },
  '/partner': {
    title: 'Partner | AndyArbeit',
    description:
      'Starke Partnerbetriebe von AndyArbeit – Meisterqualität für Sanierung, Elektro, Umzüge und mehr im Raum München.',
  },
  '/ueber-uns': {
    title: 'Über uns | AndyArbeit',
    description:
      'Lernen Sie AndyArbeit kennen: zuverlässiger Haus- und Gebäudeservice in München und Umgebung – persönlich, fair und erreichbar.',
  },
  '/termin-anfragen': {
    title: 'Terminanfrage München | AndyArbeit',
    description:
      'Termin bei AndyArbeit anfragen – schnell und unkompliziert für Hausmeisterservice, Reinigung, Abwassertechnik und weitere Leistungen.',
  },
  '/notfall': {
    title: 'Notfall Rohrreinigung München | AndyArbeit',
    description:
      'Rohrreinigungs-Notdienst in München: Soforthilfe bei verstopften Abflüssen und Abwasserproblemen – auch abends, am Wochenende und an Feiertagen.',
  },
  '/impressum': {
    title: 'Impressum | AndyArbeit',
    description:
      'Impressum und Anbieterkennzeichnung von AndyArbeit München gemäß § 5 DDG.',
  },
  '/datenschutz': {
    title: 'Datenschutz | AndyArbeit',
    description:
      'Datenschutzerklärung von AndyArbeit München – Informationen zur Verarbeitung personenbezogener Daten.',
  },
}

export const whatsappEmergencyMessage = `Anfrage wegen Rohrreinigung Notfall
Vorname:
Nachname:
Adresse:
Email:
Telefon:
Stockwerk der Verstopfung:

Deine Nachricht:
`

export const whatsappQuickMessage = `Anfrage über die AndyArbeit Website
Vorname:
Nachname:
Adresse:
Telefon:
Email:
Anliegen:
`

const waLink = (message: string) =>
  `https://wa.me/${site.whatsappPhone}?text=${encodeURIComponent(message)}`

export const whatsappEmergencyHref = waLink(whatsappEmergencyMessage)
export const whatsappQuickHref = waLink(whatsappQuickMessage)

export const emergencyContact = {
  label: 'Notfall',
  path: '/notfall',
  ariaLabel: 'Notfall – Soforthilfe',
} as const

export const notfallPage = {
  title: 'Soforthilfe bei Notfall',
  eyebrow: 'Notdienst München · 17–22 Uhr',
  intro: 'Akutes Rohr- oder Abwasserproblem? Sofort anrufen oder per WhatsApp melden.',
  examplesTitle: 'Typische Notfälle',
  examples: [
    'Verstopfung mit Überlauf oder Wasser im Bad / Keller',
    'Abfluss läuft nicht mehr ab',
    'Rückstau oder dringender Abwasser-Notfall',
  ],
  availabilityLabel: 'Erreichbar',
  availabilityItems: ['Abends 17–22 Uhr', 'Wochenende', 'Feiertage'],
  callLabel: 'Jetzt anrufen',
  whatsappLabel: 'WhatsApp Notdienst',
  noEmergencyText: 'Kein Notfall?',
  noEmergencyCta: 'Zur Terminanfrage',
} as const

export const socialLinks = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/andyarbeit_89',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@andyarbeit089',
  },
] as const

export const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Leistungen', path: '/leistungen' },
  { label: 'Über uns', path: '/ueber-uns' },
  { label: 'Terminanfrage', path: '/termin-anfragen' },
] as const

/** Footer keeps Partner as a secondary link (not in the main header). */
export const footerNavLinks = [
  { label: 'Home', path: '/' },
  { label: 'Leistungen', path: '/leistungen' },
  { label: 'Partner', path: '/partner' },
  { label: 'Über uns', path: '/ueber-uns' },
  { label: 'Terminanfrage', path: '/termin-anfragen' },
] as const

export const appointmentRequest = {
  title: 'Terminanfrage',
  intro: 'Zuerst eine kurze Frage – so finden wir den schnellsten Weg für Sie.',
  triageQuestion: 'Handelt es sich um einen Notfall?',
  triageHint: 'Was zählt als Notfall?',
  notfallExamplesTitle: 'Ein Notfall liegt z. B. vor bei:',
  notfallExamples: [
    'Rohrverstopfung mit Überlauf oder Wasser im Bad / Keller',
    'Abfluss läuft nicht mehr ab und droht Folgeschäden',
    'Rückstau, geruchsintensiver oder dringender Abwasser-Notfall',
    'Probleme, die nicht bis zu einem geplanten Termin warten können',
  ],
  notfallNoExamplesTitle: 'Kein Notfall – eher eine Terminanfrage – ist z. B.:',
  notfallNoExamples: [
    'Wartung, Reinigung oder geplante Hausmeisterarbeiten',
    'Anliegen, die in den nächsten Tagen erledigt werden können',
  ],
  choiceYes: 'Ja, Notfall',
  choiceNo: 'Nein, Terminanfrage',
  changeChoice: 'Auswahl ändern',
  emergencyTitle: 'Soforthilfe bei Notfall',
  emergencyText:
    'Bitte warten Sie nicht auf eine Terminanfrage. Rufen Sie uns an oder schreiben Sie uns per WhatsApp – wir sind rund um die Uhr erreichbar.',
  emergencyCall: 'Jetzt anrufen',
  emergencyWhatsApp: 'Notdienst per WhatsApp',
  stepsTitle: 'So funktioniert die Terminanfrage',
  steps: [
    {
      title: 'Anfrage senden',
      short: 'Wunschtermin + Anliegen angeben.',
      description:
        'Beschreiben Sie Ihr Anliegen und nennen Sie Wunschdatum sowie Uhrzeit. Das ist noch keine verbindliche Buchung.',
    },
    {
      title: 'Antwort in 24 Stunden',
      short: 'Wir bestätigen oder schlagen Alternativen vor.',
      description:
        'Wir prüfen Ihre Anfrage und bestätigen Ihren Wunschtermin – oder schlagen einen passenden Alternativtermin vor.',
    },
    {
      title: 'Einsatz nach Bestätigung',
      short: 'Erst dann ist der Termin verbindlich.',
      description:
        'Erst nach unserer Bestätigung ist der Termin verbindlich. Dann kommt unser Team zuverlässig zu Ihnen.',
    },
  ],
  stepsInfoLabel: 'Mehr Infos zum Ablauf',
  formTitle: 'Terminanfrage senden',
  formSubtitle:
    'Unverbindlich – Pflichtfelder mit *. Rückmeldung spätestens innerhalb von 24 Stunden.',
} as const

export const heroCarouselSlides = [
  {
    // Brand-first: person/brand photo, not the Notdienst vehicle
    src: '/photos/home-portrait.jpeg',
    srcMobile: '/photos/home-portrait.jpeg',
    alt: 'Andreas von AndyArbeit München – Service rund ums Haus',
    title: 'AndyArbeit München',
    subtitle:
      'An die Arbeit – Hausmeisterservice, Gebäudereinigung & Abwassertechnik aus einer Hand',
    contentPosition: 'bottom' as const,
    /** Keep Andy’s face/upper body as the crop anchor */
    focus: 'person' as const,
  },
  {
    src: '/photos/home-pipe-camera.jpeg',
    srcMobile: '/photos/home-pipe-camera.jpeg',
    alt: 'TV-Kamerauntersuchung und Rohrreinigung vor Ort in München',
    title: 'Rohrprobleme? Wir sind für Sie da.',
    subtitle:
      'TV-Kamerauntersuchung und fachgerechte Abwassertechnik – professionell, fair und persönlich',
    contentPosition: 'right' as const,
    /** Tools (Kamera-Monitor) + Andy are the protagonists */
    focus: 'tools' as const,
  },
  {
    src: '/photos/home-car.jpeg',
    srcMobile: '/photos/home-car.jpeg',
    alt: 'AndyArbeit Notdienst – mobil unterwegs in München und Umgebung',
    title: '24/7 Notdienst',
    subtitle:
      'Schnell erreichbar in München und Umgebung – auch abends, am Wochenende und an Feiertagen',
    contentPosition: 'bottom' as const,
    /** Branded car is the lead subject; keep Andy in frame too */
    focus: 'vehicle' as const,
  },
] as const

export const hero = {
  title: 'AndyArbeit München',
  subtitle: 'An die Arbeit – Service rund um Ihr Haus!',
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
    body: 'Verstopfte Abflüsse und Rohrprobleme kommen selten gelegen – wir helfen schnell und zuverlässig. Ob Küchenleitung reinigen, klassische Rohrreinigung, Hochdruckspülung oder TV-Kamerauntersuchung: wir bieten professionelle Abwassertechnik für Haushalte, Gewerbe und Wohnanlagen. Unser Notdienst ist rund um die Uhr erreichbar.',
    gallery: [
      {
        src: '/photos/abwassertechnik/andy-kitchen-pipe-cleaning.jpeg',
        alt: 'Rohrreinigung der Küchenleitung mit Spirale unter der Spüle',
        caption: 'Küchenleitung reinigen – schnell und ohne große Baustelle.',
        body: 'Verstopfte Küchenabflüsse lösen wir vor Ort mit professioneller Spirale – damit Fett und Ablagerungen wieder freigespült werden und das Wasser ruhig abläuft.',
        objectPosition: { mobile: '50% 48%', desktop: '52% 42%' },
      },
      {
        src: '/photos/abwassertechnik/andy-pipe-equipment-walk.jpeg',
        alt: 'Schachtortung und Kanalreinigung mit professionellem Ortungsgerät',
        caption: 'Schachtortung für die Kanalreinigung – präzise und ohne unnötiges Aufgraben.',
        body: 'Mit professionellem Schachtortungsgerät finden wir verdeckte Schächte und Leitungen exakt – so lösen wir Ihre Rohrprobleme gezielt und schonen Grundstück und Garten.',
        // Tall portrait: contain keeps head → tool wheels visible on every screen size
        objectFit: 'contain' as const,
        objectPosition: { mobile: '50% 50%', desktop: '50% 50%' },
      },
      {
        src: '/photos/abwassertechnik/andy-pipe-camera-kit.jpeg',
        alt: 'TV-Kamerasystem bei der Rohrinspektion am offenen Schacht',
        caption: 'TV-Kamerauntersuchung – Blick ins Rohr, bevor saniert wird.',
        body: 'Mit professionellem Kamerasystem sehen wir Verstopfungen und Schäden direkt im Rohr – so wissen Sie genau, was nötig ist, und unnötiges Aufreißen entfällt.',
        objectPosition: { mobile: '42% 55%', desktop: '36% 58%' },
      },
    ],
  },
  {
    id: 'komplettsanierung',
    title: 'Komplettsanierung',
    description:
      'Elektrik, Gas/Wasser, Abriss & mehr in Kooperation mit einem Meisterbetrieb',
    body: 'Bei Sanierungsprojekten koordinieren wir die wichtigsten Gewerke aus einer Hand. In Kooperation mit einem Meisterbetrieb unterstützen wir Sie bei Elektrik, Gas/Wasser, Abrissarbeiten und weiteren Maßnahmen – von der Planung bis zur sauberen Umsetzung.',
    gallery: [
      {
        src: '/photos/komplettsanierung/andy-garden-work.jpeg',
        alt: 'Körperliche Arbeiten und Vorbereitung auf dem Grundstück',
        caption: 'Vorbereitung und Umsetzung – handwerklich und zuverlässig.',
        body: 'Von Abriss bis Aufbau: wir packen mit an und halten die Baustelle für Sie im Griff.',
        objectPosition: { mobile: '55% 42%', desktop: '68% 55%' },
      },
      {
        src: '/photos/komplettsanierung/andy-renovation-interior.jpeg',
        alt: 'Innenausbau bei der Komplettsanierung mit Bodenschutz und Einbauten',
        caption: 'Innenausbau – sauber geschützt und professionell umgesetzt.',
        body: 'Bei der Sanierung schützen wir Böden und Flächen und setzen Einbauten, Licht und Technik sorgfältig um – damit Ihr Umbau geordnet und termingerecht vorangeht.',
        objectPosition: { mobile: '50% 42%', desktop: '50% 45%' },
      },
      {
        src: '/photos/komplettsanierung/andy-renovation-infrastructure.jpeg',
        alt: 'Rohbau und Leitungsvorbereitung bei der Komplettsanierung',
        caption: 'Rohbau und Leitungen – die Basis für eine moderne Sanierung.',
        body: 'Wir bereiten Wände und Leitungswege für Elektrik, Gas und Wasser vor – abgestimmt mit dem Meisterbetrieb, damit die Sanierung auf einem soliden Fundament steht.',
        objectPosition: { mobile: '50% 40%', desktop: '48% 42%' },
      },
    ],
  },
  {
    id: 'hausmeisterservice',
    title: 'Hausmeisterservice',
    description: 'Rundum-Betreuung von Wohnanlagen',
    body: 'Als Hausmeisterservice kümmern wir uns um den laufenden Betrieb Ihrer Wohnanlage: kleinere Reparaturen, Kontrollgänge, Winterdienst-Abstimmung und die schnelle Reaktion, wenn etwas nicht stimmt. So bleibt Ihre Immobilie gepflegt und funktionsfähig.',
    gallery: [
      {
        src: '/photos/hausmeisterservice/andy-roof-cleaning.jpeg',
        alt: 'Dachreinigung und Gebäudepflege durch AndyArbeit',
        caption: 'Dach- und Gebäudepflege – gründlich und mit dem richtigen Equipment.',
        body: 'Von der Dachpflege bis zur Fassadenreinigung: wir halten Gebäude optisch und funktional in Schuss.',
        // Portrait work shot: contain keeps head → blower nozzle visible
        objectFit: 'contain' as const,
        objectPosition: { mobile: '50% 50%', desktop: '50% 50%' },
      },
      {
        src: '/photos/hausmeisterservice/andy-driveway-trim.jpeg',
        alt: 'Pflege von Zufahrt und Außenanlagen',
        caption: 'Kleine Pflegearbeiten – bevor Probleme groß werden.',
        body: 'Kleine Defekte und Unordnung beheben wir frühzeitig – damit Ihre Anlage gepflegt bleibt.',
        objectPosition: { mobile: '52% 40%', desktop: '58% 42%' },
      },
      {
        src: '/photos/hausmeisterservice/andy-hallway-sweeping.jpeg',
        alt: 'Hausmeister kehrt Treppenhaus und Flur',
        caption: 'Saubere Gemeinschaftsflächen – Treppenhaus und Flur inklusive.',
        body: 'Kehrarbeiten und laufende Pflege in Hausfluren und Treppenhäusern gehören zu unserem Hausmeisterservice.',
        objectPosition: { mobile: '48% 32%', desktop: '50% 35%' },
      },
    ],
  },
  {
    id: 'garten-landschaftspflege',
    title: 'Garten- & Landschaftspflege',
    description: 'In Kooperation mit einem Meisterbetrieb',
    body: 'Gepflegte Außenanlagen werten jedes Objekt auf. In Kooperation mit einem Meisterbetrieb unterstützen wir Sie bei der Garten- und Landschaftspflege – von der regelmäßigen Pflege bis zu saisonalen Arbeiten rund um Ihr Grundstück.',
    gallery: [
      {
        src: '/photos/garten-landschaftspflege/andy-lawn-mower-portrait.jpeg',
        alt: 'AndyArbeit bei der Rasenpflege mit professionellem Gerät',
        caption: 'Saubere Außenanlagen – mit Profi-Gerät und klarer Handschrift.',
        body: 'Gemeinsam mit erfahrenen Partnern halten wir Grünflächen und Außenbereiche gepflegt und einladend.',
        objectPosition: { mobile: '45% 38%', desktop: '42% 62%' },
      },
      {
        src: '/photos/garten-landschaftspflege/andy-hedge-trimming.jpeg',
        alt: 'Heckenschnitt und Gartenpflege durch AndyArbeit',
        caption: 'Professioneller Heckenschnitt – sauber und mit dem richtigen Gerät.',
        body: 'Formschnitte und Rückschnitte erledigen wir sauber, termingerecht und mit dem passenden Gerät.',
        objectPosition: { mobile: '48% 30%', desktop: '46% 32%' },
      },
      {
        src: '/photos/garten-landschaftspflege/andy-lawn-mowing.jpeg',
        alt: 'Rasenmähen und Gartenpflege durch AndyArbeit',
        caption: 'Rasenpflege – persönlich und zuverlässig vor Ort.',
        body: 'Ob Rasen oder saisonale Arbeiten: wir kümmern uns persönlich und zuverlässig um Ihre Außenanlagen.',
        objectPosition: { mobile: '50% 42%', desktop: '48% 48%' },
      },
      {
        src: '/photos/garten-landschaftspflege/andy-lawn-mowing-front.jpeg',
        alt: 'Rasenmähen vor dem Haus mit professionellem Gerät',
        caption: 'Rasenpflege mit Profi-Gerät – zuverlässig und termingerecht.',
        body: 'Regelmäßiges Mähen und Pflege halten Ihren Rasen und die Außenanlage gepflegt und einladend.',
        objectPosition: { mobile: '50% 36%', desktop: '48% 40%' },
      },
      {
        src: '/photos/garten-landschaftspflege/andy-hedge-scaffold-close.png',
        alt: 'Heckenschnitt in der Höhe mit Arbeitsbühne und Profi-Gerät',
        caption: 'Heckenschnitt in der Höhe – sicher und präzise mit der richtigen Technik.',
        body: 'Auch hohe Hecken schneiden wir fachgerecht: mit Arbeitsbühne und Profi-Gerät für ein sauberes Ergebnis – ohne Risiko für Sie und Ihre Pflanze.',
        objectPosition: { mobile: '50% 36%', desktop: '52% 40%' },
      },
      {
        src: '/photos/garten-landschaftspflege/andy-hedge-scaffold-lawn.png',
        alt: 'Professioneller Heckenschnitt auf dem Grundstück mit Rollgerüst',
        caption: 'Hohe Hecken im Griff – professionell und schonend für Ihr Grundstück.',
        body: 'Mit dem passenden Equipment erreichen wir auch große Hecken zuverlässig und halten Ihre Außenanlage gepflegt und einladend.',
        objectPosition: { mobile: '52% 38%', desktop: '58% 42%' },
      },
    ],
  },
  {
    id: 'gebaeudereinigung',
    title: 'Gebäudereinigung',
    description: 'Saubere Büros, Gewerberäume & Treppenhäuser',
    body: 'Ein gepflegtes Gebäude hinterlässt Eindruck – bei Mitarbeitenden, Kunden und Bewohnern. Wir übernehmen die regelmäßige und gründliche Reinigung von Büros, Gewerberäumen und Treppenhäusern und passen den Einsatzplan flexibel an Ihren Bedarf an.',
    gallery: [
      {
        src: '/photos/gebaeudereinigung/andy-roof-cleaning.jpeg',
        alt: 'Professionelle Dach- und Gebäudeaußenreinigung',
        caption: 'Außenreinigung mit Schutzausrüstung – gründlich und sicher.',
        body: 'Von Dach bis Fassade: wir reinigen Außenflächen gründlich und mit dem passenden Equipment.',
        objectFit: 'contain' as const,
        objectPosition: { mobile: '50% 50%', desktop: '50% 50%' },
      },
      {
        src: '/photos/gebaeudereinigung/andy-trimmer-blower.jpeg',
        alt: 'Reinigung und Pflege von Außenflächen',
        caption: 'Saubere Wege und Außenbereiche – auch rund ums Gebäude.',
        body: 'Wege, Einfahrten und Außenbereiche halten wir frei und gepflegt – für Bewohner und Besucherverkehr.',
        objectPosition: { mobile: '50% 36%', desktop: '48% 38%' },
      },
      {
        src: '/photos/gebaeudereinigung/andy-driveway-trim.jpeg',
        alt: 'Reinigung und Freischneiden von Pflasterflächen',
        caption: 'Gepflegte Zufahrten und Gemeinschaftsflächen.',
        body: 'Moos, Unkraut und Verschmutzungen an Pflaster und Zufahrt entfernen wir zuverlässig und sauber.',
        objectPosition: { mobile: '55% 38%', desktop: '60% 40%' },
      },
    ],
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

export const googleReviewsHref =
  'https://www.google.com/search?q=andyarbeit&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_6CjpROWF6sYklfelYA0ifcP8COg2_ZTdm_6Qng9tpJIXpeAS5AuGCZrHn2l-VjQOwuToPI%3D'

export const reviewsIntro = {
  title: 'Das sagen unsere Kunden',
  subtitle:
    'Echte Rückmeldungen von Privat- und Geschäftskunden aus München und Umgebung.',
} as const

export const reviews = [
  {
    name: 'Donato M.',
    rating: 5,
    text: 'Erstmal muss ich sagen, ich habe noch nie so gut gelaunte und motivierte Leute beim arbeiten gesehen! Weiter so... Ich danke euch für die Hilfe und dass ihr im Anschluss noch bei meinen Eltern geholfen habt fand ich mehr als Hammer! Kann ich nur empfehlen!',
  },
  {
    name: 'Robert F.',
    rating: 5,
    text: 'Nach Kontaktaufnahme kurzfristigen Termin zur vor-Ort-Begutachtung und Absprache der gewünschten Tätigkeiten bekommen. Reibungslose und schnelle Durchführung der Arbeiten. Absolut zufrieden mit der ausgeführten Tätigkeit - gerne wieder!',
  },
  {
    name: 'Michael F.',
    rating: 5,
    text: 'Ich bin absolut begeistert von der Arbeit! Bzw. vom Andy, er war immer pünktlich, hat eine hervorragende Sauberkeit hinterlassen und war jederzeit erreichbar. Sehr empfehlenswert!',
  },
  {
    name: 'Anita C.',
    rating: 5,
    text: 'Ich bin absolut begeistert von AndyArbeit München! Die Reinigung der Regenrinne ging superschnell, professionell und sauber. Schon bei der Kontaktaufnahme war der Service freundlich und zuverlässig. Andy kam pünktlich, arbeitete sauber und effizient – keine Umstände, alles perfekt erledigt. Wer eine Regenrinnen-Reinigung braucht, ist hier in besten Händen. Uneingeschränkt empfehlenswert!',
  },
  {
    name: 'Sarah E.',
    rating: 5,
    text: 'Ich habe sofort einen Termin bekommen. Die Arbeit war sauber und professionell ausgeführt. Sehr kompetent, faire Preise und bei weiteren Problemen jederzeit erreichbar – rundum tolle Arbeit! Absolut empfehlenswert. Vielen Dank!',
  },
  {
    name: 'Barbara V.',
    rating: 5,
    text: 'Andy ist sehr pünktlich, unglaublich nett und ich habe noch nie jemanden gleichzeitig so schnell und präzise diverse Sachen „an die Wand bohren“ sehen (in unserem Fall einen Briefkasten und ein Insektenhotel). Es ist mir so eine Erleichterung, jetzt jemanden zu haben, der einfach die ganzen Kleinigkeiten erledigt, für die einem normal kein Handwerker kommt. Egal wie mühsam (unser Eingangsbereich ist jetzt frei von Unkraut, Moos und Dreck), egal wie geringfügig (wie eine kleine Reparatur einer Badarmatur), Ratztfatz hat er alles wieder in Ordnung gebracht.',
  },
] as const

export const faqIntro = {
  title: 'Häufig gestellte Fragen',
  subtitle:
    'Antworten auf die wichtigsten Fragen zu unserem Service, Einsatzgebiet und unseren Leistungen.',
} as const

export const faqs = [
  {
    id: 'was-ist-notdienst',
    question: 'Was ist ein Notdienst bei der Rohrreinigung – und was ist dabei wichtig?',
    answer:
      'Ein Rohrreinigungs-Notdienst ist die Soforthilfe bei akuten Abfluss- und Rohrproblemen: verstopftes WC, Rückstau, überlaufendes Wasser oder Gerüche, die nicht warten können. Der Notdienst ist rund um die Uhr erreichbar – auch nachts, am Wochenende und an Feiertagen – und kommt schnell vor Ort, bevor Folgeschäden entstehen. Wichtig ist: echte Erreichbarkeit (kein reiner Anrufbeantworter), kurze Anfahrt, fachgerechte Technik statt aggressiver Chemie, und klare, transparente Kosten vor dem Einsatz. Bei AndyArbeit sind wir im Großraum München in der Regel innerhalb von 30–60 Minuten bei Ihnen und klären den Ablauf und die Kosten offen mit Ihnen ab.',
  },
  {
    id: 'notfall-reaktionszeit',
    question: 'Wie schnell können Sie bei einem Notfall vor Ort sein?',
    answer:
      'In Notfällen sind wir in der Regel innerhalb von 30–60 Minuten bei Ihnen vor Ort im Großraum München.',
  },
  {
    id: 'einsatzgebiet',
    question: 'Welche Gebiete decken Sie in München ab?',
    answer:
      'Wir sind im gesamten Großraum München tätig – einschließlich aller Stadtteile und umliegender Gemeinden.',
  },
  {
    id: 'wartungsvertraege',
    question: 'Bieten Sie Wartungsverträge an?',
    answer:
      'Ja. Wir bieten maßgeschneiderte Wartungsverträge für Immobilien jeder Größe an – mit regelmäßigen Inspektionen und Wartungsarbeiten.',
  },
  {
    id: 'preise',
    question: 'Wie sind Ihre Preise gestaltet?',
    answer:
      'Unsere Preise sind transparent und fair. Gerne erstellen wir Ihnen ein individuelles Angebot basierend auf Ihren Anforderungen.',
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
    'Willkommen bei AndyArbeit – Ihrem zuverlässigen Partner für professionelle Dienstleistungen rund um Haus, Gebäude und Außenanlagen.',
    'Mit langjähriger Erfahrung in der Rohrreinigung und als selbstständiger Unternehmer biete ich, Andreas Graf, ein umfassendes Leistungsspektrum – höchste Qualität und Flexibilität vereint.',
    'Durch enge Zusammenarbeit mit erfahrenen Meisterbetrieben können wir auch anspruchsvolle Sanierungs- und Pflegearbeiten anbieten. Unsere Kunden im Raum München und Umgebung profitieren von Zuverlässigkeit und hohem Qualitätsanspruch.',
  ],
} as const

export const partnersIntro = {
  title: 'Unsere Partner',
  description:
    'Handwerk, Service und lokale Betriebe, mit denen wir zusammenarbeiten – für starke Ergebnisse und Empfehlungen, denen Sie vertrauen können.',
} as const

export type PartnerKind = 'trade' | 'network'

export const partners = [
  {
    id: 'eg-elektrotechnik',
    kind: 'trade' as const,
    name: 'EG ELEKTROTECHNIK',
    description:
        'Ihr zuverlässiger Partner für Elektrotechnik in München und Umgebung. Fachgerechte Planung und Umsetzung moderner Elektroprojekte.',
    image: '/partners/eg-elektrotechnik.png',
    website: 'https://eg-elektrotechnik-muc.de/',
    services: [
      'Elektroinstallationen',
      'Netzwerktechnik',
      'Sicherheits- und Beleuchtungslösungen',
      'PV-Anlagen',
    ],
  },
  {
    id: 'fliesenfachbetrieb-hoti',
    kind: 'trade' as const,
    name: 'Fliesenfachbetrieb Hoti',
    description:
        'Ihr zuverlässiger Partner für Fliesenverlegung, Mosaikarbeiten und Sanierungen in Gilching und Umgebung. Langjährige Erfahrung und präzise Ausführung für höchste Qualität.',
    image: '/partners/fliesenfachbetrieb-hoti.png',
    website: 'https://www.fliesenfachbetrieb-hoti.de/',
    services: [
      'Fliesen & Platten verlegen',
      'Mosaikverlegung',
      'Bodenlegerarbeiten',
      'Altbausanierung',
      'Bad-Komplettsanierung',
      'Renovierungen aller Art',
    ],
  },
  {
    id: '5-seen-umzuege',
    kind: 'trade' as const,
    name: '5 Seen Umzüge',
    description:
      'Ihr professioneller Partner für Umzüge in München und Umgebung. Individuelle Planung und sicherer Transport für private und gewerbliche Kunden.',
    image: '/partners/5-seen-umzuege.jpg',
    website: 'https://5seen-umzuege.de/',
    services: [
      'Privatumzüge',
      'Firmenumzüge',
      'Möbeltransporte',
      'Verpackungsservice',
      'Entrümpelung',
    ],
  },
  {
    id: 'libra-design',
    kind: 'trade' as const,
    name: 'Libra Design',
    description:
      'Ihr Spezialist für hochwertige Arbeitskleidung, Textildruck und Werbemittel in München. Individuelle Lösungen für Unternehmen aller Größen – von der Beratung bis zur Fertigstellung.',
    image: '/partners/libra-design.png',
    website: 'https://libra-design.de/',
    services: [
      'Personalisierte Arbeitskleidung',
      'Professioneller Textildruck',
      'Corporate Fashion',
      'Werbemittel & Merchandise',
      'Stickerei & Veredelung',
    ],
  },
  {
    id: 'donatos',
    kind: 'network' as const,
    name: 'Donatos',
    description:
        'Ihr exklusiver Friseursalon in Germering. Modernste Haarpflege und Styling-Techniken für Damen und Herren in entspannter Atmosphäre.',
    image: '/partners/donatos.png',
    website: 'https://dadonato.de/',
    services: [
      'Damen- & Herrenschnitte',
      'Farb- & Strähnentechniken',
      'Hochsteckfrisuren',
      'Bartpflege & Styling',
      'Haarverlängerungen',
    ],
  },
] as const

/** Trade partners only — used on the home teaser so the offer stays clear. */
export const tradePartners = partners.filter((p) => p.kind === 'trade')
