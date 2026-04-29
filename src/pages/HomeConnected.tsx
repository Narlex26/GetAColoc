import CriteriaSection from '../components/home/CriteriaSection';
import MatchingSection from '../components/home/MatchingSection';

export default function HomeConnected() {
  return (
    <div className="w-full overflow-hidden">
      <CriteriaSection />
      <MatchingSection />
    </div>
  );
}
