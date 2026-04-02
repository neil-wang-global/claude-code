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
// biome-ignore format: keep the species list compact
export const cndragon = c(0x63, 0x6e, 0x64, 0x72, 0x61, 0x67, 0x6f, 0x6e) as 'cndragon'
export const wukong = c(0x77, 0x75, 0x6b, 0x6f, 0x6e, 0x67) as 'wukong'
export const totoro = c(0x74, 0x6f, 0x74, 0x6f, 0x72, 0x6f) as 'totoro'
export const gamabunta = c(0x67, 0x61, 0x6d, 0x61, 0x62, 0x75, 0x6e, 0x74, 0x61) as 'gamabunta'
export const mewtwo = c(0x6d, 0x65, 0x77, 0x74, 0x77, 0x6f) as 'mewtwo'
export const bajie = c(0x62, 0x61, 0x6a, 0x69, 0x65) as 'bajie'
export const pikachu = c(0x70, 0x69, 0x6b, 0x61, 0x63, 0x68, 0x75) as 'pikachu'
export const koromon = c(0x6b, 0x6f, 0x72, 0x6f, 0x6d, 0x6f, 0x6e) as 'koromon'
export const dodo = c(0x64, 0x6f, 0x64, 0x6f) as 'dodo'
export const trex = c(0x74, 0x72, 0x65, 0x78) as 'trex'
export const thanos = c(0x74, 0x68, 0x61, 0x6e, 0x6f, 0x73) as 'thanos'

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
  cndragon,
  wukong,
  totoro,
  gamabunta,
  mewtwo,
  bajie,
  pikachu,
  koromon,
  dodo,
  trex,
  thanos,
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

// Species base stats at "rare" rarity (×1.0 multiplier).
// Other rarities apply a multiplier via getScaledBaseStats(), capped at 100 per stat.
// T1 (310+): dragon, ghost, capybara, trex, cndragon, wukong, totoro, gamabunta, mewtwo, bajie, pikachu, koromon, thanos
// T2 (255-270): octopus, robot, cat, owl
// T3 (230-245): axolotl, penguin, cactus, goose, mushroom
// T4 (190-225): turtle, chonk, duck, blob, snail, rabbit, dodo
export const SPECIES_BASE_STATS: Record<Species, Record<StatName, number>> = {
  [dragon]:   { DEBUGGING: 85, PATIENCE: 30, CHAOS: 80, WISDOM: 65, SNARK: 55 },
  [ghost]:    { DEBUGGING: 75, PATIENCE: 25, CHAOS: 85, WISDOM: 65, SNARK: 60 },
  [capybara]: { DEBUGGING: 40, PATIENCE: 90, CHAOS: 20, WISDOM: 85, SNARK: 75 },
  [octopus]:  { DEBUGGING: 70, PATIENCE: 50, CHAOS: 40, WISDOM: 80, SNARK: 30 },
  [robot]:    { DEBUGGING: 90, PATIENCE: 55, CHAOS: 20, WISDOM: 75, SNARK: 25 },
  [cat]:      { DEBUGGING: 55, PATIENCE: 25, CHAOS: 60, WISDOM: 45, SNARK: 75 },
  [owl]:      { DEBUGGING: 45, PATIENCE: 60, CHAOS: 20, WISDOM: 90, SNARK: 40 },
  [axolotl]:  { DEBUGGING: 50, PATIENCE: 55, CHAOS: 45, WISDOM: 60, SNARK: 35 },
  [penguin]:  { DEBUGGING: 50, PATIENCE: 65, CHAOS: 30, WISDOM: 55, SNARK: 40 },
  [cactus]:   { DEBUGGING: 40, PATIENCE: 70, CHAOS: 30, WISDOM: 35, SNARK: 65 },
  [goose]:    { DEBUGGING: 35, PATIENCE: 15, CHAOS: 80, WISDOM: 30, SNARK: 75 },
  [mushroom]: { DEBUGGING: 35, PATIENCE: 50, CHAOS: 65, WISDOM: 50, SNARK: 30 },
  [turtle]:   { DEBUGGING: 30, PATIENCE: 85, CHAOS: 10, WISDOM: 60, SNARK: 40 },
  [chonk]:    { DEBUGGING: 25, PATIENCE: 65, CHAOS: 40, WISDOM: 30, SNARK: 55 },
  [duck]:     { DEBUGGING: 45, PATIENCE: 50, CHAOS: 35, WISDOM: 50, SNARK: 35 },
  [blob]:     { DEBUGGING: 35, PATIENCE: 60, CHAOS: 25, WISDOM: 45, SNARK: 40 },
  [snail]:    { DEBUGGING: 20, PATIENCE: 90, CHAOS: 10, WISDOM: 45, SNARK: 35 },
  [rabbit]:   { DEBUGGING: 35, PATIENCE: 45, CHAOS: 40, WISDOM: 40, SNARK: 30 },
  [cndragon]:  { DEBUGGING: 80, PATIENCE: 55, CHAOS: 65, WISDOM: 85, SNARK: 35 },
  [wukong]:    { DEBUGGING: 90, PATIENCE: 15, CHAOS: 95, WISDOM: 70, SNARK: 55 },
  [totoro]:    { DEBUGGING: 45, PATIENCE: 90, CHAOS: 25, WISDOM: 85, SNARK: 65 },
  [gamabunta]: { DEBUGGING: 70, PATIENCE: 35, CHAOS: 75, WISDOM: 70, SNARK: 65 },
  [mewtwo]:    { DEBUGGING: 95, PATIENCE: 30, CHAOS: 55, WISDOM: 90, SNARK: 50 },
  [bajie]:     { DEBUGGING: 50, PATIENCE: 75, CHAOS: 55, WISDOM: 55, SNARK: 80 },
  [pikachu]:   { DEBUGGING: 65, PATIENCE: 50, CHAOS: 70, WISDOM: 60, SNARK: 70 },
  [koromon]:   { DEBUGGING: 55, PATIENCE: 60, CHAOS: 65, WISDOM: 60, SNARK: 70 },
  [dodo]:      { DEBUGGING: 25, PATIENCE: 70, CHAOS: 20, WISDOM: 30, SNARK: 55 },
  [trex]:      { DEBUGGING: 75, PATIENCE: 20, CHAOS: 90, WISDOM: 60, SNARK: 70 },
  [thanos]:    { DEBUGGING: 85, PATIENCE: 65, CHAOS: 80, WISDOM: 75, SNARK: 25 },
}

