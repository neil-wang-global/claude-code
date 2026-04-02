import * as React from 'react'
import { Box, Text, useInput } from '../../ink.js'
import { useSetAppState } from '../../state/AppState.js'
import { getGlobalConfig, saveGlobalConfig } from '../../utils/config.js'
import type { LocalJSXCommandCall } from '../../types/command.js'
import { getCompanion, saveCompanion } from '../../buddy/companion.js'
import { renderFace, renderSprite } from '../../buddy/sprites.js'
import {
  ALLOCATABLE_POINTS,
  EYES,
  HATS,
  PERSONALITIES,
  RARITIES,
  RARITY_COLORS,
  RARITY_STARS,
  RARITY_STAT_TOTALS,
  SPECIES,
  STAT_NAMES,
  type Companion,
  type Eye,
  type Hat,
  type Personality,
  type Rarity,
  type Species,
  type StatName,
  getScaledBaseStats,
} from '../../buddy/types.js'

// ── Card ──────────────────────────────────────────────────────────────

const CARD_WIDTH = 44

function StatBar({
  name,
  value,
  color,
}: {
  name: string
  value: number
  color: string
}): React.ReactNode {
  const filled = Math.round(value / 5)
  const empty = 20 - filled
  return (
    <Text>
      <Text dimColor>{name.padEnd(10)}</Text>
      <Text color={color}>{'█'.repeat(filled)}</Text>
      <Text dimColor>{'░'.repeat(empty)}</Text>
      <Text> {value}</Text>
    </Text>
  )
}

function CompanionCard({
  companion,
  onDone,
}: {
  companion: Companion
  onDone: () => void
}): React.ReactNode {
  const color = RARITY_COLORS[companion.rarity]
  const sprite = renderSprite(companion)
  const stars = RARITY_STARS[companion.rarity]

  useInput((_input, key) => {
    if (key.escape || key.return) {
      onDone()
    }
  })

  const shinyTag = companion.shiny ? ' [SHINY]' : ''
  const title = ` ${companion.name} `
  const subtitle = `${companion.species}${shinyTag}`

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={color}
      paddingX={2}
      paddingY={1}
      width={CARD_WIDTH}
    >
      <Box justifyContent="center">
        <Text bold color={color}>
          {title}
        </Text>
      </Box>
      <Box justifyContent="center">
        <Text color={color}>{stars}</Text>
        <Text dimColor> {companion.rarity}{shinyTag}</Text>
      </Box>
      <Box flexDirection="column" alignItems="center" marginTop={1}>
        {sprite.map((line, i) => (
          <Text key={i} color={color}>
            {line}
          </Text>
        ))}
      </Box>
      <Box flexDirection="column" alignItems="center" marginTop={1}>
        <Text dimColor>{subtitle}</Text>
        <Text dimColor italic>"{companion.personality}"</Text>
      </Box>
      <Box
        flexDirection="column"
        marginTop={1}
        borderStyle="single"
        borderColor={color}
        borderLeft={false}
        borderRight={false}
        borderBottom={false}
        paddingTop={1}
      >
        {STAT_NAMES.map(stat => (
          <StatBar
            key={stat}
            name={stat}
            value={companion.stats[stat]}
            color={color}
          />
        ))}
      </Box>
      <Box justifyContent="center" marginTop={1}>
        <Text dimColor>Press Esc or Enter to close</Text>
      </Box>
    </Box>
  )
}

// ── Hatch steps ──────────────────────────────────────────────────────

type HatchStep =
  | 'confirm'
  | 'species'
  | 'rarity'
  | 'shiny'
  | 'eye'
  | 'hat'
  | 'name'
  | 'personality'
  | 'stats'
  | 'done'

function ListSelector<T extends string>({
  items,
  labels,
  onSelect,
  title,
}: {
  items: readonly T[]
  labels?: (item: T, index: number) => string
  onSelect: (item: T) => void
  title: string
}): React.ReactNode {
  const [index, setIndex] = React.useState(0)

  useInput((_input, key) => {
    if (key.upArrow) setIndex(i => Math.max(0, i - 1))
    else if (key.downArrow) setIndex(i => Math.min(items.length - 1, i + 1))
    else if (key.return) onSelect(items[index]!)
  })

  return (
    <Box flexDirection="column">
      <Text bold>{title}</Text>
      <Text dimColor>(↑↓ to navigate, Enter to select)</Text>
      <Box flexDirection="column" marginTop={1}>
        {items.map((item, i) => (
          <Text key={item}>
            {i === index ? '▸ ' : '  '}
            {labels ? labels(item, i) : item}
          </Text>
        ))}
      </Box>
    </Box>
  )
}

