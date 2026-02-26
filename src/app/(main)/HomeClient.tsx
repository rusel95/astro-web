'use client';

import { useEffect } from 'react';
import { track, ANALYTICS_EVENTS } from '@/lib/analytics';
import HeroSection from '@/components/landing/HeroSection';
import PainPointsSection from '@/components/landing/PainPointsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ProductCatalog from '@/components/landing/ProductCatalog';
import BookOfLifeSection from '@/components/landing/BookOfLifeSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import StatsSection from '@/components/landing/StatsSection';
import AccountBenefitsSection from '@/components/landing/AccountBenefitsSection';
import EmailSubscriptionSection from '@/components/landing/EmailSubscriptionSection';
import SeoTextSection from '@/components/landing/SeoTextSection';

export default function HomeClient() {
  useEffect(() => {
    track(ANALYTICS_EVENTS.LANDING_VIEWED);
  }, []);

  return (
    <div>
      <HeroSection />
      <hr className="divider-cosmic mx-8 md:mx-auto md:max-w-4xl" />
      <PainPointsSection />
      <HowItWorksSection />
      <ProductCatalog />
      <BookOfLifeSection />
      <TestimonialsSection />
      <StatsSection />
      <AccountBenefitsSection />
      <EmailSubscriptionSection />
      <SeoTextSection />
    </div>
  );
}
