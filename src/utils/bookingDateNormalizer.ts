export type BookingFilterType = 'all' | 'today' | 'tomorrow' | 'after' | 'this_week' | 'next_week';

export interface BookingFilterKeys {
  todayKey: string;
  tomorrowKey: string;
  dayAfterKey: string;
  weekStartKey: string;
  weekEndKey: string;
  nextWeekStartKey: string;
  nextWeekEndKey: string;
  in7DaysKey: string;
}

const MONTH_MAP: Record<string, string> = {
  enero: '01', ene: '01', febrero: '02', feb: '02', marzo: '03', mar: '03',
  abril: '04', abr: '04', mayo: '05', may: '05', junio: '06', jun: '06',
  julio: '07', jul: '07', agosto: '08', ago: '08', septiembre: '09', setiembre: '09', sep: '09', set: '09',
  octubre: '10', oct: '10', noviembre: '11', nov: '11', diciembre: '12', dic: '12',
};

const DAY_MAP: Record<string, number> = { lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6, domingo: 7 };

export function getLocalDateKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function normalizeToDateKey(rawDate?: string | null, refDate: Date = new Date()): string | null {
  if (!rawDate || typeof rawDate !== 'string') return null;
  const s = rawDate.trim().toLowerCase();

  // 1. Direct ISO YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = s.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  // 2. Format DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmyMatch) {
    const d = dmyMatch[1].padStart(2, '0');
    const m = dmyMatch[2].padStart(2, '0');
    return `${dmyMatch[3]}-${m}-${d}`;
  }

  // 3. Spanish text with month name: e.g. 'Lunes, 26 de Octubre de 2026', '26 de octubre', 'Hoy, 26 oct'
  const textDateMatch = s.match(/(\d{1,2})\s+(?:de\s+)?([a-záéíóúñ]+)(?:\s+(?:de\s+)?(\d{4}))?/i);
  if (textDateMatch) {
    const mName = textDateMatch[2].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (MONTH_MAP[mName]) {
      const day = textDateMatch[1].padStart(2, '0');
      const month = MONTH_MAP[mName];
      const year = textDateMatch[3] || String(refDate.getFullYear());
      return `${year}-${month}-${day}`;
    }
  }

  // 4. Relative terms: hoy, manana, pasado manana
  const clean = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (clean.includes('pasado manana')) {
    const d = new Date(refDate);
    d.setDate(d.getDate() + 2);
    return getLocalDateKey(d);
  }
  if (clean.includes('manana')) {
    const d = new Date(refDate);
    d.setDate(d.getDate() + 1);
    return getLocalDateKey(d);
  }
  if (clean.includes('hoy')) {
    return getLocalDateKey(refDate);
  }

  // 5. Day names: lunes, martes, etc.
  for (const [dayName, targetDayNum] of Object.entries(DAY_MAP)) {
    if (clean.includes(dayName)) {
      const rawCurDay = refDate.getDay();
      const curDayNum = rawCurDay === 0 ? 7 : rawCurDay;
      let diff = targetDayNum - curDayNum;
      if (diff < 0) diff += 7;
      const d = new Date(refDate);
      d.setDate(d.getDate() + diff);
      return getLocalDateKey(d);
    }
  }

  return null;
}

export function getBookingFilterKeys(refDate: Date = new Date()): BookingFilterKeys {
  const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(d.getDate() + n); return getLocalDateKey(r); };
  const todayKey = getLocalDateKey(refDate);
  const tomorrowKey = addDays(refDate, 1);
  const dayAfterKey = addDays(refDate, 2);

  const dayOfWeek = refDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(refDate);
  monday.setDate(refDate.getDate() + diffToMonday);
  const weekStartKey = getLocalDateKey(monday);
  const weekEndKey = addDays(monday, 6);

  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  const nextWeekStartKey = getLocalDateKey(nextMonday);
  const nextWeekEndKey = addDays(nextMonday, 6);
  const in7DaysKey = addDays(refDate, 7);

  return { todayKey, tomorrowKey, dayAfterKey, weekStartKey, weekEndKey, nextWeekStartKey, nextWeekEndKey, in7DaysKey };
}

export function isBookingInFilter(
  rawDateOrKey: string,
  timeFilter: BookingFilterType,
  keys: BookingFilterKeys,
  refDate: Date = new Date()
): boolean {
  if (timeFilter === 'all') return true;

  const dateKey = normalizeToDateKey(rawDateOrKey, refDate) || rawDateOrKey;
  if (!dateKey) return false;

  switch (timeFilter) {
    case 'today':
      return dateKey === keys.todayKey;
    case 'tomorrow':
      return dateKey === keys.tomorrowKey;
    case 'after':
      return dateKey === keys.dayAfterKey;
    case 'this_week':
      return (dateKey >= keys.weekStartKey && dateKey <= keys.weekEndKey) ||
             (dateKey >= keys.todayKey && dateKey <= keys.in7DaysKey);
    case 'next_week':
      return dateKey >= keys.nextWeekStartKey && dateKey <= keys.nextWeekEndKey;
    default:
      return true;
  }
}
