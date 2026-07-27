function getUKDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? '0');
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour') };
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Deterministic slot count between 4 and 8 (inclusive) that only changes at the UK
 * 00:00/12:00 boundary — same UK date + 12-hour period always yields the same number.
 */
export function getSlotCount(): number {
  const { year, month, day, hour } = getUKDateParts(new Date());
  const period = hour < 12 ? 0 : 1;
  const seed = year * 1000000 + month * 10000 + day * 100 + period;
  return Math.floor(seededRandom(seed) * 5) + 4;
}
