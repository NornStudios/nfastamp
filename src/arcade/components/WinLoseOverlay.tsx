type Props = {
  open: boolean
  title?: string
  win: boolean | null
  headline: string
  detail?: string
  onAgain: () => void
  onClose: () => void
}

export function WinLoseOverlay({
  open,
  title = 'Result',
  win,
  headline,
  detail,
  onAgain,
  onClose,
}: Props) {
  if (!open) return null
  const deco =
    win === true
      ? '/media/nfa/arcade/inked-sticker.svg'
      : win === false
        ? '/media/nfa/sticker-pack/smug.png'
        : '/media/nfa/arcade/starburst.svg'
  return (
    <div className="arc-overlay" role="dialog" aria-label={title}>
      <div
        className={`arc-overlay__panel${win === true ? ' win' : ''}${win === false ? ' lose' : ''}`}
      >
        <img className="arc-overlay__deco" src={deco} alt="" aria-hidden />
        <h2>{headline}</h2>
        {detail ? <p>{detail}</p> : null}
        <div className="arc-overlay__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn btn--stamp" onClick={onAgain}>
            Again
          </button>
        </div>
      </div>
    </div>
  )
}
