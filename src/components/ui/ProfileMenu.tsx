import { ChevronDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProfileMenu({ open, onToggle, containerRef }: { open: boolean; onToggle: () => void; containerRef?: React.RefObject<HTMLDivElement | null> }) {
  const navigate = useNavigate()
  const { user, logout: authLogout } = useAuth()

  const handleLogout = async () => {
    await authLogout()
    navigate('/')
    onToggle()
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
        onClick={onToggle}
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-white/20 grid place-items-center">
          <User size={16} />
        </div>
        <span className="text-sm">{user?.firstName} {user?.lastName}</span>
        <ChevronDown size={16} className="opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 glass-card dropdown-card p-3 z-50" role="menu" aria-label="Profile menu">
          <div className="px-2 py-2">
            <div className="font-medium">{user?.firstName} {user?.lastName}</div>
            <div className="text-muted text-sm">{user?.email}</div>
            <div className="text-xs text-emerald-400 mt-1 capitalize">{user?.role}</div>
          </div>
          <div className="border-t border-white/10 my-2" />
          <div className="flex items-center justify-between px-2 py-2">
            <button className="btn-outline px-3 py-2" onClick={() => { 
              const profileRoute = user?.role === 'admin' ? '/admin/profile' : 
                                  user?.role === 'agent' ? '/agent/profile' : '/client/profile'
              navigate(profileRoute); 
              onToggle(); 
            }}>Profile</button>
            <button className="btn-danger px-3 py-2" onClick={handleLogout}>
              <LogOut size={16} />
              <span className="ml-1">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}