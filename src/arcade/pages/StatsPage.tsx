import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { useStats, ACHIEVEMENTS } from '../StatsContext'
import './StatsPage.css'

export function StatsPage() {
  const { balance } = useChips()
  const { stats, unlocked } = useStats()

  const winRate = stats.gamesPlayed > 0
    ? ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)
    : '0.0'

  const favoriteGame = Object.entries(stats.gamesPlayedByType)
    .sort((a, b) => b[1] - a[1])[0]

  const achievementCount = ACHIEVEMENTS.filter(a => !a.secret && unlocked.has(a.id)).length
  const totalAchievements = ACHIEVEMENTS.filter(a => !a.secret).length

  return (
    <div className="stats-page">
      <p><Link to="/arcade">← Arcade</Link></p>
      
      <div className="stats-page__header">
        <h1>📊 Your Stats</h1>
        <p className="stats-page__subtitle">A complete record of your gambling adventures</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-card--highlight">
          <span className="stat-card__label">Current Balance</span>
          <span className="stat-card__value">{balance.toLocaleString()}</span>
          <span className="stat-card__unit">NFA</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Games Played</span>
          <span className="stat-card__value">{stats.gamesPlayed}</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Win Rate</span>
          <span className="stat-card__value">{winRate}%</span>
          <span className="stat-card__sub">{stats.wins}W / {stats.losses}L</span>
        </div>

        <div className="stat-card">
          <span className="stat-card__label">Total Wagered</span>
          <span className="stat-card__value">{stats.totalWagered.toLocaleString()}</span>
          <span className="stat-card__unit">NFA</span>
        </div>
      </div>

      <div className="stats-section">
        <h2>🏆 Wins & Losses</h2>
        <div className="stats-grid stats-grid--small">
          <div className="stat-card">
            <span className="stat-card__label">Total Won</span>
            <span className="stat-card__value stat-card__value--green">{stats.totalWon.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Total Lost</span>
            <span className="stat-card__value stat-card__value--red">{stats.totalLost.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Biggest Win</span>
            <span className="stat-card__value stat-card__value--green">{stats.biggestWin.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Biggest Loss</span>
            <span className="stat-card__value stat-card__value--red">{stats.biggestLoss.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>🔥 Streaks</h2>
        <div className="stats-grid stats-grid--small">
          <div className="stat-card">
            <span className="stat-card__label">Current Streak</span>
            <span className={`stat-card__value ${stats.currentStreak > 0 ? 'stat-card__value--green' : stats.currentStreak < 0 ? 'stat-card__value--red' : ''}`}>
              {stats.currentStreak > 0 ? `+${stats.currentStreak}` : stats.currentStreak}
            </span>
            <span className="stat-card__sub">
              {stats.currentStreak > 0 ? 'wins' : stats.currentStreak < 0 ? 'losses' : 'neutral'}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Best Win Streak</span>
            <span className="stat-card__value stat-card__value--green">{stats.bestWinStreak}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Worst Loss Streak</span>
            <span className="stat-card__value stat-card__value--red">{Math.abs(stats.worstLossStreak)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Daily Claim Streak</span>
            <span className="stat-card__value">{stats.dailyClaimStreak}</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>📈 Balance History</h2>
        <div className="stats-grid stats-grid--small">
          <div className="stat-card">
            <span className="stat-card__label">Highest Balance</span>
            <span className="stat-card__value">{stats.highestBalance.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Lowest Balance</span>
            <span className="stat-card__value">{stats.lowestBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h2>🎖️ Achievements</h2>
        <div className="stat-card stat-card--wide">
          <span className="stat-card__label">Progress</span>
          <div className="stat-progress">
            <div 
              className="stat-progress__bar" 
              style={{ width: `${(achievementCount / totalAchievements) * 100}%` }}
            />
          </div>
          <span className="stat-card__sub">{achievementCount} / {totalAchievements} unlocked</span>
          <Link to="/arcade/achievements" className="stat-card__link">View All →</Link>
        </div>
      </div>

      {favoriteGame && (
        <div className="stats-section">
          <h2>🎮 Favorite Game</h2>
          <div className="stat-card stat-card--wide">
            <span className="stat-card__value">{favoriteGame[0].replace(/-/g, ' ').toUpperCase()}</span>
            <span className="stat-card__sub">{favoriteGame[1]} plays</span>
          </div>
        </div>
      )}

      {stats.firstPlayDate && (
        <div className="stats-footer">
          <p>Playing since {new Date(stats.firstPlayDate).toLocaleDateString()}</p>
          {stats.lastPlayDate && (
            <p>Last played {new Date(stats.lastPlayDate).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  )
}
