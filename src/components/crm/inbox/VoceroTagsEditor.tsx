import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface VoceroTagsEditorProps {
  tags: string[];
  onUpdateTags: (tags: string[]) => void;
}

export const VoceroTagsEditor: React.FC<VoceroTagsEditorProps> = ({ tags, onUpdateTags }) => {
  const [newTag, setNewTag] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    const trimmed = newTag.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onUpdateTags([...tags, trimmed]);
    setNewTag('');
    setIsAdding(false);
  };

  const handleRemove = (tagToRemove: string) => {
    onUpdateTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
          <Tag className="w-3 h-3 text-emerald-400" /> Etiquetas
        </label>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Agregar
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[11px] border border-zinc-700"
          >
            <span>{tag}</span>
            <button
              onClick={() => handleRemove(tag)}
              className="text-zinc-500 hover:text-rose-400 transition cursor-pointer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}

        {isAdding && (
          <div className="flex items-center gap-1 w-full mt-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Ej: VIP, Comanda, Cita..."
              autoFocus
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleAdd}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold cursor-pointer"
            >
              OK
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
