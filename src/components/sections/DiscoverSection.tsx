"use client";

import { useEffect, useRef } from "react";

export default function DiscoverSection() {
  const section = useRef<HTMLElement>(null);
  const words = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const area = section.current;
    const content = words.current;
    const left = first.current;
    const right = second.current;
    const button = handle.current;
    if (!area || !content || !left || !right || !button) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (!reduced.matches) {
        content.querySelectorAll<HTMLElement>("[data-discover-title]").forEach((word, index) => {
          animations.push(word.animate([
            { opacity: 0.08, transform: `translateX(${index === 0 ? "18%" : "-18%"}) skewX(${index === 0 ? "-18deg" : "18deg"}) scaleX(1.08)` },
            { opacity: 1, transform: "translateX(0) skewX(0) scaleX(1)" },
          ], { duration: 1250, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }));
        });
        content.querySelectorAll<HTMLElement>("[data-discover-copy]").forEach(copy => {
          animations.push(copy.animate([{ opacity: 0 }, { opacity: 1 }],
            { duration: 900, delay: 350, fill: "both" }));
        });
        [left, right, button].forEach((shape, index) => {
          animations.push(shape.animate([{ opacity: 0 }, { opacity: 1 }],
            { duration: 900, delay: 550 + index * 100, fill: "both" }));
        });
      }
      observer.disconnect();
    }, { threshold: 0.3 });
    observer.observe(content);

    let dragging = false;
    let pointerId: number | null = null;
    let frame = 0;
    let previous = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let returning = false;

    const render = (time: number) => {
      frame = 0;
      const dt = Math.min(time - (previous || time - 16), 40);
      previous = time;
      const ease = reduced.matches ? 1 : 1 - Math.exp(-dt / 180);
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      left.style.translate = `${x * 0.7}px ${y * 0.7}px`;
      right.style.translate = `${-x * 0.5}px ${-y * 0.5}px`;
      button.style.translate = dragging || returning ? `${x}px ${y}px` : "0px 0px";
      if (Math.hypot(targetX - x, targetY - y) > 0.2) frame = requestAnimationFrame(render);
      else { previous = 0; returning = false; }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const move = (event: PointerEvent) => {
      if (dragging) {
        targetX = Math.max(-area.clientWidth * 0.55, Math.min(40, event.clientX - dragStartX));
        targetY = Math.max(-120, Math.min(120, event.clientY - dragStartY));
      } else {
        if (event.pointerType !== "mouse") return;
        const box = content.getBoundingClientRect();
        targetX = Math.max(-140, Math.min(140, (event.clientX - box.left - box.width / 2) * 0.16));
        targetY = Math.max(-70, Math.min(70, (event.clientY - box.top - box.height / 2) * 0.14));
      }
      returning = false;
      schedule();
    };
    const release = () => {
      if (pointerId !== null && button.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
      pointerId = null;
      returning = dragging || returning;
      dragging = false;
      targetX = 0;
      targetY = 0;
      button.style.cursor = "grab";
      schedule();
    };
    const press = (event: PointerEvent) => {
      dragging = true;
      pointerId = event.pointerId;
      dragStartX = event.clientX - x;
      dragStartY = event.clientY - y;
      button.setPointerCapture(event.pointerId);
      button.style.cursor = "grabbing";
      event.preventDefault();
    };
    const leave = () => { if (!dragging) release(); };
    const keyboard = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Escape') { release(); return; }
      targetX = Math.max(-140, Math.min(140, targetX + (event.key === 'ArrowLeft' ? -30 : event.key === 'ArrowRight' ? 30 : 0)));
      targetY = Math.max(-70, Math.min(70, targetY + (event.key === 'ArrowUp' ? -30 : event.key === 'ArrowDown' ? 30 : 0)));
      schedule();
    };
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", leave);
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("keydown", keyboard);
    window.addEventListener("blur", release);
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      cancelAnimationFrame(frame);
      if (pointerId !== null && button.hasPointerCapture(pointerId)) button.releasePointerCapture(pointerId);
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", leave);
      button.removeEventListener("pointerdown", press);
      button.removeEventListener("pointerup", release);
      button.removeEventListener("pointercancel", release);
      button.removeEventListener("keydown", keyboard);
      window.removeEventListener("blur", release);
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="discover-title"
      className="relative isolate flex min-h-[720px] items-center overflow-hidden bg-white py-24 text-[#1b1b1b] md:min-h-[min(900px,100svh)] md:py-36">
      <div ref={words} className="relative isolate mx-auto w-[calc(100%-40px)] md:w-[70%]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div ref={first} className="absolute left-[26%] top-[8%] size-[clamp(130px,15.8vw,304px)] rounded-full bg-[#d9d9d9] will-change-transform" />
          <div ref={second} className="absolute left-[57%] top-[5%] size-[clamp(130px,15.8vw,304px)] rounded-full bg-[#d9d9d9] will-change-transform" />
        </div>
        <h2 id="discover-title" className="sr-only">Discover who we are.</h2>
        <div className="grid items-center gap-7 md:grid-cols-[55%_35%] md:gap-x-[4%] md:gap-y-0">
          <p data-discover-title aria-hidden="true" className="text-[clamp(4.5rem,8.4vw,10rem)] font-light leading-[1.05] tracking-[-.075em] md:pl-[4%]">discover</p>
          <p data-discover-copy className="max-w-lg text-sm font-normal leading-[1.65] md:text-[clamp(12px,.88vw,18px)]">
            We are a creative production company that partners with global brands striving to make authentic connections. We’re not just here for the awards (though they are nice), we’re here to make cutting-edge stunners that last, surprise and solve the problem.
          </p>
        </div>
        <div className="mt-9 grid items-center gap-7 md:mt-4 md:grid-cols-[34%_64%] md:gap-x-[2%] md:gap-y-0">
          <p data-discover-copy className="order-2 max-w-md text-sm font-normal leading-[1.65] md:order-1 md:text-[clamp(12px,.88vw,18px)]">
            This isn’t art-for-art’s sake or tech-cause-it’s-trendy, this is about redefining the interactive space. We believe a talented, agile team and a fresh, insightful approach is how you elevate the field, get noticed and stand above the noise.
          </p>
          <p data-discover-title aria-hidden="true" className="order-1 whitespace-nowrap text-[clamp(2.9rem,8.4vw,10rem)] font-light leading-[1.05] tracking-[-.075em] md:order-2">who we are.</p>
        </div>
      </div>
      <button ref={handle} type="button" aria-label="Drag to move the circles. You can also use the arrow keys."
        className="absolute -right-[76px] bottom-6 z-20 grid size-[152px] touch-none cursor-grab place-items-center rounded-full bg-black pr-12 text-[9px] font-medium text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#2444df] md:-right-[8.2vw] md:bottom-auto md:top-1/2 md:size-[16.4vw] md:max-h-[315px] md:max-w-[315px] md:[transform:translateY(-50%)] md:pr-[7vw]">
        DRAG ME
      </button>
    </section>
  );
}
