import { ArrowUpRight } from "lucide-react";

export default function ContactSection() {
  return <section id="contact" className="bg-[#101010] px-5 py-24 text-white md:px-9 md:py-36">
    <div className="grid gap-16 md:grid-cols-[.55fr_2fr]"><p className="label text-white/50">[ LET’S MAKE IT REAL ]</p><div><h2 className="text-[clamp(4rem,10vw,10rem)] font-medium leading-[.8] tracking-[-.075em]">YOUR IDEA.<br/><span className="text-[#ff5b21]">OUR PULSE.</span></h2><a href="mailto:hello@nexora.studio" className="mt-16 inline-flex items-center gap-4 border-b border-white/40 pb-3 text-xl md:text-3xl">said38383742@gmail.com <ArrowUpRight/></a></div></div>
    <footer className="mt-32 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/45 sm:flex-row sm:justify-between"><span>Nexora Creative Technology</span><span>Dhaka / Worldwide</span><a href="#top">Back to top ↑</a></footer>
  </section>;
}
