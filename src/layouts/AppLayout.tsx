import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Gauge, Building2, Users, Megaphone, Bot, FileText, BarChart3, Settings as SettingsIcon } from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'
import ProfileMenu from '../components/ui/ProfileMenu'
import ChatbotWidget from '../components/ui/ChatbotWidget'
import NotificationDropdown from '../components/ui/NotificationDropdown'
import { useAuth } from '../contexts/AuthContext'

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
  const notifRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null
      if (!target) return
      const insideNotif = !!notifRef.current && notifRef.current.contains(target)
      const insideProfile = !!profileRef.current && profileRef.current.contains(target)

      // If click/touch is outside both panels, close any open menu
      if (!insideNotif && !insideProfile) {
        setOpenMenu('none')
      }
    }

    // Use mousedown and touchstart for immediate response across browsers
    document.addEventListener('mousedown', onPointer, true)
    document.addEventListener('touchstart', onPointer, true)

    // Accessibility: close with Escape
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu('none')
    }
    document.addEventListener('keydown', onKey, true)

    return () => {
      document.removeEventListener('mousedown', onPointer, true)
      document.removeEventListener('touchstart', onPointer, true)
      document.removeEventListener('keydown', onKey, true)
    }
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar (desktop fixed, mobile slide-over) */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: sidebarOpen ? 0 : -260 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed left-0 top-0 h-full w-[260px] border-r border-white/10 bg-black/50 backdrop-blur-md shadow-2xl z-40 lg:translate-x-0"
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
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 border-b border-white/10 bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen(s => !s)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="font-medium">Welcome back, {user?.firstName || 'Admin'}</div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
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
          <Outlet />
        </main>
        <ChatbotWidget />
      </div>

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  )
}