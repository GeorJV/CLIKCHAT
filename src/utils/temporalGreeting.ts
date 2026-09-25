export type TimePeriod = 'mañana' | 'tarde' | 'noche';

export function getTimePeriod(hour?: number): TimePeriod {
  const h = typeof hour === 'number' ? hour : new Date().getHours();
  if (h >= 12 && h < 19) return 'tarde';
  if (h >= 19 || h < 5) return 'noche';
  return 'mañana';
}

export function getTemporalFarewell(hour?: number): string {
  const period = getTimePeriod(hour);
  if (period === 'tarde') return '¡Que tengas una excelente tarde!';
  if (period === 'noche') return '¡Que tengas una excelente noche!';
  return '¡Que tengas un excelente día!';
}

export function getTemporalGreeting(hour?: number): string {
  const period = getTimePeriod(hour);
  if (period === 'tarde') return '¡Buenas tardes!';
  if (period === 'noche') return '¡Buenas noches!';
  return '¡Buenos días!';
}

export function adaptTemporalText(text: string, hour?: number): string {
  if (!text) return text;
  const period = getTimePeriod(hour);
  let res = text;
  if (period === 'tarde') {
    res = res.replace(/¡?\s*que\s+tengas\s+un\s+(?:excelente|buen|lindo|maravilloso)?\s*d[ií]a\s*!?/gi, '¡Que tengas una excelente tarde!');
    res = res.replace(/¡?\s*que\s+pases\s+un\s+(?:excelente|buen|lindo|maravilloso)?\s*d[ií]a\s*!?/gi, '¡Que pases una excelente tarde!');
    res = res.replace(/¡?\s*que\s+tengas\s+un\s+d[ií]a\s+(?:delicioso|incre[ií]ble|genial)\s*!?/gi, '¡Que tengas una tarde deliciosa!');
    res = res.replace(/¡?\s*buenos\s+d[ií]as\s*!?/gi, '¡Buenas tardes!');
    res = res.replace(/¡?\s*feliz\s+d[ií]a\s*!?/gi, '¡Feliz tarde!');
  } else if (period === 'noche') {
    res = res.replace(/¡?\s*que\s+tengas\s+un\s+(?:excelente|buen|lindo|maravilloso)?\s*d[ií]a\s*!?/gi, '¡Que tengas una excelente noche!');
    res = res.replace(/¡?\s*que\s+tengas\s+una\s+(?:excelente|buena|linda|maravillosa)?\s*tarde\s*!?/gi, '¡Que tengas una excelente noche!');
    res = res.replace(/¡?\s*que\s+pases\s+un\s+(?:excelente|buen|lindo|maravilloso)?\s*d[ií]a\s*!?/gi, '¡Que pases una excelente noche!');
    res = res.replace(/¡?\s*que\s+tengas\s+un\s+d[ií]a\s+(?:delicioso|incre[ií]ble|genial)\s*!?/gi, '¡Que tengas una noche deliciosa!');
    res = res.replace(/¡?\s*buenos\s+d[ií]as\s*!?/gi, '¡Buenas noches!');
    res = res.replace(/¡?\s*buenas\s+tardes\s*!?/gi, '¡Buenas noches!');
    res = res.replace(/¡?\s*feliz\s+d[ií]a\s*!?/gi, '¡Feliz noche!');
    res = res.replace(/¡?\s*feliz\s+tarde\s*!?/gi, '¡Feliz noche!');
  }
  return res;
}
