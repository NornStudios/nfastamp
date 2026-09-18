/**
 * NFA Arcade Achievement System
 * Unlock badges for milestones - persisted to localStorage
 */

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  secret?: boolean
  condition: (stats: PlayerStats) => boolean
}

export interface PlayerStats {
  totalWagered: number
  totalWon: number
  totalLost: number
  gamesPlayed: number
  wins: number
  losses: number
  biggestWin: number
  biggestLoss: number
  currentStreak: number
  bestWinStreak: number
  worstLossStreak: number
  lowestBalance: number
  highestBalance: number
  dailyClaimStreak: number
  totalDailyClaims: number
  gamesPlayedByType: Record<string, number>
  firstPlayDate: string | null
  lastPlayDate: string | null
  konamiUsed: boolean
  luckyTimeWins: number
}

export const DEFAULT_STATS: PlayerStats = {
  totalWagered: 0,
  totalWon: 0,
  totalLost: 0,
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  biggestWin: 0,
  biggestLoss: 0,
  currentStreak: 0,
  bestWinStreak: 0,
  worstLossStreak: 0,
  lowestBalance: 1000,
  highestBalance: 1000,
  dailyClaimStreak: 0,
  totalDailyClaims: 0,
  gamesPlayedByType: {},
  firstPlayDate: null,
  lastPlayDate: null,
  konamiUsed: false,
  luckyTimeWins: 0,
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-stamp',
    title: 'First Stamp',
    description: 'Play your first game',
    icon: '🎰',
    condition: (s) => s.gamesPlayed >= 1,
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Play 10 games',
    icon: '🎲',
    condition: (s) => s.gamesPlayed >= 10,
  },
  {
    id: 'arcade-regular',
    title: 'Arcade Regular',
    description: 'Play 50 games',
    icon: '🏠',
    condition: (s) => s.gamesPlayed >= 50,
  },
  {
    id: 'arcade-veteran',
    title: 'Arcade Veteran',
    description: 'Play 100 games',
    icon: '🎖️',
    condition: (s) => s.gamesPlayed >= 100,
  },
  {
    id: 'first-win',
    title: 'Winner Winner',
    description: 'Win your first game',
    icon: '🏆',
    condition: (s) => s.wins >= 1,
  },
  {
    id: 'lucky-7',
    title: 'Lucky 7',
    description: 'Win 7 times in a row',
    icon: '🍀',
    condition: (s) => s.bestWinStreak >= 7,
  },
  {
    id: 'on-fire',
    title: 'On Fire',
    description: 'Win 10 times in a row',
    icon: '🔥',
    condition: (s) => s.bestWinStreak >= 10,
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Win 15 times in a row',
    icon: '⚡',
    condition: (s) => s.bestWinStreak >= 15,
  },
  {
    id: 'paper-hands',
    title: 'Paper Hands',
    description: 'Lose 1000 chips total',
    icon: '📄',
    condition: (s) => s.totalLost >= 1000,
  },
  {
    id: 'shredded',
    title: 'Shredded',
    description: 'Lose 5000 chips total',
    icon: '🗑️',
    condition: (s) => s.totalLost >= 5000,
  },
  {
    id: 'diamond-hands',
    title: 'Diamond Hands',
    description: 'Recover from under 100 chips to over 500',
    icon: '💎',
    condition: (s) => s.lowestBalance < 100 && s.highestBalance > 500,
  },
  {
    id: 'high-roller',
    title: 'High Roller',
    description: 'Wager 10,000 chips total',
    icon: '🎩',
    condition: (s) => s.totalWagered >= 10000,
  },
  {
    id: 'whale',
    title: 'Whale',
    description: 'Wager 50,000 chips total',
    icon: '🐋',
    condition: (s) => s.totalWagered >= 50000,
  },
  {
    id: 'big-score',
    title: 'Big Score',
    description: 'Win 100+ chips in a single game',
    icon: '💰',
    condition: (s) => s.biggestWin >= 100,
  },
  {
    id: 'jackpot',
    title: 'Jackpot!',
    description: 'Win 500+ chips in a single game',
    icon: '🎰',
    condition: (s) => s.biggestWin >= 500,
  },
  {
    id: 'bad-beat',
    title: 'Bad Beat',
    description: 'Lose 100+ chips in a single game',
    icon: '😢',
    condition: (s) => s.biggestLoss >= 100,
  },
  {
    id: 'daily-stamper',
    title: 'Daily Stamper',
    description: 'Claim daily bonus 3 days in a row',
    icon: '📅',
    condition: (s) => s.dailyClaimStreak >= 3,
  },
  {
    id: 'devoted',
    title: 'Devoted',
    description: 'Claim daily bonus 7 days in a row',
    icon: '🙏',
    condition: (s) => s.dailyClaimStreak >= 7,
  },
  {
    id: 'true-believer',
    title: 'True Believer',
    description: 'Claim daily bonus 30 days in a row',
    icon: '👑',
    condition: (s) => s.dailyClaimStreak >= 30,
  },
  {
    id: 'loss-streak-5',
    title: 'Rough Patch',
    description: 'Lose 5 times in a row',
    icon: '😬',
    condition: (s) => s.worstLossStreak >= 5,
  },
  {
    id: 'loss-streak-10',
    title: 'Pain Train',
    description: 'Lose 10 times in a row',
    icon: '🚂',
    condition: (s) => s.worstLossStreak >= 10,
  },
  {
    id: 'rock-bottom',
    title: 'Rock Bottom',
    description: 'Drop below 50 chips',
    icon: '📉',
    condition: (s) => s.lowestBalance < 50,
  },
  {
    id: 'to-the-moon',
    title: 'To The Moon',
    description: 'Reach 5000 chips',
    icon: '🚀',
    condition: (s) => s.highestBalance >= 5000,
  },
  {
    id: 'millionaire',
    title: 'Demo Millionaire',
    description: 'Reach 10,000 chips',
    icon: '💵',
    condition: (s) => s.highestBalance >= 10000,
  },
  {
    id: 'konami-master',
    title: 'Konami Master',
    description: 'Enter the secret code',
    icon: '🕹️',
    secret: true,
    condition: (s) => s.konamiUsed,
  },
  {
    id: 'lucky-time',
    title: 'Perfect Timing',
    description: 'Win during a lucky time (4:20 or 11:11)',
    icon: '⏰',
    secret: true,
    condition: (s) => s.luckyTimeWins >= 1,
  },
]

