import React, { useState, useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { useVoceroMode } from '../../../hooks/useVoceroMode';

interface GreetingDropzoneProps {
  onTextLoaded: (content: string, filename: string) => void;
}

export const GreetingDropzone: React.FC<GreetingDropzoneProps> = ({ onTextLoaded }) => {
  const { isVoceroMode } = useVoceroMode();
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

  const dropzoneBg = isVoceroMode
    ? isDragging ? 'bg-[#ebf1ff] ring-2 ring-[#0d5bff]' : 'bg-[#f8fafc] hover:bg-[#ebf1ff]/50'
    : isDragging ? 'bg-emerald-950/40 ring-2 ring-emerald-500' : 'bg-[#121111] hover:bg-[#1a1919] border border-dashed border-[#333]';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`rounded-2xl p-4 text-center cursor-pointer transition-all shadow-2xs hover:shadow-xs ${dropzoneBg}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,.text"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className={`flex items-center justify-center gap-2 text-xs font-sans ${isVoceroMode ? 'text-[#62728d]' : 'text-zinc-400'}`}>
        <UploadCloud className={`w-4 h-4 ${
          isDragging
            ? (isVoceroMode ? 'text-[#0d5bff] animate-bounce' : 'text-emerald-400 animate-bounce')
            : (isVoceroMode ? 'text-[#8391aa]' : 'text-zinc-500')
        }`} />
        <span>
          {uploadedName ? (
            <span className={`${isVoceroMode ? 'text-[#0d5bff]' : 'text-emerald-400'} font-bold flex items-center gap-1 inline-flex`}>
              <FileText className="w-3.5 h-3.5" />
              Cargado: {uploadedName} (clic para cambiar)
            </span>
          ) : (
            <>
              <strong className={isVoceroMode ? 'text-[#0a1730]' : 'text-zinc-200'}>Arrastra un archivo aquí</strong> o haz clic para subir (.txt, .md)
            </>
          )}
        </span>
      </div>
    </div>
  );
};
