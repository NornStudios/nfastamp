import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { WIN_MULTIPLIER, simulateEdgeSnack } from '../economy'
import { ChipSelector } from '../components/ChipSelector'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EdgeBanner, FunOnly, TreasuryCopy } from '../components/EdgeChrome'
import { WinLoseOverlay } from '../components/WinLoseOverlay'

type Side = 'INK' | 'BLANK'

type Props = {
  title?: string
  lede?: string
  inkLabel?: string
  blankLabel?: string
}

export function StampFlipGame({
  title = 'Stamp Flip',
  lede = 'Ink or blank. One slam. House keeps five.',
  inkLabel = 'INK',
  blankLabel = 'BLANK',
}: Props) {
  const { balance, asset, setAsset, debit, credit } = useChips()
  const [stake, setStake] = useState(10)
  const [side, setSide] = useState<Side>('INK')
  const [sheet, setSheet] = useState(false)
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState<'idle' | 'slam' | 'inked' | 'blank'>('idle')
  const [showSticker, setShowSticker] = useState(false)
  const [result, setResult] = useState<{
    win: boolean
    headline: string
    detail: string
  } | null>(null)

  function openSheet() {
    if (busy || stake > balance) return
    setSheet(true)
  }

  function slam() {
    if (busy) return
    if (!debit(stake)) return
    setSheet(false)
    setBusy(true)
    setResult(null)
    setShowSticker(false)
    setStage('slam')

    const outcome: Side = Math.random() < 0.5 ? 'INK' : 'BLANK'
    const win = outcome === side
    const snack = simulateEdgeSnack(stake)

    window.setTimeout(() => {
      setStage(outcome === 'INK' ? 'inked' : 'blank')
      setShowSticker(true)
      if (win) {
        const payout = +(stake * WIN_MULTIPLIER).toFixed(2)
        credit(payout)
        setResult({
          win: true,
          headline: 'INKED!',
          detail: `+${payout} ${asset} · Still NFA. Edge snack simulated: ${snack.buyback} buyback / ${snack.treasury} treasury.`,
        })
      } else {
        setResult({
          win: false,
          headline: blankLabel === 'SINK' ? 'SUNK.' : 'Blank.',
          detail: `Thanks for the snack. House edge was 5%. Split demo: ${snack.buyback} buyback · ${snack.treasury} treasury.`,
        })
      }
      setBusy(false)
    }, 650)
  }

  return (
    <div className="arc-game">
      <p>
        <Link to="/arcade">← Floor</Link>
      </p>
      <div className="arc-game__head">
        <div className="arc-callout-row" style={{ justifyContent: 'center' }}>
          <span className="arc-callout arc-callout--stamp">House edge 5%</span>
          <span className="arc-callout">Poster honesty</span>
        </div>
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
      </div>

      <EdgeBanner compact />

      <div
        className={`arc-stage ${stage === 'slam' ? 'slam' : ''} ${stage === 'inked' ? 'inked' : ''} ${stage === 'blank' ? 'blank' : ''} ${showSticker ? 'show-sticker' : ''}`}
        aria-hidden
      >
        <div className="ink-bloom" />
        <img
          className="sticker-slap"
          src={
            stage === 'inked'
              ? '/media/nfa/arcade/inked-sticker.svg'
              : stage === 'blank'
                ? '/media/nfa/sticker-pack/smug.png'
                : '/media/nfa/arcade/starburst.svg'
          }
          alt=""
        />
        <span className="seal">
          {stage === 'blank' ? blankLabel : stage === 'inked' ? 'NFA' : 'NFA'}
        </span>
      </div>

      <ChipSelector
        stake={stake}
        onStake={setStake}
        asset={asset}
        onAsset={setAsset}
        balance={balance}
      />

      <label className="arc-label">Side</label>
      <div className="arc-row">
        <button
          type="button"
          className={side === 'INK' ? 'active' : ''}
          onClick={() => setSide('INK')}
        >
          {inkLabel}
        </button>
        <button
          type="button"
          className={side === 'BLANK' ? 'active' : ''}
          onClick={() => setSide('BLANK')}
        >
          {blankLabel}
        </button>
      </div>
      <p className="arc-label">Pick a side. We&apos;ll still take 5%.</p>

      <button
        type="button"
        className="arc-cta"
        disabled={busy || stake > balance}
        onClick={openSheet}
      >
        Slam check
      </button>

      <ConfirmSheet
        open={sheet}
        lines={[
          `Stake: ${stake} ${asset}`,
          `Side: ${side === 'INK' ? inkLabel : blankLabel}`,
          `Win pays: 1.90× → ${(stake * WIN_MULTIPLIER).toFixed(2)} ${asset}`,
        ]}
        onCancel={() => setSheet(false)}
        onConfirm={slam}
      />

      <WinLoseOverlay
        open={!!result}
        win={result?.win ?? null}
        headline={result?.headline ?? ''}
        detail={result?.detail}
        onAgain={() => {
          setResult(null)
          setStage('idle')
          setShowSticker(false)
          openSheet()
        }}
        onClose={() => {
          setResult(null)
          setStage('idle')
          setShowSticker(false)
        }}
      />

      <TreasuryCopy />
      <FunOnly />
    </div>
  )
}
