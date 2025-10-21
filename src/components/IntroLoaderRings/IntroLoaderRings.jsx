import { useEffect, useRef } from "react";
import "./IntroLoaderRings.css";

export default function IntroLoaderRings({ show = true, duration = 2000, onDone }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      // Activamos el fade-out
      overlayRef.current?.classList.add("is-exiting");
      // Esperamos a que acabe la transición antes de desmontar
      const exitTimer = setTimeout(() => onDone?.(), 380);
      return () => clearTimeout(exitTimer);
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onDone]);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="intro-loader-overlay"
      role="dialog"
      aria-label="Cargando"
    >
      <div className="intro-loader-bar" aria-hidden="true">
        <span className="intro-loader-bar__light" />
        <span className="intro-loader-bar__shade" />
      </div>
    </div>
  );
}
