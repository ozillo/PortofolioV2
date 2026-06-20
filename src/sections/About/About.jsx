import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import './About.css';

const CHIPS = ['React', 'GSAP', 'TypeScript', 'UI / UX'];

export default function About() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="about" role="region" aria-label="Texto sobre mí">
      <div className="about__container" ref={containerRef}>
        <span className="about__eyebrow">Frontend Developer</span>
        <h2 className="about__title">Sobre mí</h2>
        <p className="about__text">
          Me dedico a diseñar y desarrollar experiencias digitales funcionales y con carácter propio.
          Trabajo con <strong>React</strong> y <strong>GSAP</strong> para crear interfaces fluidas,
          accesibles y de alto rendimiento. Pongo atención en cada detalle para reforzar la identidad
          visual y generar impacto real.
        </p>
        <ul className="about__chips" aria-label="Tecnologías principales">
          {CHIPS.map(chip => (
            <li key={chip} className="about__chip">{chip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
