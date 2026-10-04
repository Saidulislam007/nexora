"use client";

import { useEffect, useRef } from "react";

export function useStudioMotion() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const area = root.current;
    if (!area) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const animations: Animation[] = [];
    const reveals = Array.from(area.querySelectorAll<HTMLElement>("[data-reveal]"));
    const images = Array.from(area.querySelectorAll<HTMLElement>("[data-parallax]"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const node = entry.target as HTMLElement;
        animations.push(node.animate([
          { opacity: 0, transform: "translateY(32px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 1000, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" }));
        observer.unobserve(node);
      });
    }, { threshold: 0.12 });
    reveals.forEach(node => { node.style.opacity = "0"; observer.observe(node); });
    let frame = 0;
    const update = () => {
      frame = 0;
      images.forEach(node => {
        const bounds = node.parentElement?.getBoundingClientRect();
        if (!bounds || bounds.bottom < 0 || bounds.top > window.innerHeight) return;
        const offset = Math.max(-40, Math.min(40, (window.innerHeight / 2 - bounds.top - bounds.height / 2) * 0.075));
        node.style.transform = `translate3d(0,${offset}px,0) scale(1.15)`;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      cancelAnimationFrame(frame);
      reveals.forEach(node => { node.style.opacity = ""; });
      images.forEach(node => { node.style.transform = ""; });
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return root;
}
