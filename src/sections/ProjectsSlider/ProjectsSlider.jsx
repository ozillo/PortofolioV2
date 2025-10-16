import { useEffect, useMemo, useRef, useState } from "react";
import "./ProjectsSlider.css";

const SLIDES = [
  {
    type: "card",
    name: "Saüc Floristeria",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/178shots_so_sl7d7v.png",
    description: "Diseño visual y branding para floristería artesanal.",
    url: "http://xn--sacfloristeria-hsb.cat/",
  },
  {
    type: "card",
    name: "DevLink",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141366/PortofolioMarcMateo/433shots_so_sm2qmq.png",
    description: "Plataforma para conectar desarrolladores con oportunidades.",
    url: "https://frontend-final-project-ip0mr7t7q.vercel.app/home",
  },
  {
    type: "card",
    name: "Fem Camí",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/114shots_so_wgpxss.png",
    description: "Campaña comunitaria enfocada en la sostenibilidad.",
    url: "https://www.femcami.cat/",
  },
];

export default function ProjectsSlider() {
  const cards = SLIDES;
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  // índice extendido (0 = clon último, 1..n = reales, n+1 = clon primero)
  const [index, setIndex] = useState(1);
  const indexRef = useRef(index);
  useEffect(() => { indexRef.current = index; }, [index]);

  const [isInstant, setIsInstant] = useState(false);

  const extended = useMemo(() => {
    const first = cards[0];
    const last = cards[cards.length - 1];
    return [last, ...cards, first];
  }, [cards]);

  const realCount = cards.length;
  const lastIdx = extended.length - 1;

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);
  const goTo = (iReal) => setIndex(iReal + 1);
  const activeDot = ((index - 1) % realCount + realCount) % realCount;

  // teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") next();
      if (e.key === "ArrowLeft" || e.key === "PageUp") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // swipe táctil / arrastre
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let startX = 0, currentX = 0, isDown = false, moved = false;
    const getX = (e) => ("touches" in e ? e.touches[0].clientX : e.clientX) ?? 0;

    const onStart = (e) => { isDown = true; moved = false; startX = getX(e); };
    const onMove = (e) => {
      if (!isDown) return;
      currentX = getX(e);
      if (Math.abs(currentX - startX) > 10) moved = true;
    };
    const onEnd = () => {
      if (!isDown) return;
      const dx = currentX - startX;
      if (moved && Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      isDown = false; startX = 0; currentX = 0; moved = false;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("pointerdown", onStart);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onEnd);
    el.addEventListener("pointerleave", onEnd);

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("pointerdown", onStart);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onEnd);
      el.removeEventListener("pointerleave", onEnd);
    };
  }, []);

  // bucle infinito (teletransportes al cruzar clones)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onTransitionEnd = () => {
      if (indexRef.current === lastIdx) {
        setIsInstant(true);
        setIndex(1);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsInstant(false)));
      } else if (indexRef.current === 0) {
        setIsInstant(true);
        setIndex(realCount);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsInstant(false)));
      }
    };

    track.addEventListener("transitionend", onTransitionEnd);
    return () => track.removeEventListener("transitionend", onTransitionEnd);
  }, [lastIdx, realCount]);

  // rueda con throttle
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let last = 0;
    const THROTTLE_MS = 650;

    const onWheel = (e) => {
      const now = Date.now();
      const dy = e.deltaY;
      if (Math.abs(dy) < 10) return;
      if (now - last < THROTTLE_MS) { e.preventDefault(); return; }

      last = now;
      dy > 0 ? next() : prev();
      e.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Iconos Chevron Circular
  const ArrowCircleLeft = () => (
    <svg className="ps__icon" width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2"/>
      <path d="M13 16l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const ArrowCircleRight = () => (
    <svg className="ps__icon" width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2"/>
      <path d="M11 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <section className="projects-slider" id="projects" aria-label="Proyectos">
      <div className="ps__viewport" aria-live="polite" ref={viewportRef}>
        <div
          className={`ps__track ${isInstant ? "is-instant" : ""}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
          ref={trackRef}
        >
          {extended.map((p, i) => (
            <article className="ps__slide" key={`${p.name}-${i}`} aria-hidden={index !== i}>
              <div className="ps__wrap">
                {/* Texto */}
                <div className="ps__content">
                  <h2 className="ps__title">{p.name}</h2>
                  <p className="ps__desc">{p.description}</p>
                  <a
                    className="ps__btn"
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} — abrir proyecto en nueva pestaña`}
                  >
                    Ver proyecto
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"></path>
                      <path d="M5 5h5V3H3v7h2V5zM19 19h-5v2h7v-7h-2v5zM5 19v-5H3v7h7v-2H5z"></path>
                    </svg>
                  </a>
                </div>

                {/* Imagen */}
                <div className="ps__mediaCard">
                  <div className="ps__mediaInner">
                    <img
                      src={p.img}
                      alt={p.name}
                      loading={i === 1 ? "eager" : "lazy"}
                      decoding="async"
                      fetchpriority={i === 1 ? "high" : "auto"}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* CONTROLES INFERIORES (estilo carrusel tradicional) */}
      <div className="ps__controls" aria-label="Controles de carrusel">
        <button className="ps__nav ps__nav--prev" onClick={prev} aria-label="Anterior">
          <ArrowCircleLeft />
        </button>

        <div className="ps__dots" role="tablist" aria-label="Ir a slide">
          {cards.map((_, i) => (
            <button
              key={i}
              className={`ps__dot ${activeDot === i ? "is-active" : ""}`}
              aria-label={`Slide ${i + 1}`}
              aria-selected={activeDot === i}
              role="tab"
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <button className="ps__nav ps__nav--next" onClick={next} aria-label="Siguiente">
          <ArrowCircleRight />
        </button>
      </div>
    </section>
  );
}
