/**
 * Arcade economy — transparent house edge + 50/50 split.
 * v0 demo simulates in copy; v1 plugs real buyback/treasury wallets here.
 */

export const HOUSE_EDGE = 0.05
export const WIN_MULTIPLIER = 1.9

/** Of the 5% edge: half → buyback/holders, half → treasury. */
export const EDGE_OF_STAKE = {
  buyback: 0.025,
  treasury: 0.025,
} as const

export const EDGE_BADGE = 'House edge 5% — shown before you play'

export const EDGE_SPLIT_LINE =
  'House edge 5% — half buyback/burn or Pons→holders, half treasury.'

export const FUN_ONLY = 'Entertainment only. You can lose. NFA.'

export const DEMO_BANNER = 'DEMO CHIPS — fake balance, real attitude'

export const LOCKED_COPY = "Coming soon — stamp's not dry"

/** v1 hooks — replace placeholders when paid routing ships. */
export const ROUTING_HOOKS = {
  treasuryAddress: 'TBD',
  buybackAddress: 'TBD',
  mode: 'demo' as 'demo' | 'paid',
}

export function edgeSplitConfirmLines(): string[] {
  return [
    'House edge: 5%',
    'Split: 2.5% buyback/burn or Pons→holders · 2.5% arcade treasury',
  ]
}

export function simulateEdgeSnack(stake: number): {
  buyback: number
  treasury: number
} {
  return {
    buyback: +(stake * EDGE_OF_STAKE.buyback).toFixed(4),
    treasury: +(stake * EDGE_OF_STAKE.treasury).toFixed(4),
  }
}
