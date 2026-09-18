import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  ACHIEVEMENTS,
  checkAchievements,
  DEFAULT_STATS,
  isLuckyTime,
  loadStats,
  loadUnlockedAchievements,
  saveStats,
  saveUnlockedAchievements,
  type Achievement,
  type PlayerStats,
} from './achievements'
import { launchConfetti } from './confetti'

interface StatsCtx {
  stats: PlayerStats
  unlocked: Set<string>
  recordPlay: (gameId: string, stake: number, won: boolean, payout: number) => void
  recordDailyClaim: (streak: number) => void
  recordKonami: () => void
  updateBalance: (balance: number) => void
  resetStats: () => void
  newAchievements: Achievement[]
  dismissAchievement: () => void
  currentStreak: number
  streakType: 'win' | 'loss' | null
}

const Ctx = createContext<StatsCtx | null>(null)

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<PlayerStats>(() => loadStats())
  const [unlocked, setUnlocked] = useState<Set<string>>(() => loadUnlockedAchievements())
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    saveStats(stats)
  }, [stats])

  useEffect(() => {
    saveUnlockedAchievements(unlocked)
  }, [unlocked])

  const recordPlay = useCallback(
    (gameId: string, stake: number, won: boolean, payout: number) => {
      setStats((prev) => {
        const now = new Date().toISOString()
        const profit = won ? payout - stake : 0
        const loss = won ? 0 : stake

        let newStreak = prev.currentStreak
        if (won) {
          newStreak = prev.currentStreak >= 0 ? prev.currentStreak + 1 : 1
        } else {
          newStreak = prev.currentStreak <= 0 ? prev.currentStreak - 1 : -1
        }

        const updated: PlayerStats = {
          ...prev,
          totalWagered: prev.totalWagered + stake,
          totalWon: prev.totalWon + (won ? payout : 0),
          totalLost: prev.totalLost + loss,
          gamesPlayed: prev.gamesPlayed + 1,
          wins: prev.wins + (won ? 1 : 0),
          losses: prev.losses + (won ? 0 : 1),
          biggestWin: Math.max(prev.biggestWin, profit),
          biggestLoss: Math.max(prev.biggestLoss, loss),
          currentStreak: newStreak,
          bestWinStreak: Math.max(prev.bestWinStreak, newStreak),
          worstLossStreak: Math.min(prev.worstLossStreak, newStreak),
          gamesPlayedByType: {
            ...prev.gamesPlayedByType,
            [gameId]: (prev.gamesPlayedByType[gameId] || 0) + 1,
          },
          firstPlayDate: prev.firstPlayDate || now,
          lastPlayDate: now,
          luckyTimeWins: prev.luckyTimeWins + (won && isLuckyTime() ? 1 : 0),
        }

        const newUnlocked = new Set(unlocked)
        const justUnlocked = checkAchievements(updated, newUnlocked)
        if (justUnlocked.length > 0) {
          setUnlocked(newUnlocked)
          setNewAchievements((prev) => [...prev, ...justUnlocked])
          if (justUnlocked.some((a) => a.id === 'jackpot' || a.id === 'to-the-moon')) {
            launchConfetti('jackpot')
          } else if (justUnlocked.length > 0) {
            launchConfetti('normal')
          }
        }

        return updated
      })
    },
    [unlocked],
  )

  const recordDailyClaim = useCallback(
    (streak: number) => {
      setStats((prev) => {
        const updated: PlayerStats = {
          ...prev,
          dailyClaimStreak: streak,
          totalDailyClaims: prev.totalDailyClaims + 1,
        }

        const newUnlocked = new Set(unlocked)
        const justUnlocked = checkAchievements(updated, newUnlocked)
        if (justUnlocked.length > 0) {
          setUnlocked(newUnlocked)
          setNewAchievements((prev) => [...prev, ...justUnlocked])
        }

        return updated
      })
    },
    [unlocked],
  )

  const recordKonami = useCallback(() => {
    setStats((prev) => {
      if (prev.konamiUsed) return prev
      const updated = { ...prev, konamiUsed: true }

      const newUnlocked = new Set(unlocked)
      const justUnlocked = checkAchievements(updated, newUnlocked)
      if (justUnlocked.length > 0) {
        setUnlocked(newUnlocked)
        setNewAchievements((prev) => [...prev, ...justUnlocked])
      }

      return updated
    })
  }, [unlocked])

  const updateBalance = useCallback(
    (balance: number) => {
      setStats((prev) => {
        const updated: PlayerStats = {
          ...prev,
          lowestBalance: Math.min(prev.lowestBalance, balance),
          highestBalance: Math.max(prev.highestBalance, balance),
        }

        const newUnlocked = new Set(unlocked)
        const justUnlocked = checkAchievements(updated, newUnlocked)
        if (justUnlocked.length > 0) {
          setUnlocked(newUnlocked)
          setNewAchievements((prev) => [...prev, ...justUnlocked])
        }

        return updated
      })
    },
    [unlocked],
  )

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS)
    setUnlocked(new Set())
    setNewAchievements([])
  }, [])

  const dismissAchievement = useCallback(() => {
    setNewAchievements((prev) => prev.slice(1))
  }, [])

  const value = useMemo<StatsCtx>(
    () => ({
      stats,
      unlocked,
      recordPlay,
      recordDailyClaim,
      recordKonami,
      updateBalance,
      resetStats,
      newAchievements,
      dismissAchievement,
      currentStreak: stats.currentStreak,
      streakType:
        stats.currentStreak > 0
          ? 'win'
          : stats.currentStreak < 0
            ? 'loss'
            : null,
    }),
    [
      stats,
      unlocked,
      recordPlay,
      recordDailyClaim,
      recordKonami,
      updateBalance,
      resetStats,
      newAchievements,
      dismissAchievement,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStats(): StatsCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStats outside StatsProvider')
  return ctx
}

export { ACHIEVEMENTS }
