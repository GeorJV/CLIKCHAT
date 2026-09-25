import React, { useState, useEffect } from 'react';
import { Tenant } from '../../types';
import { SettingsHeader } from './settings/SettingsHeader';
import { SettingsBusinessTypeStep } from './settings/SettingsBusinessTypeStep';
import { SettingsIdentityStep } from './settings/SettingsIdentityStep';
import { SettingsWelcomeKitStep } from './settings/SettingsWelcomeKitStep';

interface BotSettingsTabProps {
  tenant: Tenant | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
  saveSuccess: boolean;
  onOpenLiveChat?: () => void;
}

export const BotSettingsTab: React.FC<BotSettingsTabProps> = ({
  tenant,
  onUpdateSettings,
  saveSuccess,
  onOpenLiveChat
}) => {
  const [selectedBizType, setSelectedBizType] = useState('tienda');
  const [name, setName] = useState(tenant?.name || '');
  const [slug, setSlug] = useState(tenant?.slug || '');
  const [phone, setPhone] = useState(tenant?.cta_url || '');
  const [agentName, setAgentName] = useState(tenant?.bot_name || 'Asistente Virtual');
  const [agentRole, setAgentRole] = useState('Asesor Comercial & Ventas');
  const [faqBase, setFaqBase] = useState(
    tenant?.business_hours || 'Lunes a Sábado de 9:00 AM a 6:00 PM. Entregas a todo el país.'
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name || '');
      setSlug(tenant.slug || '');
      setPhone(tenant.cta_url || '');
      setAgentName(tenant.bot_name || 'Asistente Virtual');
      if (tenant.business_hours) setFaqBase(tenant.business_hours);
    }
  }, [tenant]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    await onUpdateSettings({
      name,
      slug,
      bot_name: agentName,
      cta_url: phone,
      business_hours: faqBase,
      system_prompt: `${agentRole ? `Rol: ${agentRole}. ` : ''}${faqBase}`
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header con botón de Wizard Rápido estilo Qchatt */}
      <SettingsHeader onOpenWizard={onOpenLiveChat} />

      {/* Paso 1: Selector de Tipo de Negocio (8 Industrias) */}
      <SettingsBusinessTypeStep
        selectedBizType={selectedBizType}
        onSelectBizType={setSelectedBizType}
      />

      {/* Paso 2: Datos de Identidad Comercial & Cobro Sinpe / WhatsApp */}
      <SettingsIdentityStep
        name={name}
        setName={setName}
        slug={slug}
        setSlug={setSlug}
        phone={phone}
        setPhone={setPhone}
        agentName={agentName}
        setAgentName={setAgentName}
        agentRole={agentRole}
        setAgentRole={setAgentRole}
        faqBase={faqBase}
        setFaqBase={setFaqBase}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        onSave={handleSave}
        onLivePreview={onOpenLiveChat}
      />

      {/* Paso 3: Identidad Digital QLink & Kit de Bienvenida */}
      <SettingsWelcomeKitStep
        slug={slug || tenant?.slug || 'mi-tienda'}
        onOpenLiveChat={onOpenLiveChat}
        onOpenWizard={onOpenLiveChat}
      />
    </div>
  );
};
