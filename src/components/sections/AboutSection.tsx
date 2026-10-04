"use client";

import { useEffect, useRef } from "react";

const parts = [
  { text: "We create living digital worlds where ", italic: false },
  { text: "story, design", italic: true },
  { text: " and technology move as one.", italic: false },
];
const sentence = parts.map(part => part.text).join("");

function Letters({ text }: { text: string }) {
  return text.split(/(\s+)/).map((word, index) => /^\s+$/.test(word)
    ? <span key={index}>{word}</span>
    : <span key={index} className="inline-block whitespace-nowrap">{Array.from(word).map((letter, position) =>
      <span key={position} data-about-letter className="relative inline-block origin-center">{letter}</span>
    )}</span>);
}

export default function AboutSection() {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const title = heading.current;
    if (!title) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const letters = Array.from(title.querySelectorAll<HTMLElement>("[data-about-letter]"));
    const animations: Animation[] = [];
    letters.forEach(letter => { letter.style.opacity = "0"; });
    const show = () => {
      animations.forEach(animation => animation.finish());
      letters.forEach(letter => { letter.style.opacity = "1"; letter.style.willChange = ""; });
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (reduced.matches) { show(); return; }
      const distance = Math.min(280, Math.max(100, window.innerWidth * 0.16));
      letters.forEach((letter, index) => {
        // A deterministic spiral distributes letters across every direction.
        const angle = index * 2.399963;
        const radius = distance * (0.65 + ((index * 17) % 29) / 58);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotation = ((index * 31) % 90) - 45;
        letter.style.willChange = "transform, opacity";
        const animation = letter.animate([
          { opacity: 0, transform: `translate3d(${x}px,${y}px,0) rotate(${rotation}deg) scale(.65)` },
          { opacity: 0.7, offset: 0.35 },
          { opacity: 1, transform: "translate3d(0,0,0) rotate(0deg) scale(1)" },
        ], { duration: 1900, delay: (index * 73) % 580, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
        animation.onfinish = () => { letter.style.willChange = ""; };
        animations.push(animation);
      });
    }, { threshold: 0.2, rootMargin: "0px 0px -5% 0px" });
    observer.observe(title);
    const preference = () => { if (reduced.matches) { observer.disconnect(); show(); } };
    reduced.addEventListener("change", preference);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", preference);
      animations.forEach(animation => animation.cancel());
      letters.forEach(letter => { letter.style.opacity = ""; letter.style.willChange = ""; });
    };
  }, []);

  return <section id="about" className="overflow-hidden px-5 py-28 md:px-9 md:py-44"><div className="grid gap-14 md:grid-cols-[.55fr_2fr]">
    <p className="label">[ WHAT WE MAKE ]</p>
    <div className="min-w-0"><h2 ref={heading} aria-label={sentence} className="statement"><span aria-hidden="true">{parts.map((part, index) => part.italic
      ? <em key={index}><Letters text={part.text} /></em>
      : <span key={index}><Letters text={part.text} /></span>
    )}</span></h2><div className="mt-20 grid gap-8 border-t border-black/20 pt-8 md:grid-cols-3"><p className="body-copy">From a first sketch to the final frame, every detail is designed as part of one continuous experience.</p><p className="body-copy">Our work moves between brand platforms, interactive films, playful tools and real-time 3D spaces.</p><p className="body-copy">The result is expressive on a large screen, responsive in your hand and memorable everywhere.</p></div></div>
  </div></section>;
}
