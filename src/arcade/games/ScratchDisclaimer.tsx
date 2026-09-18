import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { simulateEdgeSnack } from '../economy'
import { ChipSelector } from '../components/ChipSelector'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EdgeBanner, FunOnly, TreasuryCopy } from '../components/EdgeChrome'
import { WinLoseOverlay } from '../components/WinLoseOverlay'

const SYMBOLS = ['NFA', 'DYOR', '???', 'BLANK'] as const
/** ~9% edge: P(triple NFA) low, pays 12× on fixed ticket. */
const TRIPLE_PAY = 12

function drawSeal(): (typeof SYMBOLS)[number] {
  const r = Math.random()
  if (r < 0.22) return 'NFA'
  if (r < 0.45) return 'DYOR'
  if (r < 0.7) return '???'
  return 'BLANK'
}

export function ScratchDisclaimerGame() {
  const { balance, asset, setAsset, debit, credit } = useChips()
  const [stake, setStake] = useState(10)
  const [sheet, setSheet] = useState(false)
  const [seals, setSeals] = useState<(string | null)[]>([null, null, null])
  const [hidden, setHidden] = useState<string[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{
    win: boolean
    headline: string
    detail: string
  } | null>(null)

  function buyTicket() {
    if (busy || !debit(stake)) return
    setSheet(false)
    setBusy(true)
    setResult(null)
    const drawn = [drawSeal(), drawSeal(), drawSeal()]
    setHidden(drawn)
    setSeals([null, null, null])
    setBusy(false)
  }

  function scratch(i: number) {
    if (!hidden || seals[i] != null) return
    const next = [...seals]
    next[i] = hidden[i]
    setSeals(next)
    if (next.every((x) => x != null)) {
      const snack = simulateEdgeSnack(stake)
      const win = next.every((x) => x === 'NFA')
      if (win) {
        const payout = +(stake * TRIPLE_PAY).toFixed(2)
        credit(payout)
        setResult({
          win: true,
          headline: 'TRIPLE NFA',
          detail: `+${payout} ${asset}. Rare hit. Edge ~9%.`,
        })
      } else {
        setResult({
          win: false,
          headline: 'Still not advice.',
          detail: `${next.join(' · ')}. Snack: ${snack.buyback} buyback · ${snack.treasury} treasury.`,
        })
      }
    }
  }

  return (
    <div className="arc-game">
      <p>
        <Link to="/arcade">← Floor</Link>
      </p>
      <div className="arc-game__head">
        <div className="arc-callout-row" style={{ justifyContent: 'center' }}>
          <span className="arc-callout arc-callout--stamp">Edge ~9%</span>
          <span className="arc-callout">Triple NFA = hit</span>
        </div>
        <h1>Scratch Disclaimer</h1>
        <p className="lede">Scratch three seals. Else: still not advice.</p>
      </div>
      <EdgeBanner compact />
      <div className="arc-scratch">
        {seals.map((s, i) => (
          <button
            key={i}
            type="button"
            className={`arc-seal-card${s ? ' revealed' : ''}`}
            onClick={() => scratch(i)}
            disabled={!hidden}
          >
            {s ?? 'SCRATCH'}
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
        disabled={busy || stake > balance || (!!hidden && seals.some((x) => x == null))}
        onClick={() => setSheet(true)}
      >
        Buy ticket
      </button>
      <ConfirmSheet
        open={sheet}
        title="Ticket check"
        cta="Buy it"
        lines={[
          `Ticket: ${stake} ${asset}`,
          `Triple NFA pays: ${TRIPLE_PAY}×`,
          'Odds card: rare hit, house keeps ~9%',
        ]}
        onCancel={() => setSheet(false)}
        onConfirm={buyTicket}
      />
      <WinLoseOverlay
        open={!!result}
        win={result?.win ?? null}
        headline={result?.headline ?? ''}
        detail={result?.detail}
        onAgain={() => {
          setResult(null)
          setHidden(null)
          setSeals([null, null, null])
          setSheet(true)
        }}
        onClose={() => setResult(null)}
      />
      <TreasuryCopy />
      <FunOnly />
    </div>
  )
}
