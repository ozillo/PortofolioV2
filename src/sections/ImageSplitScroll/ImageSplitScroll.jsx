import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../lib/gsap"; // ✅ tu wrapper
import "./ImageSplitScroll.css";

gsap.registerPlugin(ScrollTrigger);

export default function ImageSplitScroll({
  id = "projects",
  title = "Proyectos",
  subtitle = "Una imagen que se transforma en tres tarjetas al hacer scroll.",
  image = "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop",
}) {
  const sectionRef = useRef(null);
  const lRef = useRef(null);
  const cRef = useRef(null);
  const rRef = useRef(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const cleanup = [];

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=200%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
        defaults: { ease: "power2.out" },
      });

      gsap.set([lRef.current, cRef.current, rRef.current], {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
      });

      tl.to(lRef.current, { x: "-12vw", rotate: -1.5, boxShadow: "var(--split-shadow-1)" }, 0)
        .to(rRef.current, { x: "12vw", rotate: 1.5, boxShadow: "var(--split-shadow-1)" }, 0)
        .to(cRef.current, { scale: 1.04, boxShadow: "var(--split-shadow-2)" }, 0)
        .to([lRef.current, cRef.current, rRef.current], { y: "3vh", borderRadius: "18px" }, 0.35)
        .to(lRef.current, { y: "6vh" }, 0.6)
        .to(cRef.current, { y: "4vh" }, 0.6)
        .to(rRef.current, { y: "8vh" }, 0.6);

      cleanup.push(() => tl.scrollTrigger?.kill());
      cleanup.push(() => tl.kill());
    });

    return () => {
      cleanup.forEach((fn) => fn());
      mm.kill();
    };
  }, []);

  return (
    <section id={id} className="split-section" ref={sectionRef} aria-label={title}>
      <div className="split-stage">
        {/* Paneles */}
        <div
          ref={lRef}
          className="panel panel-left"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />
        <div
          ref={cRef}
          className="panel panel-center"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />
        <div
          ref={rRef}
          className="panel panel-right"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden="true"
        />

        {/* Título */}
        <div className="split-title">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
