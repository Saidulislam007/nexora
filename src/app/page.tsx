import WorldwideSection from "@/components/sections/WorldwideSection";
import StudioStorySection from "@/components/sections/StudioStorySection";
import StudioUpdatesSection from "@/components/sections/StudioUpdatesSection";
import GamesSection from "@/components/sections/GamesSection";
import DiscoverSection from "@/components/sections/DiscoverSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import HeroSection from "@/components/sections/HeroSection";
import WorkSection from "@/components/sections/WorkSection";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <main className="bg-[#f1f0eb] text-[#101010]">
      <Header />
      <HeroSection />
      <WorkSection />
      <AboutSection />
      <DiscoverSection />
      <GamesSection />
      <WorldwideSection />
      <StudioStorySection />
      <StudioUpdatesSection />
      <ContactSection />
    </main>
  );
}
