import Navbar from '../components/home/Navbar';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CriteriaSection from '../components/home/CriteriaSection';
import MatchingSection from '../components/home/MatchingSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CTASection from '../components/home/CTASection';
import Footer from '../components/home/Footer';

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CriteriaSection />
      <MatchingSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
}
