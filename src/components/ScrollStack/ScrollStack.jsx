import React, {
    useRef,
    useEffect,
    useMemo,
    Children,
    cloneElement,
    forwardRef,
  } from "react";
  import "./ScrollStack.css";
  
  export const ScrollStackItem = forwardRef(function ScrollStackItem(
    { children, itemClassName = "" },
    ref
  ) {
    return (
      <div ref={ref} className={`scrollstack-item ${itemClassName}`}>
        <div className="scrollstack-item-inner">{children}</div>
      </div>
    );
  });
  
  export default function ScrollStack({
    children,
    lenis = null,                 // instancia Lenis opcional
    itemDistance = 120,
    itemScale = 0.035,
    itemStackDistance = 0.18,      // fracción del alto del contenedor
    stackPosition = "22%",
    scaleEndPosition = "12%",
    baseScale = 0.86,
    rotationAmount = 0,
    blurAmount = 0,
    onStackComplete,
  }) {
    const containerRef = useRef(null);
    const itemRefs = useRef([]);
  
    const items = useMemo(() => Children.toArray(children), [children]);
    itemRefs.current = items.map(
      (_, i) => itemRefs.current[i] || React.createRef()
    );
  
    const config = useMemo(
      () => ({
        itemDistance,
        itemScale,
        itemStackDistance,
        baseScale,
        rotationAmount,
        blurAmount,
        stackPosPct: parseFloat(String(stackPosition).replace("%", "")) / 100,
        scaleEndPct: parseFloat(String(scaleEndPosition).replace("%", "")) / 100,
      }),
      [
        itemDistance,
        itemScale,
        itemStackDistance,
        baseScale,
        rotationAmount,
        blurAmount,
        stackPosition,
        scaleEndPosition,
      ]
    );
  
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
  
      let viewportH = window.innerHeight;
      let containerTopPageY = 0;
      let containerH = 0;
      let ticking = false;
  
      const readLayout = () => {
        const rect = el.getBoundingClientRect();
        const pageScroll = lenis ? lenis.scroll : window.scrollY;
        containerTopPageY = rect.top + pageScroll;
        containerH = rect.height;
        viewportH = window.innerHeight;
      };
  
      const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
  
      const update = (scrollPos) => {
        ticking = false;
  
        const scrollY = scrollPos ?? (lenis ? lenis.scroll : window.scrollY);
  
        const start = containerTopPageY - viewportH * config.stackPosPct;
        const end =
          containerTopPageY + containerH - viewportH * config.scaleEndPct;
        const progress = clamp(
          (scrollY - start) / Math.max(1, end - start),
          0,
          1
        );
  
        let allStacked = true;
  
        items.forEach((_, i) => {
          const node = itemRefs.current[i]?.current;
          if (!node) return;
  
          const perItem = config.itemStackDistance * containerH; // px
          const localP = clamp(
            progress - (i * perItem) / Math.max(1, containerH),
            0,
            1
          );
  
          const translateY = -(i * config.itemDistance) * (1 - localP);
          const scale =
            config.baseScale +
            localP * (1 - config.baseScale) -
            i * config.itemScale * (1 - localP);
          const rotate = config.rotationAmount * (1 - localP);
          const blur = config.blurAmount * (1 - localP);
  
          node.style.setProperty("--y", `${translateY}`);
          node.style.setProperty("--scale", `${scale}`);
          node.style.setProperty("--rotate", `${rotate}`);
          node.style.setProperty("--blur", `${blur}`);
  
          if (localP < 1) allStacked = false;
        });
  
        if (allStacked && typeof onStackComplete === "function") {
          onStackComplete();
        }
      };
  
      const schedule = (pos) => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => update(pos));
        }
      };
  
      const onResize = () => {
        readLayout();
        schedule();
      };
  
      // inicial
      readLayout();
      update();
  
      // Suscripción a Lenis o scroll nativo
      let offLenis = null;
      if (lenis && typeof lenis.on === "function") {
        const handler = (e) => schedule(e?.scroll ?? lenis.scroll);
        lenis.on("scroll", handler);
        offLenis = () => lenis.off("scroll", handler);
      } else {
        const onScroll = () => schedule();
        window.addEventListener("scroll", onScroll, { passive: true });
        offLenis = () => window.removeEventListener("scroll", onScroll);
      }
  
      window.addEventListener("resize", onResize);
      const ro = new ResizeObserver(() => {
        readLayout();
        schedule();
      });
      ro.observe(el);
  
      return () => {
        offLenis && offLenis();
        window.removeEventListener("resize", onResize);
        ro.disconnect();
      };
    }, [items, config, onStackComplete, lenis]);
  
    return (
      <section ref={containerRef} className="scrollstack">
        {items.map((child, i) =>
          cloneElement(child, {
            ref: itemRefs.current[i],
            key: i,
            // z-index dinámico: los últimos items quedan por encima
            style: { zIndex: items.length - i },
          })
        )}
      </section>
    );
  }
  