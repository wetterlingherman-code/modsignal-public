import { modColors } from '../data/modData';

export function riskColor(flag) {
  if (flag === 'high') return modColors.red;
  if (flag === 'med') return modColors.amber;
  if (flag === 'watch') return modColors.blue;
  return 'oklch(0.72 0.02 250)';
}

export function riskLabel(flag) {
  if (flag === 'high') return 'Hög';
  if (flag === 'med') return 'Medel';
  if (flag === 'watch') return 'Bevaka';
  return 'Låg';
}

export function tagKind(tag) {
  const text = tag.toLowerCase();

  if (text.includes('report') || text.includes('incitement')) return 'danger';
  if (text.includes('attack') || text.includes('escalat') || text.includes('sarcasm')) return 'warn';
  return 'info';
}
