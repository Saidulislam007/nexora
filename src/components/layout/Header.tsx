"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [["Work", "#work"], ["About", "#about"], ["Contact", "#contact"]];

  return <>
    <header className="fixed inset-x-0 top-0 z-50 flex h-[74px] items-center justify-between border-b border-white/10 bg-[#0a0a0a]/88 px-5 text-white backdrop-blur-xl md:px-9">
      <a href="#top" className="wordmark">NEXORA<span>●</span></a>
      <div className="hidden text-center text-[12px] uppercase tracking-[.16em] text-white/45 md:block">Creative technology studio<br/>Dhaka · Everywhere</div>
      <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 text-sm uppercase tracking-[.12em]" aria-label="Toggle navigation">Menu <span className="grid size-10 place-items-center rounded-full border border-white/25">{menuOpen ? <X size={17}/> : <Menu size={17}/>}</span></button>
    </header>
    {menuOpen && <div className="fixed inset-0 z-40 grid bg-[#ff5b21] px-5 pt-24 md:px-10"><nav className="flex flex-col justify-center text-[clamp(4rem,11vw,10rem)] font-medium leading-[.82] tracking-[-.07em]">{links.map(([label, href]) => <a key={href} onClick={() => setMenuOpen(false)} href={href}>{label}</a>)}</nav></div>}
  </>;
}
