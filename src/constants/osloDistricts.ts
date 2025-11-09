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
  // Primærfarger
  primary: '#0066CC', // Oslo blå
  secondary: '#FF6B35', // Oslo oransje
  accent: '#00A859', // Grønn
  
  // Utvidede farger for mer variasjon
  purple: '#6B46C1', // Lilla/Blå - for spesielle elementer
  red: '#DC2626', // Rød - for viktige varsler
  yellow: '#F59E0B', // Gul - for oppmerksomhet
  turquoise: '#06B6D4', // Turkis - for informasjon
  pink: '#EC4899', // Rosa - for highlights
  indigo: '#4F46E5', // Indigo - for dybde
  
  // Nøytrale farger
  background: '#F5F5F5',
  backgroundLight: '#FAFAFA', // Ekstra lys bakgrunn
  backgroundDark: '#2D2D2D', // For dark mode
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999', // Ekstra lys tekst
  border: '#E0E0E0',
  borderLight: '#F0F0F0', // Ekstra lys border
  
  // Status farger
  success: '#00A859', // Grønn
  warning: '#F59E0B', // Gul
  error: '#DC2626', // Rød
  info: '#06B6D4', // Turkis
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

// Fargekartlegging for kategorier
export const CATEGORY_COLORS: Record<PollCategory, string> = {
  miljø: OSLO_COLORS.accent, // Grønn
  transport: OSLO_COLORS.primary, // Blå
  byutvikling: OSLO_COLORS.yellow, // Gul
  politikk: OSLO_COLORS.purple, // Lilla
  barn: OSLO_COLORS.pink, // Rosa
  natur: OSLO_COLORS.accent, // Grønn
  dyr: OSLO_COLORS.secondary, // Oransje
  lokaldemokrati: OSLO_COLORS.indigo, // Indigo
  budsjett: OSLO_COLORS.turquoise, // Turkis
  vern: OSLO_COLORS.accent, // Grønn
} as const;

// Hjelpefunksjon for å hente kategori-farge
export const getCategoryColor = (category: PollCategory): string => {
  return CATEGORY_COLORS[category] || OSLO_COLORS.primary;
};

