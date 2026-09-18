import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { simulateEdgeSnack } from '../economy'
import { ChipSelector } from '../components/ChipSelector'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EdgeBanner, FunOnly, TreasuryCopy } from '../components/EdgeChrome'
import { WinLoseOverlay } from '../components/WinLoseOverlay'

type Bet = 'under' | 'over' | 'seven'

/** Payouts underpay true odds → ~5% edge. */
const PAY: Record<Bet, number> = {
  under: 1.9, // true ~2.0 for under 7? actually P(under7)=15/36, fair~2.4 — we pay 1.9
  over: 1.9,
  seven: 4.5, // true 6× for 6/36
}

export function DyorDiceGame() {
  const { balance, asset, setAsset, debit, credit } = useChips()
  const [stake, setStake] = useState(10)
  const [bet, setBet] = useState<Bet>('under')
  const [sheet, setSheet] = useState(false)
  const [dice, setDice] = useState<[number, number]>([3, 4])
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState<{
    win: boolean
    headline: string
    detail: string
  } | null>(null)

  function roll() {
    if (rolling || !debit(stake)) return
    setSheet(false)
    setRolling(true)
    const d1 = 1 + Math.floor(Math.random() * 6)
    const d2 = 1 + Math.floor(Math.random() * 6)
    const total = d1 + d2
    const snack = simulateEdgeSnack(stake)

    window.setTimeout(() => {
      setDice([d1, d2])
      const win =
        (bet === 'under' && total < 7) ||
        (bet === 'over' && total > 7) ||
        (bet === 'seven' && total === 7)
      if (win) {
        const payout = +(stake * PAY[bet]).toFixed(2)
        credit(payout)
        setResult({
          win: true,
          headline: `${d1}+${d2}=${total}`,
          detail: `+${payout} ${asset}. DYOR again. Edge in the payouts (~5%).`,
        })
      } else {
        setResult({
          win: false,
          headline: `${d1}+${d2}=${total}`,
          detail: `House snack. Split demo: ${snack.buyback} buyback · ${snack.treasury} treasury.`,
        })
      }
      setRolling(false)
    }, 550)
  }

  return (
    <div className="arc-game">
      <p>
        <Link to="/arcade">← Floor</Link>
      </p>
      <div className="arc-game__head">
        <div className="arc-callout-row" style={{ justifyContent: 'center' }}>
          <span className="arc-callout arc-callout--stamp">Edge ~5%</span>
          <span className="arc-callout">Table on screen</span>
        </div>
        <h1>DYOR Dice</h1>
        <p className="lede">2d6 over/under. Edge in the payouts.</p>
      </div>
      <EdgeBanner compact />
      <div className="arc-dice">
        <div className={`arc-die${rolling ? ' roll' : ''}`}>{dice[0]}</div>
        <div className={`arc-die${rolling ? ' roll' : ''}`}>{dice[1]}</div>
      </div>
      <p style={{ fontFamily: 'var(--font-seal)', fontSize: '0.75rem', textAlign: 'center' }}>
        Under 7 → {PAY.under}× · Over 7 → {PAY.over}× · Exactly 7 → {PAY.seven}×
      </p>
      <label className="arc-label">Bet</label>
      <div className="arc-row">
        {(
          [
            ['under', 'Under 7'],
            ['over', 'Over 7'],
            ['seven', 'Seven'],
          ] as const
        ).map(([k, lab]) => (
          <button
            key={k}
            type="button"
            className={bet === k ? 'active' : ''}
            onClick={() => setBet(k)}
          >
            {lab}
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
        disabled={rolling || stake > balance}
        onClick={() => setSheet(true)}
      >
        Roll check
      </button>
      <ConfirmSheet
        open={sheet}
        title="Roll check"
        cta="Roll it"
        lines={[
          `Stake: ${stake} ${asset}`,
          `Bet: ${bet}`,
          `Win pays: ${PAY[bet]}×`,
        ]}
        onCancel={() => setSheet(false)}
        onConfirm={roll}
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
