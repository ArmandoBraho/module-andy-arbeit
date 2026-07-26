/**
 * Accent colors for the Terminanfrage form + Google Calendar color mapping.
 * googleColorId: Google Calendar event color (1–11). Requires Calendar API to apply
 * automatically; the add-to-calendar link cannot set color by itself.
 */
export const serviceThemes: Record<
  string,
  {
    accent: string
    soft: string
    deep: string
    googleColorId: string
    googleColorLabel: string
  }
> = {
  // Rohr / Wasser → Blueberry
  abwassertechnik: {
    accent: '#2b6cb0',
    soft: 'rgba(43, 108, 176, 0.1)',
    deep: '#1e4e8c',
    googleColorId: '9',
    googleColorLabel: 'Blaubeere (Blau)',
  },
  // Bau / Sanierung → Tangerine (closest warm brown/orange)
  komplettsanierung: {
    accent: '#9a5b2f',
    soft: 'rgba(154, 91, 47, 0.1)',
    deep: '#7a4522',
    googleColorId: '6',
    googleColorLabel: 'Mandarine (Orange-Braun)',
  },
  // Haus / Neutral → Graphite
  hausmeisterservice: {
    accent: '#4a5568',
    soft: 'rgba(74, 85, 104, 0.1)',
    deep: '#2d3748',
    googleColorId: '8',
    googleColorLabel: 'Graphit (Grau)',
  },
  // Garten → Basil
  'garten-landschaftspflege': {
    accent: '#2f855a',
    soft: 'rgba(47, 133, 90, 0.1)',
    deep: '#276749',
    googleColorId: '10',
    googleColorLabel: 'Basilikum (Grün)',
  },
  // Reinigung → Peacock
  gebaeudereinigung: {
    accent: '#0f766e',
    soft: 'rgba(15, 118, 110, 0.1)',
    deep: '#0d5c56',
    googleColorId: '7',
    googleColorLabel: 'Pfau (Türkis)',
  },
}
