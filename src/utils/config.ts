export const APP_NAME = 'Real Estate Pro'
export const COMPANY_NAME = 'Homekey Global Investment Ltd'
export const POWERED_BY = 'ColAI'
export const CURRENCY = '₦'
export const LOCALE = 'en-NG'

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(value)
}