import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import MaterialLabSection from "@/components/sections/MaterialLabSection";
import TickerSection from "@/components/sections/TickerSection";
import WorkSection from "@/components/sections/WorkSection";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <main className="bg-[#f1f0eb] text-[#101010]">
      <Header />
      <HeroSection />
      <WorkSection />
      <AboutSection />
      <TickerSection />
      <MaterialLabSection />
      <ContactSection />
    </main>
  );
}
