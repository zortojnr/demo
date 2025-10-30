import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import type { TouchEvent as ReactTouchEvent } from 'react'
import { motion } from 'framer-motion'
import { 
  Gauge, 
  Building2, 
  Users, 
  Sparkles, 
  FileText, 
  BarChart3, 
  Settings as SettingsIcon,
  User,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react'
import ThemeToggle from '../components/ui/ThemeToggle'
import ProfileMenu from '../components/ui/ProfileMenu'
import NotificationDropdown from '../components/ui/NotificationDropdown'
import Breadcrumbs from '../components/ui/Breadcrumbs'
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
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)
  const { user } = useAuth()
  const notifRef = useRef<HTMLDivElement | null>(null)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCommon = (target: Node | null) => {
      if (!target) return
      const insideNotif = !!notifRef.current && notifRef.current.contains(target)
      const insideProfile = !!profileRef.current && profileRef.current.contains(target)
      if (!insideNotif && !insideProfile) {
        setOpenMenu('none')
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      handleCommon(e.target as Node | null)
    }

    const onTouchStartDoc = (e: TouchEvent) => {
      handleCommon(e.target as Node | null)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu('none')
        setSidebarOpen(false)
      }
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

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    const body = document.body
    if (sidebarOpen) body.style.overflow = 'hidden'
    else body.style.overflow = ''
    return () => { body.style.overflow = '' }
  }, [sidebarOpen])

  // Close sidebar on route change or when resizing to desktop
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      setIsDesktop(w >= 1024)
      if (w >= 1024 && sidebarOpen) setSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [sidebarOpen])

  // Simple touch gesture to close sidebar by swiping left
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
      {/* Fixed Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: isDesktop ? 0 : (sidebarOpen ? 0 : -280) }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed left-0 top-0 h-full w-[280px] lg:w-[300px] border-r border-emerald-500/20 bg-black/60 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 z-40"
        role="navigation"
        aria-label="Agent sidebar"
        aria-hidden={!isDesktop && !sidebarOpen}
        id="agent-sidebar"
        onTouchStart={onAsideTouchStart}
        onTouchEnd={onAsideTouchEnd}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="px-6 lg:px-8 py-8 lg:py-10 border-b border-emerald-500/20 shrink-0">
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
          <nav className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 lg:py-8 space-y-3">
            {navItems.map(({ to, label, icon: Icon }, index) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 * index }}
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
            transition={{ delay: 0.3 }}
            className="mt-auto px-4 lg:px-6 pb-6 lg:pb-8"
          >
            <div className="p-4 lg:p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 to-gold-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-emerald-400 to-gold-400 flex items-center justify-center">
                  <User size={20} className="text-slate-900" />
                </div>
                <div>
                  <div className="text-sm lg:text-base font-medium text-emerald-300">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs lg:text-sm text-slate-400">Premium Agent</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="lg:ml-[300px] flex flex-col min-h-screen">
        {/* Sticky Top Navbar */}
        <motion.header 
          initial={{ y: -64 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-5 lg:px-8 xl:px-10 h-16 border-b border-emerald-500/20 bg-black/40 backdrop-blur-xl shadow-lg shadow-emerald-500/5"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-1 sm:gap-2 min-w-0"
          >
            {/* Mobile Sidebar Toggle */}
            {!isDesktop && (
            <button
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
              aria-controls="agent-sidebar"
              onClick={() => setSidebarOpen(s => !s)}
              className="inline-flex items-center justify-center p-2 rounded-md bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 shrink-0"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
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
            <div className="text-sm sm:text-base lg:text-xl font-semibold text-emerald-300 truncate max-w-[50vw] sm:max-w-[60vw]">
              Welcome back, {user?.firstName || 'Agent'} 👋
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {/* Unified components to keep styling consistent and avoid overlap */}
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
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 min-h-screen overflow-x-hidden"
        >
          <div className="mb-4">
            <Breadcrumbs baseLabel="Agent" />
          </div>
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Render page content directly; pages manage their own cards/layout */}
            <Outlet />
          </div>
        </motion.main>

        {/* Mobile overlay when sidebar is open */}
        {!isDesktop && sidebarOpen && (
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