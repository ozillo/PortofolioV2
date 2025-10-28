import { useEffect, useRef, useState } from "react";
import { initLenis } from "./lib/lenis";
import { ScrollTrigger } from "./lib/gsap";

import IntroLoaderRings from "./components/IntroLoaderRings/IntroLoaderRings";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Hero from "./sections/Hero/Hero";
import About from "./sections/About/About";
import Skills from "./sections/Skills/Skills";

// ⛔️ Efecto dividido eliminado para esta sección
// import ImageSplitScroll from "./sections/ImageSplitScroll/ImageSplitScroll";

// ✅ Carrusel con Swiper React
import ProjectsCarousel from "./sections/ProjectsCarousel/ProjectsCarousel";

import PillNav from "./components/PillNav";

export default function App() {
  const [loading, setLoading] = useState(true);
  const initialThemeRef = useRef(null);

  // ✅ Inicializa Lenis + ScrollTrigger
  useEffect(() => {
    const lenis = initLenis();

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? window.scrollTo(0, value) : window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    function onScroll() {
      ScrollTrigger.update();
    }
    lenis.on("scroll", onScroll);

    setTimeout(() => ScrollTrigger.refresh(), 0);

    return () => {
      lenis.off("scroll", onScroll);
    };
  }, []);

  // ✅ Modo oscuro durante carga + bloqueo scroll
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (initialThemeRef.current === null) {
      initialThemeRef.current = html.getAttribute("data-theme");
    }

    if (loading) {
      html.setAttribute("data-theme", "dark");
      const prevOverflow = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = prevOverflow;
      };
    } else {
      if (initialThemeRef.current === null) {
        html.removeAttribute("data-theme");
      } else {
        html.setAttribute("data-theme", initialThemeRef.current);
      }
      setTimeout(() => ScrollTrigger.refresh(), 0);
    }
  }, [loading]);

  return (
    <>
      {/* Loader inicial */}
      <IntroLoaderRings
        show={loading}
        duration={2000}
        onDone={() => setLoading(false)}
      />

      {/* <Navbar /> — descomenta si quieres mostrarlo */}
      <PillNav
        items={[
          { label: "Inicio", ariaLabel: "Ir a inicio", link: "#hero" },
          { label: "Sobre mí", ariaLabel: "Ir a sobre mí", link: "#about" },
          { label: "Habilidades", ariaLabel: "Ir a habilidades", link: "#skills" },
          // ✅ mantiene “Proyectos” apuntando a #projects
          { label: "Proyectos", ariaLabel: "Ir a proyectos", link: "#projects" },
        ]}
        socialItems={[
          { label: "Twitter", link: "https://twitter.com" },
          { label: "GitHub", link: "https://github.com" },
          { label: "LinkedIn", link: "https://linkedin.com" },
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

        {/* ✅ Nueva sección "Proyectos" como carrusel Swiper */}
        <section id="projects" className="section">
          <ProjectsCarousel />
        </section>
      </main>

      <Footer />
    </>
  );
}
