import { Link } from 'react-router-dom'
import { useStats, ACHIEVEMENTS } from '../StatsContext'
import './AchievementsPage.css'

export function AchievementsPage() {
  const { unlocked } = useStats()

  const regularAchievements = ACHIEVEMENTS.filter((a) => !a.secret)
  const secretAchievements = ACHIEVEMENTS.filter((a) => a.secret)
  const unlockedSecrets = secretAchievements.filter((a) => unlocked.has(a.id))

  const totalUnlocked = regularAchievements.filter((a) => unlocked.has(a.id)).length
  const percentage = Math.round((totalUnlocked / regularAchievements.length) * 100)

  return (
    <div className="achievements-page">
      <p><Link to="/arcade">← Arcade</Link></p>

      <div className="achievements-page__header">
        <h1>🏆 Achievements</h1>
        <p className="achievements-page__subtitle">
          {totalUnlocked} / {regularAchievements.length} unlocked ({percentage}%)
        </p>
        <div className="achievements-progress">
          <div 
            className="achievements-progress__bar" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="achievements-grid">
        {regularAchievements.map((ach) => {
          const isUnlocked = unlocked.has(ach.id)
          return (
            <div
              key={ach.id}
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <span className="achievement-card__icon">{isUnlocked ? ach.icon : '🔒'}</span>
              <div className="achievement-card__content">
                <span className="achievement-card__title">
                  {isUnlocked ? ach.title : '???'}
                </span>
                <span className="achievement-card__desc">
                  {ach.description}
                </span>
              </div>
              {isUnlocked && (
                <span className="achievement-card__badge">✓</span>
              )}
            </div>
          )
        })}
      </div>

      {(unlockedSecrets.length > 0 || secretAchievements.some((a) => unlocked.has(a.id))) && (
        <>
          <h2 className="achievements-section-title">🕵️ Secret Achievements</h2>
          <div className="achievements-grid">
            {secretAchievements.map((ach) => {
              const isUnlocked = unlocked.has(ach.id)
              if (!isUnlocked) return null
              return (
                <div
                  key={ach.id}
                  className="achievement-card unlocked secret"
                >
                  <span className="achievement-card__icon">{ach.icon}</span>
                  <div className="achievement-card__content">
                    <span className="achievement-card__title">{ach.title}</span>
                    <span className="achievement-card__desc">{ach.description}</span>
                  </div>
                  <span className="achievement-card__badge">✓</span>
                </div>
              )
            })}
            {secretAchievements.filter((a) => !unlocked.has(a.id)).map((_, i) => (
              <div key={`secret-${i}`} className="achievement-card locked secret">
                <span className="achievement-card__icon">❓</span>
                <div className="achievement-card__content">
                  <span className="achievement-card__title">???</span>
                  <span className="achievement-card__desc">Secret achievement</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="achievements-hint">
        <p>Keep playing to unlock more achievements!</p>
        <p>Some achievements are hidden... 👀</p>
      </div>
    </div>
  )
}
