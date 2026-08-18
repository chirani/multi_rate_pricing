const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatValue = (value: number) => formatter.format(value);

export function parseToCents(str: string) {
  return Math.round(parseFloat(str) * 100);
}
