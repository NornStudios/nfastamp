import { useState } from 'react'
import { LINKS, PONS_CTA } from './config'

const ROADMAP = [
  {
    id: 'rh',
    label: '01',
    title: 'Pons · Robinhood Chain',
    status: 'Live · 4663',
    accent: 'stamp' as const,
    body: 'Primary path — live on Pons (Robinhood Chain). Official CA on this site. Locked pad liquidity via Pons — no DIY LP from us. Base and Solana are later stories, not this market.',
  },
  {
    id: 'base',
    label: '02',
    title: 'Stonks · Base',
    status: 'Ready · later',
    accent: 'chart' as const,
    body: 'Companion ready for later — Stonks Exchange on Base. Same brand and ticker when we ship it. Separate contract — no bridge, no unified supply. Not this sitting.',
  },
  {
    id: 'sol',
    label: '03',
    title: 'Solana later',
    status: 'Future',
    accent: 'ink' as const,
    body: 'Solana launchpad path comes after EVM brand has its run. Not live. Separate mint if/when — never invent unified supply across chains.',
  },
]

const STICKERS = [
  { file: 'wink.png', label: 'Wink' },
  { file: 'panic.png', label: 'Panic' },
  { file: 'smug.png', label: 'Smug' },
  { file: 'stamp-slam.png', label: 'Stamp slam' },
  { file: 'shrug.png', label: 'Shrug' },
] as const

function media(path: string) {
  return `/media/nfa/${path}`
}

function shortCa(value: string) {
  if (value === 'TBD' || value.length < 12) return value
  return `${value.slice(0, 6)}…${value.slice(-4)}`
}

