import { Navigate } from 'react-router-dom'
import { useRole } from './RoleContext'
import { getAssignedRoute } from '../config'

export default function ProtectedRoute({ allowed, children }: { allowed: Array<'admin' | 'agent' | 'client'>, children: React.ReactElement }) {
  const { role } = useRole()
  // Admin can access everything
  if (role === 'admin') return children
  if (allowed.includes(role)) return children
  return <Navigate to={getAssignedRoute(role)} replace />
}