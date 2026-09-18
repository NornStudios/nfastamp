import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { PriceTicker } from '../components/PriceTicker'
import { ChipProvider, useChips } from './ChipContext'
import { DemoBanner } from './components/EdgeChrome'
import './arcade.css'

function Shell({ children }: { children: ReactNode }) {
  const { balance, reset } = useChips()
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 30_000)
    return () => window.clearInterval(id)
  }, [])
  void tick

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
            <Link to="/">Home</Link>
            <button
              type="button"
              className="arc-callout arc-callout--stamp"
              style={{ cursor: 'pointer', borderWidth: 2, boxShadow: 'none' }}
              onClick={reset}
              title="Reset demo chips"
            >
              {balance.toFixed(0)} chips
            </button>
          </nav>
        </header>
        <DemoBanner />
        {children}
      </div>
    </div>
  )
}

export function ArcadeLayout() {
  return (
    <ChipProvider>
      <Shell>
        <Outlet />
      </Shell>
    </ChipProvider>
  )
}
