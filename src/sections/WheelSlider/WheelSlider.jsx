import { useLayoutEffect, useMemo, useRef, useState } from "react";
import "./WheelSlider.css";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

const SLIDES = [
  {
    name: "Saüc Floristeria",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/178shots_so_sl7d7v.png",
    url: "http://xn--sacfloristeria-hsb.cat/",
    description: "Diseño visual y branding para floristería artesanal."
  },
  {
    name: "DevLink",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141366/PortofolioMarcMateo/433shots_so_sm2qmq.png",
    url: "https://frontend-final-project-ip0mr7t7q.vercel.app/home",
    description: "Plataforma para conectar desarrolladores con oportunidades."
  },
  {
    name: "Fem Camí",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/114shots_so_wgpxss.png",
    url: "https://www.femcami.cat/",
    description: "Campaña comunitaria enfocada en la sostenibilidad."
  },

  // duplica o añade más proyectos reales si quieres
  {
    name: "Saüc Floristeria",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/178shots_so_sl7d7v.png",
    url: "http://xn--sacfloristeria-hsb.cat/",
    description: "Diseño visual y branding para floristería artesanal."
  },
  {
    name: "DevLink",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141366/PortofolioMarcMateo/433shots_so_sm2qmq.png",
    url: "https://frontend-final-project-ip0mr7t7q.vercel.app/home",
    description: "Plataforma para conectar desarrolladores con oportunidades."
  },
  {
    name: "Fem Camí",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/114shots_so_wgpxss.png",
    url: "https://www.femcami.cat/",
    description: "Campaña comunitaria enfocada en la sostenibilidad."
  },
];

const HEADING_TITLE = "Colaboraciones & Proyectos";
const HEADING_SUB = "";

