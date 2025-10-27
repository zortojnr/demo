import { CURRENT_YEAR, PRODUCT_NAME, COMPANY_NAME, POWERED_BY, COMPANY_ADDRESS, COMPANY_PHONES, COMPANY_EMAILS } from './config'
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/30">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold">{PRODUCT_NAME}</div>
          <div className="text-white/60 text-sm mt-1">Smart, simple, and automated property solutions by {COMPANY_NAME}.</div>
          <div className="text-white/50 text-xs mt-2">Powered by {POWERED_BY}</div>
        </div>
        <div className="text-sm space-y-2">
          <a className="block text-white/70 hover:text-white" href="/about">About</a>
          <a className="block text-white/70 hover:text-white" href="/privacy">Privacy Policy</a>
          <a className="block text-white/70 hover:text-white" href="/terms">Terms</a>
          <a className="block text-white/70 hover:text-white" href="/contact">Contact</a>
        </div>
        <div className="text-sm">
          <div className="text-white/70">{COMPANY_ADDRESS}</div>
          <div className="text-white/60 mt-2">Tel: {COMPANY_PHONES.join(' | ')}</div>
          <div className="text-white/60 mt-1">Email: {COMPANY_EMAILS.join(' | ')}</div>
          <div className="text-white/50 mt-4">© {CURRENT_YEAR} {PRODUCT_NAME}. A product of {COMPANY_NAME}. All rights reserved. Powered by {POWERED_BY}.</div>
        </div>
      </div>
    </footer>
  )
}