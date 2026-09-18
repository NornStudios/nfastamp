import { DEMO_BANNER, EDGE_BADGE, EDGE_SPLIT_LINE, FUN_ONLY } from '../economy'

export function DemoBanner() {
  return (
    <div className="arc-demo" role="status">
      {DEMO_BANNER}
    </div>
  )
}

export function EdgeBanner({ compact }: { compact?: boolean }) {
  return (
    <div className={`arc-edge${compact ? ' arc-edge--compact' : ''}`}>
      <strong>{EDGE_BADGE}</strong>
      <span>{EDGE_SPLIT_LINE}</span>
    </div>
  )
}

export function FunOnly() {
  return <p className="arc-fun">{FUN_ONLY}</p>
}

export function TreasuryCopy() {
  return (
    <div className="arc-treasury">
      <p className="arc-callout arc-callout--stamp" style={{ display: 'inline-flex', marginBottom: '0.65rem' }}>
        Poster callout
      </p>
      <p>{EDGE_SPLIT_LINE}</p>
      <p>
        Arcade Treasury (half the edge / 2.5% of stake): TBD — demo only. v1
        wallet hook ready.
      </p>
      <p>
        Buyback pool (half the edge / 2.5% of stake): buy NFA on Pons → burn
        and/or distribute to holders. Receipts when we post them.
      </p>
    </div>
  )
}
