import { useState } from 'react'
import './StickerDownload.css'

const STICKERS = [
  { file: 'wink.png', label: 'Wink' },
  { file: 'panic.png', label: 'Panic' },
  { file: 'smug.png', label: 'Smug' },
  { file: 'stamp-slam.png', label: 'Stamp Slam' },
  { file: 'shrug.png', label: 'Shrug' },
] as const

export function StickerDownload() {
  const [selected, setSelected] = useState<string | null>(null)

  async function downloadSticker(file: string, label: string) {
    try {
      const response = await fetch(`/media/nfa/sticker-pack/${file}`)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nfa-${label.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      window.open(`/media/nfa/sticker-pack/${file}`, '_blank')
    }
  }

  return (
    <div className="sticker-download">
      <div className="sticker-download__header">
        <span>🎨</span>
        <span className="sticker-download__title">Sticker Pack</span>
      </div>
      <p className="sticker-download__subtitle">Download and share your favorites!</p>
      
      <div className="sticker-download__grid">
        {STICKERS.map((s) => (
          <div
            key={s.file}
            className={`sticker-download__item ${selected === s.file ? 'selected' : ''}`}
            onClick={() => setSelected(selected === s.file ? null : s.file)}
          >
            <img
              src={`/media/nfa/sticker-pack/${s.file}`}
              alt={s.label}
            />
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="sticker-download__actions">
          {STICKERS.filter((s) => s.file === selected).map((s) => (
            <button
              key={s.file}
              className="sticker-download__btn"
              onClick={() => downloadSticker(s.file, s.label)}
            >
              ⬇️ Download {s.label}
            </button>
          ))}
        </div>
      )}

      <button
        className="sticker-download__all"
        onClick={() => STICKERS.forEach((s) => downloadSticker(s.file, s.label))}
      >
        ⬇️ Download All
      </button>
    </div>
  )
}
