import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { SkillShowcase } from "@/components/SkillShowcase";
import { StatsSection } from "@/components/StatsSection";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <HowItWorksSection />
          <FeaturesSection />
          <SkillShowcase />
          <StatsSection />
        </motion.div>
      </main>
    </div>
  );
};

export default Index;