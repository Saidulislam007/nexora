import CursorTrail from "@/components/effects/CursorTrail";

export default function HeroSection() {
  return <section id="top" className="hero-zone relative min-h-screen overflow-hidden bg-[#0a0a0a] px-5 pb-7 pt-28 text-white md:px-9">
    <CursorTrail/>
    <div className="pointer-events-none relative z-10 flex min-h-[calc(100vh-8rem)] flex-col justify-between">
      <div className="flex items-start justify-between text-[11px] text-white/50"><span>Interactive studio<br/>Dhaka · Worldwide</span></div>
      <div className="hero-copy relative mx-auto my-12 w-full max-w-5xl"><h1 className="hero-short"><span className="hero-word">global<span className="hero-side-note hero-side-note-global">we turn aesthetics into experiences</span></span><span className="hero-word">creative</span><span className="hero-word">studio.<span className="hero-side-note hero-side-note-studio">tech that’s light as air</span></span></h1></div>
      <div className="flex items-end justify-between text-xs text-white/45"><span>•••</span><span>Move your cursor to play</span></div>
    </div>
  </section>;
}
