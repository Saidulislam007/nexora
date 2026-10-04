"use client";

import Image from "next/image";
import { ArrowUpRight, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useStudioMotion } from "@/hooks/useStudioMotion";

const questions = [
  { question: "What services does Nexora offer?", answer: "We create websites, interactive digital experiences and creative interfaces that bring story, design and technology together. Tell us about your idea to discuss the right approach." },
  { question: "What technologies does Nexora specialise in?", answer: "Our current website uses Next.js, React, TypeScript and Tailwind CSS. The technology for each project depends on the experience it needs to deliver." },
  { question: "What is Nexora’s creative process?", answer: "We start with your story and goals, explore the design, build the experience, then refine it through feedback and testing." },
  { question: "Can Nexora handle both strategy and production?", answer: "We can discuss your concept, interface design and development together, and agree on a clear scope before work begins." },
  { question: "What results can I expect working with Nexora?", answer: "The goals and deliverables are agreed for each project. We focus on a clear, responsive experience that supports those goals." },
  { question: "Does Nexora work with international clients?", answer: "We are based in Bangladesh and welcome conversations about remote projects and worldwide collaboration." },
];

export default function StudioUpdatesSection() {
  const root = useStudioMotion();
  const [open, setOpen] = useState<number | null>(null);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    if (typeof email !== "string") return;
    const subject = encodeURIComponent("Nexora studio updates");
    const body = encodeURIComponent(`Hello Nexora,\nI would like to receive studio updates at ${email}.`);
    window.location.href = `mailto:hello@nexora.studio?subject=${subject}&body=${body}`;
  };
  return <div ref={root}>
    <section aria-labelledby="newsletter-title" className="relative isolate bg-[#f2f2f2] px-5 pb-0 pt-24 md:px-0 md:pt-[10.5vw]">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-[#101010] md:h-[6vw]" />
      <div data-reveal className="relative mx-auto max-w-[1400px] bg-white p-7 text-[#171717] md:w-[73%] md:p-[3.5vw]">
        <h2 id="newsletter-title" className="text-2xl font-normal leading-[1.5] tracking-[-.025em] md:text-[clamp(24px,1.8vw,36px)]">Give an email,<br />get the newsletter.</h2>
        <div className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:justify-between">
          <div aria-hidden="true" className="flex gap-1"><span className="size-2 rounded-full bg-black" /><span className="size-2 rounded-full bg-black" /><span className="size-2 rounded-full bg-[#bbb]" /></div>
          <form onSubmit={submit} className="relative w-full md:w-[46%]">
            <label htmlFor="studio-email" className="sr-only">Email address</label>
            <input id="studio-email" name="email" type="email" autoComplete="email" required placeholder="Email address" aria-describedby="studio-email-help" className="relative z-10 w-full rounded-none border-0 border-b border-black/60 bg-transparent py-5 pr-20 text-sm outline-none focus:border-black md:pr-28" />
            <button type="submit" aria-label="Request studio updates via email" className="group absolute -right-2 -top-3 z-20 grid size-20 place-items-center rounded-full bg-[#f4f4f4] outline-offset-4 transition-colors hover:bg-[#e9e9e9] focus-visible:outline-2 md:-top-6 md:size-28"><ArrowUpRight aria-hidden="true" className="size-6 rotate-[25deg] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" strokeWidth={1.2} /></button>
            <p id="studio-email-help" className="mt-3 text-xs text-black/50">Opens your email app to request studio updates.</p>
          </form>
        </div>
      </div>
    </section>
    <section aria-labelledby="faq-title" className="bg-[#101010] px-5 pb-24 md:px-0 md:pb-[8vw]">
      <div aria-hidden="true" className="relative mx-auto aspect-[1400/650] max-w-[1400px] overflow-hidden md:w-[73%]">
        <div data-parallax className="absolute inset-0 will-change-transform"><Image src="/studio/fabric.webp" alt="" fill sizes="(min-width: 768px) 73vw, 100vw" className="object-cover" /></div>
      </div>
      <div data-reveal className="mx-auto mt-14 max-w-[1400px] bg-white px-7 py-12 text-[#171717] md:mt-[8vw] md:w-[73%] md:px-[5.2vw] md:py-[5vw]">
        <p className="text-xs text-black/60 underline underline-offset-4">Everything you need to know</p>
        <h2 id="faq-title" className="mb-10 mt-4 text-[clamp(1.8rem,3vw,3.5rem)] font-light leading-[1.1] tracking-[-.06em] md:mb-20">Frequently Asked Questions</h2>
        <div>{questions.map((item, index) => <div key={item.question} className="border-t border-black/15">
          <h3><button type="button" id={`faq-question-${index}`} aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(open === index ? null : index)} className="flex w-full items-center justify-between gap-6 py-6 text-left text-base outline-offset-4 focus-visible:outline-2 md:py-8 md:text-xl">
            {item.question}<Plus aria-hidden="true" className={`size-4 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${open === index ? "rotate-45" : ""}`} strokeWidth={1} />
          </button></h3>
          <div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} inert={open !== index} aria-hidden={open !== index} className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${open === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden"><p className="max-w-3xl pb-7 text-sm leading-relaxed text-black/65 md:text-base">{item.answer}</p></div>
          </div>
        </div>)}</div>
      </div>
    </section>
  </div>;
}
