import type { Metadata } from "next";
import { HowItWorksHero } from "@/components/public/HowItWorksHero";
import { HowItWorksProcess } from "@/components/public/HowItWorksProcess";
import { HowItWorksConfidence } from "@/components/public/HowItWorksConfidence";
import { HowItWorksContext } from "@/components/public/HowItWorksContext";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how SchoolCost NG gathers, verifies, and labels school fee data so you know where each figure came from and how far to trust it.",
};

export default function HowItWorksPage() {
  return (
    <>
      <HowItWorksHero />
      <HowItWorksProcess />
      <HowItWorksConfidence />
      <HowItWorksContext />
    </>
  );
}
