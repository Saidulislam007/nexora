"use client";

import { useEffect, useRef } from "react";

const sources = ["/trail-blue.png", "/trail-glass.png", "/nexora-world.png", "/trail-blue.png", "/trail-glass.png", "/nexora-world.png"];

export default function CursorTrail() {
  const holder = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, y: 0 });
  const index = useRef(0);

  useEffect(() => {
    const layer = holder.current;
    const hero = layer?.parentElement;
    if (!layer || !hero) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.buttons === 0) return;
      const dx = event.clientX - last.current.x;
      const dy = event.clientY - last.current.y;
      if (Math.hypot(dx, dy) < 42) return;
      last.current = { x: event.clientX, y: event.clientY };

      const box = hero.getBoundingClientRect();
      const current = index.current++ % sources.length;
      const card = document.createElement("div");
      card.className = `trail-card trail-tone-${current % 5}`;
      card.style.left = `${event.clientX - box.left}px`;
      card.style.top = `${event.clientY - box.top}px`;
      card.style.zIndex = String(10 + index.current);

      const image = document.createElement("img");
      image.src = sources[current];
      image.alt = "";
      card.appendChild(image);
      layer.appendChild(card);

      const rotation = Math.max(-9, Math.min(9, dx * .09));
      const travelX = Math.max(-28, Math.min(28, dx * .22));
      const travelY = Math.max(-22, Math.min(22, dy * .18));
      card.animate([
        { opacity: 0, transform: `translate(-50%,-50%) translate(${-travelX * .35}px,${-travelY * .35}px) rotate(${rotation * .3}deg) scale(.42)` },
        { opacity: 1, offset: .22, transform: `translate(-50%,-50%) translate(${travelX * .12}px,${travelY * .12}px) rotate(${rotation}deg) scale(1.04)` },
        { opacity: 1, offset: .66, transform: `translate(-50%,-50%) translate(${travelX * .42}px,${travelY * .42}px) rotate(${rotation * .75}deg) scale(1)` },
        { opacity: 0, transform: `translate(-50%,-50%) translate(${travelX}px,${travelY - 18}px) rotate(${rotation * .35}deg) scale(.72)` },
      ], { duration: 1900, easing: "cubic-bezier(.16,.78,.2,1)", fill: "forwards" }).finished.then(() => card.remove()).catch(() => card.remove());
    };

    hero.addEventListener("pointermove", move);
    return () => hero.removeEventListener("pointermove", move);
  }, []);

  return <div ref={holder} className="pointer-events-none absolute inset-0 z-[3] overflow-hidden" aria-hidden="true"/>;
}
