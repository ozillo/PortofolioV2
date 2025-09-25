import './Hero.css'
import { useEffect, useMemo, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import ProfileCard from '../../components/ProfileCard/ProfileCard'
import avatar from '../../assets/marc.png'

export default function Hero() {
  const h1Ref = useRef(null)
  const pRef = useRef(null)

  const title = 'Hola, soy Marc Mateo'
  const subtitle = 'Frontend Developer — React, GSAP, efectos visuales y experiencias fluidas.'
  const titleWords = useMemo(() => title.split(' '), [title])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(h1Ref.current.querySelectorAll('.word'), {
        yPercent: 120,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06
      })
      tl.from(pRef.current, { y: 20, opacity: 0, duration: 0.6 }, '-=0.2')
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="container hero hero--with-card">
      <div className="hero__col">
        <h1 ref={h1Ref} className="hero__title" aria-label={title}>
          {titleWords.map((w, i) => (
            <span className="word-wrap" key={i}>
              <span className={`word ${w.toLowerCase() === 'marc' || w.toLowerCase() === 'mateo' ? 'accent' : ''}`}>
                {w}
              </span>{' '}
            </span>
          ))}
        </h1>
        <p ref={pRef} className="hero__subtitle">{subtitle}</p>
      </div>

      <div className="hero__col hero__card">
        <ProfileCard
          name="Marc Mateo"
          title="Frontend Developer"
          handle="marc-mateo"
          status="Online"
          contactText="Contacto"
          avatarUrl={avatar}
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}      // ponlo a true si quieres tilt en móvil (requiere HTTPS y permiso)
          onContactClick={() => console.log('Contact clicked')}
          // Opcional: apaga el “glow” de fondo si prefieres más sobrio:
          // showBehindGradient={false}
        />
      </div>
    </div>
  )
}
