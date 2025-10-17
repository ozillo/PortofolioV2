import { useEffect } from "react";
import "./IntroLoader.css";

export default function IntroLoader({
  show = true,
  duration = 1400,
  title = "Marc Mateo",
  onDone,
}) {
  useEffect(() => {
    if (!show || !onDone) return;
    const id = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(id);
  }, [show, duration, onDone]);

  if (!show) return null;

  return (
    <div className="intro-loader" role="dialog" aria-label="Cargando" aria-live="polite">
      <div className="intro-loader__wrapper">
        <div className="intro-loader__brand">{title}</div>
        <div className="intro-loader__bar">
          <span
            className="intro-loader__bar-fill"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
        <span className="visually-hidden">Loading…</span>
      </div>
    </div>
  );
}
