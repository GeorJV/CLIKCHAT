import React from 'react';
import { UserCheck } from 'lucide-react';
import { Tenant } from '../../../types';
import { AuthUser } from '../../../types/auth';
import { AccountBillingCard } from './AccountBillingCard';
import { AccountContactCard } from './AccountContactCard';
import { AccountSecurityCard } from './AccountSecurityCard';

interface MyAccountTabProps {
  tenant: Tenant | null;
  user: AuthUser | null;
  onUpdateSettings: (updates: Partial<Tenant>) => Promise<boolean>;
}

export const MyAccountTab: React.FC<MyAccountTabProps> = ({
  tenant,
  user,
  onUpdateSettings
}) => {
  const userEmail = user?.email || tenant?.owner_email || 'propietario@clikchat.com';

  return (
    <div className="space-y-5 max-w-5xl text-slate-100 font-sans animate-fadeIn">
      {/* Header de Mi Cuenta */}
      <div className="border-b border-[#242323] pb-3.5">
        <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <span>Mi Cuenta & Suscripción</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Gestiona los detalles de tu plan de software, ciclos de facturación, datos de contacto y credenciales de acceso.
        </p>
      </div>

      {/* 1. Tarjeta de Suscripción, Monto, Próximo Pago y Fecha de Creación */}
      <AccountBillingCard tenant={tenant} />

      {/* 2. Tarjeta de Correo, Teléfono y Tipo de Negocio */}
      <AccountContactCard tenant={tenant} onUpdateSettings={onUpdateSettings} />

      {/* 3. Tarjeta de Seguridad y Cambio de Contraseña */}
      <AccountSecurityCard userEmail={userEmail} />
    </div>
  );
};
