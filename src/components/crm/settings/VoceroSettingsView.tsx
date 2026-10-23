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
      if (p.endsWith('/canales') || p.includes('/canales') || p.endsWith('/whatsapp')) return 'canales';
      if (p.endsWith('/catalogo') || p.includes('/catalogo')) return 'catalogo';
      if (p.endsWith('/ia') || p.includes('/ia')) return 'ia';
      if (p.endsWith('/zernio') || p.includes('/zernio')) return 'zernio';
      if (p.endsWith('/perfil') || p.includes('/perfil')) return 'perfil';
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
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const TABS = [
    { id: 'perfil' as const, label: 'Perfil del Negocio', icon: Store },
    { id: 'canales' as const, label: 'Canales (WhatsApp & ClikChat)', icon: MessageSquare },
    { id: 'catalogo' as const, label: 'Catálogo / Menú', icon: ShoppingBag, badge: products.length },
    { id: 'ia' as const, label: 'Motor de IA', icon: Cpu },
    { id: 'zernio' as const, label: 'Zernio Multicanal', icon: Network },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Settings className="h-4 w-4 text-[#0d5bff] shrink-0" />
          <h2 className="text-base sm:text-[17px] font-bold tracking-tight text-[#0a1730] truncate">Ajustes del Sistema</h2>
          <span className="vocero-kicker ml-1 hidden sm:inline">Configuración</span>
        </div>

        {/* Tabs Bar con Menú Desplegable Responsivo */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl relative" ref={menuRef}>
          {/* Tabs visibles principales */}
          <div className="hidden md:flex items-center gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectSubTab(tab.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                    active ? 'bg-white text-[#0d5bff] shadow-xs' : 'text-[#334155] hover:text-[#0a1730] hover:bg-white/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-1 rounded-full bg-[#e8edf6] px-1.5 py-0.2 text-[10px] font-bold text-[#42506b]">{tab.badge}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selector activo en pantallas compactas */}
          <div className="flex md:hidden items-center gap-1">
            <span className="px-2.5 py-1 text-xs font-bold text-[#0d5bff] bg-white rounded-lg shadow-xs flex items-center gap-1.5">
              {TABS.find(t => t.id === subTab)?.label}
            </span>
          </div>

          {/* Botón de 3 rayitas de menú (Dropdown) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 rounded-lg text-[#42506b] hover:text-[#0a1730] hover:bg-white/80 transition cursor-pointer"
            title="Ver más ajustes"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Dropdown flotante */}
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#e2e8f0] bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#8391aa] border-b border-[#f1f5f9] mb-1">
                Todas las Secciones
              </div>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = subTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { handleSelectSubTab(tab.id); setIsMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer text-left ${
                      active ? 'bg-blue-50 text-[#0d5bff]' : 'text-[#42506b] hover:bg-[#f8fafc] hover:text-[#0a1730]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </div>
                    {active && <Check className="h-3.5 w-3.5 text-[#0d5bff]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 max-w-5xl w-full mx-auto">
        {subTab === 'canales' && (
          <VoceroChannelsSettings
            tenant={tenant}
            tenantSlug={tenantSlug}
            onUpdateSettings={onUpdateSettings}
          />
        )}
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
