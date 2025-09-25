import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react'
import { gsap } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import useTheme from '../../hooks/useTheme'
import './MobileStaggeredMenu.css'

export default function MobileStaggeredMenu({
  position = 'right',
  colors = ['#B19EEF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className = '',
  logoUrl,                 // opcional; si no hay, muestra "MM"
  menuButtonColor,         // por defecto var(--fg)
  openMenuButtonColor,     // por defecto var(--fg)
  accentColor,             // por defecto var(--accent)
  changeMenuColorOnOpen = false,
  onMenuOpen,
  onMenuClose
}) {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)

  const panelRef = useRef(null)
  const preLayersRef = useRef(null)
  const preLayerElsRef = useRef([])
  const plusHRef = useRef(null)
  const plusVRef = useRef(null)
  const iconRef = useRef(null)
  const textInnerRef = useRef(null)
  const textWrapRef = useRef(null)

  const [textLines, setTextLines] = useState(['Menu', 'Close'])

  const openTlRef = useRef(null)
  const closeTweenRef = useRef(null)
  const spinTweenRef = useRef(null)
  const textCycleAnimRef = useRef(null)
  const colorTweenRef = useRef(null)
  const toggleBtnRef = useRef(null)
  const busyRef = useRef(false)
  const itemEntranceTweenRef = useRef(null)

  const { theme, toggleTheme } = useTheme()

  const resolveTargetId = (href = '') => {
    if (!href) return null
    if (href.startsWith('#')) return href.slice(1)
    const guess = href.replace(/^\/+/, '')
    return document.getElementById(guess) ? guess : null
  }

  const scrollToHref = (href) => {
    const id = resolveTargetId(href)
    if (!id) return
    const el = document.getElementById(id)
    const lenis = getLenis()
    const navEl = document.querySelector('.staggered-menu-wrapper')
    const navH = navEl ? parseInt(getComputedStyle(navEl).getPropertyValue('--sm-nav-h')) || 56 : 56
    if (lenis) lenis.scrollTo(el, { offset: -navH })
    else {
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top - navH, behavior: 'smooth' })
    }
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const preContainer = preLayersRef.current
      const plusH = plusHRef.current
      const plusV = plusVRef.current
      const icon = iconRef.current
      const textInner = textInnerRef.current
      if (!panel || !plusH || !plusV || !icon || !textInner) return

      let preLayers = []
      if (preContainer) preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'))
      preLayerElsRef.current = preLayers

      const offscreen = position === 'left' ? -100 : 100
      gsap.set([panel, ...preLayers], { xPercent: offscreen })
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 })
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 })
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(textInner, { yPercent: 0 })

      const fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#fff'
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor || fg })
    })
    return () => ctx.revert()
  }, [menuButtonColor, position, theme])

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return null

    openTlRef.current?.kill()
    closeTweenRef.current?.kill()
    closeTweenRef.current = null
    itemEntranceTweenRef.current?.kill()

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'))
    const socialTitle = panel.querySelector('.sm-socials-title')
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'))

    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }))
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'))

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
    if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
    })
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0)
    const panelDuration = 0.65
    tl.fromTo(panel, { xPercent: panelStart }, { xPercent: 0, duration: panelDuration, ease: 'power4.out' }, panelInsertTime)

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15
      tl.to(itemEls, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } }, itemsStart)
      if (numberEls.length) {
        tl.to(numberEls, { duration: 0.6, ease: 'power2.out', '--sm-num-opacity': 1, stagger: { each: 0.08, from: 'start' } }, itemsStart + 0.1)
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart)
      if (socialLinks.length) {
        tl.to(socialLinks, {
          y: 0, opacity: 1, duration: 0.55, ease: 'power3.out',
          stagger: { each: 0.08, from: 'start' },
          onComplete: () => { gsap.set(socialLinks, { clearProps: 'opacity' }) }
        }, socialsStart + 0.04)
      }
    }

    openTlRef.current = tl
    return tl
  }, [])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const tl = buildOpenTimeline()
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false })
      tl.play(0)
    } else {
      busyRef.current = false
    }
  }, [buildOpenTimeline])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    openTlRef.current = null
    itemEntranceTweenRef.current?.kill()

    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return

    const all = [...layers, panel]
    closeTweenRef.current?.kill()
    const offscreen = position === 'left' ? -100 : 100
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'))
        if (numberEls.length) gsap.set(numberEls, { '--sm-num-opacity': 0 })
        const socialTitle = panel.querySelector('.sm-socials-title')
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'))
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 })
        busyRef.current = false
      }
    })
  }, [position])

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current
    if (!icon) return
    spinTweenRef.current?.kill()
    if (opening) spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' })
    else spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' })
  }, [])

  const animateColor = useCallback((opening) => {
    const btn = toggleBtnRef.current
    if (!btn) return
    colorTweenRef.current?.kill()
    const fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#fff'
    if (changeMenuColorOnOpen) {
      const targetColor = opening ? (openMenuButtonColor || fg) : (menuButtonColor || fg)
      colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' })
    } else {
      gsap.set(btn, { color: menuButtonColor || fg })
    }
  }, [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen])

  useEffect(() => {
    animateColor(openRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme])

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current
    if (!inner) return
    textCycleAnimRef.current?.kill()

    const currentLabel = opening ? 'Menu' : 'Cerrar'
    const targetLabel = opening ? 'Cerrar' : 'Menu'
    const cycles = 3
    const seq = [currentLabel]
    let last = currentLabel
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu'
      seq.push(last)
    }
    if (last !== targetLabel) seq.push(targetLabel)
    seq.push(targetLabel)
    setTextLines(seq)

    gsap.set(inner, { yPercent: 0 })
    const lineCount = seq.length
    const finalShift = ((lineCount - 1) / lineCount) * 100
    textCycleAnimRef.current = gsap.to(inner, { yPercent: -finalShift, duration: 0.5 + lineCount * 0.07, ease: 'power4.out' })
  }, [])

  const toggleMenu = useCallback(() => {
    const target = !openRef.current
    openRef.current = target
    setOpen(target)
    if (target) { onMenuOpen?.(); playOpen() } else { onMenuClose?.(); playClose() }
    animateIcon(target)
    animateColor(target)
    animateText(target)
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose])

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper'}
      style={{ ...(accentColor ? {'--sm-accent': accentColor} : {}) }}
      data-position={position}
      data-open={open || undefined}
    >
      <header className="staggered-menu-header" aria-label="Main navigation header">
        <a
          className="sm-logo"
          href={items?.[0]?.link || '#hero'}
          onClick={(e) => { e.preventDefault(); scrollToHref(items?.[0]?.link || '#hero') }}
          aria-label="Home"
        >
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="sm-logo-img" draggable={false} width={110} height={24} />
          ) : (
            <span className="sm-logo-fallback">M</span>
          )}
        </a>

        <div className="sm-header-actions">
          <button
            className="sm-theme"
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleTheme(); }}
            aria-pressed={theme === 'light'}
            title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button
            ref={toggleBtnRef}
            className="sm-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
              <span ref={textInnerRef} className="sm-toggle-textInner">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line" key={i}>{l}</span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="sm-icon" aria-hidden="true">
              <span ref={plusHRef} className="sm-icon-line" />
              <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
            </span>
          </button>
        </div>
      </header>

      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c']
          let arr = [...raw]
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2)
            arr.splice(mid, 1)
          }
          return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />)
        })()}
      </div>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {(items && items.length ? items : [{ label: 'No items', link: '#' }]).map((it, idx) => (
              <li className="sm-panel-itemWrap" key={it.label + idx}>
                <a
                  className="sm-panel-item"
                  href={it.link}
                  aria-label={it.ariaLabel || it.label}
                  data-index={idx + 1}
                  onClick={(e) => { e.preventDefault(); scrollToHref(it.link); toggleMenu() }}
                >
                  <span className="sm-panel-itemLabel">{it.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {displaySocials && socialItems && socialItems.length > 0 && (
            <div className="sm-socials" aria-label="Social links">
              <h3 className="sm-socials-title">Socials</h3>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((s, i) => (
                  <li key={s.label + i} className="sm-socials-item">
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
