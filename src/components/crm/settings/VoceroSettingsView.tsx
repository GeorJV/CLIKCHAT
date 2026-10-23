import React, { useState, useRef, useEffect } from 'react';
import { Tenant, Product } from '../../../types';
import { MessageSquare, Store, ShoppingBag, Cpu, Settings, Network, Menu, Check } from 'lucide-react';
import { VoceroChannelsSettings } from './VoceroChannelsSettings';
import { VoceroZernioSettings } from './VoceroZernioSettings';
import { VoceroBusinessProfileSettings } from './VoceroBusinessProfileSettings';
import { VoceroCatalogSettings } from './VoceroCatalogSettings';
import { VoceroAiModelSettings } from './VoceroAiModelSettings';

interface VoceroSettingsViewProps {
  tenant: Tenant | null;
  tenantSlug: string;
  products: Product[];
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  onCreateProduct: (data: Partial<Product> & { name: string; price: number }) => Promise<boolean>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
}

export const VoceroSettingsView: React.FC<VoceroSettingsViewProps> = ({
  tenant, tenantSlug, products, onUpdateSettings,
  onCreateProduct, onUpdateProduct, onDeleteProduct,
}) => {
  const getInitialSubTab = (): 'perfil' | 'canales' | 'catalogo' | 'ia' | 'zernio' => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('/canales') || p.includes('/whatsapp')) return 'canales';
      if (p.includes('/catalogo')) return 'catalogo';
      if (p.includes('/ia')) return 'ia';
      if (p.includes('/zernio')) return 'zernio';
    }
    return 'perfil';
  };

  const [subTab, setSubTab] = useState<'perfil' | 'canales' | 'catalogo' | 'ia' | 'zernio'>(getInitialSubTab);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPop = () => setSubTab(getInitialSubTab());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const handleSelectSubTab = (tabId: 'perfil' | 'canales' | 'catalogo' | 'ia' | 'zernio') => {
    setSubTab(tabId);
    if (typeof window !== 'undefined' && tenantSlug) {
      window.history.pushState({}, '', `/user/mi-negocio/${encodeURIComponent(tenantSlug)}/${tabId}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const TABS = [
    { id: 'perfil' as const, label: 'Perfil del Negocio', shortLabel: 'Perfil', icon: Store },
    { id: 'canales' as const, label: 'Canales (WhatsApp)', shortLabel: 'Canales', icon: MessageSquare },
    { id: 'catalogo' as const, label: 'Catálogo / Menú', shortLabel: 'Catálogo', icon: ShoppingBag, badge: products.length },
    { id: 'ia' as const, label: 'Motor de IA', shortLabel: 'Motor IA', icon: Cpu },
    { id: 'zernio' as const, label: 'Zernio Multicanal', shortLabel: 'Zernio', icon: Network },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 sm:px-6 shadow-xs gap-4">
        {/* Título Oficial y Subtítulo Configuración en Pequeño Abajo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#0d5bff] shadow-2xs shrink-0">
            <Settings className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[15px] font-bold tracking-tight text-[#0a1730] leading-tight whitespace-nowrap">
              Ajustes del Sistema
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8391aa] mt-0.5 leading-none">
              Configuración
            </span>
          </div>
        </div>

        {/* Menú de Secciones Bien Estructurado */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl shadow-2xs relative" ref={menuRef}>
          {/* Vista Desktop / Tablet */}
          <div className="hidden sm:flex items-center gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectSubTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-[#0d5bff] shadow-xs'
                      : 'text-[#475569] hover:text-[#0a1730] hover:bg-white/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden xl:inline">{tab.label}</span>
                  <span className="inline xl:hidden">{tab.shortLabel}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-1 rounded-full bg-[#e8edf6] px-1.5 py-0.2 text-[10px] font-bold text-[#42506b]">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selector Compacto Móvil (< 640px) */}
          <div className="flex sm:hidden items-center gap-1">
            <span className="px-2.5 py-1 text-xs font-bold text-[#0d5bff] bg-white rounded-lg shadow-xs flex items-center gap-1.5">
              {TABS.find(t => t.id === subTab)?.shortLabel || 'Ajustes'}
            </span>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg text-[#42506b] hover:text-[#0a1730] hover:bg-white/80 transition cursor-pointer"
              title="Cambiar sección"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          {/* Dropdown Flotante Móvil */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-60 rounded-xl bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 sm:hidden">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8391aa] border-b border-[#f1f5f9] mb-1">
                Secciones de Configuración
              </div>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = subTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { handleSelectSubTab(tab.id); setIsMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer text-left ${
                      active ? 'bg-blue-50 text-[#0d5bff]' : 'text-[#42506b] hover:bg-[#f8fafc] hover:text-[#0a1730]'
                    }`}
                  >
                    <div className="flex items-center gap-2"><Icon className="h-3.5 w-3.5" /><span>{tab.label}</span></div>
                    {active && <Check className="h-3.5 w-3.5 text-[#0d5bff]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-5xl w-full mx-auto">
        {subTab === 'canales' && <VoceroChannelsSettings tenant={tenant} tenantSlug={tenantSlug} onUpdateSettings={onUpdateSettings} />}
        {subTab === 'zernio' && <VoceroZernioSettings tenantSlug={tenantSlug} />}
        {subTab === 'perfil' && <VoceroBusinessProfileSettings tenant={tenant} onUpdateSettings={onUpdateSettings} />}
        {subTab === 'catalogo' && (
          <VoceroCatalogSettings
            products={products}
            currency={tenant?.currency}
            tenantSlug={tenantSlug}
            onCreateProduct={onCreateProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
          />
        )}
        {subTab === 'ia' && <VoceroAiModelSettings tenant={tenant} onUpdateSettings={onUpdateSettings} />}
      </main>
    </div>
  );
};
