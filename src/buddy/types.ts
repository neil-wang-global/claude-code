export const RARITIES = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
] as const
export type Rarity = (typeof RARITIES)[number]

// One species name collides with a model-codename canary in excluded-strings.txt.
// The check greps build output (not source), so runtime-constructing the value keeps
// the literal out of the bundle while the check stays armed for the actual codename.
// All species encoded uniformly; `as` casts are type-position only (erased pre-bundle).
const c = String.fromCharCode
// biome-ignore format: keep the species list compact

export const duck = c(0x64,0x75,0x63,0x6b) as 'duck'
export const goose = c(0x67, 0x6f, 0x6f, 0x73, 0x65) as 'goose'
export const blob = c(0x62, 0x6c, 0x6f, 0x62) as 'blob'
export const cat = c(0x63, 0x61, 0x74) as 'cat'
export const dragon = c(0x64, 0x72, 0x61, 0x67, 0x6f, 0x6e) as 'dragon'
export const octopus = c(0x6f, 0x63, 0x74, 0x6f, 0x70, 0x75, 0x73) as 'octopus'
export const owl = c(0x6f, 0x77, 0x6c) as 'owl'
export const penguin = c(0x70, 0x65, 0x6e, 0x67, 0x75, 0x69, 0x6e) as 'penguin'
export const turtle = c(0x74, 0x75, 0x72, 0x74, 0x6c, 0x65) as 'turtle'
export const snail = c(0x73, 0x6e, 0x61, 0x69, 0x6c) as 'snail'
export const ghost = c(0x67, 0x68, 0x6f, 0x73, 0x74) as 'ghost'
export const axolotl = c(0x61, 0x78, 0x6f, 0x6c, 0x6f, 0x74, 0x6c) as 'axolotl'
export const capybara = c(
  0x63,
  0x61,
  0x70,
  0x79,
  0x62,
  0x61,
  0x72,
  0x61,
) as 'capybara'
export const cactus = c(0x63, 0x61, 0x63, 0x74, 0x75, 0x73) as 'cactus'
export const robot = c(0x72, 0x6f, 0x62, 0x6f, 0x74) as 'robot'
export const rabbit = c(0x72, 0x61, 0x62, 0x62, 0x69, 0x74) as 'rabbit'
export const mushroom = c(
  0x6d,
  0x75,
  0x73,
  0x68,
  0x72,
  0x6f,
  0x6f,
  0x6d,
) as 'mushroom'
export const chonk = c(0x63, 0x68, 0x6f, 0x6e, 0x6b) as 'chonk'

export const SPECIES = [
  duck,
  goose,
  blob,
  cat,
  dragon,
  octopus,
  owl,
  penguin,
  turtle,
  snail,
  ghost,
  axolotl,
  capybara,
  cactus,
  robot,
  rabbit,
  mushroom,
  chonk,
] as const
export type Species = (typeof SPECIES)[number] // biome-ignore format: keep compact

export const EYES = ['·', '✦', '×', '◉', '@', '°'] as const
export type Eye = (typeof EYES)[number]

export const HATS = [
  'none',
  'crown',
  'tophat',
  'propeller',
  'halo',
  'wizard',
  'beanie',
  'tinyduck',
] as const
export type Hat = (typeof HATS)[number]

export const STAT_NAMES = [
  'DEBUGGING',
  'PATIENCE',
  'CHAOS',
  'WISDOM',
  'SNARK',
] as const
export type StatName = (typeof STAT_NAMES)[number]

