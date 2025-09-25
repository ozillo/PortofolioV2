// AboutTypewriter.jsx
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextType from "./TextType/TextType"; // ruta según tu estructura
import "./AboutTypewriter.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutTypewriter({ lenis }) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [replayKey, setReplayKey] = useState(0);

  // Sincroniza ScrollTrigger con Lenis si está disponible
  useEffect(() => {
    if (!lenis) return;
    const onScroll = () => ScrollTrigger.update();
    lenis.on?.("scroll", onScroll);
    ScrollTrigger.refresh();
    return () => lenis.off?.("scroll", onScroll);
  }, [lenis]);

  // Animación de entrada y re-play del typewriter al entrar / volver
  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        end: "bottom 25%",
        onEnter: () => setReplayKey((k) => k + 1),
        onEnterBack: () => setReplayKey((k) => k + 1),
      },
      defaults: { ease: "power2.out", duration: 0.75 },
    });

    tl.fromTo(
      content,
      { opacity: 0, filter: "blur(10px)", y: 12 },
      { opacity: 1, filter: "blur(0px)", y: 0 }
    );

    return () => tl.kill();
  }, []);

  return (
    <section id="about-typewriter" className="about" ref={sectionRef}>
      <div className="about__container" ref={contentRef}>
        <h2 className="about__title">Sobre mí</h2>
        <p className="about__text">
          <TextType
            key={replayKey}
            items={[
              "Soy un desarrollador frontend con experiencia en React, diseño responsivo y animaciones modernas. Me encanta aprender y colaborar en proyectos creativos."
            ]}
            typingSpeed={38}
            deletingSpeed={24}   /* no aplica (loop=false) */
            holdTime={3000}
            startDelay={150}
            loop={false}         /* escribe una vez por entrada a viewport */
            cursor
            className="about__typed"
          />
        </p>
      </div>
    </section>
  );
}
