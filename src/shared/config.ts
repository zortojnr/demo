export type Role = 'admin' | 'agent' | 'client'

// Branding & Ownership
export const PRODUCT_NAME = 'Real Estate Pro'
export const COMPANY_NAME = 'Homekey Global Investment Ltd'
export const TAGLINE = 'Building smarter property solutions'
export const POWERED_BY = 'ColAI'

// Company Details
export const COMPANY_ADDRESS = '45 Smart Estate Avenue, Yola, Adamawa State, Nigeria'
export const COMPANY_PHONES = ['+234 906 640 9957', '+234 703 854 1337', '+234 810 033 3629']
export const COMPANY_EMAILS = ['info@realestatepro.ai', 'thecolai92@gmail.com']

// Currency & Localization
export const CURRENCY_SYMBOL = '₦'
export const LOCALE = 'en-NG'
export const CURRENCY_CODE = 'NGN'
export function formatCurrency(value: number) {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    minimumFractionDigits: 2,
  }).format(value)
}

// Meta & SEO
export const META_TITLE = `${PRODUCT_NAME} – Smart Real Estate Automation | ${COMPANY_NAME}`
export const META_DESCRIPTION = `${PRODUCT_NAME}, a product of ${COMPANY_NAME}, simplifies property management and marketing with AI — helping agents and clients make smarter decisions.`

// Helpers
export const CURRENT_YEAR = new Date().getFullYear()

export function getAssignedRoute(role: Role): string {
  switch (role) {
    case 'admin':
      return '/app'
    case 'agent':
      return '/agent/dashboard'
    case 'client':
    default:
      return '/'
  }
}