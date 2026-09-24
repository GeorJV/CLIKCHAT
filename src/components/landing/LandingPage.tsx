import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingTrustBar } from './LandingTrustBar';
import { LandingTargetAudience } from './LandingTargetAudience';
import { LandingCapabilitiesBento } from './LandingCapabilitiesBento';
import { LandingInteractiveDemo } from './LandingInteractiveDemo';
import { LandingFAQ } from './LandingFAQ';
import { LandingCTA } from './LandingCTA';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onGoToDashboard: () => void;
  onGoToAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToDashboard,
  onGoToAdmin
}) => {
  const handleOpenDemo = () => {
    const el = document.getElementById('demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      <LandingNavbar
        onOpenDemo={handleOpenDemo}
        onGoToDashboard={onGoToDashboard}
        onGoToAdmin={onGoToAdmin}
      />
      <main>
        <LandingHero
          onOpenDemo={handleOpenDemo}
          onGoToDashboard={onGoToDashboard}
        />
        <LandingTrustBar />
        <LandingTargetAudience />
        <LandingCapabilitiesBento />
        <LandingInteractiveDemo />
        <LandingFAQ />
        <LandingCTA
          onOpenDemo={handleOpenDemo}
          onGoToDashboard={onGoToDashboard}
        />
      </main>
      <LandingFooter
        onGoToDashboard={onGoToDashboard}
        onGoToAdmin={onGoToAdmin}
        onOpenDemo={handleOpenDemo}
      />
    </div>
  );
};
