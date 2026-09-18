import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { WIN_MULTIPLIER, simulateEdgeSnack } from '../economy'
import { ChipSelector } from '../components/ChipSelector'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EdgeBanner, FunOnly, TreasuryCopy } from '../components/EdgeChrome'
import { WinLoseOverlay } from '../components/WinLoseOverlay'

type Move = 'stamp' | 'clipboard' | 'ink'

const MOVES: { id: Move; label: string }[] = [
  { id: 'stamp', label: 'Stamp' },
  { id: 'clipboard', label: 'Clipboard' },
  { id: 'ink', label: 'Ink bottle' },
]

function beats(a: Move, b: Move): boolean {
  return (
    (a === 'stamp' && b === 'ink') ||
    (a === 'ink' && b === 'clipboard') ||
    (a === 'clipboard' && b === 'stamp')
  )
}

export function RubberRpsGame() {
  const { balance, asset, setAsset, debit, credit } = useChips()
  const [stake, setStake] = useState(10)
  const [move, setMove] = useState<Move>('stamp')
  const [sheet, setSheet] = useState(false)
  const [busy, setBusy] = useState(false)
  const [house, setHouse] = useState<Move | null>(null)
  const [result, setResult] = useState<{
    win: boolean | null
    headline: string
    detail: string
  } | null>(null)

  function play() {
    if (busy || !debit(stake)) return
    setSheet(false)
    setBusy(true)
    const houseMove = MOVES[Math.floor(Math.random() * 3)].id
    setHouse(houseMove)
    const snack = simulateEdgeSnack(stake)

    window.setTimeout(() => {
      if (move === houseMove) {
        credit(stake) // push — return stake
        setResult({
          win: null,
          headline: 'Tie.',
          detail: 'Same gesture. Stake returned. Still NFA.',
        })
      } else if (beats(move, houseMove)) {
        const payout = +(stake * WIN_MULTIPLIER).toFixed(2)
        credit(payout)
        setResult({
          win: true,
          headline: 'You inked Stampy.',
          detail: `+${payout} ${asset}. Win pays 1.90×. Edge 5%.`,
        })
      } else {
        setResult({
          win: false,
          headline: 'Stampy wins.',
          detail: `Snack: ${snack.buyback} buyback · ${snack.treasury} treasury.`,
        })
      }
      setBusy(false)
    }, 500)
  }

  return (
    <div className="arc-game">
      <p>
        <Link to="/arcade">← Floor</Link>
      </p>
      <div className="arc-game__head">
        <div className="arc-callout-row" style={{ justifyContent: 'center' }}>
          <span className="arc-callout arc-callout--stamp">Edge 5%</span>
          <span className="arc-callout">1.90× wins</span>
        </div>
        <h1>Rubber RPS</h1>
        <p className="lede">Stamp / clipboard / ink-bottle vs Stampy.</p>
      </div>
      <EdgeBanner compact />
      <img
        src="/media/nfa/mascot-icon.png"
        alt="Stampy"
        width={120}
        height={120}
        style={{ display: 'block', margin: '0 auto 0.75rem' }}
      />
      {house ? (
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-seal)' }}>
          Stampy played: {house}
        </p>
      ) : null}
      <label className="arc-label">Your gesture</label>
      <div className="arc-row">
        {MOVES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={move === m.id ? 'active' : ''}
            onClick={() => setMove(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <ChipSelector
        stake={stake}
        onStake={setStake}
        asset={asset}
        onAsset={setAsset}
        balance={balance}
      />
      <button
        type="button"
        className="arc-cta"
        disabled={busy || stake > balance}
        onClick={() => setSheet(true)}
      >
        Gesture check
      </button>
      <ConfirmSheet
        open={sheet}
        title="Gesture check"
        cta="Throw it"
        lines={[
          `Stake: ${stake} ${asset}`,
          `You: ${move}`,
          `Win pays: 1.90×`,
        ]}
        onCancel={() => setSheet(false)}
        onConfirm={play}
      />
      <WinLoseOverlay
        open={!!result}
        win={result?.win ?? null}
        headline={result?.headline ?? ''}
        detail={result?.detail}
        onAgain={() => {
          setResult(null)
          setHouse(null)
          setSheet(true)
        }}
        onClose={() => {
          setResult(null)
          setHouse(null)
        }}
      />
      <TreasuryCopy />
      <FunOnly />
    </div>
  )
}
