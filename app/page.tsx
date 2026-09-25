'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, Crosshair, Mail, Menu, MoveUpRight, Sparkles, X } from 'lucide-react'

const products = [
  { number: '01', name: 'Novexa', category: 'Idea validation', description: 'Turn raw ideas into structured, investable opportunities with AI-guided strategy.', url: 'https://novexa-idea-validator.lovable.app/', mark: 'NX' },
  { number: '02', name: 'EconoMind AI', category: 'Finance intelligence', description: 'Understand money, markets, and business decisions through a calm, intelligent lens.', url: 'https://econo-mind-ai-novexa.lovable.app', mark: 'EM' },
  { number: '03', name: 'BlitzData', category: 'Business analytics', description: 'Move from complex datasets to clear, actionable decisions in minutes.', url: 'https://blitzdata-novexa.lovable.app/', mark: 'BD' },
  { number: '04', name: 'Solve NCERT', category: 'Learning systems', description: 'Build stronger understanding with verified explanations and adaptive study tools.', url: 'https://solvencert-novexa.vercel.app/', mark: 'SN' },
  { number: '05', name: 'Novexis', category: 'AI-native development', description: 'A new environment for thinking, building, and shipping with intelligent agents.', url: '#', mark: 'NV', soon: true },
]

const plans = [
  { number: '01', name: 'Starter', price: '±₹5,000 · negotiable', caption: 'For institutions and small businesses ready to launch.', features: ['Basic website or web app', 'Forms, dashboards, and CRUD flows', 'Basic database integration', 'Responsive custom UI/UX', 'Deployment and setup'], action: 'Start your build' },
  { number: '02', name: 'Business', price: '±₹10,000 · negotiable', caption: 'For teams that need a dependable digital operation.', features: ['Advanced business applications', 'Authentication and user roles', 'Admin dashboards', 'Database and API integrations', 'Automated workflows', 'Deployment and configuration'], action: 'Plan my application' },
  { number: '03', name: 'Pro', price: '±₹20,000 · negotiable', caption: 'For ambitious products with real operational complexity.', features: ['Full-featured custom applications', 'Complex dashboards and management systems', 'Advanced integrations and automation', 'Multiple user roles', 'Payments, notifications, and third-party services', 'Production deployment'], action: 'Build something serious' },
  { number: '04', name: 'Custom', price: 'Let’s discuss', caption: 'For large systems, SaaS products, and specialized software.', features: ['Institutional systems', 'Startup MVPs', 'Custom SaaS products', 'Highly specialized software', 'Complex requirements', 'Long-term development partnership'], action: 'Discuss your vision' },
]

const planEmail = (plan: string) => `mailto:support.noirdemons@puszao.resend.app?subject=${encodeURIComponent(`NDE NoirDemons ${plan} plan enquiry`)}&body=${encodeURIComponent(`Hello NDE (NoirDemons) team,\n\nI am interested in the ${plan} plan.\n\nKindly mention your Custom Features:\n\n`)}`


const GALAXY_STARS = 2600
const WORDMARK_STARS = 5200
const AMBIENT_STARS = 1800

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let t = value
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Particle = {
  x: number
  y: number
  tx: number
  ty: number
  size: number
  alpha: number
  phase: number
  speed: number
}

