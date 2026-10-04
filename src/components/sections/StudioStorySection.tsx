"use client";

import Image from "next/image";
import { useStudioMotion } from "@/hooks/useStudioMotion";

export default function StudioStorySection() {
  const root = useStudioMotion();
  return <div ref={root} className="relative bg-white text-[#171717]">
    <section aria-labelledby="studio-story-title" className="relative grid gap-12 pb-32 md:grid-cols-[45%_55%] md:gap-0 md:pb-[18vw]">
      <div className="relative z-10 -mt-14 md:-mt-[100px]">
        <div data-reveal className="relative aspect-[864/612] overflow-hidden bg-[#ccc]">
          <div data-parallax className="absolute inset-0 will-change-transform"><Image src="/studio/pedestal.webp" alt="A floating studio card above a stone pedestal" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" /></div>
        </div>
        <h2 id="studio-story-title" data-reveal className="px-6 pt-14 text-[clamp(3rem,4.3vw,5.4rem)] font-light leading-[1.02] tracking-[-.07em] md:pl-[10vw] md:pt-[7vw]">
          <a href="#about" className="underline decoration-1 underline-offset-8">Discover<br />who we are.</a>
        </h2>
      </div>
      <div className="px-6 md:px-[10vw] md:pt-[18vw]">
        <p data-reveal className="text-xs font-semibold uppercase">We really like our team</p>
        <p data-reveal className="mt-9 text-[clamp(1.5rem,1.9vw,2.4rem)] leading-[1.4] tracking-[-.025em] md:mt-20">This isn’t art-for-art’s sake or tech-cause-it’s-trendy, this is about redefining the interactive space. We believe a talented, agile team and a fresh, insightful approach is how you elevate the field, get noticed and rise above the noise.</p>
      </div>
    </section>
    <div className="relative h-24 bg-[#f2f2f2] md:h-[10vw]">
      <div data-reveal className="absolute bottom-0 right-[8%] z-10 w-[65%] overflow-hidden bg-[#ccc] md:right-[15%] md:w-[35%]">
        <div className="relative aspect-[672/450]"><div data-parallax className="absolute inset-0 will-change-transform"><Image src="/studio/sculpture.webp" alt="An intertwined white sculptural form" fill sizes="(min-width: 768px) 35vw, 65vw" className="object-cover" /></div></div>
      </div>
    </div>
  </div>;
}
