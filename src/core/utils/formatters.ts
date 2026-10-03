/**
 * Formata números de forma compacta utilizando sufixos K e M (ex: 1400 -> 1.4K | 1500000 -> 1.5M)
 * Utiliza a API nativa Intl.NumberFormat no padrão 'en'.
 */
export function formatCompactNumber(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return '0';

  const num = typeof value === 'string' ? Number(value) : value;
  if (isNaN(num)) return '0';

  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}
