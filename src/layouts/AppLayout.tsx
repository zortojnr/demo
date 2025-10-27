import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Gauge, Building2, Users, Megaphone, Bot, FileText, BarChart3, Settings as SettingsIcon } from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'
import ProfileMenu from '../components/ui/ProfileMenu'
import ChatbotWidget from '../components/ui/ChatbotWidget'
import NotificationDropdown from '../components/ui/NotificationDropdown'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/app', label: 'Dashboard', icon: Gauge },
  { to: '/app/properties', label: 'Properties', icon: Building2 },
  { to: '/app/clients', label: 'Clients', icon: Users },
  { to: '/app/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/app/chatbot', label: 'Chatbot', icon: Bot },
  { to: '/app/documents', label: 'Documents', icon: FileText },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: SettingsIcon },
]

export default function AppLayout() {
  const [openMenu, setOpenMenu] = useState<'none' | 'notification' | 'profile'>('none')
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
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="border-r border-white/10 bg-black/40 backdrop-blur-md">
        <div className="px-6 py-6">
          <div className="text-xl font-semibold">Smart Real Estate</div>
          <div className="text-xs text-white/60 mt-1">Automation Platform</div>
        </div>
        <nav className="px-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-col min-h-screen">
        <header className="relative z-40 flex items-center justify-between px-6 h-16 border-b border-white/10 bg-black/20 backdrop-blur-md">
          <div className="font-medium">Welcome back, {user?.firstName || 'Admin'}</div>
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
        <main className="p-6">
          <Outlet />
        </main>
        <ChatbotWidget />
      </div>
    </div>
  )
}