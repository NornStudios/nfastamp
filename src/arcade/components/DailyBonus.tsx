import { useEffect, useState } from 'react'
import { useChips } from '../ChipContext'
import { useStats } from '../StatsContext'
import {
  canClaimToday,
  claimDailyBonus,
  formatTimeRemaining,
  getBonusAmount,
  getStreakEmoji,
  getStreakMultiplier,
  getTimeUntilNextClaim,
  loadDailyBonusState,
  STREAK_MULTIPLIERS,
  type DailyBonusState,
} from '../dailyBonus'
import { launchConfetti } from '../confetti'
import './DailyBonus.css'

export function DailyBonus() {
  const { credit } = useChips()
  const { recordDailyClaim } = useStats()
  const [state, setState] = useState<DailyBonusState>(() => loadDailyBonusState())
  const [canClaim, setCanClaim] = useState(() => canClaimToday(state))
  const [timeRemaining, setTimeRemaining] = useState(() => getTimeUntilNextClaim(state))
  const [justClaimed, setJustClaimed] = useState(false)
  const [claimedAmount, setClaimedAmount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const newState = loadDailyBonusState()
      setState(newState)
      setCanClaim(canClaimToday(newState))
      setTimeRemaining(getTimeUntilNextClaim(newState))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  function handleClaim() {
    if (!canClaim) return
    const result = claimDailyBonus(state)
    if (result.amount > 0) {
      credit(result.amount)
      recordDailyClaim(result.newStreak)
      setState(result.newState)
      setCanClaim(false)
      setJustClaimed(true)
      setClaimedAmount(result.amount)
      launchConfetti(result.newStreak >= 7 ? 'big' : 'normal')
      setTimeout(() => setJustClaimed(false), 3000)
    }
  }

  const currentStreak = state.streak
  const nextBonus = getBonusAmount(currentStreak)
  const multiplier = getStreakMultiplier(currentStreak)

  return (
    <div className={`daily-bonus ${justClaimed ? 'just-claimed' : ''}`}>
      <div className="daily-bonus__header">
        <span className="daily-bonus__emoji">{getStreakEmoji(currentStreak)}</span>
        <span className="daily-bonus__title">Daily Stamp</span>
      </div>

      {justClaimed ? (
        <div className="daily-bonus__claimed">
          <span className="daily-bonus__amount">+{claimedAmount} NFA</span>
          <span className="daily-bonus__streak-msg">
            {currentStreak}-day streak!
          </span>
        </div>
      ) : canClaim ? (
        <>
          <div className="daily-bonus__preview">
            <span className="daily-bonus__amount">{nextBonus} NFA</span>
            {multiplier > 1 && (
              <span className="daily-bonus__multiplier">{multiplier}× streak bonus</span>
            )}
          </div>
          <button className="daily-bonus__btn" onClick={handleClaim}>
            Claim Now
          </button>
        </>
      ) : (
        <div className="daily-bonus__wait">
          <span className="daily-bonus__timer">{formatTimeRemaining(timeRemaining)}</span>
          <span className="daily-bonus__next">until next claim</span>
          {currentStreak > 0 && (
            <span className="daily-bonus__streak">
              {currentStreak}-day streak {getStreakEmoji(currentStreak)}
            </span>
          )}
        </div>
      )}

      <div className="daily-bonus__ladder">
        {STREAK_MULTIPLIERS.map((mult, i) => (
          <div
            key={i}
            className={`daily-bonus__day ${i < currentStreak ? 'complete' : ''} ${i === currentStreak ? 'next' : ''}`}
          >
            <span className="daily-bonus__day-num">{i + 1}</span>
            <span className="daily-bonus__day-mult">{mult}×</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DailyBonusCompact() {
  const { credit } = useChips()
  const { recordDailyClaim } = useStats()
  const [state, setState] = useState<DailyBonusState>(() => loadDailyBonusState())
  const [canClaim, setCanClaim] = useState(() => canClaimToday(state))
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newState = loadDailyBonusState()
      setState(newState)
      setCanClaim(canClaimToday(newState))
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  function handleClaim() {
    if (!canClaim) return
    const result = claimDailyBonus(state)
    if (result.amount > 0) {
      credit(result.amount)
      recordDailyClaim(result.newStreak)
      setState(result.newState)
      setCanClaim(false)
      setPulse(true)
      launchConfetti('normal')
      setTimeout(() => setPulse(false), 1000)
    }
  }

  if (!canClaim) return null

  return (
    <button
      className={`daily-bonus-compact ${pulse ? 'pulse' : ''}`}
      onClick={handleClaim}
      title="Claim your daily bonus!"
    >
      🎁 Claim Daily
    </button>
  )
}
