import React, { useState } from 'react';
import { Tenant, Product } from '../../../types';
import { MessageSquare, Store, ShoppingBag, Cpu, Settings } from 'lucide-react';
import { VoceroChannelsSettings } from './VoceroChannelsSettings';
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
  tenant,
  tenantSlug,
  products,
  onUpdateSettings,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [subTab, setSubTab] = useState<'canales' | 'perfil' | 'catalogo' | 'ia'>('canales');

  const TABS = [
    { id: 'canales' as const, label: 'Canales (WhatsApp / Meta)', icon: MessageSquare },
    { id: 'perfil' as const, label: 'Perfil del Negocio', icon: Store },
    { id: 'catalogo' as const, label: 'Catálogo / Menú', icon: ShoppingBag, badge: products.length },
    { id: 'ia' as const, label: 'Motor de IA & Proveedores', icon: Cpu },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f6f8fc] font-sans overflow-hidden">
      {/* Encabezado Vocero */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e8edf6] bg-white px-6 shadow-xs">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-[#0d5bff]" />
          <h2 className="text-[17px] font-bold tracking-tight text-[#0a1730]">Ajustes del Sistema</h2>
          <span className="vocero-kicker ml-2">Configuración General</span>
        </div>

        {/* Sub-tabs tipo píldora Vocero */}
        <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-white text-[#0d5bff] shadow-xs'
                    : 'text-[#62728d] hover:text-[#0a1730]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 rounded-full bg-[#e8edf6] px-1.5 py-0.2 text-[10px] font-bold text-[#42506b]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Área con scroll */}
      <main className="flex-1 overflow-y-auto p-6 max-w-5xl w-full mx-auto">
        {subTab === 'canales' && (
          <VoceroChannelsSettings tenant={tenant} tenantSlug={tenantSlug} />
        )}
        {subTab === 'perfil' && (
          <VoceroBusinessProfileSettings tenant={tenant} onUpdateSettings={onUpdateSettings} />
        )}
        {subTab === 'catalogo' && (
          <VoceroCatalogSettings
            products={products}
            onCreateProduct={onCreateProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
            currency={tenant?.currency}
            businessType={tenant?.business_type}
          />
        )}
        {subTab === 'ia' && (
          <VoceroAiModelSettings tenant={tenant} onUpdateSettings={onUpdateSettings} />
        )}
      </main>
    </div>
  );
};
