import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Showcase.css";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { SLIDES } from "../../data/projects"; // ← usa tus slides

gsap.registerPlugin(ScrollTrigger);

// Icono navegador (SVG inline, hereda currentColor)
function BrowserIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path
        d="M4 4h16a2 2 0 0 1 2 2v3H2V6a2 2 0 0 1 2-2zm18 7H2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7zM6 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm3 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zm3 0a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Showcase() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil (sin depender del padre)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 991px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  // Animación de entrada (compatible con Lenis + ScrollTrigger de tu App)
  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".show-card");
      gsap.set(cards, { y: 24, opacity: 0 });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.06,
          }),
      });

      rootRef.current.querySelectorAll("img").forEach((img) => {
        if (img.complete) return;
        img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
      });
    }, rootRef);

    setTimeout(() => ScrollTrigger.refresh(), 0);
    return () => ctx.revert();
  }, []);

  // Flechas en móvil
  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -Math.round(window.innerWidth * 0.7), behavior: "smooth" });
  };
  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: Math.round(window.innerWidth * 0.7), behavior: "smooth" });
  };

  return (
    <div className="showcase-v3" ref={rootRef}>
      <header className="show-head">
        <h2 className="show-title">Portafolio &amp; Proyectos Anteriores</h2>
        <p className="show-sub">
          He construido distintos proyectos para cubrir necesidades específicas de cada cliente.
          Si quieres ver más ejemplos de mi trabajo además de los que aparecen aquí, ¡contáctame!
        </p>
      </header>

      {isMobile ? (
        <div className="show-mobile">
          <button className="show-arrow" aria-label="Desplazar a la izquierda" onClick={scrollLeft}>‹</button>
          <div className="show-track" ref={trackRef} role="list">
            {SLIDES.map((item) => <Card key={item.id} item={item} mobile />)}
          </div>
          <button className="show-arrow" aria-label="Desplazar a la derecha" onClick={scrollRight}>›</button>
        </div>
      ) : (
        <div className="show-grid" role="list">
          {SLIDES.map((item) => <Card key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}

function Card({ item, mobile = false }) {
  const { name, img, url, description } = item;
  return (
    <article className={`show-card ${mobile ? "is-mobile" : ""}`} role="listitem">
      <div className="show-imgWrap">
        <img src={img} alt={name} loading="lazy" />
      </div>
      <div className="show-meta">
        <h3 className="show-name">{name}</h3>
        {description ? <p className="show-desc">{description}</p> : null}
        {url ? (
          <a
            className="show-btn"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visitar el proyecto ${name}`}
          >
            <BrowserIcon />
            <span>Visitar proyecto</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
