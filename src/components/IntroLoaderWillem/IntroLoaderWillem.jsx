import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import "./IntroLoaderWillem.css";

const COLS = 22;
const ROWS = 12;
const DOT_COUNT = COLS * ROWS;

export default function IntroLoaderWillem({ onDone }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const dotEls    = root.querySelectorAll(".al-dot");
    const charEls   = root.querySelectorAll(".al-char");
    const subtitleEl = root.querySelector(".al-subtitle-inner");

    // Ocultar letras y subtítulo antes de que empiece el timeline
    // (los tweens dentro de un timeline no aplican `from` de inmediato)
    gsap.set(charEls, { yPercent: 115 });
    gsap.set(subtitleEl, { yPercent: 100, opacity: 0 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: onDone,
      });

      // Fase 1 — puntos aparecen en ripple desde el centro
      tl.fromTo(
        dotEls,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: { each: 0.006, from: "center", grid: [ROWS, COLS] },
        }
      );

      // Fase 2 — puntos se encogen + letras suben simultáneamente
      tl.to(
        dotEls,
        {
          scale: 0,
          opacity: 0,
          duration: 0.45,
          ease: "expo.in",
          stagger: { each: 0.004, from: "center", grid: [ROWS, COLS] },
        },
        "+=0.1"
      );

      tl.to(
        charEls,
        { yPercent: 0, duration: 0.85, stagger: 0.05, ease: "expo.out" },
        "<0.08"
      );

      // Fase 3 — subtítulo sube
      tl.to(
        subtitleEl,
        { yPercent: 0, opacity: 1, duration: 0.65 },
        "-=0.4"
      );

      // Fase 4 — overlay se va a la izquierda (wipe reveal)
      tl.to(
        root,
        { xPercent: -100, duration: 0.85, ease: "expo.inOut" },
        "+=0.55"
      );
    }, root);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div className="al-overlay" ref={rootRef}>
      {/* Grid de puntos */}
      <div className="al-grid" aria-hidden="true">
        {Array.from({ length: DOT_COUNT }).map((_, i) => (
          <span className="al-dot" key={i} />
        ))}
      </div>

      {/* Nombre + subtítulo */}
      <div className="al-content">
        <div className="al-name">
          <div className="al-name__row">
            {"Marc".split("").map((ch, i) => (
              <span className="al-char-wrap" key={`a-${i}`}>
                <span className="al-char">{ch}</span>
              </span>
            ))}
          </div>
          <div className="al-name__row al-name__row--bold">
            {"Mateo".split("").map((ch, i) => (
              <span className="al-char-wrap" key={`b-${i}`}>
                <span className="al-char">{ch}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="al-subtitle">
          <span className="al-subtitle-inner">Frontend Developer</span>
        </div>
      </div>
    </div>
  );
}
