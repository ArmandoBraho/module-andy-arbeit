/** Approximate centers of listed service areas */
export const serviceAreaLocations = [
  { name: 'München Stadt', lat: 48.1374, lng: 11.5755 },
  { name: 'Pasing', lat: 48.1477, lng: 11.4608 },
  { name: 'Germering', lat: 48.1339, lng: 11.3669 },
  { name: 'Gröbenzell', lat: 48.1954, lng: 11.3743 },
  { name: 'Fürstenfeldbruck', lat: 48.178, lng: 11.2548 },
  { name: 'Dachau', lat: 48.2602, lng: 11.4342 },
  { name: 'Karlsfeld', lat: 48.2214, lng: 11.4668 },
  { name: 'Unterschleißheim', lat: 48.2808, lng: 11.5768 },
] as const

/**
 * Closed polygon covering the listed areas (Münchner West-/Nordraum)
 * with a small buffer around the outermost towns.
 */
export const serviceAreaPolygon = [
  { lat: 48.095, lng: 11.2 },
  { lat: 48.07, lng: 11.42 },
  { lat: 48.075, lng: 11.62 },
  { lat: 48.12, lng: 11.73 },
  { lat: 48.2, lng: 11.76 },
  { lat: 48.3, lng: 11.72 },
  { lat: 48.33, lng: 11.58 },
  { lat: 48.33, lng: 11.4 },
  { lat: 48.3, lng: 11.28 },
  { lat: 48.22, lng: 11.18 },
  { lat: 48.14, lng: 11.16 },
] as const
