"use client";

import { useStudioMotion } from "@/hooks/useStudioMotion";

export default function WorldwideSection() {
  const root = useStudioMotion();
  return <div ref={root}>
    <section aria-labelledby="worldwide-title" className="relative flex min-h-[650px] items-center justify-center bg-[#101010] px-6 pb-32 pt-36 text-white md:min-h-[100svh] md:pb-40">
      <span className="absolute left-[5%] top-20 text-sm md:top-28 md:text-lg">Dhaka / Bangladesh</span>
      <span className="absolute right-[5%] top-20 text-sm md:top-28 md:text-lg">Worldwide collaboration</span>
      <div className="mx-auto max-w-[650px] text-center">
        <h2 id="worldwide-title" data-reveal className="text-[clamp(3.2rem,4.4vw,5.5rem)] font-light leading-none tracking-[-.07em]">Worldwide.</h2>
        <p data-reveal className="mt-10 text-base leading-[1.55] md:text-[clamp(17px,1.05vw,21px)]">We are global in our vision and our ambition. Our favourite projects create authentic connections across the world. This is about redefining the interactive space and creating new ways of communicating in a restless world. Based in Bangladesh, we are available for worldwide collaboration.</p>
        <div aria-hidden="true" data-reveal className="mx-auto mt-16 h-px w-12 bg-white/60" />
      </div>
    </section>
  </div>;
}
