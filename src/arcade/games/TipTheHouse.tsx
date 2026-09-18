import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { ChipSelector } from '../components/ChipSelector'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { EdgeBanner, FunOnly, TreasuryCopy } from '../components/EdgeChrome'
import { WinLoseOverlay } from '../components/WinLoseOverlay'

export function TipTheHouseGame() {
  const { balance, asset, setAsset, debit } = useChips()
  const [stake, setStake] = useState(5)
  const [sheet, setSheet] = useState(false)
  const [result, setResult] = useState(false)

  function tip() {
    if (!debit(stake)) return
    setSheet(false)
    setResult(true)
  }

  return (
    <div className="arc-game">
      <p>
        <Link to="/arcade">← Floor</Link>
      </p>
      <div className="arc-game__head">
        <div className="arc-callout-row" style={{ justifyContent: 'center' }}>
          <span className="arc-callout arc-callout--stamp">Edge 100%</span>
          <span className="arc-callout">Not a game</span>
        </div>
        <h1>Tip the House</h1>
        <p className="lede">No win condition. You tip. The honesty is the bit.</p>
      </div>
      <EdgeBanner compact />
      <img
        src="/media/nfa/sticker-pack/wink.png"
        alt=""
        width={140}
        height={140}
        style={{ display: 'block', margin: '0 auto 1rem' }}
      />
      <ChipSelector
        stake={stake}
        onStake={setStake}
        asset={asset}
        onAsset={setAsset}
        balance={balance}
        max={50}
      />
      <button
        type="button"
        className="arc-cta"
        disabled={stake > balance}
        onClick={() => setSheet(true)}
      >
        Feed Stampy
      </button>
      <ConfirmSheet
        open={sheet}
        title="Tip jar"
        cta="Feed Stampy"
        includeEdgeSplit={false}
        lines={[
          `Tip: ${stake} ${asset}`,
          'Edge: 100%. No flip. Just vibes.',
          'Half of tips still roleplay as buyback/treasury in v1.',
        ]}
        onCancel={() => setSheet(false)}
        onConfirm={tip}
      />
      <WinLoseOverlay
        open={result}
        win={false}
        headline="Thanks. Still NFA."
        detail={`You tipped ${stake} ${asset}. Edge was 100%. You saw it.`}
        onAgain={() => {
          setResult(false)
          setSheet(true)
        }}
        onClose={() => setResult(false)}
      />
      <TreasuryCopy />
      <FunOnly />
    </div>
  )
}
