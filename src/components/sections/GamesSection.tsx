"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export default function GamesSection() {
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLParagraphElement>(null);
  const wipe = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLAnchorElement>(null);
  const circle = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const link = action.current;
    const disc = circle.current;
    if (!link || !disc) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    const render = (time: number) => {
      frame = 0;
      const dt = Math.min(time - (previous || time - 16), 40);
      previous = time;
      const ease = 1 - Math.exp(-dt / 110);
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      disc.style.translate = `${x}px ${y}px`;
      if (Math.hypot(targetX - x, targetY - y) > 0.1) frame = requestAnimationFrame(render);
      else previous = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      const bounds = link.getBoundingClientRect();
      // Measure the stationary link so the moving circle cannot feed back into its target.
      const centerX = bounds.right - disc.offsetWidth / 2;
      const centerY = bounds.top + bounds.height / 2;
      targetX = Math.max(-32, Math.min(32, (event.clientX - centerX) * 0.25));
      targetY = Math.max(-28, Math.min(28, (event.clientY - centerY) * 0.25));
      schedule();
    };
    const reset = () => { targetX = 0; targetY = 0; schedule(); };
    link.addEventListener("pointermove", move);
    link.addEventListener("pointerleave", reset);
    link.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    reduced.addEventListener("change", reset);
    return () => {
      cancelAnimationFrame(frame);
      link.removeEventListener("pointermove", move);
      link.removeEventListener("pointerleave", reset);
      link.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      reduced.removeEventListener("change", reset);
      disc.style.translate = "";
    };
  }, []);

  useEffect(() => {
    const area = section.current;
    const surface = panel.current;
    const logo = wordmark.current;
    const curtain = wipe.current;
    if (!area || !surface || !logo || !curtain) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    if (!reduced.matches) {
      surface.style.clipPath = "inset(42% 0 42% 78% round 120px)";
      logo.style.opacity = "1";
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduced.matches) return;
      const play = (node: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
        animations.push(node.animate(frames, { fill: "both", ...options }));
      };
      play(logo, [{ opacity: 1 }, { opacity: 1, offset: 0.45 }, { opacity: 0 }], { duration: 850 });
      play(surface, [
        { clipPath: "inset(42% 0 42% 78% round 120px)", opacity: 0 },
        { clipPath: "inset(42% 0 42% 78% round 120px)", opacity: 1, offset: 0.25 },
        { clipPath: "inset(0% 0% 0% 0% round 32px)", opacity: 1 },
      ], { duration: 1050, easing: "cubic-bezier(.76,0,.24,1)" });
      play(curtain, [
        { transform: "translateY(110%)", opacity: 1 },
        { transform: "translateY(0%)", opacity: 1, offset: 0.48 },
        { transform: "translateY(-110%)", opacity: 1 },
      ], { duration: 800, delay: 800, easing: "cubic-bezier(.65,0,.35,1)" });
      surface.querySelectorAll<HTMLElement>("[data-games-reveal]").forEach((node, index) => {
        play(node, [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 750, delay: 1500 + index * 110, easing: "cubic-bezier(.22,1,.36,1)" });
      });
    }, { threshold: 0.15 });
    observer.observe(area);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); surface.style.clipPath = ""; logo.style.opacity = ""; };
  }, []);

  return (
    <section ref={section} id="games" aria-labelledby="games-title" className="relative overflow-hidden bg-white px-4 pb-5 md:px-[4.25vw] md:pb-8">
      <p ref={wordmark} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-[clamp(2.5rem,7vw,7.5rem)] font-bold tracking-[-.075em] opacity-0">
        makeme<span className="text-[#896bff]">play</span>.
      </p>
      <div ref={panel} className="relative flex min-h-[680px] flex-col justify-center overflow-hidden rounded-[24px] bg-[radial-gradient(ellipse_at_37%_62%,#b999ff_0%,#a080fa_47%,#896bff_100%)] px-7 py-24 text-[#fffdf6] md:min-h-[min(880px,100svh)] md:rounded-[32px] md:pl-[10.2vw] md:pr-[5.1vw] md:pt-[12vw] md:pb-[7vw]">
        <h2 id="games-title" data-games-reveal className="relative z-10 mx-auto mb-14 w-full text-center text-[clamp(3.3rem,10.7vw,13rem)] font-semibold leading-[.84] tracking-[-.055em] md:mb-[4vw] md:-ml-[5.1vw] md:w-[calc(100%+5.1vw)]">
          <span className="block">We also do</span><span className="block">games.</span>
        </h2>
        <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <p data-games-reveal className="max-w-[310px] text-xs leading-[1.5] uppercase md:max-w-[16vw] md:text-[clamp(12px,.84vw,17px)]">
            Gaming is the future of experience. We make games with heart. We make games that deliver.
          </p>
          <a ref={action} data-games-reveal href="#contact" aria-label="Contact Nexora about an interactive game" className="group flex items-center justify-end gap-6 self-end rounded-full md:self-center outline-offset-8 focus-visible:outline-2 focus-visible:outline-white md:gap-[5.5vw]">
            <span className="text-sm leading-[1.5] md:text-[clamp(14px,1.08vw,22px)]">Discover<br />makemeplay.</span>
            <span ref={circle} className="will-change-transform grid size-20 shrink-0 place-items-center rounded-full bg-[#fffdf9] text-[#181818] transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none md:size-[8.5vw] md:max-h-[164px] md:max-w-[164px]">
              <ArrowUpRight aria-hidden="true" className="size-6 rotate-[30deg] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none md:size-8" strokeWidth={1.3} />
            </span>
          </a>
        </div>
        <div ref={wipe} aria-hidden="true" className="pointer-events-none absolute -inset-x-1 -inset-y-3 z-20 rounded-[10%] bg-white opacity-0" />
      </div>
    </section>
  );
}
