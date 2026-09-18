/**
 * NFA Daily Stamp Bonus System
 * Claim free chips daily with streak multipliers
 */

const STORAGE_KEY = 'nfa-daily-bonus'

export interface DailyBonusState {
  lastClaimDate: string | null
  streak: number
  totalClaimed: number
}

export const BASE_BONUS = 100
export const STREAK_MULTIPLIERS = [1, 1.2, 1.5, 1.8, 2, 2.5, 3] as const
export const MAX_STREAK = STREAK_MULTIPLIERS.length

export function loadDailyBonusState(): DailyBonusState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {}
  return { lastClaimDate: null, streak: 0, totalClaimed: 0 }
}

export function saveDailyBonusState(state: DailyBonusState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function canClaimToday(state: DailyBonusState): boolean {
  if (!state.lastClaimDate) return true
  const today = getDateString()
  return state.lastClaimDate !== today
}

export function getTimeUntilNextClaim(state: DailyBonusState): number {
  if (!state.lastClaimDate) return 0
  const lastClaim = new Date(state.lastClaimDate)
  const nextClaim = new Date(lastClaim)
  nextClaim.setDate(nextClaim.getDate() + 1)
  nextClaim.setHours(0, 0, 0, 0)
  return Math.max(0, nextClaim.getTime() - Date.now())
}

export function getCurrentStreak(state: DailyBonusState): number {
  if (!state.lastClaimDate) return 0
  const today = getDateString()
  const yesterday = getDateString(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
  )
  if (state.lastClaimDate === today || state.lastClaimDate === yesterday) {
    return state.streak
  }
  return 0
}

export function getStreakMultiplier(streak: number): number {
  const idx = Math.min(streak, MAX_STREAK - 1)
  return STREAK_MULTIPLIERS[idx]
}

export function getBonusAmount(streak: number): number {
  return Math.floor(BASE_BONUS * getStreakMultiplier(streak))
}

export function claimDailyBonus(state: DailyBonusState): {
  newState: DailyBonusState
  amount: number
  newStreak: number
} {
  const today = getDateString()
  const yesterday = getDateString(
    new Date(Date.now() - 24 * 60 * 60 * 1000),
  )

  let newStreak: number
  if (!state.lastClaimDate) {
    newStreak = 1
  } else if (state.lastClaimDate === yesterday) {
    newStreak = Math.min(state.streak + 1, MAX_STREAK)
  } else if (state.lastClaimDate === today) {
    return { newState: state, amount: 0, newStreak: state.streak }
  } else {
    newStreak = 1
  }

  const amount = getBonusAmount(newStreak - 1)

  const newState: DailyBonusState = {
    lastClaimDate: today,
    streak: newStreak,
    totalClaimed: state.totalClaimed + amount,
  }

  saveDailyBonusState(newState)
  return { newState, amount, newStreak }
}

export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Now!'
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  }
  return `${seconds}s`
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 7) return '🔥'
  if (streak >= 5) return '⭐'
  if (streak >= 3) return '✨'
  if (streak >= 1) return '📅'
  return '🎁'
}
