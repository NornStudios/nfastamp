import { useEffect, useState } from 'react'
import { useStats } from '../StatsContext'
import { getRandomSlogan, getWinQuip, getLoseQuip } from '../slogans'
import './StampyReactions.css'

type Mood = 'idle' | 'happy' | 'sad' | 'shocked' | 'smug'

const MOOD_STICKERS: Record<Mood, string> = {
  idle: '/media/nfa/sticker-pack/wink.png',
  happy: '/media/nfa/sticker-pack/stamp-slam.png',
  sad: '/media/nfa/sticker-pack/panic.png',
  shocked: '/media/nfa/sticker-pack/shrug.png',
  smug: '/media/nfa/sticker-pack/smug.png',
}

export function StampyReactions() {
  const { currentStreak, streakType, stats } = useStats()
  const [mood, setMood] = useState<Mood>('idle')
  const [message, setMessage] = useState<string>('')
  const [visible, setVisible] = useState(false)
  const [lastGamesPlayed, setLastGamesPlayed] = useState(stats.gamesPlayed)

  useEffect(() => {
    if (stats.gamesPlayed === lastGamesPlayed) return
    setLastGamesPlayed(stats.gamesPlayed)

    const absStreak = Math.abs(currentStreak)

    if (streakType === 'win') {
      if (absStreak >= 5) {
        setMood('shocked')
        setMessage("You're... actually winning?!")
      } else if (absStreak >= 3) {
        setMood('happy')
        setMessage(getWinQuip())
      } else {
        setMood('smug')
        setMessage(getWinQuip())
      }
    } else if (streakType === 'loss') {
      if (absStreak >= 5) {
        setMood('sad')
        setMessage("The house thanks you deeply.")
      } else if (absStreak >= 3) {
        setMood('sad')
        setMessage(getLoseQuip())
      } else {
        setMood('idle')
        setMessage(getLoseQuip())
      }
    } else {
      setMood('idle')
      setMessage(getRandomSlogan())
    }

    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [stats.gamesPlayed, currentStreak, streakType, lastGamesPlayed])

  return (
    <div className={`stampy-reactions ${visible ? 'show' : ''}`}>
      <img
        className={`stampy-reactions__img stampy-reactions__img--${mood}`}
        src={MOOD_STICKERS[mood]}
        alt="Stampy"
      />
      {message && (
        <div className="stampy-reactions__bubble">
          <p>{message}</p>
        </div>
      )}
    </div>
  )
}

export function StampyCorner() {
  const [slogan, setSlogan] = useState(getRandomSlogan)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(true)
      setSlogan(getRandomSlogan())
      setTimeout(() => setShow(false), 5000)
    }, 15000)

    setTimeout(() => {
      setShow(true)
      setTimeout(() => setShow(false), 5000)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`stampy-corner ${show ? 'show' : ''}`}>
      <img
        className="stampy-corner__img"
        src="/media/nfa/sticker-pack/smug.png"
        alt=""
      />
      <div className="stampy-corner__bubble">
        <p>{slogan}</p>
      </div>
    </div>
  )
}
