export function formatNumber(
  value: number,
  options?: { locale?: string; compact?: boolean; maximumFractionDigits?: number }
): string {
  const { locale = 'en-NG', compact = false, maximumFractionDigits = 0 } = options || {}
  if (compact) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits,
    }).format(value)
  }
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value)
}

export function formatCurrencyNaira(
  value: number,
  options?: { compact?: boolean; fractionDigits?: number }
): string {
  const { compact = false, fractionDigits = 0 } = options || {}
  if (compact) {
    // Compact currency approximation with symbol prefix
    const compactStr = new Intl.NumberFormat('en-NG', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: fractionDigits,
    }).format(value)
    return `₦${compactStr}`
  }
  return `₦${new Intl.NumberFormat('en-NG', { maximumFractionDigits: fractionDigits }).format(value)}`
}