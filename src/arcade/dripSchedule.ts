/**
 * Drip unlock schedule — generated once with seed 0x4efa2026 (mulberry32).
 * Public UI unlocks when Date.now() >= unlockAt.
 * Status ladder: locked → demo (newest unlock) → live (when the next demo drops).
 * See docs/arcade-drip-schedule.md
 */

export const DRIP_SEED = '0x4efa2026'
export const DRIP_EPOCH = '2026-09-18T05:15:00.000Z'

export type GameId =
  | 'stamp-flip'
  | 'ink-or-sink'
  | 'disclaimer-wheel'
  | 'dyor-dice'
  | 'scratch-disclaimer'
  | 'panic-button'
  | 'rubber-rps'
  | 'tip-the-house'
  | 'cosmetics-closet'
  | 'high-score-slam'

/** locked = not yet; demo = current drip feature; live = prior unlock superseded by a newer demo */
export type GameStatus = 'locked' | 'demo' | 'live'

export interface DripEntry {
  id: GameId
  unlockAt: string
  delayHoursFromPrev: number
}

/** Persisted schedule — do not re-roll casually. */
export const DRIP_SCHEDULE: readonly DripEntry[] = [
  {
    id: 'stamp-flip',
    unlockAt: '2026-09-18T05:15:00.000Z',
    delayHoursFromPrev: 0,
  },
  {
    id: 'ink-or-sink',
    unlockAt: '2026-09-20T01:11:05.692Z',
    delayHoursFromPrev: 43.9349,
  },
  {
    id: 'disclaimer-wheel',
    unlockAt: '2026-09-21T03:30:05.530Z',
    delayHoursFromPrev: 26.3166,
  },
  {
    id: 'dyor-dice',
    unlockAt: '2026-09-22T17:46:26.099Z',
    delayHoursFromPrev: 38.2724,
  },
  {
    id: 'scratch-disclaimer',
    unlockAt: '2026-09-24T12:29:13.117Z',
    delayHoursFromPrev: 42.7131,
  },
  {
    id: 'panic-button',
    unlockAt: '2026-09-26T05:09:27.411Z',
    delayHoursFromPrev: 40.6706,
  },
  {
    id: 'rubber-rps',
    unlockAt: '2026-09-27T14:59:05.724Z',
    delayHoursFromPrev: 33.8273,
  },
  {
    id: 'tip-the-house',
    unlockAt: '2026-09-28T18:31:48.047Z',
    delayHoursFromPrev: 27.5451,
  },
  {
    id: 'cosmetics-closet',
    unlockAt: '2026-09-30T17:29:01.943Z',
    delayHoursFromPrev: 46.9539,
  },
  {
    id: 'high-score-slam',
    unlockAt: '2026-10-02T02:19:40.482Z',
    delayHoursFromPrev: 32.844,
  },
] as const

const byId = Object.fromEntries(
  DRIP_SCHEDULE.map((e) => [e.id, e]),
) as Record<GameId, DripEntry>

export function getUnlockAt(id: GameId): string {
  return byId[id].unlockAt
}

export function getScheduleIndex(id: GameId): number {
  return DRIP_SCHEDULE.findIndex((e) => e.id === id)
}

/**
 * - locked: now < unlockAt
 * - demo: unlocked and no later game has unlocked yet (one current demo)
 * - live: unlocked and a later game has already unlocked as the new demo
 */
export function getGameStatus(
  id: GameId,
  now: number = Date.now(),
): GameStatus {
  const idx = getScheduleIndex(id)
  if (idx < 0) return 'locked'
  if (now < Date.parse(DRIP_SCHEDULE[idx].unlockAt)) return 'locked'
  const next = DRIP_SCHEDULE[idx + 1]
  if (next && now >= Date.parse(next.unlockAt)) return 'live'
  return 'demo'
}

export function isUnlocked(
  id: GameId,
  now: number = Date.now(),
): boolean {
  return getGameStatus(id, now) !== 'locked'
}

export function isPlayable(
  id: GameId,
  now: number = Date.now(),
): boolean {
  return isUnlocked(id, now)
}

/** Newest unlocked game (the current demo), or null if none unlocked. */
export function getCurrentDemoId(
  now: number = Date.now(),
): GameId | null {
  for (let i = DRIP_SCHEDULE.length - 1; i >= 0; i--) {
    if (now >= Date.parse(DRIP_SCHEDULE[i].unlockAt)) {
      return DRIP_SCHEDULE[i].id
    }
  }
  return null
}

export function statusLabel(status: GameStatus): string {
  switch (status) {
    case 'locked':
      return 'Coming soon'
    case 'demo':
      return 'Demo'
    case 'live':
      return 'Live'
  }
}

export function msUntilUnlock(
  id: GameId,
  now: number = Date.now(),
): number {
  return Math.max(0, Date.parse(getUnlockAt(id)) - now)
}
