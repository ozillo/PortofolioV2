import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import useTheme from '../../hooks/useTheme'
import './PillNavDesktop.css'

export default function PillNavDesktop({
  logo, logoAlt='Logo',
  items = [
    { label: 'Inicio', href: '#hero' },
    { label: 'Sobre mí', href: '#about' },
    { label: 'Habilidades', href: '#skills' },
    { label: 'Colaboraciones', href: '#collaborations' },
  ],
  className='',
  ease='power3.out',
  baseColor, pillColor, hoveredPillTextColor, pillTextColor,
  initialLoadAnimation = true
}) {
  const { theme, toggleTheme } = useTheme()

  const getHref = (it) => it?.href ?? it?.link ?? '#'
  const getIdFromHref = (href='') => {
    if (!href) return null
    if (href.startsWith('#')) return href.slice(1)
    const guess = href.replace(/^\/+/, '')
    return document.getElementById(guess) ? guess : null
  }

  const [current, setCurrent] = useState(getHref(items[0]) || '#hero')

  const circleRefs = useRef([])
  const tlRefs = useRef([])
  const activeTweenRefs = useRef([])
  const logoElRef = useRef(null)
  const logoImgRef = useRef(null)

  const cssVars = {
    ...(baseColor ? {'--base': baseColor} : {}),
    ...(pillColor ? {'--pill-bg': pillColor} : {}),
    ...(hoveredPillTextColor ? {'--hover-text': hoveredPillTextColor} : {}),
    ...(pillTextColor ? {'--pill-text': pillTextColor} : {}),
  }

  const scrollToHref = (href) => {
    const id = getIdFromHref(href)
    if (!id) return
    const el = document.getElementById(id)
    const lenis = getLenis()
    const navEl = document.querySelector('.pill-desktop')
    const navH = navEl ? parseInt(getComputedStyle(navEl).getPropertyValue('--nav-h')) : 64
    if (lenis) lenis.scrollTo(el, { offset: -navH })
    else {
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top - navH, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return
        const pill = circle.parentElement
        const { width: w, height: h } = pill.getBoundingClientRect()
        const R = ((w*w)/4 + h*h) / (2*h)
        const D = Math.ceil(2*R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R*R - (w*w)/4))) + 1
        const originY = D - delta
        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`
        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })
        const label = pill.querySelector('.pill-label')
        const white = pill.querySelector('.pill-label-hover')
        if (label) gsap.set(label, { y: 0 })
        if (white) gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 })

        const i = circleRefs.current.indexOf(circle)
        if (i === -1) return
        tlRefs.current[i]?.kill()
        const tl = gsap.timeline({ paused: true })
        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0)
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0)
        if (white) tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0)
        tlRefs.current[i] = tl
      })
    }
    layout()
    const onResize = () => layout()
    window.addEventListener('resize', onResize)
    if (document.fonts?.ready) document.fonts.ready.then(layout).catch(() => {})

    const triggers = items
      .map(getHref)
      .map(href => getIdFromHref(href))
      .filter(Boolean)
      .map(id => {
        const el = document.getElementById(id)
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 60%',
          onEnter: () => setCurrent(`#${id}`),
          onEnterBack: () => setCurrent(`#${id}`),
        })
      })

    ScrollTrigger.refresh()
    return () => {
      window.removeEventListener('resize', onResize)
      triggers.forEach(t => t.kill())
    }
  }, [items, ease])

  const handleEnter = (i) => {
    const tl = tlRefs.current[i]; if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' })
  }
  const handleLeave = (i) => {
    const tl = tlRefs.current[i]; if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' })
  }

  return (
    <div className="pill-desktop-container">
      <nav className={`pill-desktop ${className}`} aria-label="Primary" style={cssVars}>
        <a
          className="pill-logo"
          href={getHref(items[0]) || '#hero'}
          aria-label="Home"
          ref={logoElRef}
          onClick={(e) => { e.preventDefault(); scrollToHref(getHref(items[0]) || '#hero') }}
        >
          {logo ? <img src={logo} alt={logoAlt} ref={logoImgRef}/> : <span className="pill-logo-text">M</span>}
        </a>

        <div className="pill-nav-items">
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => {
              const href = getHref(item)
              return (
                <li key={href || `item-${i}`} role="none">
                  <a
                    role="menuitem"
                    href={href}
                    className={`pill${(current) === href ? ' is-active' : ''}`}
                    aria-current={(current) === href ? 'page' : undefined}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                    onClick={(e) => { e.preventDefault(); scrollToHref(href) }}
                  >
                    <span className="hover-circle" aria-hidden="true" ref={el => { circleRefs.current[i] = el }} />
                    <span className="label-stack">
                      <span className="pill-label">{item.label}</span>
                      <span className="pill-label-hover" aria-hidden="true">{item.label}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <button
          type="button"
          className="pill-theme-toggle"
          onClick={toggleTheme}
          aria-pressed={theme === 'light'}
          title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>
    </div>
  )
}