function TextInput({
  title,
  onSubmit,
}: {
  title: string
  onSubmit: (value: string) => void
}): React.ReactNode {
  const [value, setValue] = React.useState('')

  useInput((input, key) => {
    if (key.return && value.trim()) {
      onSubmit(value.trim())
    } else if (key.backspace || key.delete) {
      setValue(v => v.slice(0, -1))
    } else if (input && !key.ctrl && !key.meta) {
      setValue(v => v + input)
    }
  })

  return (
    <Box flexDirection="column">
      <Text bold>{title}</Text>
      <Box marginTop={1}>
        <Text>{'> '}</Text>
        <Text>{value}</Text>
        <Text dimColor>_</Text>
      </Box>
    </Box>
  )
}

function StatAllocator({
  baseStats,
  totalPoints,
  onDone,
  color,
}: {
  baseStats: Record<StatName, number>
  totalPoints: number
  onDone: (finalStats: Record<StatName, number>) => void
  color: string
}): React.ReactNode {
  const [allocated, setAllocated] = React.useState<Record<StatName, number>>(
    () => {
      const init = {} as Record<StatName, number>
      for (const name of STAT_NAMES) init[name] = 0
      return init
    },
  )
  const [index, setIndex] = React.useState(0)
  const remaining = totalPoints - Object.values(allocated).reduce((a, b) => a + b, 0)

  useInput((_input, key) => {
    if (key.upArrow) setIndex(i => Math.max(0, i - 1))
    else if (key.downArrow) setIndex(i => Math.min(STAT_NAMES.length - 1, i + 1))
    else if (key.rightArrow && remaining > 0) {
      const name = STAT_NAMES[index]!
      setAllocated(prev => ({ ...prev, [name]: prev[name] + 1 }))
    } else if (key.leftArrow) {
      const name = STAT_NAMES[index]!
      setAllocated(prev => ({
        ...prev,
        [name]: Math.max(0, prev[name] - 1),
      }))
    } else if (key.return && remaining === 0) {
      const finalStats = {} as Record<StatName, number>
      for (const name of STAT_NAMES) {
        finalStats[name] = baseStats[name] + allocated[name]
      }
      onDone(finalStats)
    }
  })

  return (
    <Box flexDirection="column">
      <Text bold>Allocate {totalPoints} stat points</Text>
      <Text dimColor>(↑↓ to select, ←→ to adjust, Enter to confirm)</Text>
      <Text dimColor>Remaining: <Text bold color={remaining > 0 ? 'yellow' : 'green'}>{remaining}</Text></Text>
      <Box flexDirection="column" marginTop={1}>
        {STAT_NAMES.map((name, i) => {
          const base = baseStats[name]
          const added = allocated[name]
          const total = base + added
          const filled = Math.round(total / 5)
          const empty = 20 - filled
          const pointer = i === index ? '▸ ' : '  '
          return (
            <Text key={name}>
              {pointer}
              <Text dimColor>{name.padEnd(10)}</Text>
              <Text color={color}>{'█'.repeat(filled)}</Text>
              <Text dimColor>{'░'.repeat(empty)}</Text>
              <Text> {base}</Text>
              {added > 0 ? <Text color="green">+{added}</Text> : null}
              <Text> = {total}</Text>
            </Text>
          )
        })}
      </Box>
      {remaining === 0 ? (
        <Text color="green" marginTop={1}>All points allocated. Press Enter to confirm.</Text>
      ) : null}
    </Box>
  )
}

