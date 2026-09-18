import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { PriceTicker } from '../components/PriceTicker'
import { ChipProvider, useChips } from './ChipContext'
import { StatsProvider, useStats } from './StatsContext'
import { DemoBanner } from './components/EdgeChrome'
import { AchievementToast } from './components/AchievementToast'
import { DailyBonusCompact } from './components/DailyBonus'
import { StreakBadge } from './components/StreakTracker'
import { ActivityTicker } from './components/ActivityFeed'
import { StampyReactions } from './components/StampyReactions'
import { createKonamiListener } from './easterEggs'
import { launchConfetti } from './confetti'
import './arcade.css'

function Shell({ children }: { children: ReactNode }) {
  const { balance, reset, credit } = useChips()
  const { recordKonami, stats } = useStats()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30_000)
    return () => window.clearInterval(id)
  }, [])
  void tick

  useEffect(() => {
    return createKonamiListener(() => {
      if (!stats.konamiUsed) {
        credit(500)
        recordKonami()
        launchConfetti('jackpot')
        alert('🎮 KONAMI CODE ACTIVATED! +500 bonus chips!')
      } else {
        alert('🎮 Nice try! Konami code already used.')
      }
    })
  }, [credit, recordKonami, stats.konamiUsed])

  return (
    <div className="arc-page">
      <PriceTicker />
      <div className="arc-shell">
        <header className="arc-top">
          <Link className="arc-top__brand" to="/arcade">
            <img
              src="/media/nfa/logo-horizontal.png"
              alt="NFA"
              width={180}
              height={60}
            />
            <span className="arc-top__title">Arcade</span>
          </Link>
          <nav className="arc-top__nav" aria-label="Arcade">
            <NavLink to="/arcade" end>
              Floor
            </NavLink>
            <NavLink to="/arcade/stats">Stats</NavLink>
            <NavLink to="/arcade/achievements">🏆</NavLink>
            <NavLink to="/arcade/leaderboard">🏅</NavLink>
            <Link to="/">Home</Link>
          </nav>
          <div className="arc-top__actions">
            <DailyBonusCompact />
            <StreakBadge />
            <button
              type="button"
              className="arc-callout arc-callout--stamp"
              style={{ cursor: 'pointer', borderWidth: 2, boxShadow: 'none' }}
              onClick={reset}
              title="Reset demo chips"
            >
              {balance.toFixed(0)} chips
            </button>
          </div>
        </header>
        <DemoBanner />
        {children}
      </div>
      <AchievementToast />
      <ActivityTicker />
      <StampyReactions />
    </div>
  )
}

function Providers({ children }: { children: ReactNode }) {
  return (
    <ChipProvider>
      <StatsProvider>
        {children}
      </StatsProvider>
    </ChipProvider>
  )
}

export function ArcadeLayout() {
  return (
    <Providers>
      <Shell>
        <Outlet />
      </Shell>
    </Providers>
  )
}
