import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "../../lib/gsap";
import "./CarouselCoverflow.css";

export default function CarouselCoverflow({
  items = [],
  headingTitle = "Colaboraciones & Proyectos",
  headingSub = "He desarrollado diversos proyectos que se adaptan a diferentes diseños según cada modalidad. Si deseas ver más ejemplos de mi trabajo además de los que se muestran en este sitio, ¡contáctame!",
  spread = 180,
  depth = 560,
  tilt = 65,
  sag = 28,
  perspective = 1200,
  autoplayMs = null,
}) {
  const wrapRef = useRef(null);

  const [active, setActive] = useState(0);
  const data = useMemo(() => items.map((it, i) => ({ ...it, _i: i })), [items]);
  const N = data.length;
  const wrapIdx = gsap.utils.wrap(0, N);

  // —— curva de coverflow
  const curve = (d) => {
    const side = Math.sign(d);
    const ad = Math.abs(d);
    const rotateY = side * gsap.utils.clamp(0, 1, ad) * tilt;
    const x = side * (ad ** 1.06) * spread;
    const z = -Math.min(depth, (ad ** 1.18) * depth);
    const y = Math.min(sag, (ad ** 1.12) * (sag * 0.8));
    const scale = 1 - Math.min(0.5, ad * 0.12);
    const opacity = gsap.utils.clamp(0.12, 1, 1 - ad * 0.22);
    const zIndex = Math.round(1000 - ad * 20);
    return { x, y, z, rotateY, scale, opacity, zIndex };
  };

  const apply = (index, frac = 0) => {
    const slides = wrapRef.current?.querySelectorAll(".ccf__slide");
    if (!slides) return;
    slides.forEach((el, i) => {
      let d = i - (index + frac);
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;
      const { x, y, z, rotateY, scale, opacity, zIndex } = curve(d);
      gsap.set(el, {
        zIndex,
        opacity,
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
      });
    });
  };

  const shortestDelta = (from, to, length) => {
    let delta = (to - from) % length;
    if (delta > length / 2) delta -= length;
    if (delta < -length / 2) delta += length;
    return delta;
  };

  const toIndex = (next) => {
    if (N <= 0) return;
    const from = active;
    const delta = shortestDelta(from, next, N);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: delta,
      duration: 0.55,
      ease: "power3.out",
      onUpdate: () => apply(from, obj.v),
      onComplete: () => {
        const final = wrapIdx(next);
        setActive(final);
        apply(final, 0);
      },
    });
  };

  const next = () => toIndex(active + 1);
  const prev = () => toIndex(active - 1);

  // primer render + resize
  useEffect(() => {
    apply(active, 0);
    const onResize = () => apply(active, 0);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [N]);

  // WHEEL: solo captura intención horizontal (no blocar scroll vertical)
  const wheelCooldownRef = useRef(false);
  const onWheel = (e) => {
    // mide intención horizontal: dx dominante y suficiente magnitud
    const dx = Math.abs(e.deltaX);
    const dy = Math.abs(e.deltaY);
    const horizontalIntent = dx > dy * 1.25 && dx > 8; // umbral y dominancia

    if (!horizontalIntent) return; // dejar pasar scroll vertical

    // consumimos el gesto solo si vamos a navegar
    e.preventDefault();
    if (wheelCooldownRef.current) return;
    wheelCooldownRef.current = true;

    if (e.deltaX > 0) next();
    else prev();

    // cooldown para no saltar varias cartas con un gesto
    setTimeout(() => (wheelCooldownRef.current = false), 280);
  };

  // DRAG
  const drag = useRef({ down: false, x: 0, last: 0, t: 0, vx: 0 });
  const onDown = (e) => {
    drag.current.down = true;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    drag.current.x = x;
    drag.current.last = x;
    drag.current.t = performance.now();
    drag.current.vx = 0;
  };
  const onMove = (e) => {
    if (!drag.current.down) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? drag.current.last;
    const now = performance.now();
    const dx = x - drag.current.last;
    const dt = Math.max(1, now - drag.current.t);
    const frac = dx / spread;
    apply(active, -frac);
    drag.current.vx = dx / dt;
    drag.current.last = x;
    drag.current.t = now;
  };
  const onUp = () => {
    if (!drag.current.down) return;
    drag.current.down = false;
    const boost = Math.abs(drag.current.vx) > 0.4 ? (drag.current.vx > 0 ? -1 : 1) : 0;
    toIndex(active + boost);
  };

  // autoplay (opcional)
  useEffect(() => {
    if (!autoplayMs || N < 2) return;
    const id = setInterval(next, Math.max(1200, autoplayMs));
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, autoplayMs, N]);

  return (
    <section id="coverflow" className="ccf">
      {/* Heading */}
      <header className="ccf__heading">
        <h2 className="ccf__titleSec">{headingTitle}</h2>
        <p className="ccf__subtitleSec">{headingSub}</p>
      </header>

      {/* Carrusel (perspective SOLO aquí) */}
      <div
        className="ccf__wrap ccf--mask"
        ref={wrapRef}
        style={{ perspective: `${perspective}px` }}
        onWheel={onWheel}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        {data.map((it, i) => (
          <article
            className={`ccf__slide ${i === active ? "is-active" : ""}`}
            key={`${it.title ?? it.image}-${i}`}
            onClick={() => toIndex(i)}
          >
            <img
              src={it.image}
              alt={it.title ?? `slide ${i + 1}`}
              loading={i < 5 ? "eager" : "lazy"}
            />
            {(it.title || it.description || it.link) && (
              <div className="ccf__caption">
                {it.title && <h3 className="ccf__capTitle">{it.title}</h3>}
                {it.description && <p className="ccf__capDesc">{it.description}</p>}
                {it.link && (
                  <a
                    className="ccf__btn"
                    href={it.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${it.title ?? "proyecto"}`}
                  >
                    ↗
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Controles */}
      <div className="ccf__ui">
        <button className="ccf__ctrl" onClick={() => toIndex(active - 1)} aria-label="Anterior">‹</button>
        <button className="ccf__ctrl" onClick={() => toIndex(active + 1)} aria-label="Siguiente">›</button>
      </div>
    </section>
  );
}
