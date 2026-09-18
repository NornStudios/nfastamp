import { useState } from 'react'
import { generateMadlib, getRandomSlogan, getRandomSlogans } from '../slogans'
import './SloganGenerator.css'

export function SloganGenerator() {
  const [slogan, setSlogan] = useState(getRandomSlogan)
  const [spinning, setSpinning] = useState(false)

  function generate() {
    if (spinning) return
    setSpinning(true)
    
    let count = 0
    const interval = setInterval(() => {
      setSlogan(getRandomSlogan())
      count++
      if (count >= 8) {
        clearInterval(interval)
        setSpinning(false)
      }
    }, 100)
  }

  return (
    <div className="slogan-gen">
      <div className="slogan-gen__header">
        <span>🎰</span>
        <span className="slogan-gen__title">Slogan Slot</span>
      </div>
      <div className={`slogan-gen__display ${spinning ? 'spinning' : ''}`}>
        <p>{slogan}</p>
      </div>
      <button className="slogan-gen__btn" onClick={generate} disabled={spinning}>
        {spinning ? 'Spinning...' : 'Generate'}
      </button>
    </div>
  )
}

export function MadlibGenerator() {
  const [result, setResult] = useState<string | null>(null)

  function generate() {
    setResult(generateMadlib())
  }

  return (
    <div className="madlib-gen">
      <div className="madlib-gen__header">
        <span>📝</span>
        <span className="madlib-gen__title">Disclaimer Mad Libs</span>
      </div>
      {result && (
        <div className="madlib-gen__result">
          <p>{result}</p>
        </div>
      )}
      <button className="madlib-gen__btn" onClick={generate}>
        Generate Disclaimer
      </button>
    </div>
  )
}

export function SloganBanner() {
  const [slogans] = useState(() => getRandomSlogans(3))
  const [index, setIndex] = useState(0)

  function next() {
    setIndex((i) => (i + 1) % slogans.length)
  }

  return (
    <div className="slogan-banner" onClick={next}>
      <span className="slogan-banner__text">{slogans[index]}</span>
      <span className="slogan-banner__tap">tap for more</span>
    </div>
  )
}
