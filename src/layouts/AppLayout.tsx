import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import type { TouchEvent as ReactTouchEvent } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, ChevronLeft } from 'lucide-react'
import { Gauge, Building2, Users, Megaphone, Bot, FileText, BarChart3, Settings as SettingsIcon } from 'lucide-react'
import ProfileMenu from '../components/ui/ProfileMenu'
import ChatbotWidget from '../components/ui/ChatbotWidget'
import NotificationDropdown from '../components/ui/NotificationDropdown'
import { useAuth } from '../contexts/AuthContext'
import Breadcrumbs from '../components/ui/Breadcrumbs'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/admin/properties', label: 'Properties', icon: Building2 },
  { to: '/admin/clients', label: 'Clients', icon: Users },
  { to: '/admin/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/admin/chatbot', label: 'Chatbot', icon: Bot },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
]

export default function AppLayout() {
  const [openMenu, setOpenMenu] = useState<'none' | 'notification' | 'profile'>('none')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)
  const notifRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCommon = (target: Node | null) => {
      if (!target) return
      const insideNotif = !!notifRef.current && notifRef.current.contains(target)
      const insideProfile = !!profileRef.current && profileRef.current.contains(target)

      // If click/touch is outside both panels, close any open menu
      if (!insideNotif && !insideProfile) {
        setOpenMenu('none')
      }
    }

    // Use mousedown and touchstart for immediate response across browsers
    const onMouseDown = (e: MouseEvent) => {
      handleCommon(e.target as Node | null)
    }
    const onTouchStartDoc = (e: TouchEvent) => {
      handleCommon(e.target as Node | null)
    }

    // Accessibility: close with Escape
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu('none')
    }
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('touchstart', onTouchStartDoc, true)
    document.addEventListener('keydown', onKey, true)

    return () => {
      document.removeEventListener('mousedown', onMouseDown, true)
      document.removeEventListener('touchstart', onTouchStartDoc, true)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [])

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      setIsDesktop(w >= 1024)
      if (w >= 1024 && sidebarOpen) setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [sidebarOpen])

  // Touch gesture to close sidebar by swiping left
  const touchStartX = useRef<number | null>(null)
  const onAsideTouchStart = (e: ReactTouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null
  }
  const onAsideTouchEnd = (e: ReactTouchEvent) => {
    if (touchStartX.current == null) return
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current
    const deltaX = endX - touchStartX.current
    if (deltaX < -50 && !isDesktop) setSidebarOpen(false)
    touchStartX.current = null
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar (desktop fixed, mobile slide-over) */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: isDesktop ? 0 : (sidebarOpen ? 0 : -260) }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed left-0 top-0 h-full w-[260px] border-r border-white/10 bg-black/50 backdrop-blur-md shadow-2xl z-40"
        role="navigation"
        aria-label="Admin sidebar"
        aria-hidden={!isDesktop && !sidebarOpen}
        id="admin-sidebar"
        onTouchStart={onAsideTouchStart}
        onTouchEnd={onAsideTouchEnd}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <div className="text-xl font-semibold">Smart Real Estate</div>
          <div className="text-xs text-white/60 mt-1">Automation Platform</div>
        </div>
        <nav className="px-2 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      {/* Main */}
      <div className="flex flex-col min-h-screen lg:ml-[260px]">
        <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-6 h-16 border-b border-white/10 bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile/Tablet Sidebar Toggle */}
            {!isDesktop && (
              <button
                aria-label="Toggle sidebar"
                aria-expanded={sidebarOpen}
                aria-controls="admin-sidebar"
                onClick={() => setSidebarOpen(s => !s)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shrink-0"
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
            {/* Back Button */}
            <button
              type="button"
              aria-label="Go back"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-black/20 text-white hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 shrink-0"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-sm sm:text-base font-medium truncate max-w-[55vw] sm:max-w-none">Welcome back, {user?.firstName || 'Admin'}</div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <NotificationDropdown
              open={openMenu === 'notification'}
              onToggle={() => setOpenMenu(openMenu === 'notification' ? 'none' : 'notification')}
              containerRef={notifRef}
            />
            <ProfileMenu
              open={openMenu === 'profile'}
              onToggle={() => setOpenMenu(openMenu === 'profile' ? 'none' : 'profile')}
              containerRef={profileRef}
            />
          </div>
        </header>
        <main className="p-4 sm:p-6">
          {/* Breadcrumbs */}
          <div className="mb-4">
            <Breadcrumbs baseLabel="Admin" />
          </div>
          <Outlet />
        </main>
        <ChatbotWidget />
      </div>

      {/* Mobile overlay when sidebar is open */}
      {!isDesktop && sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  )
}