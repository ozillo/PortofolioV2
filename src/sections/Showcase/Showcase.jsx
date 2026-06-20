import { useLayoutEffect, useRef } from "react";
import "./Showcase.css";
import { gsap } from "../../lib/gsap";
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
  const cubeRef        = useRef(null);
  const cubeWrapRef    = useRef(null);
  const panelRefs      = useRef([]);
  const dotRefs        = useRef([]);
  const counterRef     = useRef(null);
  const angleRef       = useRef(0);
  const currentIdxRef  = useRef(0);
  const isAnimatingRef = useRef(false);
  const touchStartRef  = useRef(null); // { x, y } recorded on touchstart
  const isDraggingRef  = useRef(false);

  // Pre-position both adjacent faces so drag in either direction looks right
  const prepareAdjacentFaces = () => {
    const faces = Array.from(cubeRef.current.children);
    const base  = angleRef.current;
    const cur   = currentIdxRef.current;
    const nextI = (cur + 1) % N;
    const prevI = ((cur - 1) + N) % N;
    if (nextI !== cur) {
      faces[nextI].style.setProperty("--face-ry", `${((-(base - 90)) % 360 + 360) % 360}deg`);
    }
    if (prevI !== cur) {
      faces[prevI].style.setProperty("--face-ry", `${((-(base + 90)) % 360 + 360) % 360}deg`);
    }
  };

  const navigate = (dir, duration = 0.75) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const cube   = cubeRef.current;
    const faces  = Array.from(cube.children);
    const panels = panelRefs.current.filter(Boolean);
    const dots   = dotRefs.current.filter(Boolean);

    const prevIdx  = currentIdxRef.current;
    const newAngle = angleRef.current + (dir === "next" ? -90 : 90);
    const newIdx   = ((prevIdx + (dir === "next" ? 1 : -1)) + N) % N;

    // Reposition target face to align with the incoming cube angle
    const faceLocalAngle = ((-newAngle % 360) + 360) % 360;
    faces[newIdx].style.setProperty("--face-ry", `${faceLocalAngle}deg`);

    gsap.to(cube, {
      rotateY: newAngle,
      duration,
      ease: duration < 0.6 ? "expo.out" : "expo.inOut",
      onComplete: () => { isAnimatingRef.current = false; },
    });

    const panelDur = Math.min(duration * 0.5, 0.35);
    gsap.to(panels[prevIdx], { opacity: 0, y: dir === "next" ? -36 : 36, duration: panelDur, ease: "power2.in" });
    gsap.fromTo(
      panels[newIdx],
      { opacity: 0, y: dir === "next" ? 36 : -36 },
      { opacity: 1, y: 0, duration: panelDur + 0.05, ease: "power2.out", delay: panelDur * 0.7 }
    );

    angleRef.current      = newAngle;
    currentIdxRef.current = newIdx;
    dots.forEach((el, i) => el.classList.toggle("is-active", i === newIdx));
    if (counterRef.current) counterRef.current.textContent = String(newIdx + 1).padStart(2, "0");
    panels.forEach((el, i) => {
      el.setAttribute("aria-hidden", i !== newIdx ? "true" : "false");
      const cta = el.querySelector(".sc-cta");
      if (cta) cta.setAttribute("tabindex", i !== newIdx ? "-1" : "0");
    });
  };

  const goToIdx = (targetIdx) => {
    if (targetIdx === currentIdxRef.current) return;
    const forwardSteps = ((targetIdx - currentIdxRef.current) + N) % N;
    navigate(forwardSteps <= N / 2 ? "next" : "prev");
  };

  useLayoutEffect(() => {
    gsap.set(panelRefs.current.filter(Boolean).slice(1), { opacity: 0, y: 36 });

    const cubeWrap = cubeWrapRef.current;
    if (!cubeWrap) return;

    let lockAxis = null; // null | "h" | "v" — determined on first move

    const onTouchStart = (e) => {
      if (isAnimatingRef.current) return;
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
      isDraggingRef.current  = false;
      lockAxis = null;
      // Stop any running tween so drag starts from the real current position
      gsap.killTweensOf(cubeRef.current);
      prepareAdjacentFaces();
    };

    const onTouchMove = (e) => {
      if (!touchStartRef.current) return;
      const t      = e.touches[0];
      const deltaX = t.clientX - touchStartRef.current.x;
      const deltaY = t.clientY - touchStartRef.current.y;

      // Determine horizontal vs vertical on first meaningful movement
      if (!lockAxis) {
        if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return;
        lockAxis = Math.abs(deltaX) >= Math.abs(deltaY) ? "h" : "v";
      }

      if (lockAxis !== "h") return; // vertical → let browser scroll
      e.preventDefault();

      isDraggingRef.current = true;
      const rotDelta = (deltaX / (cubeWrap.offsetWidth || 300)) * -90;
      gsap.set(cubeRef.current, { rotateY: angleRef.current + rotDelta });
    };

    const onTouchEnd = (e) => {
      if (!touchStartRef.current) return;
      const deltaX = (e.changedTouches[0]?.clientX ?? touchStartRef.current.x) - touchStartRef.current.x;
      touchStartRef.current = null;

      if (!isDraggingRef.current) return; // tap, not swipe — ignore
      isDraggingRef.current = false;

      if (Math.abs(deltaX) > 40) {
        // Commit to the direction with a snappy duration
        navigate(deltaX < 0 ? "next" : "prev", 0.45);
      } else {
        // Not enough distance — snap back to current face
        isAnimatingRef.current = true;
        gsap.to(cubeRef.current, {
          rotateY: angleRef.current,
          duration: 0.4,
          ease: "expo.out",
          onComplete: () => { isAnimatingRef.current = false; },
        });
      }
    };

    cubeWrap.addEventListener("touchstart", onTouchStart, { passive: true });
    cubeWrap.addEventListener("touchmove",  onTouchMove,  { passive: false });
    cubeWrap.addEventListener("touchend",   onTouchEnd,   { passive: true });

    return () => {
      cubeWrap.removeEventListener("touchstart", onTouchStart);
      cubeWrap.removeEventListener("touchmove",  onTouchMove);
      cubeWrap.removeEventListener("touchend",   onTouchEnd);
    };
  }, []);

  return (
    <div className="sc-outer">
      <div className="sc-sticky">

        <span className="sc-section-label" aria-hidden="true">Proyectos</span>

        <nav className="sc-nav" aria-label="Navegar entre proyectos">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              className={`sc-dot${i === 0 ? " is-active" : ""}`}
              aria-label={`Ir al proyecto ${i + 1}: ${SLIDES[i].name}`}
              onClick={() => goToIdx(i)}
            />
          ))}
        </nav>

        <div className="sc-scene">
          <div className="sc-cube-area">
            <button
              className="sc-nav-btn sc-nav-btn--prev"
              aria-label="Proyecto anterior"
              onClick={() => navigate("prev")}
            >
              <ChevronIcon dir="left" />
            </button>

            <div className="sc-cube-wrap" ref={cubeWrapRef} aria-hidden="true">
              <div className="sc-cube" ref={cubeRef}>
                {SLIDES.map((item, i) => (
                  <div key={item.id} className={`sc-face sc-face--${i}`}>
                    <img src={item.img} alt={item.name} loading="lazy" draggable="false" />
                  </div>
                ))}
              </div>
            </div>

            <button
              className="sc-nav-btn sc-nav-btn--next"
              aria-label="Proyecto siguiente"
              onClick={() => navigate("next")}
            >
              <ChevronIcon dir="right" />
            </button>
          </div>

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

        <div className="sc-hud" aria-hidden="true">
          <span className="sc-hud-current" ref={counterRef}>01</span>
          <span className="sc-hud-sep"> / </span>
          <span className="sc-hud-total">{String(N).padStart(2, "0")}</span>
        </div>

      </div>
    </div>
  );
}
