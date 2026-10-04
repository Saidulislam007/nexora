"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function WorkSection() {
  const picture = useRef<HTMLAnchorElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const area = picture.current;
    const circle = cursor.current;
    if (!area || !circle) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastTime = 0;
    let visible = false;
    let initialized = false;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;

    const render = (time: number) => {
      frame = 0;
      const delta = Math.min(time - (lastTime || time - 16), 40);
      lastTime = time;
      const ease = reducedMotion.matches ? 1 : 1 - Math.exp(-delta / 65);
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      if (visible && Math.hypot(targetX - x, targetY - y) > 0.1) {
        frame = requestAnimationFrame(render);
      } else lastTime = 0;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const box = area.getBoundingClientRect();
      targetX = event.clientX - box.left;
      targetY = event.clientY - box.top;
      if (!initialized) {
        x = targetX;
        y = targetY;
        initialized = true;
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
      }
      visible = true;
      circle.style.opacity = "1";
      circle.style.scale = "1";
      if (!frame) frame = requestAnimationFrame(render);
    };
    const hide = () => {
      visible = false;
      initialized = false;
      circle.style.opacity = "0";
      circle.style.scale = "0.65";
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };
    area.addEventListener("pointerenter", move);
    area.addEventListener("pointermove", move);
    area.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      hide();
      area.removeEventListener("pointerenter", move);
      area.removeEventListener("pointermove", move);
      area.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", hide);
    };
  }, []);

  return (
    <section id="work" className="relative z-30 bg-white px-5 pb-12 text-[#101010] md:px-0 md:pb-20">
      <article className="relative -top-8 mx-auto -mb-8 w-full md:-top-12 md:-mb-12 md:w-[70%]">
        <a ref={picture} href="#contact" aria-label="Discuss an interactive project with Nexora"
          className="relative block aspect-[16/9] overflow-hidden bg-[#1a1a1a] outline-offset-8 focus-visible:outline-2 focus-visible:outline-[#2444df] [@media(hover:hover)_and_(pointer:fine)]:cursor-none">
          <Image src="/nexora-world.png" alt="Surreal spheres and an architectural portal from Nexora’s Material Gate project"
            fill sizes="(min-width: 768px) 70vw, calc(100vw - 40px)" className="object-cover" />
          <span ref={cursor} aria-hidden="true"
            className="pointer-events-none absolute z-10 grid size-16 -translate-x-1/2 -translate-y-1/2 scale-[.65] place-items-center rounded-full bg-white text-[#101010] opacity-0 shadow-sm transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none md:size-24">
            <ArrowUpRight size={22} strokeWidth={1} />
          </span>
        </a>
        <div className="flex flex-col gap-4 px-1 py-5 sm:flex-row sm:items-center sm:justify-between md:px-8 md:py-7">
          <h2 className="text-xl font-normal leading-tight tracking-[-.04em] md:text-[clamp(1.2rem,2.4vw,3rem)]">
            The Material Gate — An Interactive Digital World
          </h2>
          <p className="shrink-0 text-[9px] font-semibold uppercase leading-[1.05] tracking-tight md:text-[11px]">
            Creative technology<br />by Nexora Studio
          </p>
        </div>
      </article>
    </section>
  );
}
