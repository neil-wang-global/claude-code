import type { Message } from '../types/message.js'
import type { Attachment } from '../utils/attachments.js'
import { getGlobalConfig } from '../utils/config.js'
import { getCompanion } from './companion.js'
import { SPECIES_LABELS } from './types.js'

export function companionIntroText(name: string, species: string): string {
  return `# 同伴

一只名叫 ${name} 的${species}正待在用户输入框旁边，偶尔会在气泡里插一句话。你不是 ${name} —— 它是独立的旁观者。

当用户直接叫 ${name} 的名字时，它的气泡会自己回应。此时你的任务是让开：只用一行内简短回应你需要回答的部分，或者只回答消息里明确是对你说的内容。不要解释你不是 ${name}——用户知道。也不要替 ${name} 复述它会说什么——气泡会自己处理。`
}

export function getCompanionIntroAttachment(
  messages: Message[] | undefined,
): Attachment[] {
  const companion = getCompanion()
  if (!companion || getGlobalConfig().companionMuted) return []

  for (const msg of messages ?? []) {
    if (msg.type !== 'attachment') continue
    if (msg.attachment.type !== 'companion_intro') continue
    if (msg.attachment.companionId === companion.id) return []
  }

  return [
    {
      type: 'companion_intro',
      companionId: companion.id,
      name: companion.name,
      species: SPECIES_LABELS[companion.species],
    },
  ]
}
