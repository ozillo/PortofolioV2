import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./CarouselRB.css";

/**
 * CarouselRB — React Bits-like
 * Props:
 * - items: [{ image, title?, description?, link? }]
 * - slidesPerView: { base:1, sm:1, md:2, lg:3 }   // breakpoints
 * - gap: number (px)                               // espacio entre tarjetas
 * - loop: boolean
 * - autoplayMs: number | null                      // ej. 3500 (null para desactivar)
 * - showArrows: boolean
 * - showDots: boolean
 * - aspectRatio: string (ej. "16/9", "3/4")
 */
export default function CarouselRB({
  items = [],
  slidesPerView = { base: 1, sm: 1, md: 2, lg: 3 },
  gap = 16,
  loop = true,
  autoplayMs = 4000,
  showArrows = true,
  showDots = true,
  aspectRatio = "16/9",
}) {
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const roRef = useRef(null);

  // Estado
  const [viewportW, setViewportW] = useState(0);
  const [spv, setSpv] = useState(1); // slides per view efectivo
  const [slideW, setSlideW] = useState(0);
  const [index, setIndex] = useState(0); // índice VIRTUAL (incluye clones)
  const [isDragging, setIsDragging] = useState(false);

  // Gesture cache
  const dragRef = useRef({ startX: 0, lastX: 0, lastT: 0, vx: 0 });
  const autoRef = useRef({ id: 0 });

  // === Datos y clones para loop ===
  const hasLoop = loop && items.length > 1;
  const clonedItems = useMemo(() => {
    if (!hasLoop) return items;
    // Para loop suave, clonamos spv elementos en cada extremo. Usar 3 por estabilidad.
    const k = 3;
    const head = items.slice(-k);
    const tail = items.slice(0, k);
    return [...head, ...items, ...tail];
  }, [items, hasLoop]);

  const realCount = items.length;
  const total = clonedItems.length;

  // índice real (0..realCount-1)
  const realIndex = useMemo(() => {
    if (!hasLoop) return index;
    // mapea index virtual a real (desfase k)
    const k = 3;
    return ((index - k) % realCount + realCount) % realCount;
  }, [index, realCount, hasLoop]);

  // === Breakpoints simples
  const computeSpv = useCallback((w) => {
    // base <640, sm >=640, md >=768, lg >=1024
    if (w >= 1024) return slidesPerView.lg ?? 3;
    if (w >= 768) return slidesPerView.md ?? 2;
    if (w >= 640) return slidesPerView.sm ?? 1;
    return slidesPerView.base ?? 1;
  }, [slidesPerView]);

  // Resize observer
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const resize = () => {
      const w = el.clientWidth;
      setViewportW(w);
      const nextSpv = computeSpv(w);
      setSpv(nextSpv);
      const innerGap = gap * (nextSpv - 1);
      const sw = Math.max(1, Math.floor((w - innerGap) / nextSpv));
      setSlideW(sw);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    roRef.current = ro;
    return () => ro.disconnect();
  }, [computeSpv, gap]);

  // Posición (translateX) según índice
  const trackStyle = useMemo(() => {
    const x = -(index * (slideW + gap));
    return {
      transform: `translate3d(${x}px,0,0)`,
      transition: isDragging ? "none" : "transform 380ms cubic-bezier(.22,.61,.36,1)",
      gap: `${gap}px`,
    };
  }, [index, slideW, gap, isDragging]);

  // Inicializa index en el primer real (k)
  useEffect(() => {
    if (!hasLoop) {
      setIndex(0);
      return;
    }
    const k = 3;
    setIndex(k); // arrancamos en el primer real
  }, [hasLoop]);

  // Ajuste al terminar transición (si estamos en clones)
  const onTransitionEnd = () => {
    if (!hasLoop) return;
    const k = 3;
    if (index < k) {
      // saltar al final real
      setIndex(k + realCount - 1);
    } else if (index >= k + realCount) {
      // saltar al inicio real
      setIndex(k);
    }
  };

  // Navegación
  const goTo = (i) => {
    // limita (sin loop) o permite (con loop)
    if (!hasLoop) {
      const max = Math.max(0, realCount - spv);
      setIndex(Math.max(0, Math.min(i, max)));
    } else {
      setIndex(i);
    }
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);
  const goToReal = (ri) => {
    if (!hasLoop) return setIndex(ri);
    const k = 3;
    setIndex(k + ri);
  };

  // Autoplay
  useEffect(() => {
    if (!autoplayMs) return;
    clearInterval(autoRef.current.id);
    autoRef.current.id = setInterval(() => {
      next();
    }, Math.max(1200, autoplayMs));
    return () => clearInterval(autoRef.current.id);
  }, [autoplayMs, index]); // reinicia temporizador al mover

  // Gestos
  function onPointerDown(e) {
    setIsDragging(true);
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragRef.current = { startX: x, lastX: x, lastT: performance.now(), vx: 0 };
    // Pausa autoplay durante drag
    clearInterval(autoRef.current.id);
  }
  function onPointerMove(e) {
    if (!isDragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? dragRef.current.lastX;
    const now = performance.now();
    const dx = x - dragRef.current.lastX;
    const dt = Math.max(1, now - dragRef.current.lastT);
    const vx = dx / dt;

    // Mover el track “a mano” ajustando index de forma continua
    const deltaSlides = -dx / (slideW + gap);
    // movimiento continuo: acumulamos en un ref virtual y luego setIndex al final
    // Para simplicidad, aplicamos “snap” inmediato:
    if (Math.abs(dx) > 0) {
      // efecto de seguimiento: empuja el translate con CSS variable
      // En nuestro caso actualizamos index en tiempo real para feedback:
      setIndex((i) => i + deltaSlides);
    }

    dragRef.current.lastX = x;
    dragRef.current.lastT = now;
    dragRef.current.vx = vx;
  }
  function onPointerUp() {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap al slide más cercano (teniendo en cuenta la fricción/velocidad)
    const sign = dragRef.current.vx > 0 ? -1 : 1; // si arrastras hacia la izq (dx negativo), avanza
    const velocityBoost = Math.abs(dragRef.current.vx) > 0.25 ? sign : 0;

    // Redondear al entero (slide) más cercano
    setIndex((i) => Math.round(i + velocityBoost));

    // Reanuda autoplay
    if (autoplayMs) {
      clearInterval(autoRef.current.id);
      autoRef.current.id = setInterval(() => next(), Math.max(1200, autoplayMs));
    }
  }

  // Normaliza índice (evita fracciones al hacer resize/drag)
  useEffect(() => {
    // bloquea a rango válido cuando NO hay loop
    if (!hasLoop) {
      const max = Math.max(0, realCount - spv);
      if (index < 0) setIndex(0);
      if (index > max) setIndex(max);
    }
  }, [index, hasLoop, realCount, spv]);

  // Teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Pista: construye tarjetas
  return (
    <div className="rb-carousel" ref={wrapRef}>
      {showArrows && (
        <>
          <button
            className="rbc-arrow rbc-arrow--left"
            aria-label="Anterior"
            onClick={prev}
          >
            <Chevron />
          </button>
          <button
            className="rbc-arrow rbc-arrow--right"
            aria-label="Siguiente"
            onClick={next}
          >
            <Chevron />
          </button>
        </>
      )}

      <div
        className={`rbc-viewport ${isDragging ? "is-dragging" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
        onWheel={(e) => {
          e.preventDefault();
          const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
          if (delta > 0) next(); else prev();
        }}
      >
        <ul
          className="rbc-track"
          ref={trackRef}
          style={trackStyle}
          onTransitionEnd={onTransitionEnd}
        >
          {clonedItems.map((it, i) => (
            <li
              key={`${it.title ?? it.image}-${i}`}
              className="rbc-slide"
              style={{
                width: `${slideW}px`,
              }}
            >
              <article className="rbc-card" style={{ aspectRatio }}>
                <img src={it.image} alt={it.title ?? "slide"} loading={i < 6 ? "eager" : "lazy"} />
                {(it.title || it.description || it.link) && (
                  <div className="rbc-caption">
                    {it.title && <h3 className="rbc-title">{it.title}</h3>}
                    {it.description && <p className="rbc-desc">{it.description}</p>}
                    {it.link && (
                      <a
                        className="rbc-btn"
                        href={it.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Abrir ${it.title ?? "proyecto"}`}
                      >
                        <BrowserIcon />
                      </a>
                    )}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>

      {showDots && realCount > 1 && (
        <div className="rbc-dots" role="tablist" aria-label="posición del carrusel">
          {Array.from({ length: realCount }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={realIndex === i}
              className={`rbc-dot ${realIndex === i ? "is-active" : ""}`}
              onClick={() => goToReal(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function BrowserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="3" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="6.5" cy="6" r="0.9" fill="currentColor" />
      <circle cx="9.5" cy="6" r="0.9" fill="currentColor" />
      <circle cx="12.5" cy="6" r="0.9" fill="currentColor" />
    </svg>
  );
}
