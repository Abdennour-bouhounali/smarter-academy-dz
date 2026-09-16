import Hero from '../components/hero/Hero';
import StudentHomeBanner from '../components/student/StudentHomeBanner';
import MethodTeaser from '../components/home/MethodTeaser';
import TrustRelevanceSection from '../components/home/TrustRelevanceSection';
import FreePremiumTeaser from '../components/home/FreePremiumTeaser';
import SmarterEverydaySection from '../components/home/SmarterEverydaySection';
import CtaBanner from '../components/common/CtaBanner';
import { useTranslation } from 'react-i18next';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

// Five sections, five jobs — Attention/Curiosity/Experience (Hero),
// Understanding (MethodTeaser), Trust/Relevance (TrustRelevanceSection),
// Desire (FreePremiumTeaser + SmarterEveryday), Action (CtaBanner).
// Nothing here repeats what another visitor page already owns: the full
// methodology lives on /methode, the full pricing on /tarifs, the mission
// on /about — Home experiences the idea, it doesn't re-explain it.
export default function Home() {
  const { t } = useTranslation('marketing');

  useDocumentMeta(t('home.metaTitle'), t('home.metaDescription'));

  return (
    <>
      <Hero />
      <StudentHomeBanner />
      <MethodTeaser />
      <TrustRelevanceSection />
      <FreePremiumTeaser />
      <SmarterEverydaySection />
      <CtaBanner
        eyebrow={t('home.ctaEyebrow')}
        title={t('home.ctaTitle')}
        subtitle={t('home.ctaBody')}
        primaryLabel={t('home.ctaButton')}
        primaryTo="/register"
      />
    </>
  );
}
