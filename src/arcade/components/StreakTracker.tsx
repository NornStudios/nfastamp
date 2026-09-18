import { useStats } from '../StatsContext'
import './StreakTracker.css'

export function StreakTracker() {
  const { currentStreak, streakType } = useStats()

  if (currentStreak === 0) return null

  const absStreak = Math.abs(currentStreak)
  const isHot = streakType === 'win' && absStreak >= 3
  const isCold = streakType === 'loss' && absStreak >= 3

  return (
    <div
      className={`streak-tracker ${streakType === 'win' ? 'win' : 'loss'} ${isHot ? 'hot' : ''} ${isCold ? 'cold' : ''}`}
    >
      <span className="streak-tracker__icon">
        {streakType === 'win' ? (isHot ? '🔥' : '✓') : isCold ? '💀' : '×'}
      </span>
      <span className="streak-tracker__count">{absStreak}</span>
      <span className="streak-tracker__label">
        {streakType === 'win' ? 'WIN' : 'LOSS'} STREAK
      </span>
    </div>
  )
}

export function StreakBadge() {
  const { currentStreak, streakType } = useStats()

  if (currentStreak === 0) return null

  const absStreak = Math.abs(currentStreak)

  return (
    <span className={`streak-badge ${streakType}`}>
      {streakType === 'win' ? '🔥' : '💀'} {absStreak}
    </span>
  )
}
