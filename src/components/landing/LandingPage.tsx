import React, { useState } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingTrustBar } from './LandingTrustBar';
import { LandingTargetAudience } from './LandingTargetAudience';
import { LandingCapabilitiesBento } from './LandingCapabilitiesBento';
import { LandingInteractiveDemo } from './LandingInteractiveDemo';
import { LandingFAQ } from './LandingFAQ';
import { LandingCTA } from './LandingCTA';
import { LandingFooter } from './LandingFooter';
import { ClientLogin } from '../client/ClientLogin';
import { ClientRegister } from '../client/ClientRegister';
import { useAuth } from '../../hooks/useAuth';
import { LoginFormData, RegisterFormData } from '../../types/auth';
import { X } from 'lucide-react';

interface LandingPageProps {
  onGoToDashboard: (slug?: string) => void;
  onGoToAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToDashboard,
  onGoToAdmin
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterView, setIsRegisterView] = useState(false);
  const { login, register, error: authError, setError } = useAuth();

  const handleOpenDemo = () => {
    const el = document.getElementById('demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenLogin = () => {
    setIsRegisterView(false);
    setError(null);
    setShowAuthModal(true);
  };

  const handleOpenRegister = () => {
    setIsRegisterView(true);
    setError(null);
    setShowAuthModal(true);
  };

  const handleLogin = async (data: LoginFormData) => {
    const success = await login(data);
    if (success) {
      setShowAuthModal(false);
      const active = localStorage.getItem('clikchat_active_tenant_slug') || undefined;
      onGoToDashboard(active);
    }
    return success;
  };

  const handleRegister = async (data: RegisterFormData) => {
    const success = await register(data);
    if (success) {
      setShowAuthModal(false);
      const active = localStorage.getItem('clikchat_active_tenant_slug') || undefined;
      onGoToDashboard(active);
    }
    return success;
  };

  return (
    <div className="min-h-screen w-full bg-[#fbfaf8] text-[#181716] font-sans selection:bg-[#c5a365] selection:text-white overflow-x-hidden relative">
      <LandingNavbar
        onOpenDemo={handleOpenDemo}
        onGoToDashboard={onGoToDashboard}
        onGoToAdmin={onGoToAdmin}
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
      />
      <main>
        <LandingHero
          onOpenDemo={handleOpenDemo}
          onGoToDashboard={onGoToDashboard}
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
        />
        <LandingTrustBar />
        <LandingTargetAudience />
        <LandingCapabilitiesBento />
        <LandingInteractiveDemo />
        <LandingFAQ />
        <LandingCTA
          onOpenDemo={handleOpenDemo}
          onGoToDashboard={onGoToDashboard}
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
        />
      </main>
      <LandingFooter
        onGoToDashboard={onGoToDashboard}
        onGoToAdmin={onGoToAdmin}
        onOpenDemo={handleOpenDemo}
      />

      {/* Interactive Modal for Login / Register */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAuthModal(false);
              setError(null);
            }
          }}
        >
          <div className="relative w-full max-w-lg my-auto">
            <button
              onClick={() => {
                setShowAuthModal(false);
                setError(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#1e1d1d] hover:bg-[#2e2b2b] text-zinc-400 hover:text-white border border-[#383535] transition cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isRegisterView ? (
              <ClientRegister
                onRegister={handleRegister}
                onSwitchToLogin={() => {
                  setIsRegisterView(false);
                  setError(null);
                }}
                error={authError}
              />
            ) : (
              <ClientLogin
                onLogin={handleLogin}
                onSwitchToRegister={() => {
                  setIsRegisterView(true);
                  setError(null);
                }}
                error={authError}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

