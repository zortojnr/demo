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
        <div className="w-8 h-8 rounded-full bg-black/20 text-white grid place-items-center border border-white/10">
          <User size={16} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
          {user?.role && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent)] text-white capitalize">{user.role}</span>
          )}
        </div>
        <ChevronDown size={16} className="opacity-70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0b0f14]/95 p-3 z-50 shadow-lg" role="menu" aria-label="Profile menu">
          <div className="px-2 py-2">
            <div className="font-medium">{user?.firstName} {user?.lastName}</div>
            <div className="text-white/60 text-sm">{user?.email}</div>
            {user?.role && (
              <div className="text-[11px] text-white mt-1 inline-flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent)] text-white capitalize">{user.role}</span>
              </div>
            )}
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