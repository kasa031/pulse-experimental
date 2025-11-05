// Oslo bydeler - offisielle navn
export const OSLO_DISTRICTS = [
  'Alna',
  'Bjerke',
  'Frogner',
  'Gamle Oslo',
  'Grünerløkka',
  'Grorud',
  'Nordre Aker',
  'Nordstrand',
  'Sagene',
  'St. Hanshaugen',
  'Stovner',
  'Søndre Nordstrand',
  'Ullern',
  'Vestre Aker',
  'Østensjø',
  'Sentrum',
  'Hele Oslo',
] as const;

export type OsloDistrict = typeof OSLO_DISTRICTS[number];

// Oslo kommunens offisielle farger
export const OSLO_COLORS = {
  primary: '#0066CC', // Oslo blå
  secondary: '#FF6B35', // Oslo oransje
  accent: '#00A859', // Grønn
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  border: '#E0E0E0',
} as const;

// Kategorier for avstemninger
export const POLL_CATEGORIES = [
  'miljø',
  'transport',
  'byutvikling',
  'politikk',
  'barn',
  'natur',
  'dyr',
  'lokaldemokrati',
  'budsjett',
  'vern',
] as const;

export type PollCategory = typeof POLL_CATEGORIES[number];

