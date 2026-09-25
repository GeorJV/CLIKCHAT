import React, { useState, useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

interface RulesDropzoneProps {
  onTextLoaded: (content: string, filename: string) => void;
}

export const RulesDropzone: React.FC<RulesDropzoneProps> = ({ onTextLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setUploadedName(file.name);
        onTextLoaded(text.trim(), file.name);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-rose-500 bg-rose-500/10'
          : 'border-[#2c2a2a] hover:border-rose-500/50 bg-[#141313]'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.text"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs">
        <UploadCloud className={`w-4 h-4 ${isDragging ? 'text-rose-400 animate-bounce' : 'text-zinc-500'}`} />
        <span>
          {uploadedName ? (
            <span className="text-rose-400 font-semibold flex items-center gap-1 inline-flex">
              <FileText className="w-3.5 h-3.5" />
              Cargado: {uploadedName} (clic para cambiar)
            </span>
          ) : (
            <>
              <span className="font-semibold text-zinc-300">Cargar archivo de reglas</span> o arrástralo aquí (.txt, .md)
            </>
          )}
        </span>
      </div>
    </div>
  );
};
