/**
 * NFA Easter Eggs
 * Hidden secrets and bonuses
 */

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function createKonamiListener(onActivate: () => void): () => void {
  let index = 0
  let lastTime = 0

  function handler(e: KeyboardEvent) {
    const now = Date.now()
    if (now - lastTime > 2000) {
      index = 0
    }
    lastTime = now

    if (e.key === KONAMI[index]) {
      index++
      if (index === KONAMI.length) {
        onActivate()
        index = 0
      }
    } else {
      index = 0
    }
  }

  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}

export function isLuckyTime(): { lucky: boolean; reason: string | null } {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()

  if ((h === 4 || h === 16) && m === 20) {
    return { lucky: true, reason: '4:20 bonus! 🌿' }
  }
  if ((h === 11 || h === 23) && m === 11) {
    return { lucky: true, reason: '11:11 make a wish! ✨' }
  }
  if (h === 0 && m === 0) {
    return { lucky: true, reason: 'Midnight magic! 🌙' }
  }
  if (h === 13 && m === 37) {
    return { lucky: true, reason: 'L33T time! 💻' }
  }

  return { lucky: false, reason: null }
}

export function getLuckyTimeBonus(): number {
  const { lucky } = isLuckyTime()
  return lucky ? 1.1 : 1.0
}

export const SECRET_PHRASES = [
  'stampy mode',
  'dyor',
  'to the moon',
  'wagmi',
  'ngmi',
  'wen lambo',
]

export function checkSecretPhrase(input: string): boolean {
  const lower = input.toLowerCase().trim()
  return SECRET_PHRASES.includes(lower)
}