const STORAGE_KEY = 'nfa-achievements'
const STATS_KEY = 'nfa-stats'

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (raw) {
      return { ...DEFAULT_STATS, ...JSON.parse(raw) }
    }
  } catch {}
  return { ...DEFAULT_STATS }
}

export function saveStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
  } catch {}
}

export function loadUnlockedAchievements(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      return new Set(JSON.parse(raw))
    }
  } catch {}
  return new Set()
}

export function saveUnlockedAchievements(unlocked: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked]))
  } catch {}
}

export function checkAchievements(
  stats: PlayerStats,
  unlocked: Set<string>,
): Achievement[] {
  const newlyUnlocked: Achievement[] = []
  for (const ach of ACHIEVEMENTS) {
    if (!unlocked.has(ach.id) && ach.condition(stats)) {
      newlyUnlocked.push(ach)
      unlocked.add(ach.id)
    }
  }
  return newlyUnlocked
}

export function getAchievementProgress(_stats: PlayerStats): {
  unlocked: number
  total: number
  percentage: number
} {
  const unlocked = loadUnlockedAchievements()
  const total = ACHIEVEMENTS.filter((a) => !a.secret).length
  const unlockedCount = ACHIEVEMENTS.filter(
    (a) => !a.secret && unlocked.has(a.id),
  ).length
  return {
    unlocked: unlockedCount,
    total,
    percentage: Math.round((unlockedCount / total) * 100),
  }
}

export function isLuckyTime(): boolean {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  return (hours === 4 && minutes === 20) || (hours === 16 && minutes === 20) ||
         (hours === 11 && minutes === 11) || (hours === 23 && minutes === 11)
}
