import { useState } from 'react'
import { useChips } from '../ChipContext'
import { useStats } from '../StatsContext'
import { getRandomSlogan } from '../slogans'
import './ReceiptGenerator.css'

interface ReceiptData {
  balance: number
  gamesPlayed: number
  wins: number
  losses: number
  biggestWin: number
  netProfit: number
  timestamp: string
  slogan: string
}

export function ReceiptGenerator() {
  const { balance } = useChips()
  const { stats } = useStats()
  const [showReceipt, setShowReceipt] = useState(false)
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)

  function generateReceipt() {
    const netProfit = stats.totalWon - stats.totalLost - stats.totalWagered
    setReceipt({
      balance,
      gamesPlayed: stats.gamesPlayed,
      wins: stats.wins,
      losses: stats.losses,
      biggestWin: stats.biggestWin,
      netProfit,
      timestamp: new Date().toLocaleString(),
      slogan: getRandomSlogan(),
    })
    setShowReceipt(true)
  }

  function copyReceipt() {
    if (!receipt) return
    const text = `
🎰 NFA ARCADE RECEIPT 🎰
========================
Date: ${receipt.timestamp}

Balance: ${receipt.balance} NFA
Games Played: ${receipt.gamesPlayed}
Record: ${receipt.wins}W / ${receipt.losses}L
Biggest Win: ${receipt.biggestWin} NFA
Net P/L: ${receipt.netProfit > 0 ? '+' : ''}${receipt.netProfit} NFA

"${receipt.slogan}"

nfastamp.fun/arcade
========================
NFA · Not Financial Advice
    `.trim()

    navigator.clipboard.writeText(text).then(() => {
      alert('Receipt copied to clipboard!')
    })
  }

  function shareReceipt() {
    if (!receipt) return
    const text = `I just played at NFA Arcade! 🎰\n\n📊 ${receipt.wins}W/${receipt.losses}L\n💰 Balance: ${receipt.balance} NFA\n\n"${receipt.slogan}"\n\n👉 nfastamp.fun/arcade`
    
    if (navigator.share) {
      navigator.share({
        title: 'NFA Arcade Receipt',
        text,
        url: 'https://nfastamp.fun/arcade',
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Share text copied to clipboard!')
      })
    }
  }

  return (
    <>
      <button className="receipt-btn" onClick={generateReceipt}>
        🧾 Get Receipt
      </button>

      {showReceipt && receipt && (
        <div className="receipt-overlay" onClick={() => setShowReceipt(false)}>
          <div className="receipt" onClick={(e) => e.stopPropagation()}>
            <div className="receipt__header">
              <span className="receipt__logo">🎰</span>
              <span className="receipt__title">NFA ARCADE</span>
              <span className="receipt__date">{receipt.timestamp}</span>
            </div>

            <div className="receipt__divider">- - - - - - - - - - - - -</div>

            <div className="receipt__body">
              <div className="receipt__row">
                <span>BALANCE</span>
                <span>{receipt.balance} NFA</span>
              </div>
              <div className="receipt__row">
                <span>GAMES</span>
                <span>{receipt.gamesPlayed}</span>
              </div>
              <div className="receipt__row">
                <span>RECORD</span>
                <span>{receipt.wins}W / {receipt.losses}L</span>
              </div>
              <div className="receipt__row">
                <span>BIGGEST WIN</span>
                <span>{receipt.biggestWin} NFA</span>
              </div>
              <div className="receipt__row receipt__row--total">
                <span>NET P/L</span>
                <span className={receipt.netProfit >= 0 ? 'positive' : 'negative'}>
                  {receipt.netProfit > 0 ? '+' : ''}{receipt.netProfit} NFA
                </span>
              </div>
            </div>

            <div className="receipt__divider">- - - - - - - - - - - - -</div>

            <div className="receipt__footer">
              <p className="receipt__slogan">"{receipt.slogan}"</p>
              <p className="receipt__url">nfastamp.fun/arcade</p>
              <p className="receipt__disclaimer">NOT FINANCIAL ADVICE</p>
            </div>

            <div className="receipt__actions">
              <button onClick={copyReceipt}>📋 Copy</button>
              <button onClick={shareReceipt}>📤 Share</button>
              <button onClick={() => setShowReceipt(false)}>✕ Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