function GalaxyField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1
    let lastTime = performance.now()
    let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const random = seededRandom(0x4e4f4952)
    const ambient: Particle[] = Array.from({ length: AMBIENT_STARS }, () => ({
      x: random(), y: random(), tx: random(), ty: random(),
      size: .28 + random() * 1.45,
      alpha: .035 + random() * .18,
      phase: random() * Math.PI * 2,
      speed: .12 + random() * .55,
    }))

    const galaxy: Particle[] = Array.from({ length: GALAXY_STARS }, () => ({
      x: random(), y: random(), tx: random(), ty: random(),
      size: .3 + random() * 1.6,
      alpha: .12 + random() * .72,
      phase: random() * Math.PI * 2,
      speed: .08 + random() * .42,
    }))

    // The final wordmark gets its own denser particle population. This leaves
    // every section separator and the ambient field completely unchanged.
    const wordParticles: Particle[] = Array.from({ length: WORDMARK_STARS }, () => ({
      x: random(), y: random(), tx: random(), ty: random(),
      size: .24 + random() * 1.25,
      alpha: .11 + random() * .76,
      phase: random() * Math.PI * 2,
      speed: .08 + random() * .42,
    }))

    const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
    const smooth = (value: number) => {
      const t = clamp01(value)
      return t * t * (3 - 2 * t)
    }
    const smoother = (value: number) => {
      const t = smooth(value)
      return t * t * (3 - 2 * t)
    }

    const makeHorizontalGalaxy = (index: number) => {
      const r = seededRandom(0x6e6f6972 + index * 7919)
      return galaxy.map((_, i) => {
        const u = r()
        const x = u * 1.18 - .09
        const edge = Math.abs(x - .5) * 2
        const coreBias = Math.pow(1 - clamp01(edge), .55)
        const filament = (i % 7) / 6
        const spread = .045 + .16 * (1 - coreBias) + .035 * filament
        const wave = Math.sin(x * Math.PI * (2.2 + index * .17) + filament * 6.28) * .018
        const y = .5 + wave + (r() - .5) * spread
        return { x, y, weight: coreBias }
      })
    }

    let horizontalTargets = makeHorizontalGalaxy(0)
    let textTargets: Array<{ x: number; y: number }> = []

    const buildWordmarkTargets = () => {
      const off = document.createElement('canvas')
      const ow = 1200
      const oh = 360
      off.width = ow
      off.height = oh
      const octx = off.getContext('2d')
      if (!octx) return

      octx.clearRect(0, 0, ow, oh)
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      // Prefer the requested Algerian face, with robust fallbacks.
      octx.font = '900 205px Algerian, "Arial Black", Georgia, serif'
      // Slightly thicken the rasterized glyphs so every letter remains legible
      // when it is reconstructed from a finite number of stars.
      octx.lineWidth = 3
      octx.strokeStyle = '#fff'
      octx.font = '900 96px Algerian, "Arial Black", Georgia, serif'
      octx.strokeText('NDE', ow / 2, 66)
      octx.fillText('NDE', ow / 2, 66)
      octx.font = '900 205px Algerian, "Arial Black", Georgia, serif'
      octx.strokeText('NoirDemons', ow / 2, oh / 2 + 62)
      octx.fillText('NoirDemons', ow / 2, oh / 2 + 62)

      const pixels = octx.getImageData(0, 0, ow, oh).data
      const candidates: Array<{ x: number; y: number }> = []
      for (let y = 0; y < oh; y += 1) {
        for (let x = 0; x < ow; x += 1) {
          const a = pixels[(y * ow + x) * 4 + 3] / 255
          if (a > .35) candidates.push({ x: x / ow, y: y / oh })
        }
      }

      const wordRandom = seededRandom(0x4e444d57)
      const chosen: Array<{ x: number; y: number }> = []
      if (!candidates.length) return
      for (let i = 0; i < WORDMARK_STARS; i += 1) {
        chosen.push(candidates[Math.floor(wordRandom() * candidates.length)])
      }
      textTargets = chosen
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildWordmarkTargets()
    }

    const getBoundaryState = () => {
      const ids = ['vision', 'ecosystem', 'plans', 'contact-boundary']
      const scrollY = window.scrollY || window.pageYOffset
      let best = { intensity: 0, index: 0, progress: 0 }

      ids.forEach((id, index) => {
        const node = document.getElementById(id)
        if (!node) return
        const nodeTop = node.getBoundingClientRect().top + scrollY
        const distance = nodeTop - (scrollY + height * .5)

        // The hero → vision transition is intentionally tighter: keep the
        // stellar concentration below the hero CTA row instead of letting it
        // bloom over the copy/buttons too early. All later section transitions
        // retain the original Astra-style timing.
        const transitionRadius = index === 0 ? .53 : .78
        const raw = clamp01(1 - Math.abs(distance) / (height * transitionRadius))
        const intensity = smoother(raw)
        const localProgress = clamp01((distance / height + transitionRadius) / (transitionRadius * 2))
        if (intensity > best.intensity) best = { intensity, index, progress: localProgress }
      })
      return best
    }

    const getBottomWordmarkState = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const remaining = maxScroll - (window.scrollY || window.pageYOffset)
      // The wordmark only emerges in the final ~1.15 viewport heights.
      return smoother(1 - remaining / (window.innerHeight * 1.15))
    }

    const drawAmbientStars = (time: number, suppression: number) => {
      for (const star of ambient) {
        const shimmer = .72 + .28 * Math.sin(time * .00035 * star.speed + star.phase)
        ctx.globalAlpha = star.alpha * shimmer * (.52 + .48 * (1 - suppression))
        ctx.fillStyle = '#f7f7f5'
        ctx.beginPath()
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawHorizontalGalaxy = (time: number, intensity: number, boundaryIndex: number) => {
      if (intensity <= .003) return
      const targets = horizontalTargets
      const centerY = height * (.5 + Math.sin(boundaryIndex * 1.7) * .025)
      const centerX = width * (.5 + (boundaryIndex % 3 - 1) * .035)
      const targetWidth = width * 1.12
      const targetHeight = height * .66
      const drift = Math.sin(time * .000055 + boundaryIndex) * 5
      const blend = smooth(intensity)

      // A very soft atmospheric band underneath the particles. It deliberately has no edge.
      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, targetWidth * .52)
      glow.addColorStop(0, `rgba(255,255,255,${.045 * intensity})`)
      glow.addColorStop(.28, `rgba(255,255,255,${.018 * intensity})`)
      glow.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.globalAlpha = 1
      ctx.fillStyle = glow
      ctx.fillRect(0, centerY - targetHeight * .45, width, targetHeight * .9)

      for (let i = 0; i < galaxy.length; i += 1) {
        const star = galaxy[i]
        const target = targets[i]
        const tx = centerX + (target.x - .5) * targetWidth + drift
        const ty = centerY + (target.y - .5) * targetHeight
        const ambientX = star.x * width
        const ambientY = star.y * height
        const shimmer = .7 + .3 * Math.sin(time * .0004 * star.speed + star.phase)
        const x = ambientX + (tx - ambientX) * blend
        const y = ambientY + (ty - ambientY) * blend
        const concentration = .65 + target.weight * .65
        const alpha = (.028 + star.alpha * .86 * blend) * shimmer * concentration

        ctx.globalAlpha = alpha
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(x, y, star.size * (1 + blend * .32), 0, Math.PI * 2)
        ctx.fill()

        if (blend > .72 && (i % 19 === 0 || star.size > 1.45)) {
          ctx.globalAlpha = alpha * .16
          ctx.beginPath()
          ctx.arc(x, y, star.size * 4.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const drawWordmark = (time: number, intensity: number) => {
      if (intensity <= .003 || !textTargets.length) return
      const blend = smooth(intensity)
      const centerX = width * .5
      const wordWidth = Math.min(width * .94, 1180)
      const wordHeight = Math.min(height * .58, 320)

      // Keep the ordinary starfield visible underneath while the word is forming.
      for (let i = 0; i < wordParticles.length; i += 1) {
        const star = wordParticles[i]
        const target = textTargets[i]
        const tx = centerX + (target.x - .5) * wordWidth
        const ty = height * .53 + (target.y - .5) * wordHeight
        const ambientX = star.x * width
        const ambientY = star.y * height
        const shimmer = .72 + .28 * Math.sin(time * .00038 * star.speed + star.phase)
        const x = ambientX + (tx - ambientX) * blend
        const y = ambientY + (ty - ambientY) * blend
        const alpha = (.025 + star.alpha * .94 * blend) * shimmer

        ctx.globalAlpha = alpha
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(x, y, star.size * (1 + blend * .5), 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const draw = (time: number) => {
      const delta = Math.min(40, time - lastTime)
      lastTime = time
      const animationTime = reduceMotion || delta <= 0 ? 0 : time
      const boundary = getBoundaryState()
      const wordmarkIntensity = getBottomWordmarkState()

      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'source-over'
      drawAmbientStars(animationTime, Math.max(boundary.intensity, wordmarkIntensity))
      ctx.globalCompositeOperation = 'screen'

      // The bottom wordmark takes over only at the actual end of the page.
      if (wordmarkIntensity > .003) {
        drawWordmark(animationTime, wordmarkIntensity)
      } else {
        drawHorizontalGalaxy(animationTime, boundary.intensity, boundary.index)
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    const handleMotionPreference = () => {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('orientationchange', resize, { passive: true })
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', handleMotionPreference)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('orientationchange', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="galaxy-field" aria-hidden="true" />
}
export default function Page() {

  const [activeProduct, setActiveProduct] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main className="site-shell">
      <GalaxyField />
      <div className="noise" aria-hidden="true" />
      <nav className="nav-wrap" aria-label="Primary navigation">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="NDE — NoirDemons home">
          <span className="brand-row">
            <img className="brand-logo" src="/images/noirdemons.png" alt="NDE — NoirDemons logo" />
            <span className="brand-names">
              <span className="brand-short">NDE</span>
              <span className="brand-full">NOIR<span className="brand-light">DEMONS</span></span>
            </span>
          </span>
          <span className="brand-tagline">formerly Novexa</span>
        </button>
        <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          <button onClick={() => scrollTo('ecosystem')}>Ecosystem</button>
          <button onClick={() => scrollTo('plans')}>Plans</button>
          <button onClick={() => scrollTo('vision')}>Our vision</button>
          <a href="mailto:support.noirdemons@puszao.resend.app">Contact</a>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <a className="nav-contact" href="mailto:support.noirdemons@puszao.resend.app">Start a conversation <ArrowUpRight size={15} /></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Independent intelligence studio / 001</p>
          <h1>Make the<br /><em>impossible</em><br />useful.</h1>
          <p className="hero-intro">NDE (NoirDemons) builds intelligent systems for the moments that matter — when an idea needs direction, data needs meaning, and ambition needs a way forward.</p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={() => scrollTo('ecosystem')}>Explore the ecosystem <MoveUpRight size={17} /></button>
            <button className="text-cta" onClick={() => scrollTo('plans')}>View custom plans <ChevronDown size={16} /></button>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
          <div className="art-core"><img src="/images/noirdemons.png" alt="" /><div className="core-glow" /></div>
          <span className="art-label label-top">SIGNAL / 00.01</span><span className="art-label label-bottom">INTELLIGENCE<br />WITHOUT NOISE</span>
          <div className="crosshair crosshair-a"><Crosshair size={15} /></div><div className="crosshair crosshair-b"><Crosshair size={12} /></div>
        </div>
        <div className="scroll-cue"><span>Scroll to enter</span><div className="scroll-line" /></div>
        <div className="hero-index">NDE — NOIRDEMONS / <span>01—05</span></div>
      </section>

      <section className="manifesto section-pad" id="vision">
        <div className="section-kicker"><span>( A )</span><span>THE PREMISE</span><span>2026—∞</span></div>
        <div className="manifesto-grid">
          <h2>Technology should feel like a <span>door</span>, not a wall.</h2>
          <div className="manifesto-body"><p>We make practical intelligence for people with something to build. Tools that translate complexity into confidence, and possibility into motion.</p><button className="circle-link" onClick={() => scrollTo('ecosystem')} aria-label="Explore products"><ArrowUpRight size={20} /></button></div>
        </div>
        <div className="principles"><div><span>01</span><strong>Clarity over noise</strong><p>Fewer barriers. Better questions. Sharper answers.</p></div><div><span>02</span><strong>Ambition, made useful</strong><p>We build for the leap between thinking and doing.</p></div><div><span>03</span><strong>Human by design</strong><p>Technology that respects attention, agency, and context.</p></div></div>
      </section>

      <section className="ecosystem section-pad" id="ecosystem">
        <div className="section-kicker"><span>( B )</span><span>THE ECOSYSTEM</span><span>SELECT A SIGNAL</span></div>
        <div className="ecosystem-heading"><h2>Five ways to<br /><em>move forward.</em></h2><p>One studio. An expanding constellation of products designed to make difficult things feel possible.</p></div>
        <div className="product-stage">
          <div className="product-list" role="tablist" aria-label="NDE — NoirDemons products">
            {products.map((product, index) => <button key={product.name} className={`product-tab ${activeProduct === index ? 'active' : ''}`} onClick={() => setActiveProduct(index)} role="tab" aria-selected={activeProduct === index}><span>{product.number}</span><span>{product.name}</span><span className="tab-arrow" onClick={(e) => { if (!product.soon) { e.stopPropagation(); window.open(product.url, '_blank', 'noopener,noreferrer'); } }}>{product.soon ? 'SOON' : <ArrowUpRight size={17} />}</span></button>)}
          </div>
          <div className="product-card" key={products[activeProduct].name}>
            <div className="card-top"><span>NDE · NOIRDEMONS / PRODUCT {products[activeProduct].number}</span><span>{products[activeProduct].category}</span></div>
            <div className="card-mark"><span>{products[activeProduct].mark}</span><div className="mark-lines" /></div>
            <div className="card-bottom"><h3>{products[activeProduct].name}</h3><p>{products[activeProduct].description}</p>{products[activeProduct].soon ? <span className="soon-label">In the making / Join the signal</span> : <a href={products[activeProduct].url} target="_blank" rel="noreferrer" className="card-link">Open product <ArrowUpRight size={18} /></a>}</div>
          </div>
        </div>
      </section>

      <section className="signal-band" aria-label="NDE — NoirDemons capabilities"><div className="signal-track"><span>IDEAS → OPPORTUNITIES</span><Sparkles size={19} /><span>DATA → DECISIONS</span><Sparkles size={19} /><span>KNOWLEDGE → ACTION</span><Sparkles size={19} /><span>IDEAS → OPPORTUNITIES</span><Sparkles size={19} /></div></section>

      <section className="plans section-pad" id="plans">
        <div className="section-kicker"><span>( C )</span><span>THE BUILD STUDIO</span><span>IDEA → DEPLOYMENT</span></div>
        <div className="plans-intro"><div><p className="eyebrow"><span className="status-dot" /> Trusted makers for ambitious teams</p><h2>Bring your business<br /><em>online, properly.</em></h2></div><p>One of the most trusted software creation studios is now here to help industries move forward. Get a custom application for your business in just a few days — thoughtfully designed, expertly built, and ready to grow.</p></div>
        <div className="plans-grid">{plans.map((plan) => <article className="plan-card" key={plan.name}><div className="plan-top"><span>{plan.number}</span><span>NEGOTIABLE BY SCOPE</span></div><h3>{plan.name}</h3><p className="plan-price">{plan.price}</p><p className="plan-caption">{plan.caption}</p><ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><a className="plan-action" href={planEmail(plan.name)}>{plan.action} <ArrowUpRight size={16} /></a></article>)}</div>
      </section>

      <span id="contact-boundary" className="contact-boundary" aria-hidden="true" />
      <section className="contact-section section-pad" id="contact"><div className="contact-orbit" aria-hidden="true"><div /><div /><div /></div><div className="contact-content"><p className="eyebrow">A new signal is forming</p><h2>Have a difficult<br /><em>problem?</em></h2><a className="contact-button" href="mailto:support.noirdemons@puszao.resend.app">Let&apos;s talk <Mail size={17} /></a></div></section>

      <footer className="footer"><div className="footer-brand">
          <span className="brand-row">
            <img className="brand-logo" src="/images/noirdemons.png" alt="NDE — NoirDemons logo" />
            <span className="brand-names">
              <span className="brand-short">NDE</span>
              <span className="brand-full">NOIR<span className="brand-light">DEMONS</span></span>
            </span>
          </span>
          <span className="brand-tagline">formerly Novexa</span>
        </div><p>Building intelligent tools for innovation,<br />finance, analytics, and education.</p><div className="footer-right"><span>© 2026 NDE · NoirDemons</span><a href="mailto:support.noirdemons@puszao.resend.app">support.noirdemons@puszao.resend.app</a></div></footer>
    </main>
  )
}
