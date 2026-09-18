import type { ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { LockedGate } from '../components/LockedGate'
import type { GameId } from '../dripSchedule'
import { getGame } from '../games'
import { CosmeticsClosetGame } from './CosmeticsCloset'
import { DisclaimerWheelGame } from './DisclaimerWheel'
import { DyorDiceGame } from './DyorDice'
import { HighScoreSlamGame } from './HighScoreSlam'
import { InkOrSinkGame } from './InkOrSink'
import { PanicButtonGame } from './PanicButton'
import { RubberRpsGame } from './RubberRps'
import { ScratchDisclaimerGame } from './ScratchDisclaimer'
import { StampFlipGame } from './StampFlip'
import { TipTheHouseGame } from './TipTheHouse'

const MAP: Record<GameId, () => ReactNode> = {
  'stamp-flip': () => <StampFlipGame />,
  'ink-or-sink': () => <InkOrSinkGame />,
  'disclaimer-wheel': () => <DisclaimerWheelGame />,
  'dyor-dice': () => <DyorDiceGame />,
  'scratch-disclaimer': () => <ScratchDisclaimerGame />,
  'panic-button': () => <PanicButtonGame />,
  'rubber-rps': () => <RubberRpsGame />,
  'tip-the-house': () => <TipTheHouseGame />,
  'cosmetics-closet': () => <CosmeticsClosetGame />,
  'high-score-slam': () => <HighScoreSlamGame />,
}

export function GamePage() {
  const { gameId } = useParams()
  const meta = gameId ? getGame(gameId) : undefined
  if (!meta) return <Navigate to="/arcade" replace />

  const id = meta.id
  const render = MAP[id]

  return <LockedGate id={id}>{render()}</LockedGate>
}
