import Navigation from "@/components/Navigation";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import HeroSection from "@/components/HeroSection";
import ProductPreview from "@/components/ProductPreview";
import HowItWorks from "@/components/HowItWorks";
import KeyFeatures from "@/components/KeyFeatures";
import Differentiation from "@/components/Differentiation";
import UseCases from "@/components/UseCases";
import PricingPreview from "@/components/PricingPreview";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { BackgroundLines } from "@/components/BackgroundLines";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <BackgroundLines>
        <div className="relative z-10 w-full">
          <AnnouncementBanner />
          <HeroSection />
        </div>
      </BackgroundLines>
      <ProductPreview />
      <HowItWorks />
      <KeyFeatures />
      <Differentiation />
      <UseCases />
      <PricingPreview />
      <FinalCTA />
      <Footer />
    </main>
  );
}

