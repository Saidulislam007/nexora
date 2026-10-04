"use client";

import { ArrowUpRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const projects = [
  { n:"01", title:"The Material Gate", type:"Interactive identity", tone:"orange", crop:"object-[46%_center]" },
  { n:"02", title:"Bodies of Light", type:"Digital installation", tone:"blue", crop:"object-[70%_center]" },
  { n:"03", title:"Future Archives", type:"Cultural experience", tone:"black", crop:"object-[20%_center]" },
];

export default function WorkSection() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const project = projects[active];

  return <section id="work" className="bg-[#101010] px-4 py-5 text-white md:px-5"><div className="relative min-h-[92vh] overflow-hidden rounded-[1.3rem]">
    <Image src="/nexora-world.png" alt="Surreal material spheres floating through an architectural portal" fill priority sizes="100vw" className={`absolute inset-0 scale-[1.03] object-cover transition-all duration-1000 ${project.crop}`}/><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/20"/>
    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 text-xs uppercase tracking-[.15em] md:p-9"><span>Selected worlds / 03</span><button onClick={() => setPlaying(!playing)} className="grid size-11 place-items-center rounded-full bg-white text-black" aria-label={playing ? "Pause motion" : "Play motion"}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button></div>
    <div className="absolute inset-x-0 bottom-0 p-6 md:p-9"><div className="mb-7 flex items-end justify-between"><div><p className="mb-2 text-sm text-white/65">{project.type}</p><h2 className="max-w-5xl text-[clamp(3rem,8vw,8rem)] font-medium leading-[.82] tracking-[-.07em]">{project.title}</h2></div><ArrowUpRight className="hidden md:block" size={55}/></div>
      <div className="grid border-t border-white/35 md:grid-cols-3">{projects.map((item, index) => <button key={item.n} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} className={`flex items-center justify-between border-b border-white/25 py-5 text-left text-sm transition md:border-b-0 md:border-r md:px-5 ${active === index ? "text-white" : "text-white/45"}`}><span>{item.n} — {item.title}</span><span className={`size-2 rounded-full ${item.tone === "orange" ? "bg-orange-500" : item.tone === "blue" ? "bg-blue-500" : "bg-white"}`}/></button>)}</div>
    </div>
  </div></section>;
}
