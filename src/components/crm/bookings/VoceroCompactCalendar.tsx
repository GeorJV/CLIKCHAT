import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getLocalDateKey } from '../../../utils/bookingDateNormalizer';

interface Props {
  appointmentDates: string[]; // ['2026-10-20', '2026-10-21']
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export const VoceroCompactCalendar: React.FC<Props> = ({
  appointmentDates,
  selectedDate,
  onSelectDate
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const startOffset = (firstDayOfMonth + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDayKey = (dayNum: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const todayStr = getLocalDateKey(new Date());

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs font-sans max-w-sm w-full mx-auto animate-in fade-in zoom-in-95 duration-150">
      {/* Header Mes & Nav */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#f1f5f9]">
        <div className="flex items-center gap-1.5 font-bold text-xs text-[#0a1730]">
          <CalendarIcon className="w-3.5 h-3.5 text-[#0d5bff]" />
          <span>{monthNames[month]} {year}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-[#f1f5f9] text-[#62728d] transition cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-[#f1f5f9] text-[#62728d] transition cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Días de la Semana */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] font-bold text-[#8391aa] mb-1">
        <span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span><span>Do</span>
      </div>

      {/* Grilla de Días */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-7 w-7" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayKey = formatDayKey(dayNum);
          const hasAppointments = appointmentDates.includes(dayKey);
          const isSelected = selectedDate === dayKey;
          const isToday = dayKey === todayStr;

          return (
            <button
              key={dayKey}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : dayKey)}
              className={`h-7 w-7 mx-auto rounded-lg font-bold text-[11px] transition flex flex-col items-center justify-center relative cursor-pointer ${
                isSelected
                  ? 'bg-[#0d5bff] text-white shadow-xs'
                  : isToday
                    ? 'border border-[#0d5bff] text-[#0d5bff] font-black'
                    : 'text-[#0a1730] hover:bg-[#f1f5f9]'
              }`}
            >
              <span>{dayNum}</span>
              {hasAppointments && (
                <span className={`absolute bottom-0.5 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#0d5bff]'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer selector */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#f1f5f9] text-[10.5px] text-[#62728d]">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0d5bff]" />
          <span>Días con citas</span>
        </div>
        {selectedDate && (
          <button
            type="button"
            onClick={() => onSelectDate(null)}
            className="text-[#0d5bff] font-bold hover:underline cursor-pointer"
          >
            Quitar filtro
          </button>
        )}
      </div>
    </div>
  );
};