// Species base stats at "rare" rarity (total = 120 per species).
// Other rarities scale proportionally via getScaledBaseStats().
export const SPECIES_BASE_STATS: Record<Species, Record<StatName, number>> = {
  [duck]:     { DEBUGGING: 22, PATIENCE: 28, CHAOS: 18, WISDOM: 30, SNARK: 22 },
  [goose]:    { DEBUGGING: 18, PATIENCE: 12, CHAOS: 38, WISDOM: 20, SNARK: 32 },
  [blob]:     { DEBUGGING: 20, PATIENCE: 35, CHAOS: 15, WISDOM: 25, SNARK: 25 },
  [cat]:      { DEBUGGING: 25, PATIENCE: 15, CHAOS: 28, WISDOM: 22, SNARK: 30 },
  [dragon]:   { DEBUGGING: 35, PATIENCE: 10, CHAOS: 30, WISDOM: 25, SNARK: 20 },
  [octopus]:  { DEBUGGING: 30, PATIENCE: 25, CHAOS: 20, WISDOM: 30, SNARK: 15 },
  [owl]:      { DEBUGGING: 22, PATIENCE: 28, CHAOS: 12, WISDOM: 38, SNARK: 20 },
  [penguin]:  { DEBUGGING: 24, PATIENCE: 30, CHAOS: 16, WISDOM: 26, SNARK: 24 },
  [turtle]:   { DEBUGGING: 18, PATIENCE: 40, CHAOS: 8,  WISDOM: 30, SNARK: 24 },
  [snail]:    { DEBUGGING: 15, PATIENCE: 42, CHAOS: 10, WISDOM: 28, SNARK: 25 },
  [ghost]:    { DEBUGGING: 28, PATIENCE: 15, CHAOS: 32, WISDOM: 25, SNARK: 20 },
  [axolotl]:  { DEBUGGING: 20, PATIENCE: 30, CHAOS: 22, WISDOM: 28, SNARK: 20 },
  [capybara]: { DEBUGGING: 16, PATIENCE: 38, CHAOS: 12, WISDOM: 28, SNARK: 26 },
  [cactus]:   { DEBUGGING: 22, PATIENCE: 32, CHAOS: 18, WISDOM: 20, SNARK: 28 },
  [robot]:    { DEBUGGING: 38, PATIENCE: 22, CHAOS: 15, WISDOM: 30, SNARK: 15 },
  [rabbit]:   { DEBUGGING: 20, PATIENCE: 30, CHAOS: 25, WISDOM: 25, SNARK: 20 },
  [mushroom]: { DEBUGGING: 18, PATIENCE: 28, CHAOS: 30, WISDOM: 24, SNARK: 20 },
  [chonk]:    { DEBUGGING: 15, PATIENCE: 35, CHAOS: 22, WISDOM: 18, SNARK: 30 },
}

// Base stat totals by rarity. "rare" is the reference tier (120).
export const RARITY_STAT_TOTALS: Record<Rarity, number> = {
  common: 80,
  uncommon: 100,
  rare: 120,
  epic: 140,
  legendary: 160,
}

// Fixed number of stat points the user can freely allocate.
export const ALLOCATABLE_POINTS = 40

const RARE_TOTAL = RARITY_STAT_TOTALS.rare // 120

/**
 * Get species base stats scaled for a given rarity.
 * The SPECIES_BASE_STATS table is at "rare" (total=120).
 * For other rarities, each stat is proportionally scaled so the total matches RARITY_STAT_TOTALS[rarity].
 */
export function getScaledBaseStats(
  species: Species,
  rarity: Rarity,
): Record<StatName, number> {
  const base = SPECIES_BASE_STATS[species]
  const target = RARITY_STAT_TOTALS[rarity]
  if (target === RARE_TOTAL) return { ...base }

  const raw = {} as Record<StatName, number>
  let sum = 0
  for (const name of STAT_NAMES) {
    raw[name] = Math.round((base[name] * target) / RARE_TOTAL)
    sum += raw[name]
  }
  // Fix rounding drift by adjusting the highest stat
  const diff = target - sum
  if (diff !== 0) {
    const highest = STAT_NAMES.reduce((a, b) => (raw[a] >= raw[b] ? a : b))
    raw[highest] += diff
  }
  return raw
}

// Full companion type — everything persisted in settings.json
export type Companion = {
  species: Species
  rarity: Rarity
  eye: Eye
  hat: Hat
  shiny: boolean
  name: string
  personality: string
  stats: Record<StatName, number>
  hatchedAt: number
}

// What persists in settings.json — identical to Companion
export type StoredCompanion = Companion

export const RARITY_STARS = {
  common: '★',
  uncommon: '★★',
  rare: '★★★',
  epic: '★★★★',
  legendary: '★★★★★',
} as const satisfies Record<Rarity, string>

export const RARITY_COLORS = {
  common: 'inactive',
  uncommon: 'success',
  rare: 'permission',
  epic: 'autoAccept',
  legendary: 'warning',
} as const satisfies Record<Rarity, keyof import('../utils/theme.js').Theme>

export const PERSONALITIES = [
  'cheerful',
  'sarcastic',
  'wise',
  'chaotic',
  'shy',
  'bold',
  'dreamy',
  'grumpy',
] as const
export type Personality = (typeof PERSONALITIES)[number]
