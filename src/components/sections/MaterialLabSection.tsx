import { Volume2 } from "lucide-react";

export default function MaterialLabSection() {
  return <section className="grid min-h-[80vh] overflow-hidden bg-[#2444df] text-white md:grid-cols-2">
    <div className="flex flex-col justify-between p-6 md:p-10"><p className="label">[ DIGITAL MATERIAL LAB ]</p><div><h2 className="text-[clamp(4rem,9vw,9rem)] font-medium leading-[.78] tracking-[-.075em]">TOUCH<br/>CHANGES<br/>MATTER.</h2><p className="mt-10 max-w-sm text-base leading-6 text-white/65">Move, drag and scroll. The interface responds like a physical surface instead of a stack of static sections.</p></div></div>
    <div className="material-stage"><div className="ring"><div className="material-sphere"/></div><div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-white px-5 py-3 text-xs uppercase tracking-[.13em] text-black"><Volume2 size={15}/> Interaction has a pulse</div></div>
  </section>;
}
