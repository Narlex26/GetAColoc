import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CriteriaSection from '../components/home/CriteriaSection';
import MatchingSection from '../components/home/MatchingSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CTASection from '../components/home/CTASection';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CriteriaSection />
      <MatchingSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
