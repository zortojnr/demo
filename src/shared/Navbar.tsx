import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { PRODUCT_NAME, TAGLINE } from './config'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    if (open) setOpen(false)
  }, [location.pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    const body = document.body
    if (open) {
      body.style.overflow = 'hidden'
      // Focus first menu item for accessibility
      setTimeout(() => firstLinkRef.current?.focus(), 50)
    } else {
      body.style.overflow = ''
      // Return focus to menu button
      setTimeout(() => menuButtonRef.current?.focus(), 0)
    }
    return () => {
      body.style.overflow = ''
    }
  }, [open])

  // Close menu on Escape and trap focus within panel
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Close menu when resizing above mobile or on orientation changes
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && open) setOpen(false)
    }
    const onOrientation = () => {
      // If orientation changes, ensure layout recalculates without menu open
      if (open) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onOrientation)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onOrientation)
    }
  }, [open])

  const LinkItem = ({ to, children, isPrimary = false, refProp }: { to: string; children: React.ReactNode; isPrimary?: boolean; refProp?: React.Ref<HTMLAnchorElement> }) => (
    <NavLink
      to={to}
      ref={refProp as any}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `block rounded-xl px-4 py-3 min-h-[48px] ${
          isPrimary ? 'font-semibold' : 'font-medium'
        } ${isActive ? 'text-accent' : 'text-white hover:text-accent'} transition-colors`
      }
    >
      {children}
    </NavLink>
  )

  return (
    <nav aria-label="Primary" className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <NavLink to="/" className="text-sm font-semibold">
          {PRODUCT_NAME}
          <span className="ml-2 hidden sm:inline text-white/50">— {TAGLINE}</span>
        </NavLink>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/properties" className={({ isActive }) => (isActive ? 'text-white' : 'text-white/70 hover:text-white')}>Properties</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'text-white' : 'text-white/70 hover:text-white')}>About</NavLink>
          <NavLink to="/support" className={({ isActive }) => (isActive ? 'text-white' : 'text-white/70 hover:text-white')}>Support</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'text-white' : 'text-white/70 hover:text-white')}>Contact</NavLink>
          {isAuthenticated && user ? (
            user.role === 'client' ? (
              <NavLink to="/client/dashboard" className={({ isActive }) => (isActive ? 'text-accent' : 'text-white/70 hover:text-white')}>My Dashboard</NavLink>
            ) : user.role === 'agent' ? (
              <NavLink to="/agent/dashboard" className={({ isActive }) => (isActive ? 'text-accent' : 'text-white/70 hover:text-white')}>My Properties</NavLink>
            ) : user.role === 'admin' ? (
              <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'text-accent' : 'text-white/70 hover:text-white')}>Admin Dashboard</NavLink>
            ) : null
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'text-accent' : 'text-white/70 hover:text-white')}>Login</NavLink>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center h-12 w-12 rounded-xl text-white hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-50 bg-black/70"
            aria-hidden={!open}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              ref={panelRef}
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="absolute top-14 left-0 right-0 mx-auto max-w-6xl px-4"
            >
              <div className="rounded-2xl border border-white/10 bg-[#0b0f14]/95 p-2 shadow-lg">
                <div className="grid grid-cols-1 gap-1">
                  <LinkItem to="/properties" refProp={firstLinkRef} isPrimary>Properties</LinkItem>
                  <LinkItem to="/about">About</LinkItem>
                  <LinkItem to="/support">Support</LinkItem>
                  <LinkItem to="/contact">Contact</LinkItem>
                  {isAuthenticated && user ? (
                    user.role === 'client' ? (
                      <LinkItem to="/client/dashboard">My Dashboard</LinkItem>
                    ) : user.role === 'agent' ? (
                      <LinkItem to="/agent/dashboard">My Properties</LinkItem>
                    ) : user.role === 'admin' ? (
                      <LinkItem to="/admin/dashboard">Admin Dashboard</LinkItem>
                    ) : null
                  ) : (
                    <LinkItem to="/login">Login</LinkItem>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}