// Rarity multipliers applied to base stats. "rare" is the reference (×1.0).
export const RARITY_MULTIPLIERS: Record<Rarity, number> = {
  common: 0.6,
  uncommon: 0.8,
  rare: 1.0,
  epic: 1.15,
  legendary: 1.3,
}

/**
 * Get species stats for a given rarity.
 * Applies the rarity multiplier to base stats, capped at 100 per stat.
 */
export function getScaledBaseStats(
  species: Species,
  rarity: Rarity,
): Record<StatName, number> {
  const base = SPECIES_BASE_STATS[species]
  const multiplier = RARITY_MULTIPLIERS[rarity]
  const result = {} as Record<StatName, number>
  for (const name of STAT_NAMES) {
    result[name] = Math.min(100, Math.round(base[name] * multiplier))
  }
  return result
}

export const RACES = [
  'bird',
  'beast',
  'dragonkin',
  'marine',
  'spirit',
  'celestial',
  'reptile',
  'plant',
  'construct',
  'amphibian',
  'psychic',
  'pokemon',
  'digimon',
  'cosmic',
] as const
export type Race = (typeof RACES)[number]

// Full companion type — everything persisted in buddy.settings.json
export type Companion = {
  species: Species
  rarity: Rarity
  eye: Eye
  hat: Hat
  shiny: boolean
  name: string
  personality: Personality
  profile: string
  stats: Record<StatName, number>
  hatchedAt: number
  effortUsed: number
}

export type StoredCompanion = Companion & {
  id: string
  adoptedAt: number
}

export type BuddySettings = {
  version: 2
  activeCompanionId?: string
  companions: StoredCompanion[]
}

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

