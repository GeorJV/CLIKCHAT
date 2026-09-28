import React from 'react';
import { Building2, Search, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAdminDirectory } from '../../../hooks/useAdminDirectory';
import { AiSpendingCard } from './AiSpendingCard';
import { BusinessDirectoryTable } from './BusinessDirectoryTable';
import { BusinessDetailModal } from './BusinessDetailModal';
import { AiBudgetModal } from './AiBudgetModal';

export const BusinessDirectoryTab: React.FC = () => {
  const {
    merchants,
    totalCount,
    aiMetrics,
    searchTerm,
    setSearchTerm,
    isLoading,
    fetchMerchants,
    isSubModalOpen,
    setIsSubModalOpen,
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    selectedMerchant,
    editSubForm,
    setEditSubForm,
    handleOpenSubModal,
    handleSaveSub,
    isSavingSub,
    toastMessage
  } = useAdminDirectory();

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>Directorio de Negocios Registrados</span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-300 font-mono text-[10px] rounded-full border border-slate-700">
                {totalCount} comercios
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Datos 100% reales de Cloudflare D1: suscripciones, facturación y telemetría de IA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o slug..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white focus:outline-none focus:border-emerald-500 w-56"
            />
          </div>
          <button
            onClick={fetchMerchants}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
            title="Refrescar datos en vivo"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* AI Telemetry Card */}
      <AiSpendingCard metrics={aiMetrics} onOpenBudgetModal={() => setIsBudgetModalOpen(true)} />

      {/* Directory Table */}
      <BusinessDirectoryTable merchants={merchants} onOpenDetail={handleOpenSubModal} />

      {/* Detail Modal */}
      <BusinessDetailModal
        isOpen={isSubModalOpen}
        merchant={selectedMerchant}
        form={editSubForm}
        setForm={setEditSubForm}
        onClose={() => setIsSubModalOpen(false)}
        onSave={handleSaveSub}
        isSaving={isSavingSub}
      />

      {/* AI Budgets & Optional Model Modal */}
      <AiBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        currentSettings={aiMetrics ? {
          dayBudget: aiMetrics.budgets?.dayBudget ?? 1.0,
          weekBudget: aiMetrics.budgets?.weekBudget ?? 5.0,
          monthBudget: aiMetrics.budgets?.monthBudget ?? 15.0,
          glmLimitPerAccount: aiMetrics.limits?.glm_monthly_limit ?? 5.0,
          gptLimitPerAccount: aiMetrics.limits?.gpt_monthly_limit ?? 2.0,
          optionalModel: aiMetrics.models?.optional ? {
            enabled: aiMetrics.models.optional.enabled,
            modelId: aiMetrics.models.optional.modelId,
            name: aiMetrics.models.optional.name,
            monthlyLimit: aiMetrics.models.optional.monthlyLimitPerAccount
          } : { enabled: false, modelId: 'deepseek/deepseek-chat', name: 'DeepSeek V3', monthlyLimit: 5.0 }
        } : null}
        onSaved={fetchMerchants}
      />
    </div>
  );
};
