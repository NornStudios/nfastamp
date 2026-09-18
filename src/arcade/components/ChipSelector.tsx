import type { Asset } from '../chips'

const PRESETS = [5, 10, 25, 50, 100] as const

type Props = {
  stake: number
  onStake: (n: number) => void
  asset: Asset
  onAsset: (a: Asset) => void
  balance: number
  max?: number
}

export function ChipSelector({
  stake,
  onStake,
  asset,
  onAsset,
  balance,
  max = 100,
}: Props) {
  return (
    <div className="arc-chips">
      <div className="arc-chips__bal">
        Balance: <strong>{balance.toFixed(0)}</strong> DEMO
      </div>
      <label className="arc-label">Currency</label>
      <div className="arc-row">
        {(['NFA', 'USDC'] as const).map((a) => (
          <button
            key={a}
            type="button"
            className={asset === a ? 'active' : ''}
            onClick={() => onAsset(a)}
          >
            {a}
          </button>
        ))}
      </div>
      <label className="arc-label" htmlFor="arc-stake">
        Stake
      </label>
      <div className="arc-row arc-row--presets">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            className={stake === p ? 'active' : ''}
            disabled={p > balance}
            onClick={() => onStake(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <input
        id="arc-stake"
        type="range"
        min={1}
        max={Math.min(max, Math.max(1, Math.floor(balance)))}
        value={Math.min(stake, balance || 1)}
        onChange={(e) => onStake(Number(e.target.value))}
      />
      <div className="arc-stake-read">
        {stake} {asset}
      </div>
    </div>
  )
}
