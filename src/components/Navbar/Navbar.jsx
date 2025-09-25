import './Navbar.css'
import { useMemo, useState, useEffect } from 'react'
import { getLenis } from '../../lib/lenis'
import { ScrollTrigger } from '../../lib/gsap'
import useTheme from '../../hooks/useTheme'

const LINKS = [
  { id: 'hero', label: 'Inicio' },
  { id: 'about', label: 'Sobre mí' },
  { id: 'skills', label: 'Habilidades' },
  { id: 'collaborations', label: 'Colaboraciones' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [active, setActive] = useState(LINKS[0].id)
  const ids = useMemo(() => LINKS.map(l => l.id), [])

  useEffect(() => {
    const triggers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 60%',
        onEnter:     () => setActive(id),
        onEnterBack: () => setActive(id),
      })
    }).filter(Boolean)

    ScrollTrigger.refresh()
    return () => triggers.forEach(t => t.kill())
  }, [ids])

  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(el, { offset: -80 })
    } else {
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: top - 80, behavior: 'smooth' })
    }
  }

  return (
    <header className="navbar">
      <nav className="navbar__inner container">
        <div className="navbar__brand">Marc Mateo</div>

        <ul className="navbar__links">
          {LINKS.map(l => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={active === l.id ? 'active' : ''}
                onClick={(e) => handleClick(e, l.id)}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-pressed={theme === 'light'}
          aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
          title={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>
    </header>
  )
}
