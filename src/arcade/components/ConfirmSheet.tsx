import { edgeSplitConfirmLines } from '../economy'

type Props = {
  open: boolean
  title?: string
  lines: string[]
  cta?: string
  cancel?: string
  onConfirm: () => void
  onCancel: () => void
  includeEdgeSplit?: boolean
}

export function ConfirmSheet({
  open,
  title = 'Slam check',
  lines,
  cta = 'Slam it',
  cancel = 'Not today',
  onConfirm,
  onCancel,
  includeEdgeSplit = true,
}: Props) {
  if (!open) return null
  const body = includeEdgeSplit
    ? [...lines, ...edgeSplitConfirmLines()]
    : lines
  return (
    <div className="arc-sheet" role="dialog" aria-label={title}>
      <h2>{title}</h2>
      <div className="arc-sheet__body">
        {body.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div className="arc-sheet__actions">
        <button type="button" onClick={onCancel}>
          {cancel}
        </button>
        <button type="button" className="go" onClick={onConfirm}>
          {cta}
        </button>
      </div>
    </div>
  )
}
