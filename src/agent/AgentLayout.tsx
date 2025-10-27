import { Outlet, NavLink } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Gauge, 
  Building2, 
  Users, 
  Sparkles, 
  FileText, 
  BarChart3, 
  Settings as SettingsIcon,
  Bell,
  User,
  ChevronDown,
  Menu
} from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'
import ProfileMenu from '../components/ui/ProfileMenu'
import NotificationDropdown from '../components/ui/NotificationDropdown'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/agent/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/agent/properties', label: 'My Properties', icon: Building2 },
  { to: '/agent/clients', label: 'Clients', icon: Users },
  { to: '/agent/marketing', label: 'AI Marketing', icon: Sparkles },
  { to: '/agent/documents', label: 'Documents', icon: FileText },
  { to: '/agent/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/agent/settings', label: 'Settings', icon: SettingsIcon },
]

export default function AgentLayout() {
  const [openMenu, setOpenMenu] = useState<'none' | 'notification' | 'profile'>('none')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const notifRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null
      if (!target) return
      const insideNotif = !!notifRef.current && notifRef.current.contains(target)
      const insideProfile = !!profileRef.current && profileRef.current.contains(target)

      if (!insideNotif && !insideProfile) {
        setOpenMenu('none')
      }
    }

    document.addEventListener('mousedown', onPointer, true)
    document.addEventListener('touchstart', onPointer, true)

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
      {/* Fixed Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed left-0 top-0 h-full w-[280px] lg:w-[300px] border-r border-emerald-500/20 bg-black/60 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 z-40 lg:translate-x-0"
      >
        {/* Logo Section */}
        <div className="px-6 lg:px-8 py-8 lg:py-10 border-b border-emerald-500/20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-gold-400 bg-clip-text text-transparent">
              Real Estate Pro
            </div>
            <div className="text-sm lg:text-base text-emerald-300/70 mt-2">Agent Workspace</div>
            <div className="text-xs text-white/50 mt-1">Powered by ColAI</div>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="px-4 lg:px-6 py-6 lg:py-8 space-y-2">
          {navItems.map(({ to, label, icon: Icon }, index) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 lg:px-5 py-2.5 lg:py-3.5 rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-gold-500/20 text-emerald-200 shadow-lg shadow-emerald-500/20' 
                      : 'text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-200 hover:shadow-md hover:shadow-emerald-500/10'
                  }`
                }
              >
                <Icon size={20} className="text-emerald-300/80 group-hover:text-emerald-200 group-hover:scale-110 transition-all duration-300" />
                <span className="text-sm lg:text-base font-medium tracking-tight">{label}</span>
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Agent Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-6 lg:bottom-8 left-4 lg:left-6 right-4 lg:right-6 p-4 lg:p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-gold-500/10 border border-emerald-500/20"
        >
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-emerald-400 to-gold-400 flex items-center justify-center">
              <User size={20} className="text-slate-900" />
            </div>
            <div>
              <div className="text-sm lg:text-base font-medium text-emerald-300">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs lg:text-sm text-slate-400">Premium Agent</div>
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="lg:ml-[300px] flex flex-col min-h-screen">
        {/* Sticky Top Navbar */}
        <motion.header 
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 h-16 lg:h-18 border-b border-emerald-500/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-emerald-500/5"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            {/* Mobile Sidebar Toggle */}
            <button
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen(s => !s)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Menu size={20} />
            </button>
            <div className="text-lg lg:text-xl font-semibold text-emerald-300">
              Welcome back, {user?.firstName || 'Agent'} 👋
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-3 lg:gap-4"
          >
            <ThemeToggle />
            
            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenMenu(openMenu === 'notification' ? 'none' : 'notification')}
                className="relative p-2 lg:p-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors duration-300 group"
              >
                <Bell size={20} className="text-emerald-300 group-hover:text-emerald-200" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-pulse" />
              </motion.button>
              <NotificationDropdown
                open={openMenu === 'notification'}
                onToggle={() => setOpenMenu(openMenu === 'notification' ? 'none' : 'notification')}
                containerRef={notifRef}
              />
            </div>

            {/* Profile Menu */}
            <div ref={profileRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenMenu(openMenu === 'profile' ? 'none' : 'profile')}
                className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-r from-emerald-400 to-gold-400 flex items-center justify-center">
                  <User size={18} className="text-slate-900" />
                </div>
                <span className="text-sm lg:text-base text-emerald-300 group-hover:text-emerald-200 hidden sm:block">{user?.firstName} {user?.lastName}</span>
                <ChevronDown size={16} className="text-emerald-300 group-hover:text-emerald-200 transition-transform duration-300 group-hover:rotate-180 hidden sm:block" />
              </motion.button>
              <ProfileMenu
                open={openMenu === 'profile'}
                onToggle={() => setOpenMenu(openMenu === 'profile' ? 'none' : 'profile')}
                containerRef={profileRef}
              />
            </div>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 min-h-screen overflow-x-hidden"
        >
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Section wrapper provides consistent spacing and visual separation */}
            <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md">
              <div className="p-4 sm:p-6 lg:p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </motion.main>

        {/* Mobile overlay when sidebar is open */}
        {sidebarOpen && (
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </div>
    </div>
  )
}