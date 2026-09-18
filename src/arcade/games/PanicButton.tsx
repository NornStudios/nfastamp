import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { simulateEdgeSnack } from '../economy'
import { ChipSelector } from '../components/ChipSelector'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EdgeBanner, FunOnly, TreasuryCopy } from '../components/EdgeChrome'
import { WinLoseOverlay } from '../components/WinLoseOverlay'

const PAY = 2.2 // window is ~42% of time-ish → edge ~7% with this payout

export function PanicButtonGame() {
  const { balance, asset, setAsset, debit, credit } = useChips()
  const [stake, setStake] = useState(10)
  const [sheet, setSheet] = useState(false)
  const [live, setLive] = useState(false)
  const [inWindow, setInWindow] = useState(false)
  const [result, setResult] = useState<{
    win: boolean
    headline: string
    detail: string
  } | null>(null)
  const windowRef = useRef(false)

  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => {
      const on = Math.random() < 0.42
      windowRef.current = on
      setInWindow(on)
    }, 420)
    return () => window.clearInterval(id)
  }, [live])

  function arm() {
    if (!debit(stake)) return
    setSheet(false)
    setResult(null)
    setLive(true)
  }

  function panic() {
    if (!live) return
    setLive(false)
    const snack = simulateEdgeSnack(stake)
    if (windowRef.current) {
      const payout = +(stake * PAY).toFixed(2)
      credit(payout)
      setResult({
        win: true,
        headline: 'PANIC TIMED',
        detail: `+${payout} ${asset}. Window + payout published. Edge ~7%.`,
      })
    } else {
      setResult({
        win: false,
        headline: 'Missed.',
        detail: `House snack. ${snack.buyback} buyback · ${snack.treasury} treasury.`,
      })
    }
  }

  return (
    <div className="arc-game">
      <p>
        <Link to="/arcade">← Floor</Link>
      </p>
      <div className="arc-game__head">
        <div className="arc-callout-row" style={{ justifyContent: 'center' }}>
          <span className="arc-callout arc-callout--stamp">Edge ~7%</span>
          <span className="arc-callout">FAKE CHART</span>
        </div>
        <h1>Panic Button</h1>
        <p className="lede">Fake chart spikes. Tap Panic in the window.</p>
      </div>
      <EdgeBanner compact />
      <div className="arc-chart" aria-hidden>
        <div className="arc-chart__line" />
        {inWindow ? <div className="arc-chart__window" /> : null}
        <img
          src="/media/nfa/sticker-pack/panic.png"
          alt=""
          style={{
            position: 'absolute',
            right: 8,
            bottom: 4,
            width: 64,
            opacity: inWindow ? 1 : 0.35,
          }}
        />
      </div>
      <ChipSelector
        stake={stake}
        onStake={setStake}
        asset={asset}
        onAsset={setAsset}
        balance={balance}
      />
      {!live ? (
        <button
          type="button"
          className="arc-cta"
          disabled={stake > balance}
          onClick={() => setSheet(true)}
        >
          Arm panic
        </button>
      ) : (
        <button type="button" className="arc-cta" onClick={panic}>
          PANIC
        </button>
      )}
      <ConfirmSheet
        open={sheet}
        title="Panic check"
        cta="Arm it"
        lines={[
          `Stake: ${stake} ${asset}`,
          `Win pays: ${PAY}× if you tap in the dashed window`,
          'Long-run edge ~7%',
        ]}
        onCancel={() => setSheet(false)}
        onConfirm={arm}
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
