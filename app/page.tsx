import Hero from "@/components/sections/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import dynamic from "next/dynamic";

const Statement = dynamic(() => import("@/components/sections/Statement"));
const BentoMetrics = dynamic(() => import("@/components/sections/BentoMetrics"));
const DigitalGap = dynamic(() => import("@/components/sections/DigitalGap"));
const Philosophy = dynamic(() => import("@/components/sections/Philosophy"));
const WorkShowcase = dynamic(() => import("@/components/sections/WorkShowcase"));
const CallToAction = dynamic(() => import("@/components/sections/CallToAction"));

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
