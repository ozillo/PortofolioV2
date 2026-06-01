import { useEffect, useRef, useState } from "react";
import { initLenis } from "./lib/lenis";
import { ScrollTrigger } from "./lib/gsap";

import IntroLoaderWillem from "./components/IntroLoaderWillem/IntroLoaderWillem";

import Footer from "./components/Footer/Footer";
import Hero from "./sections/Hero/Hero";
import About from "./sections/About/About";
import Skills from "./sections/Skills/Skills";

import Showcase from "./sections/Showcase/Showcase";

import PillNav from "./components/PillNav";

export default function App() {
  const [loading, setLoading] = useState(true);
  const initialThemeRef = useRef(null);

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
      {loading && <IntroLoaderWillem onDone={() => setLoading(false)} />}

      {/* Navegación tipo pastillas */}
      <PillNav
        items={[
          { label: "Inicio", ariaLabel: "Ir a inicio", link: "#hero" },
          { label: "Sobre mí", ariaLabel: "Ir a sobre mí", link: "#about" },
          { label: "Habilidades", ariaLabel: "Ir a habilidades", link: "#skills" },
          { label: "Proyectos", ariaLabel: "Ir a proyectos", link: "#projects" },
        ]}
        socialItems={[
          { label: "GitHub", link: "https://github.com/ozillo" },
          { label: "LinkedIn", link: "https://www.linkedin.com/in/marcmateoprieto1990/" },
          { label: "CodePen", link: "https://codepen.io/Marc-Mateo" },
        ]}
      />

      <main aria-busy={loading}>
        {/* === Sección Hero === */}
        <section id="hero" className="section">
          <Hero />
        </section>

        {/* === Sección Sobre mí === */}
        <section id="about" className="section">
          <About />
        </section>

        {/* === Sección Habilidades === */}
        <section id="skills" className="section skills">
          <Skills />
        </section>

        {/* === Nueva Sección Showcase (Proyectos) === */}
        <section id="projects" style={{ scrollMarginTop: "calc(var(--nav-height) + 16px)" }}>
          <Showcase />
        </section>
      </main>

      {/* === Footer === */}
      <Footer />
    </>
  );
}
