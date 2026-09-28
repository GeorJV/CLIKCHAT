import React, { useState, useEffect } from 'react';
import { ShieldAlert, TrendingUp, Building2, Cpu } from 'lucide-react';
import { FinanceDashboardTab } from './finance/FinanceDashboardTab';
import { BusinessDirectoryTab } from './directory/BusinessDirectoryTab';
import { AdminAiConsoleTab } from './AdminAiConsoleTab';

export type SuperAdminTab = 'finance' | 'directory' | 'ai-console';

export const SuperAdminDashboard: React.FC = () => {
  const getInitialTab = (): SuperAdminTab => {
    if (typeof window === 'undefined') return 'finance';
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'directory' || tabParam === 'negocios') return 'directory';
    if (tabParam === 'ai-console' || tabParam === 'console' || tabParam === 'ia') return 'ai-console';
    return 'finance';
  };

  const [activeTab, setActiveTab] = useState<SuperAdminTab>(getInitialTab);
  const [tenantCount, setTenantCount] = useState<number>(0);

  const handleTabChange = (tab: SuperAdminTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const fetchTenantCount = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const data = await res.json();
        setTenantCount(data?.metrics?.totalTenants || 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchTenantCount();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-5 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 md:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white tracking-tight">Super Admin Panel ClikChat</h1>
            <p className="text-xs text-slate-400">Inteligencia Financiera, Directorio de Negocios y AI Studio</p>
          </div>
        </div>

        {/* Tab Switcher Buttons (Estilo QChatt) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 self-start sm:self-auto">
          {/* Botón Dashboard Financiero */}
          <button
            onClick={() => handleTabChange('finance')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'finance'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp size={14} />
            <span>Dashboard Financiero</span>
          </button>

          {/* Botón Directorio Negocios */}
          <button
            onClick={() => handleTabChange('directory')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 size={14} />
            <span>Directorio de Negocios</span>
            {tenantCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono text-emerald-300">
                {tenantCount}
              </span>
            )}
          </button>

          {/* Botón Consola & IA */}
          <button
            onClick={() => handleTabChange('ai-console')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai-console'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu size={14} />
            <span>Consola & IA</span>
          </button>
        </div>
      </div>

      {/* Tab Views */}
      <div className="transition-all duration-200">
        {activeTab === 'finance' && <FinanceDashboardTab />}
        {activeTab === 'directory' && <BusinessDirectoryTab />}
        {activeTab === 'ai-console' && <AdminAiConsoleTab onTenantCreated={fetchTenantCount} />}
      </div>
    </div>
  );
};