function HatchScreen({
  onDone,
}: {
  onDone: (result?: string) => void
}): React.ReactNode {
  const existing = getCompanion()
  const [step, setStep] = React.useState<HatchStep>(
    existing ? 'confirm' : 'species',
  )
  const [species, setSpecies] = React.useState<Species>(SPECIES[0]!)
  const [rarity, setRarity] = React.useState<Rarity>('rare')
  const [shiny, setShiny] = React.useState(false)
  const [eye, setEye] = React.useState<Eye>(EYES[0]!)
  const [hat, setHat] = React.useState<Hat>('none')
  const [name, setName] = React.useState('')
  const [personality, setPersonality] = React.useState<Personality>(PERSONALITIES[0]!)
  const [companion, setCompanion] = React.useState<Companion | null>(null)

  if (step === 'confirm') {
    return (
      <ListSelector
        title={`You already have a companion: ${existing!.name}. Re-initialize?`}
        items={['yes', 'no'] as const}
        labels={item => (item === 'yes' ? 'Yes, start over' : 'No, keep current')}
        onSelect={item => {
          if (item === 'yes') setStep('species')
          else onDone()
        }}
      />
    )
  }

  if (step === 'species') {
    return (
      <ListSelector
        title="Choose your companion species:"
        items={SPECIES}
        labels={sp => {
          const face = renderFace({ species: sp, eye: '·', hat: 'none' })
          return `${face}  ${sp}`
        }}
        onSelect={sp => {
          setSpecies(sp)
          setStep('rarity')
        }}
      />
    )
  }

  if (step === 'rarity') {
    return (
      <ListSelector
        title="Choose rarity:"
        items={RARITIES}
        labels={r =>
          `${RARITY_STARS[r]} ${r} (base total: ${RARITY_STAT_TOTALS[r]})`
        }
        onSelect={r => {
          setRarity(r)
          setStep('shiny')
        }}
      />
    )
  }

  if (step === 'shiny') {
    return (
      <ListSelector
        title="Shiny variant?"
        items={['no', 'yes'] as const}
        labels={item => (item === 'yes' ? '✨ Yes, shiny!' : 'No, normal')}
        onSelect={item => {
          setShiny(item === 'yes')
          setStep('eye')
        }}
      />
    )
  }

  if (step === 'eye') {
    return (
      <ListSelector
        title="Choose eye style:"
        items={EYES}
        labels={e => {
          const face = renderFace({ species, eye: e, hat: 'none' })
          return `${face}  (${e})`
        }}
        onSelect={e => {
          setEye(e)
          setStep('hat')
        }}
      />
    )
  }

  if (step === 'hat') {
    const availableHats = rarity === 'common' ? (['none'] as const) : HATS
    if (rarity === 'common') {
      // Skip hat selection for common rarity
      setHat('none')
      setStep('name')
      return null
    }
    return (
      <ListSelector
        title="Choose a hat:"
        items={availableHats}
        onSelect={h => {
          setHat(h as Hat)
          setStep('name')
        }}
      />
    )
  }

  if (step === 'name') {
    return (
      <TextInput
        title="Name your companion:"
        onSubmit={n => {
          setName(n)
          setStep('personality')
        }}
      />
    )
  }

  if (step === 'personality') {
    return (
      <ListSelector
        title="Choose personality:"
        items={PERSONALITIES}
        onSelect={p => {
          setPersonality(p)
          setStep('stats')
        }}
      />
    )
  }

  if (step === 'stats') {
    const baseStats = getScaledBaseStats(species, rarity)
    const color = RARITY_COLORS[rarity]
    return (
      <StatAllocator
        baseStats={baseStats}
        totalPoints={ALLOCATABLE_POINTS}
        color={color}
        onDone={finalStats => {
          const newCompanion: Companion = {
            species,
            rarity,
            eye,
            hat,
            shiny,
            name,
            personality,
            stats: finalStats,
            hatchedAt: Date.now(),
          }
          saveCompanion(newCompanion)
          setCompanion(newCompanion)
          setStep('done')
        }}
      />
    )
  }

  if (step === 'done' && companion) {
    return (
      <Box flexDirection="column">
        <Text bold color={RARITY_COLORS[companion.rarity]}>
          Your companion is ready!
        </Text>
        <CompanionCard companion={companion} onDone={() => onDone()} />
      </Box>
    )
  }

  return null
}

// ── Main command ──────────────────────────────────────────────────────

export const call: LocalJSXCommandCall = async (onDone, _context, args) => {
  const sub = args.trim().toLowerCase()

  if (sub === 'pet') {
    const companion = getCompanion()
    if (!companion) {
      onDone('No companion yet — try /buddy hatch first!')
      return null
    }
    const PetAction = (): React.ReactNode => {
      const setAppState = useSetAppState()
      React.useEffect(() => {
        setAppState(prev => ({ ...prev, companionPetAt: Date.now() }))
        onDone(`You pet ${companion.name}!`)
      }, [setAppState])
      return null
    }
    return <PetAction />
  }

  if (sub === 'card') {
    const companion = getCompanion()
    if (!companion) {
      onDone('No companion yet — try /buddy hatch first!')
      return null
    }
    return <CompanionCard companion={companion} onDone={() => onDone()} />
  }

  if (sub === 'mute') {
    saveGlobalConfig(config => ({ ...config, companionMuted: true }))
    onDone('Companion muted. Use /buddy unmute to bring them back.')
    return null
  }

  if (sub === 'unmute') {
    saveGlobalConfig(config => ({ ...config, companionMuted: false }))
    onDone('Companion unmuted!')
    return null
  }

  if (sub === 'hatch' || sub === '') {
    const existing = getCompanion()
    if (existing && sub === '') {
      return <CompanionCard companion={existing} onDone={() => onDone()} />
    }
    return <HatchScreen onDone={onDone} />
  }

  onDone(
    `Unknown subcommand: ${sub}. Try: /buddy, /buddy hatch, /buddy pet, /buddy card, /buddy mute, /buddy unmute`,
  )
  return null
}
