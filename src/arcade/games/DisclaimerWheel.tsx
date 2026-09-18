import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { simulateEdgeSnack } from '../economy'
import { ChipSelector } from '../components/ChipSelector'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EdgeBanner, FunOnly, TreasuryCopy } from '../components/EdgeChrome'
import { WinLoseOverlay } from '../components/WinLoseOverlay'

/** Weighted slices — ~7% house edge baked into EV. */
const SLICES = [
  { label: 'NFA (lose)', mult: 0, w: 46 },
  { label: 'Still NFA', mult: 0, w: 22 },
  { label: '1.5×', mult: 1.5, w: 16 },
  { label: '2×', mult: 2, w: 10 },
  { label: '3×', mult: 3, w: 5 },
  { label: 'JACKPOT 8×', mult: 8, w: 1 },
] as const

const TOTAL_W = SLICES.reduce((s, x) => s + x.w, 0)

function pickSlice() {
  let r = Math.random() * TOTAL_W
  for (const s of SLICES) {
    r -= s.w
    if (r <= 0) return s
  }
  return SLICES[0]
}

export function DisclaimerWheelGame() {
  const { balance, asset, setAsset, debit, credit } = useChips()
  const [stake, setStake] = useState(10)
  const [sheet, setSheet] = useState(false)
  const [rot, setRot] = useState(0)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{
    win: boolean
    headline: string
    detail: string
  } | null>(null)

  function spin() {
    if (busy || !debit(stake)) return
    setSheet(false)
    setBusy(true)
    const slice = pickSlice()
    const idx = SLICES.indexOf(slice)
    const extra = 360 * (4 + Math.floor(Math.random() * 3))
    const sliceAngle = 360 / SLICES.length
    setRot((r) => r + extra + idx * sliceAngle + sliceAngle / 2)
    const snack = simulateEdgeSnack(stake)

    window.setTimeout(() => {
      if (slice.mult > 0) {
        const payout = +(stake * slice.mult).toFixed(2)
        credit(payout)
        setResult({
          win: true,
          headline: slice.label,
          detail: `+${payout} ${asset}. Edge ~7% in the weights. Split demo: ${snack.buyback}/${snack.treasury}.`,
        })
      } else {
        setResult({
          win: false,
          headline: slice.label,
          detail: `Most slices say you lose. Edge on the weights. Snack: ${snack.buyback} buyback · ${snack.treasury} treasury.`,
        })
      }
      setBusy(false)
    }, 3200)
  }

  const gradient = SLICES.map((_, i) => {
    const colors = ['#B8322F', '#1C1B19', '#E8A09A', '#1F7A4C', '#D4CDB8', '#B8322F']
    const start = (i / SLICES.length) * 100
    const end = ((i + 1) / SLICES.length) * 100
    return `${colors[i % colors.length]} ${start}% ${end}%`
  }).join(', ')

  return (
    <div className="arc-game">
      <p>
        <Link to="/arcade">← Floor</Link>
      </p>
      <div className="arc-game__head">
        <div className="arc-callout-row" style={{ justifyContent: 'center' }}>
          <span className="arc-callout arc-callout--stamp">Edge ~7%</span>
          <span className="arc-callout">Odds on every slice</span>
        </div>
        <h1>Disclaimer Wheel</h1>
        <p className="lede">Spin the seal. Most slices say “NFA (you lose).”</p>
      </div>
      <EdgeBanner compact />

      <div className="arc-wheel__pointer" />
      <div
        className="arc-wheel"
        style={{
          background: `conic-gradient(${gradient})`,
          transform: `rotate(${rot}deg)`,
        }}
      />
      <ul style={{ fontFamily: 'var(--font-seal)', fontSize: '0.72rem', lineHeight: 1.5 }}>
        {SLICES.map((s) => (
          <li key={s.label}>
            {s.label} · weight {s.w}/{TOTAL_W}
            {s.mult ? ` · pays ${s.mult}×` : ''}
          </li>
        ))}
      </ul>

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
        Spin check
      </button>
      <ConfirmSheet
        open={sheet}
        title="Spin check"
        cta="Spin it"
        lines={[`Stake: ${stake} ${asset}`, 'House edge ~7% baked into weights']}
        onCancel={() => setSheet(false)}
        onConfirm={spin}
      />
      <WinLoseOverlay
        open={!!result}
        win={result?.win ?? null}
        headline={result?.headline ?? ''}
        detail={result?.detail}
        onAgain={() => {
          setResult(null)
          setSheet(true)
        }}
        onClose={() => setResult(null)}
      />
      <TreasuryCopy />
      <FunOnly />
    </div>
  )
}
