import { useEffect, useState } from 'react'
import { PONS_CTA } from '../config'
import {
  formatChange,
  formatUsdCompact,
  formatUsdPrice,
  loadNfaPrice,
  type NfaPriceQuote,
} from '../lib/price'

const REFRESH_MS = 45_000

export function PriceTicker() {
  const [quote, setQuote] = useState<NfaPriceQuote | null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    let alive = true
    async function pull() {
      try {
        const q = await loadNfaPrice()
        if (!alive) return
        setQuote(q)
        setErr(false)
      } catch {
        if (alive) setErr(true)
      }
    }
    void pull()
    const id = window.setInterval(() => void pull(), REFRESH_MS)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  const price = formatUsdPrice(quote?.priceUsd ?? null)
  const mcap = formatUsdCompact(quote?.marketCapUsd ?? null)
  const change = formatChange(quote?.change24h ?? null)
  const up = (quote?.change24h ?? 0) > 0
  const down = (quote?.change24h ?? 0) < 0
  const href = quote?.href && quote.href !== '#' ? quote.href : PONS_CTA

  const items = [
    `NFA ${price}`,
    quote?.priceUsd != null ? `MCAP ${mcap}` : 'Live on Pons',
    change ? `24h ${change}` : quote?.market ?? 'Bonding curve',
    'Not financial advice',
    'Stamp it. Move on.',
  ]

  return (
    <div className="price-ticker" role="region" aria-label="NFA price ticker">
      <a className="price-ticker__pin" href={href} target="_blank" rel="noopener noreferrer">
        <span className="price-ticker__sym">NFA</span>
        <span className="price-ticker__price">{err ? '—' : price}</span>
        {change ? (
          <span
            className={`price-ticker__chg${up ? ' up' : ''}${down ? ' down' : ''}`}
          >
            {change}
          </span>
        ) : (
          <span className="price-ticker__chg">Pons</span>
        )}
      </a>
      <div className="price-ticker__rail" aria-hidden="true">
        <div className="price-ticker__track">
          {[0, 1].map((copy) => (
            <div className="price-ticker__seq" key={copy}>
              {items.map((t) => (
                <span key={`${copy}-${t}`}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
