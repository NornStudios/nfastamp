import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { EdgeBanner, FunOnly, TreasuryCopy } from '../components/EdgeChrome'

const SCORE_KEY = 'nfa-arcade-highscore-v0'

export function HighScoreSlamGame() {
  const { balance, debit } = useChips()
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem(SCORE_KEY) || 0)
    } catch {
      return 0
    }
  })
  const [running, setRunning] = useState(true)
  const [msg, setMsg] = useState('')
  const barRef = useRef<HTMLDivElement>(null)

  function slam() {
    if (!running || !barRef.current) return
    const parent = barRef.current.parentElement
    if (!parent) return
    const barLeft = barRef.current.offsetLeft
    const sweetLeft = parent.clientWidth * 0.42
    const sweetRight = parent.clientWidth * 0.58
    const center = barLeft + barRef.current.offsetWidth / 2
    const hit = center >= sweetLeft && center <= sweetRight
    const gained = hit ? 100 + Math.floor(Math.random() * 40) : 10
    const next = score + gained
    setScore(next)
    setMsg(hit ? `SLAM! +${gained}` : `Thud. +${gained}`)
    if (next > best) {
      setBest(next)
      localStorage.setItem(SCORE_KEY, String(next))
    }
  }

  function tipPin() {
    if (!debit(10)) {
      setMsg('Need 10 demo chips to pin.')
      return
    }
    setMsg(`Pinned ${score} with a tip. Tips → treasury/buyback in v1. Not a prize pool.`)
  }

  return (
    <div className="arc-game">
      <p>
        <Link to="/arcade">← Floor</Link>
      </p>
      <div className="arc-game__head">
        <div className="arc-callout-row" style={{ justifyContent: 'center' }}>
          <span className="arc-callout">Free toy</span>
          <span className="arc-callout arc-callout--stamp">Optional tip</span>
        </div>
        <h1>High-Score Slam</h1>
        <p className="lede">Timing bar + slam. Tip to pin — not a hidden prize pool.</p>
      </div>
      <EdgeBanner compact />
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '2rem' }}>
        {score}
      </p>
      <p style={{ textAlign: 'center', fontFamily: 'var(--font-seal)', fontSize: '0.8rem' }}>
        Best: {best}
      </p>
      <div className="arc-timing">
        <div className="arc-timing__sweet" />
        {running ? <div className="arc-timing__bar" ref={barRef} /> : null}
      </div>
      <button type="button" className="arc-cta" onClick={slam}>
        Slam
      </button>
      <button
        type="button"
        className="arc-cta"
        style={{ marginTop: '0.5rem', background: 'var(--ink)' }}
        disabled={balance < 10}
        onClick={tipPin}
      >
        Tip 10 to pin
      </button>
      <button
        type="button"
        className="btn btn--ghost"
        style={{ width: '100%', marginTop: '0.75rem' }}
        onClick={() => {
          setScore(0)
          setMsg('')
          setRunning(true)
        }}
      >
        Reset run
      </button>
      {msg ? (
        <p style={{ fontFamily: 'var(--font-seal)', textAlign: 'center' }}>{msg}</p>
      ) : null}
      <TreasuryCopy />
      <FunOnly />
    </div>
  )
}
