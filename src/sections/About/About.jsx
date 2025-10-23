import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/gsap'; // ya lo tienes en /lib
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Solo anima si el usuario no pide reducir movimiento
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
          // ScrollTrigger simple, sin scrub ni hacks de scroll
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
        <h2 className="about__title">Sobre mí</h2>
        <p className="about__text">
          Me dedico a diseñar y desarrollar experiencias digitales funcionales y con carácter propio.
          Trabajo con <strong>React</strong> y <strong>GSAP</strong> para crear interfaces fluidas,
          accesibles y de alto rendimiento. Pongo atención en cada detalle para reforzar la identidad
          visual y generar impacto real.
        </p>
      </div>
    </div>
  );
}
