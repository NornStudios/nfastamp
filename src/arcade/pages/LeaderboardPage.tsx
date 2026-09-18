import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { useStats } from '../StatsContext'
import {
  formatRank,
  getPlayerRank,
  loadLeaderboard,
  updatePlayerOnLeaderboard,
  type LeaderboardEntry,
} from '../leaderboard'
import './LeaderboardPage.css'

export function LeaderboardPage() {
  const { balance } = useChips()
  const { stats } = useStats()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerName, setPlayerName] = useState(() => 
    localStorage.getItem('nfa-player-name') || ''
  )
  const [editing, setEditing] = useState(false)
  const [tempName, setTempName] = useState(playerName)

  useEffect(() => {
    if (playerName) {
      const updated = updatePlayerOnLeaderboard(playerName, balance, stats.wins)
      setLeaderboard(updated)
    } else {
      setLeaderboard(loadLeaderboard())
    }
  }, [balance, stats.wins, playerName])

  function saveName() {
    const name = tempName.trim().slice(0, 20)
    if (name) {
      localStorage.setItem('nfa-player-name', name)
      setPlayerName(name)
      setEditing(false)
    }
  }

  const playerRank = getPlayerRank(leaderboard)

  return (
    <div className="leaderboard-page">
      <p><Link to="/arcade">← Arcade</Link></p>

      <div className="leaderboard-page__header">
        <h1>🏅 Leaderboard</h1>
        <p className="leaderboard-page__subtitle">Top chip holders this week</p>
      </div>

      {!playerName ? (
        <div className="leaderboard-register">
          <p>Enter your name to join the leaderboard!</p>
          <div className="leaderboard-register__form">
            <input
              type="text"
              placeholder="Your nickname..."
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              maxLength={20}
              className="leaderboard-register__input"
            />
            <button 
              className="leaderboard-register__btn"
              onClick={saveName}
              disabled={!tempName.trim()}
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className="leaderboard-player">
          {editing ? (
            <div className="leaderboard-register__form">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                maxLength={20}
                className="leaderboard-register__input"
              />
              <button className="leaderboard-register__btn" onClick={saveName}>
                Save
              </button>
              <button 
                className="leaderboard-register__btn leaderboard-register__btn--cancel" 
                onClick={() => { setEditing(false); setTempName(playerName); }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <span className="leaderboard-player__name">
                Playing as: <strong>{playerName}</strong>
              </span>
              <button 
                className="leaderboard-player__edit"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              {playerRank && (
                <span className="leaderboard-player__rank">
                  Your rank: {formatRank(playerRank)}
                </span>
              )}
            </>
          )}
        </div>
      )}

      <div className="leaderboard-list">
        {leaderboard.map((entry, idx) => (
          <div
            key={`${entry.name}-${idx}`}
            className={`leaderboard-entry ${entry.isPlayer ? 'you' : ''} ${idx < 3 ? `top-${idx + 1}` : ''}`}
          >
            <span className="leaderboard-entry__rank">{formatRank(idx + 1)}</span>
            <span className="leaderboard-entry__name">
              {entry.name}
              {entry.isPlayer && <span className="leaderboard-entry__you">(you)</span>}
            </span>
            <span className="leaderboard-entry__chips">
              {entry.chips.toLocaleString()} NFA
            </span>
            <span className="leaderboard-entry__wins">{entry.wins}W</span>
          </div>
        ))}
      </div>

      <div className="leaderboard-footer">
        <p>Leaderboard resets weekly. Demo chips only!</p>
        <p>Keep playing to climb the ranks 🚀</p>
      </div>
    </div>
  )
}
