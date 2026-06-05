import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import ProfileCard from "../ProfileCard/ProfileCard";
import avatar from "../../assets/marc.png";
import "./IntroLoaderWillem.css";

export default function IntroLoaderWillem({ onDone }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const letters      = root.querySelectorAll(".wl__letter");
    const box          = root.querySelectorAll(".wl__box");
    const growingImage = root.querySelectorAll(".wl__growing-image");
    const headingStart = root.querySelectorAll(".wl__h1-start");
    const headingEnd   = root.querySelectorAll(".wl__h1-end");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.inOut" },
        onComplete: onDone,
      });

      // Fase 1 — letras suben desde abajo
      tl.from(letters, { yPercent: 100, stagger: 0.025, duration: 1.25 });

      // Fase 2 — cuadro + card aparece + letras se separan
      tl.fromTo(box,          { width: "0em" },  { width: "1em",     duration: 1.25 }, "< 1.25");
      tl.fromTo(growingImage, { width: "0%" },   { width: "100%",    duration: 1.25 }, "<");
      tl.fromTo(headingStart, { x: "0em" },      { x: "-0.05em",     duration: 1.25 }, "<");
      tl.fromTo(headingEnd,   { x: "0em" },      { x: "0.05em",      duration: 1.25 }, "<");

      // Fase 3 — card + cuadro se expanden a pantalla completa
      tl.to(growingImage, { width: "100vw", height: "100dvh", duration: 2 }, "< 1.25");
      tl.to(box,          { width: "110vw", duration: 2 }, "<");

      // Fase 4 — fade out → revela el Hero
      tl.to(root, { opacity: 0, duration: 0.65, ease: "power2.inOut" }, "< 1.6");
    }, root);

    return () => ctx.revert();
  }, [onDone]);

  return (
    <div className="wl-overlay" ref={rootRef}>
      <div className="wl-loader">
        <div className="wl__h1">

          {/* "M" regular — izquierda */}
          <div className="wl__h1-start">
            <span className="wl__letter">M</span>
          </div>

          {/* Cuadro con ProfileCard */}
          <div className="wl__box">
            <div className="wl__box-inner">
              <div className="wl__growing-image">
                <div className="wl__growing-image-wrap">
                  <div className="wl__card-wrap">
                    <ProfileCard
                      name="Marc Mateo"
                      title="Frontend Developer"
                      handle="marc-mateo"
                      status="Online"
                      contactText="Contacto"
                      avatarUrl={avatar}
                      showUserInfo={true}
                      enableTilt={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* "M" bold — derecha */}
          <div className="wl__h1-end">
            <span className="wl__letter wl__letter--bold">M</span>
          </div>

        </div>
      </div>
    </div>
  );
}
