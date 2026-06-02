import Hero from "@/components/sections/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import Statement from "@/components/sections/Statement";
import BentoMetrics from "@/components/sections/BentoMetrics";
import DigitalGap from "@/components/sections/DigitalGap";
import Philosophy from "@/components/sections/Philosophy";
import Capabilities from "@/components/sections/Capabilities";
import WorkShowcase from "@/components/sections/WorkShowcase";
import CallToAction from "@/components/sections/CallToAction";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Statement />
      <BentoMetrics />
      <DigitalGap />
      <Philosophy />
      {/* <Capabilities /> */}
      <WorkShowcase />
      <CallToAction />
    </>
  );
}
