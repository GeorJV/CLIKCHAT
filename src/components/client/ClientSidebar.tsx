import React, { useState } from 'react';
import { ClientTab } from '../../types/client';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarSimpleNav } from './sidebar/SidebarSimpleNav';
import { SidebarProNav } from './sidebar/SidebarProNav';
import { SidebarFooter } from './sidebar/SidebarFooter';

interface ClientSidebarProps {
  activeTab: ClientTab;
  setActiveTab: (tab: ClientTab) => void;
  unresolvedCount: number;
  tenantSlug: string;
}

export const ClientSidebar: React.FC<ClientSidebarProps> = ({
  activeTab,
  setActiveTab,
  unresolvedCount,
  tenantSlug
}) => {
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isExpanded = isPinned || isHovered;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${
        isExpanded ? 'w-60 p-3' : 'w-16 px-1.5 py-3'
      } transition-all duration-300 ease-in-out shrink-0 bg-[#131212] border-r border-[#222020] flex flex-col justify-between select-none h-full overflow-y-auto relative`}
    >
      <div className="space-y-2.5">
        {/* Header con Alternador de Modo y Botón Pin */}
        <SidebarHeader
          isExpanded={isExpanded}
          isSimpleMode={isSimpleMode}
          setIsSimpleMode={setIsSimpleMode}
          isPinned={isPinned}
          setIsPinned={setIsPinned}
          showToast={showToast}
        />

        {/* Contenido Dinámico de Menú: Modo Simple vs Modo Pro */}
        {isSimpleMode ? (
          <SidebarSimpleNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isExpanded={isExpanded}
            unresolvedCount={unresolvedCount}
          />
        ) : (
          <SidebarProNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isExpanded={isExpanded}
            unresolvedCount={unresolvedCount}
          />
        )}
      </div>

      {/* Pie con Tarjeta de Funnels y Botón Invita & Gana */}
      <SidebarFooter
        isExpanded={isExpanded}
        isSimpleMode={isSimpleMode}
        onSwitchToPro={() => {
          setIsSimpleMode(false);
          showToast('Cambiado a Modo Pro con categorías');
        }}
        showToast={showToast}
        tenantSlug={tenantSlug}
      />

      {/* Toast Flotante para Feedback Interactivo */}
      {toastMessage && (
        <div className="absolute bottom-16 left-2 right-2 z-50 bg-[#1a1919] border border-emerald-500/50 text-emerald-300 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-xl text-center backdrop-blur-md animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}
    </aside>
  );
};
