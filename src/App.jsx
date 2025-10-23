import { useEffect, useRef, useState } from 'react';
import { initLenis } from './lib/lenis';
import { ScrollTrigger } from './lib/gsap';

import IntroLoaderRings from './components/IntroLoaderRings/IntroLoaderRings';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Hero from './sections/Hero/Hero';
import About from './sections/About/About';
import Skills from './sections/Skills/Skills';

// ⛔️ Quitamos WheelSlider
// import WheelSlider from './sections/WheelSlider/WheelSlider';

// ✅ Showcase estilo gsap.com
import Showcase from './sections/Showcase/Showcase';
import { SLIDES } from './data/projects';

import PillNav from './components/PillNav';

export default function App() {
  const [loading, setLoading] = useState(true);
  const initialThemeRef = useRef(null);

  // Inicializa Lenis + ScrollTrigger
  useEffect(() => {
    const lenis = initLenis();

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? window.scrollTo(0, value) : window.scrollY;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      }
    });

    function onScroll() { ScrollTrigger.update(); }
    lenis.on('scroll', onScroll);

    // Primer refresh
    setTimeout(() => ScrollTrigger.refresh(), 0);

    return () => { lenis.off('scroll', onScroll); };
  }, []);

  // Modo oscuro mientras carga + bloqueo de scroll
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (initialThemeRef.current === null) {
      initialThemeRef.current = html.getAttribute('data-theme'); // guarda tema inicial (puede ser null)
    }

    if (loading) {
      html.setAttribute('data-theme', 'dark'); // fuerza oscuro durante el loader
      const prevOverflow = body.style.overflow;
      body.style.overflow = 'hidden';          // bloquea scroll
      return () => { body.style.overflow = prevOverflow; };
    } else {
      // restaura tema inicial (si existía)
      if (initialThemeRef.current === null) {
        html.removeAttribute('data-theme');
      } else {
        html.setAttribute('data-theme', initialThemeRef.current);
      }
      // refresca triggers con el layout ya estable
      setTimeout(() => ScrollTrigger.refresh(), 0);
    }
  }, [loading]);

  return (
    <>
      {/* Intro / Loader (oscuro por defecto) */}
      <IntroLoaderRings
        show={loading}
        duration={2000}
        onDone={() => setLoading(false)}
      />

      {/* <Navbar />  si lo quieres activo, descomenta */}
      <PillNav
        items={[
          { label: 'Inicio',       ariaLabel: 'Ir a inicio',       link: '#hero' },
          { label: 'Sobre mí',     ariaLabel: 'Ir a sobre mí',     link: '#about' },
          { label: 'Habilidades',  ariaLabel: 'Ir a habilidades',  link: '#skills' },
          // 👉 ahora apunta al Showcase
          { label: 'Proyectos',    ariaLabel: 'Ir a proyectos',    link: '#showcase' },
        ]}
        socialItems={[
          { label: 'Twitter',  link: 'https://twitter.com' },
          { label: 'GitHub',   link: 'https://github.com' },
          { label: 'LinkedIn', link: 'https://linkedin.com' },
        ]}
      />

      <main aria-busy={loading}>
        <section id="hero" className="section">
          <Hero />
        </section>

        <section id="about" className="section">
          <About />
        </section>

        <section id="skills" className="section">
          <Skills />
        </section>

        {/* ✅ Showcase tipo GSAP.com (móvil: carrusel horizontal con flechas / desktop: grid 3 col) */}
        <section id="showcase" className="section">
          <Showcase items={SLIDES} />
        </section>
      </main>

      <Footer />
    </>
  );
}
