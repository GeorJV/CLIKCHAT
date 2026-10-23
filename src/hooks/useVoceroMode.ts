import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'clikchat_view_mode';

export function useVoceroMode() {
  const checkInitialMode = (): boolean => {
    if (typeof window === 'undefined') return false;

    // 1. Dominio específico clikchatcrm.pages.dev o subdominio crm
    const host = window.location.hostname.toLowerCase();
    if (host.includes('clikchatcrm') || host.startsWith('crm.')) {
      return true;
    }

    // 2. Parámetro en URL ?mode=crm o ruta /crm
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'crm' || window.location.pathname.startsWith('/crm')) {
      return true;
    }

    // 3. Preferencia guardada en localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'vocero_crm') return true;
    if (saved === 'clikchat_classic') return false;

    return false;
  };

  const [isVoceroMode, setIsVoceroMode] = useState<boolean>(checkInitialMode);

  useEffect(() => {
    const handleStorage = () => {
      setIsVoceroMode(checkInitialMode());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('vocero-mode-change', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('vocero-mode-change', handleStorage);
    };
  }, []);

  const setVoceroMode = useCallback((active: boolean) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, active ? 'vocero_crm' : 'clikchat_classic');
    setIsVoceroMode(active);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', active ? 'crm' : 'classic');
    }
    window.dispatchEvent(new Event('vocero-mode-change'));
  }, []);

  const toggleVoceroMode = useCallback(() => {
    setVoceroMode(!isVoceroMode);
  }, [isVoceroMode, setVoceroMode]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', isVoceroMode ? 'crm' : 'classic');
    }
  }, [isVoceroMode]);

  return {
    isVoceroMode,
    isCrm: isVoceroMode,
    isClassic: !isVoceroMode,
    setVoceroMode,
    toggleVoceroMode,
  };
}
