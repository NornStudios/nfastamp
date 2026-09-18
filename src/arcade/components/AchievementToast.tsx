import { useEffect, useState } from 'react'
import { useStats } from '../StatsContext'
import './AchievementToast.css'

export function AchievementToast() {
  const { newAchievements, dismissAchievement } = useStats()
  const [visible, setVisible] = useState(false)

  const current = newAchievements[0]

  useEffect(() => {
    if (current) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(dismissAchievement, 300)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [current, dismissAchievement])

  if (!current) return null

  return (
    <div className={`ach-toast ${visible ? 'show' : ''}`} onClick={dismissAchievement}>
      <div className="ach-toast__icon">{current.icon}</div>
      <div className="ach-toast__content">
        <span className="ach-toast__label">Achievement Unlocked!</span>
        <span className="ach-toast__title">{current.title}</span>
        <span className="ach-toast__desc">{current.description}</span>
      </div>
    </div>
  )
}
