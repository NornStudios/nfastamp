import { Link } from 'react-router-dom'
import { EdgeBanner, FunOnly, TreasuryCopy } from './components/EdgeChrome'
import { GAMES } from './games'
import { isUnlocked, getUnlockAt } from './dripSchedule'

const STICKERS = [
  'wink.png',
  'panic.png',
  'smug.png',
  'stamp-slam.png',
  'shrug.png',
] as const

export function ArcadeHome() {
  return (
    <>
      <section className="arc-hero-billboard" aria-labelledby="arc-title">
        <img
          className="arc-hero-billboard__burst"
          src="/media/nfa/arcade/seal-burst.svg"
          alt=""
          aria-hidden
        />
        <img
          className="arc-hero-billboard__mascot"
          src="/media/nfa/mascot-icon.png"
          alt=""
          aria-hidden
        />
        <h1 id="arc-title">NFA Arcade</h1>
        <p className="tag">House wins. We put it on the receipt.</p>
        <div className="arc-callout-row">
          <span className="arc-callout arc-callout--stamp">House edge 5%</span>
          <span className="arc-callout">
            Half buyback / holders · half treasury
          </span>
          <span className="arc-callout arc-callout--act">Act now</span>
        </div>
        <img
          className="arc-act-img"
          src="/media/nfa/arcade/act-now-banner.svg"
          alt="ACT NOW"
        />
      </section>

      <EdgeBanner />

      <div className="arc-grid">
        {GAMES.map((g, i) => {
          const open = isUnlocked(g.id)
          const sticker = STICKERS[i % STICKERS.length]
          const body = (
            <>
              <img
                className="arc-tile__sticker"
                src={`/media/nfa/sticker-pack/${sticker}`}
                alt=""
                aria-hidden
              />
              <span className="arc-tile__rank">No. {g.rank}</span>
              <h2>{g.title}</h2>
              <p>{g.lede}</p>
              <div className="arc-tile__meta">
                <span>Edge {g.edgeLabel}</span>
                <span>
                  {open
                    ? 'Open'
                    : `Locked · ${new Date(getUnlockAt(g.id)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
                </span>
              </div>
            </>
          )
          if (!open) {
            return (
              <div key={g.id} className="arc-tile locked" aria-disabled>
                {body}
                <strong style={{ fontFamily: 'var(--font-seal)', fontSize: '0.75rem' }}>
                  Coming soon — stamp&apos;s not dry
                </strong>
              </div>
            )
          }
          return (
            <Link key={g.id} className="arc-tile" to={`/arcade/${g.id}`}>
              {body}
            </Link>
          )
        })}
      </div>

      <TreasuryCopy />
      <FunOnly />
    </>
  )
}
