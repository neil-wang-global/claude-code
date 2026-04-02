import { getInitialSettings } from '../utils/settings/settings.js'
import { updateSettingsForSource } from '../utils/settings/settings.js'
import { resetSettingsCache } from '../utils/settings/settingsCache.js'
import type { Companion, StoredCompanion } from './types.js'

/**
 * Read the companion from user settings.
 * Returns undefined if no companion has been initialized via /buddy hatch.
 */
export function getCompanion(): Companion | undefined {
  const settings = getInitialSettings()
  const buddy = settings.buddy as StoredCompanion | undefined
  return buddy ?? undefined
}

/**
 * Save a companion to user settings (~/.claude/settings.json).
 */
export function saveCompanion(companion: StoredCompanion): void {
  updateSettingsForSource('userSettings', { buddy: companion } as never)
  resetSettingsCache()
}
