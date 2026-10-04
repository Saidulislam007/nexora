"use client";

import { useEffect, useRef } from "react";

const sources = ["/trail-blue.png", "/trail-glass.png", "/nexora-world.png"];
const POOL_SIZE = 18;
const LIFETIME = 900;

type Point = { x: number; y: number };
type Card = {
  element: HTMLDivElement;
  image: HTMLImageElement;
  born: number;
  start: Point;
  end: Point;
  rotation: number;
};

export default function CursorTrail() {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = holder.current;
    const hero = layer?.parentElement;
    if (!layer || !hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards: Card[] = [];
    let disposed = false;
    let ready = false;
    let inside = false;
    let frame = 0;
    let previousTime = 0;
    let lastSpawn = 0;
    let sequence = 0;
    let target: Point = { x: 0, y: 0 };
    let smooth = { ...target };
    let anchor = { ...target };

    // Decode once before displaying cards; movement never creates new images.
    Promise.all(sources.map(async (src) => {
      const image = new window.Image();
      image.src = src;
      await image.decode();
    })).then(() => { if (!disposed) ready = true; }).catch(() => {});

    for (let i = 0; i < POOL_SIZE; i++) {
      const element = document.createElement("div");
      element.className = "trail-card";
      const image = new window.Image();
      image.alt = "";
      image.draggable = false;
      image.src = sources[i % sources.length];
      element.appendChild(image);
      layer.appendChild(element);
      cards.push({ element, image, born: -Infinity, start: { x: 0, y: 0 }, end: { x: 0, y: 0 }, rotation: 0 });
    }

    const hide = () => {
      cards.forEach((card) => {
        card.born = -Infinity;
        card.element.style.opacity = "0";
      });
    };

    const tick = (now: number) => {
      frame = 0;
      if (disposed) return;
      const delta = Math.min(now - (previousTime || now), 40);
      previousTime = now;
      const amount = 1 - Math.exp(-delta / 100);
      smooth.x += (target.x - smooth.x) * amount;
      smooth.y += (target.y - smooth.y) * amount;
      const dx = target.x - anchor.x;
      const dy = target.y - anchor.y;
      const distance = Math.hypot(dx, dy);
      const spacing = Math.max(22, Math.min(38, hero.clientWidth * 0.022));

      if (inside && ready && !reducedMotion.matches && distance >= spacing && now - lastSpawn >= 38) {
        const card = cards[sequence % POOL_SIZE];
        card.image.src = sources[sequence % sources.length];
        // Reappend the reused node so the newest card always sits on top.
        layer.appendChild(card.element);
        card.start = { ...smooth };
        card.end = { ...target };
        card.rotation = Math.max(-8, Math.min(8, dx * 0.05)) + (sequence % 2 ? 3 : -3);
        card.born = now;
        sequence++;
        lastSpawn = now;
        anchor = { ...target };
      }

      let active = false;
      for (const card of cards) {
        const age = now - card.born;
        if (age >= LIFETIME) {
          card.element.style.opacity = "0";
          continue;
        }
        active = true;
        const follow = 1 - Math.pow(1 - Math.min(age / 500, 1), 3);
        const exit = Math.max(0, Math.min(1, (age - 360) / (LIFETIME - 360)));
        const entrance = Math.min(age / 170, 1);
        const scale = (0.35 + 0.65 * (1 - Math.pow(1 - entrance, 3))) * (1 - exit * 0.06);
        const x = card.start.x + (card.end.x - card.start.x) * follow;
        const y = card.start.y + (card.end.y - card.start.y) * follow;
        card.element.style.opacity = String(entrance * (1 - exit));
        card.element.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${card.rotation * follow}deg) scale(${scale})`;
      }
      if (active || (inside && Math.hypot(target.x - smooth.x, target.y - smooth.y) > 0.1)) {
        frame = requestAnimationFrame(tick);
      } else previousTime = 0;
    };

    const move = (event: PointerEvent) => {
      if (reducedMotion.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      const box = hero.getBoundingClientRect();
      target = { x: event.clientX - box.left, y: event.clientY - box.top };
      if (!inside) {
        inside = true;
        smooth = { ...target };
        anchor = { ...target };
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const leave = () => { inside = false; };
    const reset = () => {
      inside = false;
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      hide();
    };
    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", leave);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    reducedMotion.addEventListener("change", reset);
    return () => {
      disposed = true;
      reset();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      reducedMotion.removeEventListener("change", reset);
      cards.forEach(({ element }) => element.remove());
    };
  }, []);

  return <div ref={holder} className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true" />;
}
