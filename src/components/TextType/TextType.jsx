import { useEffect, useMemo, useRef, useState } from "react";
import "./TextType.css";

/* Typewriter sin dependencias, accesible y con prefers-reduced-motion */
export default function TextType({
  items,
  typingSpeed = 40,
  deletingSpeed = 28,
  startDelay = 300,
  holdTime = 1200,
  loop = true,
  cursor = true,
  className = "",
  ariaLive = "polite",
  reduceMotion,
}) {
  const safeItems = useMemo(
    () => (Array.isArray(items) ? items.filter(Boolean) : []),
    [items]
  );
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState("");
  const [deleting, setDeleting] = useState(false);
  const frame = useRef(null);
  const mounted = useRef(false);
  const [reduced, setReduced] = useState(!!reduceMotion);

  // Respeta prefers-reduced-motion si no se fuerza por prop
  useEffect(() => {
    if (typeof reduceMotion === "boolean") {
      setReduced(reduceMotion);
      return;
    }
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mql?.matches);
    update();
    mql?.addEventListener?.("change", update);
    return () => mql?.removeEventListener?.("change", update);
  }, [reduceMotion]);

  if (!safeItems.length) return null;

  if (reduced) {
    return (
      <span className="texttype" aria-live={ariaLive}>
        <span className={`texttype__text ${className}`}>{safeItems[0]}</span>
        {cursor && <span aria-hidden className="texttype__cursor">|</span>}
      </span>
    );
  }

  useEffect(() => {
    mounted.current = true;
    const startId = setTimeout(tick, startDelay);
    return () => {
      mounted.current = false;
      clearTimeout(startId);
      if (frame.current) clearTimeout(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (!mounted.current) return;
    frame.current = setTimeout(tick, 0);
    return () => clearTimeout(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub, deleting]);

  function tick() {
    if (!mounted.current) return;
    const full = safeItems[index % safeItems.length];

    if (!deleting) {
      if (sub.length < full.length) {
        frame.current = setTimeout(
          () => setSub(full.slice(0, sub.length + 1)),
          typingSpeed
        );
      } else {
        frame.current = setTimeout(() => setDeleting(true), holdTime);
      }
    } else {
      if (sub.length > 0) {
        frame.current = setTimeout(
          () => setSub(full.slice(0, sub.length - 1)),
          deletingSpeed
        );
      } else {
        setDeleting(false);
        if (loop || index < safeItems.length - 1) {
          setIndex((i) => (i + 1) % safeItems.length);
        }
      }
    }
  }

  return (
    <span className="texttype" aria-live={ariaLive}>
      <span className={`texttype__text ${className}`}>{sub}</span>
      {cursor && <span aria-hidden className="texttype__cursor">|</span>}
    </span>
  );
}
