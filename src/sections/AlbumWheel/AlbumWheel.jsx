import { useLayoutEffect, useMemo, useRef, useState } from "react";
import "./AlbumWheel.css";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Draggable, Flip);

const FALLBACK_SLIDES = [
  {
    name: "Saüc Floristeria",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/178shots_so_sl7d7v.png",
    url: "http://xn--sacfloristeria-hsb.cat/",
    description: "Diseño visual y branding para floristería artesanal.",
  },
  {
    name: "DevLink",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141366/PortofolioMarcMateo/433shots_so_sm2qmq.png",
    url: "https://frontend-final-project-ip0mr7t7q.vercel.app/home",
    description: "Plataforma para conectar desarrolladores con oportunidades.",
  },
  {
    name: "Fem Camí",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/114shots_so_wgpxss.png",
    url: "https://www.femcami.cat/",
    description: "Campaña comunitaria enfocada en la sostenibilidad.",
  },
  {
    name: "Saüc Floristeria",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/178shots_so_sl7d7v.png",
    url: "http://xn--sacfloristeria-hsb.cat/",
    description: "Diseño visual y branding para floristería artesanal.",
  },
  {
    name: "DevLink",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141366/PortofolioMarcMateo/433shots_so_sm2qmq.png",
    url: "https://frontend-final-project-ip0mr7t7q.vercel.app/home",
    description: "Plataforma para conectar desarrolladores con oportunidades.",
  },
  {
    name: "Fem Camí",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/114shots_so_wgpxss.png",
    url: "https://www.femcami.cat/",
    description: "Campaña comunitaria enfocada en la sostenibilidad.",
  },
];

