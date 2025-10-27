import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Role } from '../config'

type RoleContextValue = {
  role: Role
  setRole: (r: Role) => void
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    try {
      const stored = localStorage.getItem('app_role') as Role | null
      return stored ?? 'client'
    } catch {
      return 'client'
    }
  })

  useEffect(() => {
    try { localStorage.setItem('app_role', role) } catch {}
  }, [role])

  const value = useMemo(() => ({ role, setRole }), [role])
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}