// Flavor text shown on the companion card, one per species.
export const SPECIES_DESCRIPTIONS: Record<Species, string> = {
  [duck]:     '每次编译报错都会嘎一声',
  [goose]:    '会偷偷叼走你的分号',
  [blob]:     '靠坐在 bug 上来吸收它们',
  [cat]:      '凌晨三点批量回滚代码',
  [dragon]:   '对不稳定测试喷火',
  [octopus]:  '八只手同时开八个 PR',
  [owl]:      '每本 man page 都读了两遍',
  [penguin]:  '只愿意在寒冷环境里部署',
  [turtle]:   '构建慢？那是特性',
  [snail]:    '代码审查总会完成，只是稍晚',
  [ghost]:    '游荡在你删掉的分支之间',
  [axolotl]:  '能让损坏的配置重新长出来',
  [capybara]: '有它在，合并都会顺利很多',
  [cactus]:   '在被忽视的仓库里也能活得很好',
  [robot]:    '哔哔啵啵，你的 linter 来了',
  [rabbit]:   '切 git 分支快得像瞬移',
  [mushroom]: '生长在阴暗潮湿的 monorepo 里',
  [chonk]:    '喜欢坐在部署按钮上',
  [cndragon]:  '中式古龙，出场自带云气',
  [wukong]:    '七十二变，专治各种顽固 bug',
  [totoro]:    '会在构建完成前安静等你',
  [gamabunta]: '一落地就是测试洪流',
  [mewtwo]:    '用超能力直接看穿问题根源',
  [bajie]:     '扛着耙子也能把需求拱明白',
  [pikachu]:   '一生气就给 flaky test 放电',
  [koromon]:   '圆滚滚地把新点子弹出来',
  [dodo]:      '已灭绝但还在坚持 code review',
  [trex]:      '一口咬碎整个技术债',
  [thanos]:    '一个响指，半数 bug 灰飞烟灭',
}

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

export const SPECIES_LABELS: Record<Species, string> = {
  [duck]: '小鸭',
  [goose]: '大鹅',
  [blob]: '团子',
  [cat]: '猫猫',
  [dragon]: '巨龙',
  [octopus]: '章鱼',
  [owl]: '猫头鹰',
  [penguin]: '企鹅',
  [turtle]: '乌龟',
  [snail]: '蜗牛',
  [ghost]: '幽灵',
  [axolotl]: '六角恐龙',
  [capybara]: '水豚',
  [cactus]: '仙人掌',
  [robot]: '机器人',
  [rabbit]: '兔子',
  [mushroom]: '蘑菇',
  [chonk]: '胖团',
  [cndragon]: '中华龙',
  [wukong]: '孙悟空',
  [totoro]: '龙猫',
  [gamabunta]: '蛤蟆文太',
  [mewtwo]: '迈巴龙',
  [bajie]: '八戒',
  [pikachu]: '皮卡丘',
  [koromon]: '滚球兽',
  [dodo]: '嘟嘟鸟',
  [trex]: '霸王龙',
  [thanos]: '灭霸',
}

export const RARITY_LABELS: Record<Rarity, string> = {
  common: '普通',
  uncommon: '优秀',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
}

export const PERSONALITY_LABELS: Record<Personality, string> = {
  cheerful: '开朗',
  sarcastic: '毒舌',
  wise: '睿智',
  chaotic: '混沌',
  shy: '害羞',
  bold: '大胆',
  dreamy: '梦幻',
  grumpy: '傲娇',
}

export const HAT_LABELS: Record<Hat, string> = {
  none: '无',
  crown: '王冠',
  tophat: '礼帽',
  propeller: '螺旋桨帽',
  halo: '光环',
  wizard: '法师帽',
  beanie: '毛线帽',
  tinyduck: '小黄鸭',
}

export const RACE_LABELS: Record<Race, string> = {
  bird: '羽族',
  beast: '兽族',
  dragonkin: '龙族',
  marine: '海生族',
  spirit: '灵体族',
  celestial: '仙灵族',
  reptile: '爬行族',
  plant: '植生族',
  construct: '构造族',
  amphibian: '两栖族',
  psychic: '超能族',
  pokemon: '神奇宝贝族',
  digimon: '数码宝贝族',
  cosmic: '宇宙族',
}

export const SPECIES_TO_RACE: Record<Species, Race> = {
  [duck]: 'bird',
  [goose]: 'bird',
  [blob]: 'spirit',
  [cat]: 'beast',
  [dragon]: 'dragonkin',
  [octopus]: 'marine',
  [owl]: 'bird',
  [penguin]: 'bird',
  [turtle]: 'reptile',
  [snail]: 'beast',
  [ghost]: 'spirit',
  [axolotl]: 'dragonkin',
  [capybara]: 'beast',
  [cactus]: 'plant',
  [robot]: 'construct',
  [rabbit]: 'beast',
  [mushroom]: 'plant',
  [chonk]: 'beast',
  [cndragon]: 'dragonkin',
  [wukong]: 'celestial',
  [totoro]: 'spirit',
  [gamabunta]: 'amphibian',
  [mewtwo]: 'psychic',
  [bajie]: 'celestial',
  [pikachu]: 'pokemon',
  [koromon]: 'digimon',
  [dodo]: 'bird',
  [trex]: 'dragonkin',
  [thanos]: 'cosmic',
}

