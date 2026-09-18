/**
 * NFA Confetti System
 * Celebration particles for big wins
 */

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  color: string
  size: number
  shape: 'rect' | 'circle' | 'stamp'
  opacity: number
  life: number
}

const COLORS = [
  '#b8322f', // stamp red
  '#1c1b19', // ink black
  '#1f7a4c', // chart green
  '#e8a09a', // stamp soft
  '#d4cdb8', // paper deep
  '#fffbf5', // white
]

const STAMP_EMOJI = '📜'

export function createConfettiCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.id = 'nfa-confetti'
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `
  return canvas
}

export function launchConfetti(intensity: 'normal' | 'big' | 'jackpot' = 'normal'): void {
  let canvas = document.getElementById('nfa-confetti') as HTMLCanvasElement | null
  if (!canvas) {
    canvas = createConfettiCanvas()
    document.body.appendChild(canvas)
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particleCount = intensity === 'jackpot' ? 200 : intensity === 'big' ? 100 : 50
  const particles: Particle[] = []

  for (let i = 0; i < particleCount; i++) {
    const useStamp = intensity !== 'normal' && Math.random() < 0.15
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      shape: useStamp ? 'stamp' : Math.random() < 0.6 ? 'rect' : 'circle',
      opacity: 1,
      life: 1,
    })
  }

  let frame = 0
  const maxFrames = intensity === 'jackpot' ? 300 : intensity === 'big' ? 200 : 120

  function animate() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let activeParticles = 0

    for (const p of particles) {
      if (p.life <= 0) continue
      activeParticles++

      p.x += p.vx
      p.y += p.vy
      p.vy += 0.1
      p.rotation += p.rotationSpeed
      p.vx *= 0.99

      if (p.y > canvas.height - 50) {
        p.life -= 0.02
        p.opacity = p.life
      }

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.opacity

      if (p.shape === 'stamp') {
        ctx.font = `${p.size * 2}px serif`
        ctx.fillText(STAMP_EMOJI, -p.size, p.size / 2)
      } else if (p.shape === 'rect') {
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      } else {
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    frame++
    if (activeParticles > 0 && frame < maxFrames) {
      requestAnimationFrame(animate)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  animate()
}

export function launchStampExplosion(x: number, y: number): void {
  let canvas = document.getElementById('nfa-confetti') as HTMLCanvasElement | null
  if (!canvas) {
    canvas = createConfettiCanvas()
    document.body.appendChild(canvas)
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles: Particle[] = []

  for (let i = 0; i < 30; i++) {
    const angle = (Math.PI * 2 * i) / 30
    const speed = Math.random() * 8 + 4
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 6 + 3,
      shape: Math.random() < 0.3 ? 'stamp' : 'rect',
      opacity: 1,
      life: 1,
    })
  }

  function animate() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let active = 0
    for (const p of particles) {
      if (p.life <= 0) continue
      active++

      p.x += p.vx
      p.y += p.vy
      p.vy += 0.3
      p.rotation += p.rotationSpeed
      p.life -= 0.025
      p.opacity = p.life

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color

      if (p.shape === 'stamp') {
        ctx.font = `${p.size * 2}px serif`
        ctx.fillText('🔴', -p.size, p.size / 2)
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      }

      ctx.restore()
    }

    if (active > 0) {
      requestAnimationFrame(animate)
    }
  }

  animate()
}