export default function App() {
  const [copied, setCopied] = useState(false)
  const caReady = LINKS.contract !== 'TBD'

  function copyPrimaryCa() {
    if (!caReady) return
    void navigator.clipboard.writeText(LINKS.contract).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    })
  }

  return (
    <div className="page">
      <div className="paper-grain" aria-hidden="true" />

      <header className="top">
        <a className="brand" href="#top" id="top">
          <img
            src={media('logo-horizontal.png')}
            alt="NFA — Not Financial Advice"
            className="brand__logo"
            width={220}
            height={73}
          />
        </a>
        <nav className="nav" aria-label="Primary">
          <a href="#what">What</a>
          <a href="#path">Path</a>
          <a href="#stickers">Stickers</a>
          <a href="#links">Links</a>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__visual">
            <img
              src={media('mascot-primary.png')}
              alt="Stampy NFA — friendly rubber-stamp mascot"
              className="hero__mascot"
              width={1024}
              height={1024}
            />
          </div>
          <div className="hero__copy">
            <p className="hero__brand-line">NFA</p>
            <h1 id="hero-title" className="hero__title">
              The disclaimer became the mascot.
            </h1>
            <p className="hero__lede">
              Every trader’s favorite escape hatch — now a character you can
              sticker-spam. Live on Pons. A meme brand. Not a promise. Stamp
              it. Move on.
            </p>
            <div className="hero__ctas">
              <a
                className="btn btn--stamp"
                href={PONS_CTA}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Pons
              </a>
              <a
                className="btn btn--ghost"
                href={LINKS.explorer}
                target="_blank"
                rel="noopener noreferrer"
              >
                Explorer
              </a>
            </div>
          </div>
        </section>

        <section className="section what" id="what" aria-labelledby="what-title">
          <div className="section__head">
            <h2 id="what-title">What NFA is</h2>
            <p>
              We put the disclaimer on the outside. Self-aware meme about
              disclaimer culture — entertainment token energy, not an investment
              product.
            </p>
          </div>
          <div className="what__grid">
            <div className="what__seal">
              <img
                src={media('logo-mark.svg')}
                alt="NFA circular stamp mark"
                className="what__seal-img"
                width={320}
                height={320}
              />
            </div>
            <ul className="what__points">
              <li>
                <strong>Meme brand first.</strong> Irony that still tells the
                truth — we publish a real risk disclaimer. Not financial advice.
                Still a vibe.
              </li>
              <li>
                <strong>Ticker:</strong> <code>NFA</code> (alts{' '}
                <code>NOTFA</code> / <code>DYOR</code> if needed).
              </li>
              <li>
                <strong>Pons on Robinhood Chain.</strong> Live now — official
                CA on this site. Base companion (Stonks) ready for later:
                separate contract, no bridge, no unified supply. Not affiliated
                with Robinhood, Pons, Coinbase, or any equity issuer. Holding
                NFA is not ownership of any stock.
              </li>
              <li>
                <strong>No price promises.</strong> Crypto is volatile — you can
                lose everything. DYOR, then DYOR again.
              </li>
            </ul>
          </div>
        </section>

        <section className="section path" id="path" aria-labelledby="path-title">
          <div className="section__head">
            <h2 id="path-title">Launch path</h2>
            <p>
              Robinhood Chain first via Pons — live with the official CA. Base /
              Stonks later. Solana later — only as its own mint story.
            </p>
          </div>
          <ol className="path__list">
            {ROADMAP.map((step) => (
              <li
                key={step.id}
                className={`path__item path__item--${step.accent}`}
              >
                <div className="path__meta">
                  <span className="path__num">{step.label}</span>
                  <span className="path__status">{step.status}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="section stickers"
          id="stickers"
          aria-labelledby="stickers-title"
        >
          <div className="section__head">
            <h2 id="stickers-title">Sticker pack</h2>
            <p>
              Reaction faces for charts that hurt, charts that tease, and stamps
              that slam.
            </p>
          </div>
          <ul className="stickers__row">
            {STICKERS.map((s) => (
              <li key={s.file} className="stickers__item">
                <img
                  src={media(`sticker-pack/${s.file}`)}
                  alt={`${s.label} NFA sticker`}
                  width={512}
                  height={512}
                  loading="lazy"
                />
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="section links" id="links" aria-labelledby="links-title">
          <div className="section__head">
            <h2 id="links-title">Official links</h2>
            <p>
              Contract and pad links live here — never trust DMs. Verify the CA
              on the explorer before you do anything.
            </p>
          </div>
          <div className="links__row">
            <a className="link-chip" href={LINKS.x}>
              <span className="link-chip__label">X / Twitter</span>
              <span className="link-chip__value">@TBD</span>
            </a>
            <a className="link-chip" href={LINKS.telegram}>
              <span className="link-chip__label">Telegram</span>
              <span className="link-chip__value">t.me/TBD</span>
            </a>
            <a
              className="link-chip"
              href={LINKS.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="link-chip__label">Site</span>
              <span className="link-chip__value">nfastamp.fun</span>
            </a>
            <a
              className="link-chip"
              href={PONS_CTA}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="link-chip__label">Pad · RH</span>
              <span className="link-chip__value">Pons</span>
            </a>
            <a
              className="link-chip"
              href={LINKS.explorer}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="link-chip__label">Explorer</span>
              <span className="link-chip__value">Blockscout</span>
            </a>
            <a
              className="link-chip"
              href={LINKS.launchpadBase}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="link-chip__label">Pad · Base (later)</span>
              <span className="link-chip__value">Stonks</span>
            </a>
            <a className="link-chip" href={LINKS.dexscreener}>
              <span className="link-chip__label">DexScreener</span>
              <span className="link-chip__value">
                {LINKS.dexscreener === '#' ? 'Soon' : 'Open'}
              </span>
            </a>
            <button
              type="button"
              className="link-chip link-chip--ca"
              onClick={copyPrimaryCa}
              title="Copy official RH CA"
            >
              <span className="link-chip__label">
                CA · RH {copied ? '· Copied' : '· Copy'}
              </span>
              <span className="link-chip__value">
                {shortCa(LINKS.contract)}
              </span>
            </button>
            <div
              className="link-chip link-chip--ca link-chip--muted"
              title="Base companion later only"
            >
              <span className="link-chip__label">CA · Base (later)</span>
              <span className="link-chip__value">{LINKS.contractBase}</span>
            </div>
          </div>
          <p className="links__note">
            Official CA:{' '}
            <code>{LINKS.contract}</code>. Base CA later if we ship a companion:{' '}
            <code>{LINKS.contractBase}</code>. No official bridge. Always verify
            on a block explorer. DYOR.
          </p>
        </section>
      </main>

      <footer className="footer" id="disclaimer">
        <div className="footer__brand">
          <img
            src={media('logo-mark.svg')}
            alt=""
            className="footer__mark"
            width={56}
            height={56}
          />
          <p className="footer__tag">Not Financial Advice · meme brand</p>
        </div>
        <div className="footer__legal">
          <p>
            <strong>Not financial advice.</strong> NFA (“Not Financial Advice”)
            is a community meme token created for entertainment. Nothing on our
            channels is an offer, solicitation, or recommendation to buy or sell
            any asset. Digital assets are highly volatile and may lose all
            value. There are no guaranteed returns or partnerships. Contract
            addresses will be published only on official channels — never trust
            DMs. NFA is <strong>not</strong> affiliated with or endorsed by
            Robinhood Markets, Inc., Pons, Coinbase, Stonks Exchange, or any
            stock issuer, and holding NFA is <strong>not</strong> ownership of
            any equity. Launch path: Robinhood Chain via Pons (live); Base /
            Stonks companion ready for later. If both contracts exist, same
            brand/ticker, separate markets; <strong>no official bridge</strong>.
            Always verify each contract on a block explorer and do your own
            research.
          </p>
          <p>
            Solana mentions describe a possible future second-market path only.
            No Solana mint is live from this site until an official CA is pinned.
            Same joke. Separate contracts per chain.
          </p>
        </div>
        <p className="footer__copy">
          © {new Date().getFullYear()} NFA ·{' '}
          <a href={LINKS.siteUrl}>nfastamp.fun</a>. Stamp it. Move on.
        </p>
      </footer>
    </div>
  )
}
