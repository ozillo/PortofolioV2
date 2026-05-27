import { useLayoutEffect, useRef } from "react";
import "./Showcase.css";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { getLenis } from "../../lib/lenis";
import { SLIDES } from "../../data/projects";

const N = SLIDES.length;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function ChevronIcon({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      {dir === "left"
        ? <polyline points="15 18 9 12 15 6" />
        : <polyline points="9 6 15 12 9 18" />}
    </svg>
  );
}

export default function Showcase() {
  const outerRef    = useRef(null);
  const cubeRef     = useRef(null);
  const panelRefs   = useRef([]);
  const dotRefs     = useRef([]);
  const counterRef  = useRef(null);
  const prevBtnRef  = useRef(null);
  const nextBtnRef  = useRef(null);
  const currentIdxRef = useRef(0);

  const goPrev = () => scrollToProject(Math.max(0, currentIdxRef.current - 1));
  const goNext = () => scrollToProject(Math.min(N - 1, currentIdxRef.current + 1));

  const scrollToProject = (idx) => {
    const outer = outerRef.current;
    if (!outer) return;
    const outerTop = outer.getBoundingClientRect().top + window.scrollY;
    const target   = outerTop + idx * window.innerHeight;
    const lenis    = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const cube  = cubeRef.current;
    if (!outer || !cube) return;

    const panels = panelRefs.current.filter(Boolean);
    const dots   = dotRefs.current.filter(Boolean);

    gsap.set(panels.slice(1), { opacity: 0, y: 36 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
          onUpdate(self) {
            const idx = Math.min(Math.round(self.progress * (N - 1)), N - 1);
            currentIdxRef.current = idx;
            dots.forEach((el, i) => el.classList.toggle("is-active", i === idx));
            panels.forEach((el, i) => {
              el.setAttribute("aria-hidden", i !== idx ? "true" : "false");
              const cta = el.querySelector(".sc-cta");
              if (cta) cta.setAttribute("tabindex", i !== idx ? "-1" : "0");
            });
            if (counterRef.current) {
              counterRef.current.textContent = String(idx + 1).padStart(2, "0");
            }
            if (prevBtnRef.current) prevBtnRef.current.disabled = idx === 0;
            if (nextBtnRef.current) nextBtnRef.current.disabled = idx === N - 1;
          },
        },
      });

      tl.to(cube, { rotateY: -90 * (N - 1), ease: "none", duration: N - 1 }, 0);

      for (let i = 0; i < N - 1; i++) {
        const t = i + 0.3;
        tl.to(panels[i],     { opacity: 0, y: -36, duration: 0.4 }, t);
        tl.to(panels[i + 1], { opacity: 1, y: 0,   duration: 0.4 }, t);
      }

      setTimeout(() => ScrollTrigger.refresh(), 150);
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    <div className="sc-outer" ref={outerRef} style={{ height: `${N * 100}vh` }}>
      <div className="sc-sticky">

        <span className="sc-section-label" aria-hidden="true">Proyectos</span>

        {/* Side nav dots */}
        <nav className="sc-nav" aria-label="Navegar entre proyectos">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              className={`sc-dot${i === 0 ? " is-active" : ""}`}
              aria-label={`Ir al proyecto ${i + 1}: ${SLIDES[i].name}`}
              onClick={() => scrollToProject(i)}
            />
          ))}
        </nav>

        {/* Main scene */}
        <div className="sc-scene">

          {/* 3D Cube + lateral nav buttons (mobile only) */}
          <div className="sc-cube-area">
            <div className="sc-cube-wrap" aria-hidden="true">
              <div className="sc-cube" ref={cubeRef}>
                {SLIDES.map((item, i) => (
                  <div key={item.id} className={`sc-face sc-face--${i}`}>
                    <img src={item.img} alt={item.name} loading="lazy" draggable="false" />
                  </div>
                ))}
              </div>
            </div>
            <button
              ref={prevBtnRef}
              className="sc-mobile-btn sc-mobile-btn--prev"
              aria-label="Proyecto anterior"
              disabled
              onClick={goPrev}
            >
              <ChevronIcon dir="left" />
            </button>
            <button
              ref={nextBtnRef}
              className="sc-mobile-btn sc-mobile-btn--next"
              aria-label="Proyecto siguiente"
              onClick={goNext}
            >
              <ChevronIcon dir="right" />
            </button>
          </div>

          {/* Info panels */}
          <div className="sc-info">
            {SLIDES.map((item, i) => (
              <article
                key={item.id}
                ref={(el) => (panelRefs.current[i] = el)}
                className="sc-panel"
                aria-hidden={i !== 0 ? "true" : "false"}
              >
                <span className="sc-label">
                  {item.category}
                  <span className="sc-label-sep"> · </span>
                  {item.year}
                </span>
                <h3 className="sc-name">{item.name}</h3>
                <p className="sc-desc">{item.description}</p>
                <div className="sc-stack" aria-label="Tecnologías utilizadas">
                  {item.stack.map((tech) => (
                    <span key={tech} className="sc-tech">{tech}</span>
                  ))}
                </div>
                {item.url && (
                  <a
                    className="sc-cta"
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visitar proyecto ${item.name}`}
                    tabIndex={i !== 0 ? -1 : 0}
                  >
                    <span>Visitar proyecto</span>
                    <ArrowIcon />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* HUD counter */}
        <div className="sc-hud" aria-hidden="true">
          <span className="sc-hud-current" ref={counterRef}>01</span>
          <span className="sc-hud-sep"> / </span>
          <span className="sc-hud-total">{String(N).padStart(2, "0")}</span>
        </div>

      </div>
    </div>
  );
}
