import { NavLink } from 'react-router-dom'
import { PRODUCT_NAME, TAGLINE } from './config'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, isAuthenticated } = useAuth()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink to="/" className="text-sm font-semibold">
          {PRODUCT_NAME}
          <span className="ml-2 hidden sm:inline text-white/50">— {TAGLINE}</span>
        </NavLink>
        <div className="flex items-center gap-6 text-sm">
          <NavLink to="/properties" className={({ isActive }) => isActive ? 'text-white' : 'text-white/70 hover:text-white'}>Properties</NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-white' : 'text-white/70 hover:text-white'}>About</NavLink>
          <NavLink to="/support" className={({ isActive }) => isActive ? 'text-white' : 'text-white/70 hover:text-white'}>Support</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-white' : 'text-white/70 hover:text-white'}>Contact</NavLink>
          {isAuthenticated && user ? (
            user.role === 'client' ? (
              <NavLink to="/client/dashboard" className={({ isActive }) => isActive ? 'text-accent' : 'text-white/70 hover:text-white'}>My Dashboard</NavLink>
            ) : user.role === 'agent' ? (
              <NavLink to="/agent/dashboard" className={({ isActive }) => isActive ? 'text-accent' : 'text-white/70 hover:text-white'}>My Properties</NavLink>
            ) : user.role === 'admin' ? (
              <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'text-accent' : 'text-white/70 hover:text-white'}>Admin Dashboard</NavLink>
            ) : null
          ) : (
            <NavLink to="/login" className={({ isActive }) => isActive ? 'text-accent' : 'text-white/70 hover:text-white'}>Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}