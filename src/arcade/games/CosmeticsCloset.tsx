import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChips } from '../ChipContext'
import { EdgeBanner, FunOnly } from '../components/EdgeChrome'

const SWATCHES = [
  { id: 'stamp', color: '#B8322F', price: 25 },
  { id: 'ink', color: '#1C1B19', price: 25 },
  { id: 'paper', color: '#E8E2D4', price: 15 },
  { id: 'blush', color: '#E8A09A', price: 20 },
  { id: 'chart', color: '#1F7A4C', price: 40 },
  { id: 'cream', color: '#FFFBF5', price: 15 },
] as const

const KEY = 'nfa-arcade-cosmetics-v0'

export function CosmeticsClosetGame() {
  const { balance, debit } = useChips()
  const [owned, setOwned] = useState<string[]>(['stamp'])
  const [active, setActive] = useState('stamp')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { owned: string[]; active: string }
        setOwned(parsed.owned)
        setActive(parsed.active)
      }
    } catch {
      /* ignore */
    }
  }, [])

  function persist(nextOwned: string[], nextActive: string) {
    setOwned(nextOwned)
    setActive(nextActive)
    localStorage.setItem(
      KEY,
      JSON.stringify({ owned: nextOwned, active: nextActive }),
    )
  }

  function buy(id: string, price: number) {
    if (owned.includes(id)) {
      persist(owned, id)
      setMsg('Equipped. No payout RNG — you bought a sticker.')
      return
    }
    if (!debit(price)) {
      setMsg('Not enough demo chips.')
      return
    }
    persist([...owned, id], id)
    setMsg(`Bought ${id} for ${price} DEMO. Still NFA.`)
  }

  const pad = SWATCHES.find((s) => s.id === active)?.color ?? '#B8322F'

  return (
    <div className="arc-game">
      <p>
        <Link to="/arcade">← Floor</Link>
      </p>
      <div className="arc-game__head">
        <div className="arc-callout-row" style={{ justifyContent: 'center' }}>
          <span className="arc-callout">No payout RNG</span>
          <span className="arc-callout arc-callout--act">Closet</span>
        </div>
        <h1>Cosmetics Closet</h1>
        <p className="lede">Buy pad colors with demo chips. Soft utility.</p>
      </div>
      <EdgeBanner compact />
      <div
        className="arc-stage"
        style={{ background: pad }}
        aria-hidden
      >
        <span className="seal">NFA</span>
      </div>
      <p className="arc-chips__bal">
        Balance: <strong>{balance.toFixed(0)}</strong> DEMO
      </p>
      <div className="arc-cosmetics">
        {SWATCHES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`arc-swatch${owned.includes(s.id) ? ' owned' : ''}`}
            style={{ background: s.color }}
            title={`${s.id} · ${owned.includes(s.id) ? 'owned' : `${s.price} chips`}`}
            onClick={() => buy(s.id, s.price)}
          />
        ))}
      </div>
      {msg ? (
        <p style={{ fontFamily: 'var(--font-seal)', marginTop: '1rem' }}>{msg}</p>
      ) : null}
      <FunOnly />
    </div>
  )
}
