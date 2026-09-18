import type { GameId } from './dripSchedule'

export interface GameMeta {
  id: GameId
  title: string
  lede: string
  edgeLabel: string
  rank: number
  /** Games that take demo chips as bets */
  wagering: boolean
}

export const GAMES: readonly GameMeta[] = [
  {
    id: 'stamp-flip',
    title: 'Stamp Flip',
    lede: 'Ink or blank. One slam. House keeps five.',
    edgeLabel: '5%',
    rank: 1,
    wagering: true,
  },
  {
    id: 'ink-or-sink',
    title: 'Ink or Sink',
    lede: 'Same Flip math. Pick INK or SINK. Panic on L.',
    edgeLabel: '5%',
    rank: 2,
    wagering: true,
  },
  {
    id: 'disclaimer-wheel',
    title: 'Disclaimer Wheel',
    lede: 'Spin the seal. Most slices say NFA (you lose).',
    edgeLabel: '7%',
    rank: 3,
    wagering: true,
  },
  {
    id: 'dyor-dice',
    title: 'DYOR Dice',
    lede: '2d6 over/under. Table on screen. Edge in the payouts.',
    edgeLabel: '5%',
    rank: 4,
    wagering: true,
  },
  {
    id: 'scratch-disclaimer',
    title: 'Scratch Disclaimer',
    lede: 'Scratch three seals. Triple NFA = rare hit.',
    edgeLabel: '~9%',
    rank: 5,
    wagering: true,
  },
  {
    id: 'panic-button',
    title: 'Panic Button',
    lede: 'Fake chart spikes. Tap Panic in the window.',
    edgeLabel: '~7%',
    rank: 6,
    wagering: true,
  },
  {
    id: 'rubber-rps',
    title: 'Rubber RPS',
    lede: 'Stamp / clipboard / ink-bottle vs Stampy. 1.90×.',
    edgeLabel: '5%',
    rank: 7,
    wagering: true,
  },
  {
    id: 'tip-the-house',
    title: 'Tip the House',
    lede: 'No win condition. You tip. Edge = 100%.',
    edgeLabel: '100%',
    rank: 8,
    wagering: true,
  },
  {
    id: 'cosmetics-closet',
    title: 'Cosmetics Closet',
    lede: 'Buy pad colors with demo chips. No payout RNG.',
    edgeLabel: 'N/A',
    rank: 9,
    wagering: false,
  },
  {
    id: 'high-score-slam',
    title: 'High-Score Slam',
    lede: 'Free timing toy. Tip demo chips to pin your score.',
    edgeLabel: 'tips',
    rank: 10,
    wagering: false,
  },
] as const

export function getGame(id: string): GameMeta | undefined {
  return GAMES.find((g) => g.id === id)
}