export default function AlbumWheel({ items = FALLBACK_SLIDES }) {
  const list = useMemo(() => items, [items]);
  const [activeIdx, setActiveIdx] = useState(null);

  const sectionRef = useRef(null);
  const boxesRef = useRef(null);
  const headerRef = useRef(null);
  const headerInnerRef = useRef(null);
  const dragProxyRef = useRef(null);
  const nextBtnRef = useRef(null);
  const prevBtnRef = useRef(null);
  const cardRefs = useRef([]);
  const currentCardRef = useRef(null);

  function markOpen(isOpen) {
    boxesRef.current?.classList.toggle("is-open", !!isOpen);
  }

  function closeCurrentCard() {
    const current = currentCardRef.current;
    if (!current || !headerInnerRef.current) return;
    const img = headerInnerRef.current.querySelector("img.aw__active");
    if (!img) return;
    const state = Flip.getState(img);
    img.classList.remove("aw__active");
    current.appendChild(img);
    Flip.from(state, { duration: 0.5, ease: "power1.inOut", scale: true });
    currentCardRef.current = null;
    setActiveIdx(null);
    markOpen(false);
  }

  function openCardByIndex(i) {
    const card = cardRefs.current[i];
    if (!card || !headerInnerRef.current) return;
    const img = card.querySelector("img");
    if (!img) return;
    if (card !== currentCardRef.current) {
      closeCurrentCard();
      currentCardRef.current = card;
      const state = Flip.getState(img);
      img.classList.add("aw__active");
      headerInnerRef.current.insertBefore(img, headerInnerRef.current.firstChild);
      Flip.from(state, { duration: 0.5, ease: "power1.inOut", scale: true });
      setActiveIdx(i);
      markOpen(true);
    } else {
      closeCurrentCard();
    }
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".aw__box", { display: "block", yPercent: -50 });
      gsap.set(".aw__btn", { z: 200 });

      const STAGGER = 0.1;
      const DURATION = 1;
      const BOXES = gsap.utils.toArray(".aw__box");
      const LOOP = gsap.timeline({ paused: true, repeat: -1, ease: "none" });
      const SHIFTS = [...BOXES, ...BOXES, ...BOXES];

      SHIFTS.forEach((box, index) => {
        const tl = gsap
          .timeline()
          .set(box, { xPercent: 250, rotateY: -50, opacity: 0, scale: 0.5 })
          .to(box, { opacity: 1, scale: 1, duration: 0.1 }, 0)
          .to(box, { opacity: 0, scale: 0.5, duration: 0.1 }, 0.9)
          .fromTo(box, { xPercent: 250 }, { xPercent: -350, duration: 1, ease: "power1.inOut" }, 0)
          .fromTo(box, { rotateY: -50 }, { rotateY: 50, duration: 1, ease: "power4.inOut" }, 0)
          .to(box, { z: 100, scale: 1.25, duration: 0.1, repeat: 1, yoyo: true }, 0.4)
          .fromTo(box, { zIndex: 1 }, { zIndex: BOXES.length, repeat: 1, yoyo: true, ease: "none", duration: 0.5 }, 0);

        LOOP.add(tl, index * STAGGER);
      });

      const CYCLE_DURATION = STAGGER * BOXES.length;
      const START_TIME = CYCLE_DURATION + DURATION * 0.5;
      const LOOP_HEAD = gsap.fromTo(
        LOOP,
        { totalTime: START_TIME },
        { totalTime: `+=${CYCLE_DURATION}`, duration: 1, ease: "none", repeat: -1, paused: true }
      );

      const PLAYHEAD = { position: 0 };
      const POSITION_WRAP = gsap.utils.wrap(0, LOOP_HEAD.duration());
      const SCRUB = gsap.to(PLAYHEAD, {
        position: 0,
        onUpdate: () => LOOP_HEAD.totalTime(POSITION_WRAP(PLAYHEAD.position)),
        paused: true,
        duration: 0.25,
        ease: "power3",
      });

      let iteration = 0;
      const TRIGGER = ScrollTrigger.create({
        trigger: boxesRef.current,
        start: 0,
        end: "+=2000",
        pin: true,          // ✅ genera pin real
        pinSpacing: true,   // ✅ crea espacio detrás (Lenis puede anclar)
        onUpdate: (self) => {
          const s = self.scroll();
          if (s > self.end - 1) wrap(1, 1);
          else if (s < 1 && self.direction < 0) wrap(-1, self.end - 1);
          else {
            const newPos = (iteration + self.progress) * LOOP_HEAD.duration();
            SCRUB.vars.position = newPos;
            SCRUB.invalidate().restart();
          }
        },
      });

      const wrap = (iterationDelta, scrollTo) => {
        iteration += iterationDelta;
        TRIGGER.scroll(scrollTo);
        TRIGGER.update();
      };

      const SNAP = gsap.utils.snap(1 / BOXES.length);
      const progressToScroll = (progress) =>
        gsap.utils.clamp(1, TRIGGER.end - 1, gsap.utils.wrap(0, 1, progress) * TRIGGER.end);

      const scrollToPosition = (position) => {
        const snapPos = SNAP(position);
        const progress = (snapPos - LOOP_HEAD.duration() * iteration) / LOOP_HEAD.duration();
        const scroll = progressToScroll(progress);
        if (progress >= 1 || progress < 0) return wrap(Math.floor(progress), scroll);
        TRIGGER.scroll(scroll);
      };

      ScrollTrigger.addEventListener("scrollEnd", () => scrollToPosition(SCRUB.vars.position));
      const NEXT = () => scrollToPosition(SCRUB.vars.position - 1 / BOXES.length);
      const PREV = () => scrollToPosition(SCRUB.vars.position + 1 / BOXES.length);

      nextBtnRef.current?.addEventListener("click", NEXT);
      prevBtnRef.current?.addEventListener("click", PREV);

      boxesRef.current?.addEventListener("click", (e) => {
        const box = e.target.closest(".aw__box");
        if (!box) return;
        const idx = BOXES.indexOf(box);
        openCardByIndex(idx);
      });

      Draggable.create(dragProxyRef.current, {
        type: "x",
        trigger: ".aw__box",
        onPress() { this.startOffset = SCRUB.vars.position; },
        onDrag() {
          SCRUB.vars.position = this.startOffset + (this.startX - this.x) * 0.001;
          SCRUB.invalidate().restart();
        },
        onDragEnd() { scrollToPosition(SCRUB.vars.position); },
      });

      const onKey = (e) => {
        if (e.code === "ArrowLeft" || e.code === "KeyA") NEXT();
        if (e.code === "ArrowRight" || e.code === "KeyD") PREV();
        if (e.code === "Escape") closeCurrentCard();
      };
      window.addEventListener("keydown", onKey);

      return () => {
        window.removeEventListener("keydown", onKey);
        TRIGGER.kill(); LOOP.kill(); LOOP_HEAD.kill(); SCRUB.kill();
      };
    }, sectionRef);

    setTimeout(() => ScrollTrigger.refresh(), 200);
    return () => ctx.revert();
  }, []);

  const active = activeIdx != null ? list[activeIdx] : null;

  return (
    <section className="album-wheel" ref={sectionRef}>
      <div className="aw__boxes" ref={boxesRef}>
        <button type="button" className="aw__backdrop" onClick={closeCurrentCard} aria-label="Cerrar" />

        <header className="aw__header" ref={headerRef} onClick={closeCurrentCard}>
          <div className="aw__headerInner" ref={headerInnerRef} onClick={(e) => e.stopPropagation()}>
            <div className={`aw__caption ${active ? "is-visible" : ""}`}>
              {active && (
                <>
                  <h3 className="aw__capTitle">{active.name}</h3>
                  {active.description && <p className="aw__capDesc">{active.description}</p>}
                  {active.url && (
                    <a className="aw__capBtn aw__capBtn--icon" href={active.url} target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="16" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
                        <line x1="3" y1="8" x2="21" y2="8" stroke="currentColor" strokeWidth="2" />
                        <circle cx="6.5" cy="6" r="0.9" fill="currentColor" />
                        <circle cx="9.5" cy="6" r="0.9" fill="currentColor" />
                        <circle cx="12.5" cy="6" r="0.9" fill="currentColor" />
                        <circle cx="12" cy="13.5" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 9.5c1.5 1.5 1.5 6 0 8M12 9.5c-1.5 1.5-1.5 6 0 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M8.5 13.5h7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </header>

        {list.map((p, i) => (
          <div key={i} className="aw__box" style={{ "--src": `url(${p.img})` }} ref={(el) => (cardRefs.current[i] = el)}>
            <img src={p.img} alt={p.name} loading={i < 3 ? "eager" : "lazy"} />
          </div>
        ))}

        <div className="aw__controls">
          <button className="aw__btn aw__btn--prev" ref={prevBtnRef}>
            <svg viewBox="0 0 448 512"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" /></svg>
          </button>
          <button className="aw__btn aw__btn--next" ref={nextBtnRef}>
            <svg viewBox="0 0 448 512"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" /></svg>
          </button>
        </div>

        <div className="aw__dragProxy" ref={dragProxyRef} />
      </div>
    </section>
  );
}
