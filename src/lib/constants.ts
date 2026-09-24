export const CATEGORIES = [
  'Ideas',
  'Technology',
  'Design',
  'Culture',
  'Business',
  'Science',
  'Travel',
  'Food',
] as const;

export const COVER_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ocean: { bg: 'from-cyan-500 to-blue-600', text: 'text-cyan-600', label: 'Ocean' },
  forest: { bg: 'from-emerald-500 to-green-700', text: 'text-emerald-600', label: 'Forest' },
  sunset: { bg: 'from-orange-400 to-rose-500', text: 'text-orange-600', label: 'Sunset' },
  sand: { bg: 'from-amber-300 to-orange-400', text: 'text-amber-600', label: 'Sand' },
  slate: { bg: 'from-slate-600 to-slate-800', text: 'text-slate-600', label: 'Slate' },
  berry: { bg: 'from-rose-400 to-pink-600', text: 'text-rose-600', label: 'Berry' },
  mint: { bg: 'from-teal-300 to-emerald-500', text: 'text-teal-600', label: 'Mint' },
  dusk: { bg: 'from-indigo-400 to-violet-500', text: 'text-indigo-600', label: 'Dusk' },
};

export const COVER_COLOR_KEYS = Object.keys(COVER_COLORS);
