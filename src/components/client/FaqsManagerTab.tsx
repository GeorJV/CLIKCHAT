import React, { useState, useMemo } from 'react';
import { FAQ } from '../../types';
import { FaqsHeader } from './faqs/FaqsHeader';
import { FaqList } from './faqs/FaqList';
import { FaqSingleModal } from './faqs/FaqSingleModal';
import { FaqFileUploadModal } from './faqs/FaqFileUploadModal';

interface FaqsManagerTabProps {
  faqs: FAQ[];
  onCreateFaq: (question: string, answer: string, category?: string) => Promise<boolean>;
  onDeleteFaq: (id: string) => Promise<boolean>;
  onUpdateFaq?: (id: string, newAnswer: string) => Promise<boolean>;
  onCreateBulkFaqs?: (faqs: Array<{ question: string; answer: string; category?: string }>, source?: string) => Promise<boolean>;
}

export const FaqsManagerTab: React.FC<FaqsManagerTabProps> = ({
  faqs,
  onCreateFaq,
  onDeleteFaq,
  onUpdateFaq,
  onCreateBulkFaqs
}) => {
  const [singleModalOpen, setSingleModalOpen] = useState(false);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  const existingCategories = useMemo(() => {
    const cats = new Set<string>();
    faqs.forEach(f => {
      if (f.category?.trim()) cats.add(f.category.trim().toLowerCase());
    });
    return Array.from(cats);
  }, [faqs]);

  const handleCreateSingle = async (question: string, answer: string, category: string) => {
    return await onCreateFaq(question, answer, category);
  };

  const handleImportBulk = async (bulkFaqs: Array<{ question: string; answer: string; category?: string }>, source: string) => {
    if (onCreateBulkFaqs) {
      return await onCreateBulkFaqs(bulkFaqs, source);
    } else {
      // Fallback secuencial si no está disponible bulk
      for (const item of bulkFaqs) {
        await onCreateFaq(item.question, item.answer, item.category);
      }
      return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Cabecera con Botones 'Nueva FAQ' y 'Cargar Archivo' */}
      <FaqsHeader
        totalFaqs={faqs.length}
        onOpenSingleModal={() => setSingleModalOpen(true)}
        onOpenFileModal={() => setFileModalOpen(true)}
      />

      {/* 2. Buscador, Filtros y Lista de FAQs con Badges */}
      <FaqList
        faqs={faqs}
        onDeleteFaq={onDeleteFaq}
        onUpdateFaq={onUpdateFaq}
      />

      {/* 3. Modal para Subir Pregunta por Pregunta */}
      <FaqSingleModal
        isOpen={singleModalOpen}
        onClose={() => setSingleModalOpen(false)}
        onSubmit={handleCreateSingle}
        existingCategories={existingCategories}
      />

      {/* 4. Modal para Carga de Archivos (.txt, .docx, .pdf) con Previsualización */}
      <FaqFileUploadModal
        isOpen={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        onImportBulk={handleImportBulk}
      />
    </div>
  );
};
