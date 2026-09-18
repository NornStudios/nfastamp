import { StampFlipGame } from './StampFlip'

/** Skin of Stamp Flip — same math, INK / SINK labels. */
export function InkOrSinkGame() {
  return (
    <StampFlipGame
      title="Ink or Sink"
      lede="Same Flip math. Pick INK or SINK. Panic sticker on L."
      inkLabel="INK"
      blankLabel="SINK"
    />
  )
}