export default function WheelSlider() {
  const items = useMemo(() => SLIDES, []);
  const [activeIdx, setActiveIdx] = useState(null);

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const wheelRef = useRef(null);
  const sliderRef = useRef(null);
  const headerRef = useRef(null); // contenedor clickable (para cerrar)
  const headerInnerRef = useRef(null); // apila imagen + caption en columna
  const cardRefs = useRef([]);
  const currentCardRef = useRef(null);
  const scrollDistanceRef = useRef(0);
  const progressRef = useRef({ value: 0 });
  const autoTweenRef = useRef(null);
  const isPointerControlRef = useRef(false);

  function setupCarousel() {
    const wheel = wheelRef.current;
    const slider = sliderRef.current;
    if (!wheel) return;
    if (!slider) return;
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    const computed = window.getComputedStyle(wheel);
    const gap = parseFloat(computed.columnGap || computed.gap || "0");

    const totalWidth = cards.reduce((acc, card) => acc + card.offsetWidth, 0) +
      gap * Math.max(0, cards.length - 1);
    const containerWidth = slider.offsetWidth;

    scrollDistanceRef.current = Math.max(0, totalWidth - containerWidth);

    gsap.set(cards, { clearProps: "all" });
    gsap.set(wheel, { x: 0 });
  }

  function updateTransforms() {
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;

    const slider = sliderRef.current;
    const containerRect = slider
      ? slider.getBoundingClientRect()
      : { left: 0, width: window.innerWidth };
    const center = containerRect.left + containerRect.width / 2;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distanceRatio = containerRect.width
        ? (cardCenter - center) / containerRect.width
        : 0;

      const clamped = gsap.utils.clamp(-1, 1, distanceRatio * 2.4);
      const rotateY = clamped * 40;
      const translateY = Math.abs(clamped) * 22;
      const translateZ = (1 - Math.abs(clamped)) * 90;
      const scale = 1 - Math.abs(clamped) * 0.25;
      const zIndex = Math.round((1 - Math.abs(clamped)) * 120);
      const opacity = gsap.utils.clamp(0.2, 1, 1 - Math.abs(clamped) * 0.65);

      gsap.set(card, {
        rotateY,
        y: translateY,
        z: translateZ,
        scale,
        zIndex,
        opacity,
      });
    });
  }

  function updateCarouselPosition() {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const progress = progressRef.current.value;
    const distance = scrollDistanceRef.current;
    gsap.set(wheel, { x: -distance * progress });
    updateTransforms();
  }

  function pauseLoop() {
    if (autoTweenRef.current) {
      autoTweenRef.current.pause();
    }
  }

  function resumeLoop() {
    if (currentCardRef.current) return;
    if (autoTweenRef.current && !isPointerControlRef.current) {
      autoTweenRef.current.resume();
    }
  }

  function markOpen(isOpen) {
    const pin = pinRef.current;
    if (!pin) return;
    pin.classList.toggle("is-open", !!isOpen);
  }

  function closeCurrentCard() {
    const current = currentCardRef.current;
    if (!current || !headerInnerRef.current) return;

    const img = headerInnerRef.current.querySelector("img");
    if (!img) return;

    const state = Flip.getState(img);
    current.appendChild(img);
    Flip.from(state, { duration: 0.6, ease: "power1.inOut", scale: true });

    currentCardRef.current = null;
    setActiveIdx(null);
    markOpen(false);
    isPointerControlRef.current = false;
    resumeLoop();
  }

  function onClickCard(i) {
    const card = cardRefs.current[i];
    if (!card || !headerInnerRef.current) return;
    const img = card.querySelector("img");
    if (!img) return;

    if (card !== currentCardRef.current) {
      closeCurrentCard();
      currentCardRef.current = card;
      const state = Flip.getState(img);
      headerInnerRef.current.insertBefore(img, headerInnerRef.current.firstChild);
      Flip.from(state, { duration: 0.6, ease: "power1.inOut", scale: true });
      setActiveIdx(i);
      markOpen(true);
      pauseLoop();
    } else {
      closeCurrentCard();
    }
  }

  useLayoutEffect(() => {
    const ctx = gsap.context((context) => {
      setupCarousel();
      progressRef.current.value = 0;
      updateCarouselPosition();

      if (autoTweenRef.current) {
        autoTweenRef.current.kill();
      }

      autoTweenRef.current = gsap.to(progressRef.current, {
        value: 1,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        onUpdate: updateCarouselPosition,
      });

      const pinDistance = () => window.innerHeight * 2.2;

      const pinInstance = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: () => "+=" + pinDistance(),
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: () => updateCarouselPosition(),
        onLeave: () => closeCurrentCard(),
        onLeaveBack: () => closeCurrentCard(),
        onEnter: () => closeCurrentCard(),
        onEnterBack: () => closeCurrentCard(),
      });

      const arrowTween = gsap.to(".ws__scroll .arrow", {
        y: 5,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      ScrollTrigger.addEventListener("refreshInit", setupCarousel);
      ScrollTrigger.addEventListener("refresh", updateCarouselPosition);

      context.add(() => {
        pinInstance.kill();
        arrowTween.kill();
        ScrollTrigger.removeEventListener("refreshInit", setupCarousel);
        ScrollTrigger.removeEventListener("refresh", updateCarouselPosition);
      });
    }, sectionRef);

    const ro = new ResizeObserver(() => {
      setupCarousel();
      updateCarouselPosition();
    });
    if (wheelRef.current) ro.observe(wheelRef.current);
    if (sliderRef.current) ro.observe(sliderRef.current);

    return () => {
      ro.disconnect();
      if (autoTweenRef.current) {
        autoTweenRef.current.kill();
        autoTweenRef.current = null;
      }
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const active = activeIdx != null ? items[activeIdx] : null;

  const handlePointerMove = (event) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const ratio = rect.width
      ? (event.clientX - rect.left) / rect.width
      : 0;
    progressRef.current.value = gsap.utils.clamp(0, 1, ratio);
    isPointerControlRef.current = true;
    pauseLoop();
    updateCarouselPosition();
  };

  const handlePointerLeave = () => {
    isPointerControlRef.current = false;
    resumeLoop();
  };

  return (
    <section className="wheel-slider" ref={sectionRef} id="wheel-slider">
      <div className="ws__pin" ref={pinRef}>
        {/* Backdrop: cierra al tocar fuera */}
        <button
          type="button"
          className="ws__backdrop"
          aria-label="Close preview"
          onClick={closeCurrentCard}
        />

        {/* Encabezado */}
        <div className="ws__heading" aria-hidden="false">
          <h2 className="ws__title">{HEADING_TITLE}</h2>
          <p className="ws__subtitle">{HEADING_SUB}</p>
        </div>

        {/* Receptor: apila IMAGEN + CAPTION en columna */}
        <div
          className="ws__header"
          ref={headerRef}
          aria-label="Featured preview"
          onClick={closeCurrentCard}
        >
          <div
            className="ws__headerInner"
            ref={headerInnerRef}
            onClick={(e) => e.stopPropagation()} /* evita cierre al clicar dentro */
          >
            {/* la IMG se inserta aquí arriba dinámicamente via FLIP */}
            <div className={`ws__caption ${active ? "is-visible" : ""}`} aria-live="polite">
              {active && (
                <>
                  <h3 className="ws__capTitle">{active.name}</h3>
                  {active.description && <p className="ws__capDesc">{active.description}</p>}

                  {/* Botón SOLO icono (navegador) */}
                  {active.url && (
                    <a
                      className="ws__capBtn ws__capBtn--icon"
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${active.name} in the browser (new tab)`}
                      title={`Open ${active.name}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Icono: ventana de navegador + globo */}
                      <svg viewBox="0 0 24 24" aria-hidden="true">

                        <rect x="3" y="4" width="18" height="16" rx="2" ry="2"
                              fill="none" stroke="currentColor" strokeWidth="2"/>
                        <line x1="3" y1="8" x2="21" y2="8"
                              stroke="currentColor" strokeWidth="2"/>
                        <circle cx="6.5" cy="6" r="0.9" fill="currentColor"/>
                        <circle cx="9.5" cy="6" r="0.9" fill="currentColor"/>
                        <circle cx="12.5" cy="6" r="0.9" fill="currentColor"/>
                        {/* Globo */}
                        <circle cx="12" cy="13.5" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 9.5c1.5 1.5 1.5 6 0 8M12 9.5c-1.5 1.5-1.5 6 0 8"
                              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M8.5 13.5h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rueda */}
        <section
          className="ws__slider"
          ref={sliderRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="wheel" ref={wheelRef} aria-hidden="true">
            {items.map((p, i) => (
              <div
                className={`wheel__card ${activeIdx === i ? "is-active" : ""}`}
                key={`${p.name}-${i}`}
                ref={(el) => (cardRefs.current[i] = el)}
                onClick={() => onClickCard(i)}
                title={p.name}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  loading={i < 3 ? "eager" : "lazy"}
                  decoding="async"
                  fetchpriority={i === 0 ? "high" : "auto"}
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="ws__scroll">
          Scroll
          <div className="arrow" />
        </div>
      </div>
    </section>
  );
}
