import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import useTheme from '../../hooks/useTheme'
import './PillNav.css'

export default function PillNav({
  logo, logoAlt = 'Logo',
  items = [],
  activeHref,
  className = '',
  ease = 'power3.out',
  baseColor, pillColor, hoveredPillTextColor, pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true
}) {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const circleRefs = useRef([])
  const tlRefs = useRef([])
  const activeTweenRefs = useRef([])
  const logoElRef = useRef(null)
  const logoImgRef = useRef(null)
  const logoTweenRef = useRef(null)
  const hamburgerRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navItemsRef = useRef(null)

  const cssVars = {
    ...(baseColor ? {'--base': baseColor} : {}),
    ...(pillColor ? {'--pill-bg': pillColor} : {}),
    ...(hoveredPillTextColor ? {'--hover-text': hoveredPillTextColor} : {}),
    ...(pillTextColor ? {'--pill-text': pillTextColor} : {}),
  }

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
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
    if (document.fonts?.ready) { document.fonts.ready.then(layout).catch(() => {}) }
    const menu = mobileMenuRef.current
    if (menu) gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 })
    if (initialLoadAnimation) {
      if (logoElRef.current) { gsap.set(logoElRef.current, { scale: 0 }); gsap.to(logoElRef.current, { scale: 1, duration: 0.6, ease }) }
      if (navItemsRef.current) { gsap.set(navItemsRef.current, { width: 0, overflow: 'hidden' }); gsap.to(navItemsRef.current, { width: 'auto', duration: 0.6, ease }) }
    }
    return () => window.removeEventListener('resize', onResize)
  }, [items, ease, initialLoadAnimation])

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
  const handleLogoEnter = () => {
    const img = logoImgRef.current; if (!img) return
    logoTweenRef.current?.kill()
    gsap.set(img, { rotate: 0 })
    logoTweenRef.current = gsap.to(img, { rotate: 360, duration: 0.2, ease, overwrite: 'auto' })
  }
  const toggleMobileMenu = () => {
    const open = !isMobileMenuOpen
    setIsMobileMenuOpen(open)
    const hamburger = hamburgerRef.current
    const menu = mobileMenuRef.current
    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line')
      if (open) { gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease }); gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease }) }
      else { gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease }); gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease }) }
    }
    if (menu) {
      if (open) { gsap.set(menu, { visibility: 'visible' }); gsap.fromTo(menu, { opacity: 0, y: 10, scaleY: 1 }, { opacity: 1, y: 0, scaleY: 1, duration: 0.3, ease, transformOrigin: 'top center' }) }
      else { gsap.to(menu, { opacity: 0, y: 10, scaleY: 1, duration: 0.2, ease, transformOrigin: 'top center', onComplete: () => gsap.set(menu, { visibility: 'hidden' }) }) }
    }
    onMobileMenuClick?.()
  }
  const isExternal = (href='') => href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')
  const isHash = (href='') => href.startsWith('#')
  const handleItemClick = (e, href) => {
    if (!href) return
    if (isHash(href)) {
      e.preventDefault()
      const el = document.getElementById(href.slice(1))
      if (!el) return
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(el, { offset: -64 })
      else {
        const top = el.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: top - 64, behavior: 'smooth' })
      }
      setIsMobileMenuOpen(false)
    } else if (!isExternal(href)) {
      // Si usas router, aquí iría la navegación
    }
  }

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        {/* Logo (si no hay imagen, mostramos “MM”) */}
        <a
          className="pill-logo"
          href={items?.[0]?.href || '#hero'}
          aria-label="Home"
          onMouseEnter={handleLogoEnter}
          ref={logoElRef}
          onClick={(e) => handleItemClick(e, items?.[0]?.href || '#hero')}
        >
          {logo ? <img src={logo} alt={logoAlt} ref={logoImgRef}/> : <span className="pill-logo-text">MarcMateoStudio</span>}
        </a>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href || `item-${i}`} role="none">
                <a
                  role="menuitem"
                  href={item.href}
                  className={`pill${activeHref === item.href ? ' is-active' : ''}`}
                  aria-label={item.ariaLabel || item.label}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                  onClick={(e) => handleItemClick(e, item.href)}
                >
                  <span className="hover-circle" aria-hidden="true" ref={el => { circleRefs.current[i] = el }} />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Toggle tema */}
        <button
          type="button"
          className="pill-theme-toggle"
          onClick={toggleTheme}
          aria-pressed={theme === 'light'}
          aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
          title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Botón móvil */}
        <button
          className="mobile-menu-button mobile-only"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          ref={hamburgerRef}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      <div className={`mobile-menu-popover mobile-only${isMobileMenuOpen ? ' open' : ''}`} ref={mobileMenuRef}>
        <ul className="mobile-menu-list">
          {items.map((item, i) => (
            <li key={item.href || `mobile-item-${i}`}>
              <a
                href={item.href}
                className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                onClick={(e) => handleItemClick(e, item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
          {/* Toggle también dentro del popover móvil */}
          <li>
            <button
              type="button"
              className="mobile-theme-toggle"
              onClick={toggleTheme}
              aria-pressed={theme === 'light'}
              aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
              title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
            >
              {theme === 'light' ? '🌙 Modo oscuro' : '☀️ Modo claro'}
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
