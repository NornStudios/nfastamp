import { Link } from 'react-router-dom'
import { LOCKED_COPY } from '../economy'
import { getUnlockAt, isUnlocked, type GameId } from '../dripSchedule'

type Props = {
  id: GameId
  children: React.ReactNode
}

export function LockedGate({ id, children }: Props) {
  if (isUnlocked(id)) return <>{children}</>

  const when = new Date(getUnlockAt(id))
  return (
    <div className="arc-locked">
      <p className="arc-locked__stamp">{LOCKED_COPY}</p>
      <p className="arc-locked__when">
        Unlocks {when.toUTCString()}
      </p>
      <Link className="btn btn--ghost" to="/arcade">
        Back to Arcade
      </Link>
    </div>
  )
}
