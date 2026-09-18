/**
 * NFA Arcade Leaderboard
 * Local leaderboard with simulated other players for social proof
 */

const STORAGE_KEY = 'nfa-leaderboard'

export interface LeaderboardEntry {
  name: string
  chips: number
  wins: number
  timestamp: number
  isPlayer?: boolean
}

const FAKE_NAMES = [
  'StampyFan420',
  'DiamondStamps',
  'NFAWhale',
  'InkMaster',
  'DYORDave',
  'PaperHandPete',
  'CryptoStamper',
  'MoonBoi',
  'RektRalph',
  'HodlHank',
  'DumpItDan',
  'FomoFrank',
  'BagHolder42',
  'RugPullRick',
  'ApeDegen',
  'SellTheNews',
  'BuyHighGuy',
  'CopiumKing',
  'HopiumDealer',
  'WenLamboLarry',
  'JeetJohn',
  'ChartChaser',
  'RedCandle',
  'GreenDildo',
  'LiquidatedLisa',
] as const

function generateFakeEntries(): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = []
  const usedNames = new Set<string>()

  for (let i = 0; i < 15; i++) {
    let name: string
    do {
      name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)]
    } while (usedNames.has(name))
    usedNames.add(name)

    const baseChips = Math.floor(Math.random() * 8000) + 500
    const variance = Math.floor(Math.random() * 2000) - 1000
    entries.push({
      name,
      chips: Math.max(100, baseChips + variance),
      wins: Math.floor(Math.random() * 50) + 5,
      timestamp: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
    })
  }

  return entries.sort((a, b) => b.chips - a.chips)
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.generatedAt && Date.now() - data.generatedAt < 7 * 24 * 60 * 60 * 1000) {
        return data.entries
      }
    }
  } catch {}

  const entries = generateFakeEntries()
  saveLeaderboard(entries)
  return entries
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      generatedAt: Date.now(),
      entries,
    }))
  } catch {}
}

export function updatePlayerOnLeaderboard(
  playerName: string,
  chips: number,
  wins: number,
): LeaderboardEntry[] {
  const entries = loadLeaderboard().filter((e) => !e.isPlayer)
  
  entries.push({
    name: playerName,
    chips,
    wins,
    timestamp: Date.now(),
    isPlayer: true,
  })

  const sorted = entries.sort((a, b) => b.chips - a.chips).slice(0, 20)
  saveLeaderboard(sorted)
  return sorted
}

export function getPlayerRank(leaderboard: LeaderboardEntry[]): number | null {
  const idx = leaderboard.findIndex((e) => e.isPlayer)
  return idx >= 0 ? idx + 1 : null
}

export function formatRank(rank: number): string {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return `#${rank}`
}
