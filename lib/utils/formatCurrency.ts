/**
 * Formats a number as Indian Rupees
 * Example: 1500000 -> "₹15,00,000"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formats a number with Indian number system (no currency symbol)
 * Example: 1500000 -> "15,00,000"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

/**
 * Formats large numbers into short readable form
 * Example: 1500000 -> "15L", 1000 -> "1K", 10000000 -> "1Cr"
 */
export function formatShort(value: number): string {
  if (value >= 10_000_000) return `${(value / 10_000_000).toFixed(1)}Cr`
  if (value >= 100_000) return `${(value / 100_000).toFixed(1)}L`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}
