import { Outlet } from 'react-router-dom'
import Navbar from '../shared/Navbar'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Footer from '../shared/Footer'
import ClientChatAssistant from './ClientChatAssistant'

export default function ClientLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const onHome = location.pathname === '/'
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f14] to-[#0b0f14] text-white">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back + Breadcrumbs bar */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              {!onHome && (
                <button
                  type="button"
                  aria-label="Go back"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-black/20 text-white hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              {!onHome && <Breadcrumbs baseLabel="Home" />}
            </div>
          </div>
          <Outlet />
        </div>
      </main>
      <Footer />
      <ClientChatAssistant />
    </div>
  )
}