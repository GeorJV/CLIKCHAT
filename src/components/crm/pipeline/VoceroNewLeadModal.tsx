import React, { useState } from 'react';
import { X, UserPlus, DollarSign, Phone, Mail, User } from 'lucide-react';
import { CrmLead, CRM_STAGES, CrmStageId, CrmChannel } from '../../../types/crm';

interface VoceroNewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLead: (data: Partial<CrmLead>) => void;
}

export const VoceroNewLeadModal: React.FC<VoceroNewLeadModalProps> = ({
  isOpen,
  onClose,
  onCreateLead,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [channel, setChannel] = useState<CrmChannel>('whatsapp');
  const [stage, setStage] = useState<CrmStageId>('lead');
  const [dealValue, setDealValue] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      channel,
      stage,
      deal_value: parseFloat(dealValue) || 0,
      notes: notes.trim(),
      tags: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Cabecera del Modal */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Registrar Nuevo Lead</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="text-[11px] font-bold text-zinc-400 mb-1 block">Nombre del Contacto *</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Sofía Rodríguez"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 mb-1 block">Teléfono (WhatsApp)</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+52 55..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 mb-1 block">Canal</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as CrmChannel)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="web">Web ClikChat</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 mb-1 block">Etapa Inicial</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as CrmStageId)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
              >
                {CRM_STAGES.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 mb-1 block">Valor Estimado ($)</label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-400 mb-1 block">Notas Iniciales</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Detalles sobre su interés..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition shadow-sm cursor-pointer"
            >
              Crear Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
